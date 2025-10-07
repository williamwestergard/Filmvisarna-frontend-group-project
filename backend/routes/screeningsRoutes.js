const express = require("express");

function createScreeningRouter(pool) {
  const router = express.Router();

  // GET /api/ screenings
  router.get("/", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM screenings");
      res.json(rows);
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // POST /api/screenings
  router.post("/", async (req, res) => {
    try {
      const { name } = req.body;
      const [result] = await pool.query(
        "INSERT INTO screenings (name) VALUES (?)",
        [name]
      );
      res.json({ id: result.insertId, name });
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // DELETE all screenings
  router.delete("/", async (req, res) => {
    try {
      const [result] = await pool.query("DELETE FROM screenings");
      res.json({
        ok: true,
        message: `Deleted ${result.affectedRows} screening(s)`,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  return router;
}

module.exports = createScreeningRouter;
