const express = require("express");
const crypto = require("crypto");
const sendEmail = require("../mail/sendEmail.cjs");

function createBookingsRouter(pool) {
  const router = express.Router();

  // Insert seats safely within a transaction
  async function insertSeats(connection, bookingId, screeningId, seats) {
    for (const seat of seats) {
      const [existing] = await connection.query(
        `SELECT bs.id
         FROM bookingSeats bs
         JOIN bookings b ON bs.bookingId = b.id
         WHERE bs.screeningId = ? AND bs.seatId = ? AND b.status = 'active'`,
        [screeningId, seat.seatId]
      );

      if (existing.length > 0) {
        throw new Error(
          `Seat ${seat.seatId} is already booked for this screening`
        );
      }

      await connection.query(
        `INSERT INTO bookingSeats (bookingId, screeningId, seatId, ticketTypeId)
         VALUES (?, ?, ?, ?)`,
        [bookingId, screeningId, seat.seatId, seat.ticketTypeId]
      );
    }
  }

  // Get all bookings
  router.get("/", async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT 
          b.id AS bookingId,
          b.bookingNumber,
          b.screeningId,
          b.userId,
          b.status,
          bs.seatId,
          bs.ticketTypeId
        FROM bookings b
        LEFT JOIN bookingSeats bs ON b.id = bs.bookingId
      `);

      const grouped = {};
      for (const row of rows) {
        if (!grouped[row.bookingId]) {
          grouped[row.bookingId] = {
            id: row.bookingId,
            bookingNumber: row.bookingNumber,
            screeningId: row.screeningId,
            userId: row.userId,
            status: row.status,
            seats: [],
          };
        }
        if (row.seatId) {
          grouped[row.bookingId].seats.push({
            seatId: row.seatId,
            ticketTypeId: row.ticketTypeId,
          });
        }
      }

      res.json({ ok: true, bookings: Object.values(grouped) });
    } catch (e) {
      console.error("GET /bookings failed:", e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // Get booking by ID
  router.get("/:id", async (req, res) => {
    try {
      const bookingId = req.params.id;

      const [rows] = await pool.query(`SELECT * FROM bookings WHERE id = ?`, [
        bookingId,
      ]);
      if (rows.length === 0) {
        return res
          .status(404)
          .json({ ok: false, message: "Booking not found" });
      }

      const [seatRows] = await pool.query(
        `SELECT seatId, ticketTypeId FROM bookingSeats WHERE bookingId = ?`,
        [bookingId]
      );

      res.json({
        ok: true,
        booking: { ...rows[0], seats: seatRows },
      });
    } catch (e) {
      console.error("GET /bookings/:id failed:", e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // Create a new booking
  router.post("/", async (req, res) => {
    const connection = await pool.getConnection();
    try {
      const {
        userId,
        screeningId,
        seats = [],
        email,
        movieTitle,
        auditoriumName,
        screeningTime,
      } = req.body;

      if (!screeningId) {
        return res
          .status(400)
          .json({ ok: false, message: "screeningId is required" });
      }

      await connection.beginTransaction();

      function generateBookingNumber() {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numbers = "0123456789";
        let result = "";

        for (let i = 0; i < 3; i++) {
          result += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        for (let i = 0; i < 3; i++) {
          result += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }

        return result;
      }

      const bookingNumber = generateBookingNumber();
      const bookingUrl = crypto.randomBytes(6).toString("hex").toUpperCase();

      const [bookingResult] = await connection.query(
        `INSERT INTO bookings (bookingNumber, bookingUrl, screeningId, userId, status)
       VALUES (?, ?, ?, ?, 'active')`,
        [bookingNumber, bookingUrl, screeningId, userId || null]
      );

      const bookingId = bookingResult.insertId;
      if (seats.length > 0)
        await insertSeats(connection, bookingId, screeningId, seats);

      const [seatRows] = await connection.query(
        `SELECT seatId, ticketTypeId FROM bookingSeats WHERE bookingId = ?`,
        [bookingId]
      );

      await connection.commit();

      // Send email after successful booking
      try {
        const userEmail = req.body.email;
        const movieTitle = req.body.movieTitle;
        const auditoriumName = req.body.auditoriumName;
        const screeningTime = req.body.screeningTime;

        // --- NEW: Get readable seat names from DB ---
        const seatIds = req.body.seats.map((s) => s.seatId);
        let seatsList = "Inga platser valda";

        if (seatIds.length > 0) {
          const [seatDetails] = await pool.query(
            `SELECT rowLetter, seatNumber FROM seats WHERE id IN (?)`,
            [seatIds]
          );
          seatsList = seatDetails
            .map((s) => `${s.rowLetter}${s.seatNumber}`)
            .join(", ");
        }

        const htmlBody = `
    <div style="font-family: Arial, sans-serif; background: #F5F5F5; color:black;padding:25px;">
      <div style="max-width:480px;margin:0 auto; background: #FFFFFF;padding:0px 65px;border-radius:5px;margin-top:50px;">
        <h1 style="padding:20px;text-align:center;border-bottom:1px solid #8d8d8dff;"> <br/>  Tack för din bokning!</h1>
        <p style="margin-top:30px;">Här är detaljerna för din bokning:</p>
          <strong>Film:</strong> ${movieTitle} <br/>
         <strong>Salong:</strong> ${auditoriumName}<br/>
         <strong>Datum:</strong> ${new Date(screeningTime).toLocaleDateString(
           "sv-SE"
         )}<br/>
          <strong>Tid:</strong> ${new Date(screeningTime).toLocaleTimeString(
            "sv-SE",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          )}<br/>
         <strong>Platser:</strong> ${seatsList}<br/>
     <br/><br/>
          <div style="color:black;margin:0 auto;text-align:center;">
          <h3 style="text-transform:uppercase;margin:0;padding:0;position:relative;top:20px;">Bokningsnummer: </h3>
          <h1 style="text-transform:uppercase;color:#C41230;font-weight:800;letter-spacing:4px;font-size:4rem;margin:0;padding:0;"> ${bookingNumber}</h1>
          <p style="font-style:italic;"> Visa upp bokningsnumret till kassören. </p>
       </div>
       <br/>
       <div style="text-align:center;">
        <p style="margin-bottom:10px;">Vi ses på bion! 🍿</p>
        <a style="font-weight:600;margin-bottom:80px;text-align:center;" href="http://localhost:5173/ticket/${bookingUrl}"> Avboka biljetter </a> <br/><br/><br/><br/>
        </div>
    </div>
       <div style="text-align:center;background:#C41230;margin:0 auto;margin-bottom:50px; max-width:480px;padding:50px 65px;border-radius:0 0 5px 5px;">
      <img src="https://res.cloudinary.com/dbvcotnqt/image/upload/v1762426970/filmvisarna-email-logo.png" alt="Filmvisarna" style="max-width:110px; height:auto; display:block; margin:0 auto 10px;">
      <p style="font-size:12px;color:white; margin:0; margin-top:15px;">Filmvisarna AB | Småstad, Sverige</p>

      </div>
    </div>
  `;

        await sendEmail({
          to: userEmail,
          subject: "Din bokning hos Filmvisarna",
          text: `Film: ${movieTitle}\nTid: ${screeningTime}\nSalong: ${auditoriumName}\nPlatser: ${seatsList}`,
          html: htmlBody,
        });

        console.log(`Bekräftelsemail skickat till ${userEmail}`);
      } catch (err) {
        console.error("Kunde inte skicka bokningsmail:", err);
      }

      res.status(201).json({
        ok: true,
        booking: {
          id: bookingId,
          bookingUrl,
          bookingNumber,
          screeningId,
          userId,
          status: "active",
          seats: seatRows,
        },
      });
    } catch (e) {
      await connection.rollback();
      console.error("Booking creation failed:", e);
      res.status(500).json({ ok: false, message: e.message });
    } finally {
      connection.release();
    }
  });

  router.get("/url/:bookingUrl", async (req, res) => {
    const { bookingUrl } = req.params;
    const [rows] = await pool.query(
      `SELECT * FROM bookings WHERE bookingUrl = ?`,
      [bookingUrl]
    );
    if (!rows.length)
      return res.status(404).json({ ok: false, message: "Booking not found" });

    const [seatRows] = await pool.query(
      `SELECT seatId, ticketTypeId FROM bookingSeats WHERE bookingId = ?`,
      [rows[0].id]
    );

    res.json({ ok: true, booking: { ...rows[0], seats: seatRows } });
  });

  // Get all booking totals
  router.get("/booking-totals", async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT 
          b.id AS bookingId,
          b.bookingNumber,
          COALESCE(SUM(tt.price), 0) AS totalPrice
        FROM bookings b
        LEFT JOIN bookingSeats bs ON b.id = bs.bookingId
        LEFT JOIN ticketTypes tt ON bs.ticketTypeId = tt.id
        GROUP BY b.id
      `);

      res.json({ ok: true, totals: rows });
    } catch (e) {
      console.error("GET /booking-totals failed:", e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // Cancel a booking
  router.patch("/:id/cancel", async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await pool.query(
        `UPDATE bookings SET status = 'cancelled', cancelledAt = NOW() WHERE id = ?`,
        [id]
      );

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ ok: false, message: "Booking not found" });
      }

      res.json({ ok: true, message: "Booking cancelled" });
    } catch (e) {
      console.error("Cancel booking failed:", e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // Delete all bookings
  router.delete("/", async (req, res) => {
    try {
      const [result] = await pool.query("DELETE FROM bookings");
      res.json({
        ok: true,
        message: `Deleted ${result.affectedRows} booking(s)`,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // Delete one booking
  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await pool.query("DELETE FROM bookings WHERE id = ?", [
        id,
      ]);

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ ok: false, message: "Booking not found" });
      }

      res.json({ ok: true, message: `Booking ${id} deleted successfully` });
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  return router;
}

module.exports = createBookingsRouter;
