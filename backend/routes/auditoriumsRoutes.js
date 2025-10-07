const express = require("express");

function createAuditoriumRouter(pool) {
  const router = express.Router();

  // GET /api/auditorium
  router.get("/", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM auditoriums");
      res.json(rows);
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // POST /api/auditorium
  router.post("/", async (req, res) => {
    try {
      const { name } = req.body;
      const [result] = await pool.query(
        "INSERT INTO auditoriums (name) VALUES (?)",
        [name]
      );
      res.json({ id: result.insertId, name });
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // DELETE all auditoriums
  router.delete("/", async (req, res) => {
    try {
      const [result] = await pool.query("DELETE FROM auditoriums");
      res.json({
        ok: true,
        message: `Deleted ${result.affectedRows} auditorium(s)`,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  return router;
}

module.exports = createAuditoriumRouter;