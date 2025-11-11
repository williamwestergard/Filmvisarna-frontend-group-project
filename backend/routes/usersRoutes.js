const express = require("express");

function createUsersRouter(pool) {
  const router = express.Router();

  // === GET ALL USERS ===
  router.get("/", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM users");
      res.json(rows);
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

// Fetch a single user and their booking history (with seats)
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Get user info
    const [users] = await pool.query(
      "SELECT id, firstName, lastName, email, phoneNumber FROM users WHERE id = ?",
      [id]
    );

    if (users.length === 0) {
      return res
        .status(404)
        .json({ ok: false, message: "Användare hittades inte." });
    }

    // Get user bookings joined with movies, screenings, auditoriums, and seats
    const [bookings] = await pool.query(
      `
      SELECT 
        b.id AS bookingId,
        b.bookingNumber,
        b.bookingUrl,
        b.status,
        m.title AS movieTitle,
        s.time AS screeningTime,
        a.name AS auditoriumName,
        seat.rowLetter AS seatRow,
        seat.seatNumber AS seatNumber
      FROM bookings b
      JOIN screenings s ON b.screeningId = s.id
      JOIN movies m ON s.movieId = m.id
      JOIN auditoriums a ON s.auditoriumId = a.id
      LEFT JOIN bookingSeats bs ON bs.bookingId = b.id
      LEFT JOIN seats seat ON seat.id = bs.seatId
      WHERE b.userId = ?
      ORDER BY s.time DESC
      `,
      [id]
    );

    // Group seats per booking
    const grouped = {};
    for (const row of bookings) {
      if (!grouped[row.bookingId]) {
        grouped[row.bookingId] = {
          bookingId: row.bookingId,
          bookingNumber: row.bookingNumber,
          bookingUrl: row.bookingUrl,
          status: row.status,
          movieTitle: row.movieTitle,
          screeningTime: row.screeningTime,
          auditoriumName: row.auditoriumName,
          seats: [],
        };
      }
      if (row.seatRow && row.seatNumber) {
        grouped[row.bookingId].seats.push({
          row: row.seatRow,
          number: row.seatNumber,
        });
      }
    }

    res.json({
      ok: true,
      user: users[0],
      bookings: Object.values(grouped),
    });
  } catch (e) {
    console.error("Error fetching user data:", e);
    res.status(500).json({ ok: false, message: e.message });
  }
});

  // === CREATE USER ===
  router.post("/", async (req, res) => {
    try {
      const email = req.body.email?.trim() || null;
      const password = req.body.password?.trim() || null;
      const firstName = req.body.firstName?.trim() || null;
      const lastName = req.body.lastName?.trim() || null;
      const phoneNumber = req.body.phoneNumber?.trim() || null;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
      const phoneRegex = /^[0-9+\-\s()]+$/;

      if (!emailRegex.test(email))
        return res.status(400).json({ ok: false, message: "Ogiltigt e-postformat." });
      if (!nameRegex.test(firstName))
        return res.status(400).json({ ok: false, message: "Förnamnet får endast innehålla bokstäver." });
      if (!nameRegex.test(lastName))
        return res.status(400).json({ ok: false, message: "Efternamnet får endast innehålla bokstäver." });
      if (phoneNumber && !phoneRegex.test(phoneNumber))
        return res.status(400).json({ ok: false, message: "Telefonnumret är ogiltigt." });

      const [result] = await pool.query(
        `
        INSERT INTO users (email, password, firstName, lastName, phoneNumber)
        VALUES (?, ?, ?, ?, ?)
        `,
        [email, password, firstName, lastName, phoneNumber]
      );

      res.json({
        ok: true,
        user: {
          id: result.insertId,
          email,
          firstName,
          lastName,
          phoneNumber,
        },
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // === DELETE ALL USERS (DEBUG) ===
  router.delete("/", async (req, res) => {
    try {
      const [result] = await pool.query("DELETE FROM users");
      res.json({
        ok: true,
        message: `Tog bort ${result.affectedRows} användare.`,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // === DELETE SINGLE USER ===
  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);

      if (result.affectedRows === 0)
        return res.status(404).json({ ok: false, message: "Användare hittades inte." });

      res.json({
        ok: true,
        message: `Användare ${id} togs bort.`,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  return router;
}

module.exports = createUsersRouter;
