const express = require("express");

function createBookingTotalsRouter(pool) {
  const router = express.Router();

  // Get all booking totals
  router.get("/", async (req, res) => {
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
        ORDER BY b.id DESC
      `);

      res.json({ ok: true, totals: rows });
    } catch (error) {
      console.error("Error fetching booking totals:", error);
      res.status(500).json({ ok: false, message: "Database error" });
    }
  });

  // Get total for one booking
  router.get("/:bookingId", async (req, res) => {
    try {
      const bookingId = req.params.bookingId;

      const [rows] = await pool.query(
        `
        SELECT 
          b.id AS bookingId,
          COALESCE(SUM(tt.price), 0) AS totalPrice
        FROM bookings b
        LEFT JOIN bookingSeats bs ON b.id = bs.bookingId
        LEFT JOIN ticketTypes tt ON bs.ticketTypeId = tt.id
        WHERE b.id = ?
        GROUP BY b.id
        `,
        [bookingId]
      );

      if (rows.length === 0) {
        return res.status(404).json({ ok: false, message: "Booking not found" });
      }

      res.json({ ok: true, totalPrice: rows[0].totalPrice });
    } catch (error) {
      console.error("Error fetching total for booking:", error);
      res.status(500).json({ ok: false, message: "Database error" });
    }
  });

  return router;
}

module.exports = createBookingTotalsRouter;
