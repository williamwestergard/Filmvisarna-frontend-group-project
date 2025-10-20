// backend/routes/showtimesRoutes.js
const express = require("express");

function createShowtimesRouter(pool) {
  const router = express.Router();

  // GET /api/showtimes → alla visningstider per film
  router.get("/", async (_req, res) => {
    try {
      const [rows] = await pool.query(
        `
        SELECT
          s.id        AS screeningId,
          s.movieId   AS movieId,
          DATE(s.time) AS showDate,
          TIME(s.time) AS showTime
        FROM screenings s
        ORDER BY s.time
        `
      );

      res.json(
        rows.map((row) => ({
          screeningId: row.screeningId,
          movieId: row.movieId,
          date: row.showDate,
          time: row.showTime,
        }))
      );
    } catch (e) {
      console.error("GET /showtimes error:", e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  return router;
}

module.exports = createShowtimesRouter;
