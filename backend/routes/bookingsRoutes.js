const express = require("express");
const crypto = require("crypto");

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
        throw new Error(`Seat ${seat.seatId} is already booked for this screening`);
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

      const [rows] = await pool.query(`SELECT * FROM bookings WHERE id = ?`, [bookingId]);
      if (rows.length === 0) {
        return res.status(404).json({ ok: false, message: "Booking not found" });
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
      const { userId, screeningId, seats = [] } = req.body;

      if (!screeningId) {
        return res.status(400).json({ ok: false, message: "screeningId is required" });
      }

      await connection.beginTransaction();

      const bookingNumber = crypto.randomBytes(6).toString("hex").toUpperCase();

      const [bookingResult] = await connection.query(
        `INSERT INTO bookings (bookingNumber, screeningId, userId, status)
         VALUES (?, ?, ?, 'active')`,
        [bookingNumber, screeningId, userId || null]
      );

      const bookingId = bookingResult.insertId;
      if (seats.length > 0) await insertSeats(connection, bookingId, screeningId, seats);

      const [seatRows] = await connection.query(
        `SELECT seatId, ticketTypeId FROM bookingSeats WHERE bookingId = ?`,
        [bookingId]
      );

      await connection.commit();

      res.status(201).json({
        ok: true,
        booking: {
          id: bookingId,
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
        return res.status(404).json({ ok: false, message: "Booking not found" });
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
      res.json({ ok: true, message: `Deleted ${result.affectedRows} booking(s)` });
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // Delete one booking
  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await pool.query("DELETE FROM bookings WHERE id = ?", [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ ok: false, message: "Booking not found" });
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
