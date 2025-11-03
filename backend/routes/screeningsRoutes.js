// backend/routes/screeningsRoutes.js
const express = require("express");

function createScreeningsRouter(pool) {
  const router = express.Router();

  // GET /api/screenings// alla visningar inom 14 dagar
  router.get("/", async (_req, res) => {
    try {
      const [rows] = await pool.query(
        "SELECT id, time, movieId, auditoriumId FROM screenings WHERE time BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 14 DAY) ORDER BY time"
      );
      res.json(rows);
    } catch (e) {
      console.error("GET /screenings error:", e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // GET /api/screenings/:id / en visning
  router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const [[row]] = await pool.query(
        "SELECT id, time, movieId, auditoriumId FROM screenings WHERE id = ?",
        [id]
      );
      if (!row) {
        return res
          .status(404)
          .json({ ok: false, message: "Screening not found" });
      }
      res.json(row);
    } catch (e) {
      console.error("GET /screenings/:id error:", e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // POST /api/screenings → skapa visning
  // Body: { "time": "2025-10-10T18:00:00", "movieId": 1, "auditoriumId": 2 }
  router.post("/", async (req, res) => {
    try {
      const { time, movieId, auditoriumId } = req.body;

      if (!time || !movieId || !auditoriumId) {
        return res.status(400).json({
          ok: false,
          message: "time, movieId och auditoriumId krävs",
        });
      }

      const [result] = await pool.query(
        `INSERT INTO screenings (time, movieId, auditoriumId)
         VALUES (?, ?, ?)`,
        [time, movieId, auditoriumId]
      );

      res.status(201).json({
        ok: true,
        screening: { id: result.insertId, time, movieId, auditoriumId },
      });
    } catch (e) {
      console.error("POST /screenings error:", e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // DELETE /api/screenings → ta bort alla (test/hjälp)
  router.delete("/", async (_req, res) => {
    try {
      const [result] = await pool.query("DELETE FROM screenings");
      res.json({ ok: true, deleted: result.affectedRows });
    } catch (e) {
      console.error("DELETE /screenings error:", e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // GET /api/screenings/:id/seats // alla stolar i salongen + bokningsstatus
  // Stöd för ?onlyFree=1 för att bara visa lediga platser
  router.get("/:id/seats", async (req, res) => {
    try {
      const { id } = req.params; // screeningId
      const onlyFree = req.query.onlyFree == "1";

      const [rows] = await pool.query(
        `
        SELECT
          s.id           AS seatId,
          s.auditoriumId AS auditoriumId,
          s.rowLetter    AS rowLabel,
          s.seatNumber   AS seatNumber,
          CASE WHEN bs.seatId IS NULL THEN 0 ELSE 1 END AS isBooked
        FROM screenings sc
        JOIN seats s
          ON s.auditoriumId = sc.auditoriumId
        LEFT JOIN bookingSeats bs
          ON bs.screeningId = sc.id
         AND bs.seatId     = s.id
        WHERE sc.id = ?
        ${onlyFree ? "AND bs.seatId IS NULL" : ""}
        ORDER BY s.rowLetter, s.seatNumber
        `,
        [id]
      );

      res.json({
        ok: true,
        screeningId: Number(id),
        seats: rows,
        summary: {
          total: rows.length,
          booked: rows.filter((r) => r.isBooked === 1).length,
          free: rows.filter((r) => r.isBooked === 0).length,
        },
      });
    } catch (e) {
      console.error("GET /screenings/:id/seats error:", e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // GET /api/screenings/:id/seats/available // endast lediga stolar
  router.get("/:id/seats/available", async (req, res) => {
    try {
      const { id } = req.params;

      const [rows] = await pool.query(
        `
        SELECT
          s.id           AS seatId,
          s.auditoriumId AS auditoriumId,
          s.rowLetter    AS rowLabel,
          s.seatNumber   AS seatNumber
        FROM screenings sc
        JOIN seats s
          ON s.auditoriumId = sc.auditoriumId
        LEFT JOIN bookingSeats bs
          ON bs.screeningId = sc.id
         AND bs.seatId     = s.id
        WHERE sc.id = ?
          AND bs.seatId IS NULL
        ORDER BY s.rowLetter, s.seatNumber
        `,
        [id]
      );

      res.json({
        ok: true,
        screeningId: Number(id),
        seats: rows,
        count: rows.length,
      });
    } catch (e) {
      console.error("GET /screenings/:id/seats/available error:", e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  return router;
}

module.exports = createScreeningsRouter;
