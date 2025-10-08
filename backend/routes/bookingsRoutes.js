const express = require("express");
const crypto = require("crypto");

function createBookingsRouter(pool) {
  const router = express.Router();

  // ✅ GET all bookings
  router.get("/", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM bookings");
      res.json(rows);
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // ✅ POST - create a booking (single or multiple)
  router.post("/", async (req, res) => {
    try {
      const body = req.body;

      // Handle both single object and array of bookings
      const bookings = Array.isArray(body) ? body : [body];

      const results = [];

      for (const b of bookings) {
        const { screeningId, userId } = b;

        if (!screeningId || !userId) {
          return res.status(400).json({
            ok: false,
            message: "screeningId and userId are required",
          });
        }

        // Generate a unique booking number
        const bookingNumber = crypto
          .randomBytes(6)
          .toString("hex")
          .toUpperCase();

        const [result] = await pool.query(
          `INSERT INTO bookings (bookingNumber, screeningId, userId)
           VALUES (?, ?, ?)`,
          [bookingNumber, screeningId, userId]
        );

        results.push({
          id: result.insertId,
          bookingNumber,
          screeningId,
          userId,
          status: "booked",
        });
      }

      res.status(201).json({ ok: true, bookings: results });
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // ✅ PATCH - cancel a booking
  router.patch("/:id/cancel", async (req, res) => {
    try {
      const { id } = req.params;

      const [result] = await pool.query(
        `UPDATE bookings
         SET status = 'cancelled', cancelledAt = NOW()
         WHERE id = ?`,
        [id]
      );

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ ok: false, message: "Booking not found" });
      }

      res.json({ ok: true, message: "Booking cancelled" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  return router;
}

module.exports = createBookingsRouter;
