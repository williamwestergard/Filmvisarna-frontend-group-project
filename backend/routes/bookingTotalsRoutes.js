const express = require("express");

function createBookingTotalsRouter(pool) {
  const router = express.Router();

  // GET /api/booking-totals
  router.get("/", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM bookingTotals");
      res.json(rows);
    } catch (error) {
      console.error("Error fetching bookingTotals:", error);
      res.status(500).json({ message: "Database error", error: error.message });
    }
  });

  return router;
}

module.exports = createBookingTotalsRouter;