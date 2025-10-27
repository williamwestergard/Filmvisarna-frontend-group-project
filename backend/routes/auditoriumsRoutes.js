const express = require("express");

function createAuditoriumRouter(pool) {
  const router = express.Router();

  // Get all auditoriums
  router.get("/", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM auditoriums");
      res.json(rows);
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // Get one auditorium by ID
  router.get("/:id", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM auditoriums WHERE id = ?", [
        req.params.id,
      ]);

      if (rows.length === 0) {
        return res.status(404).json({ ok: false, message: "Auditorium not found" });
      }

      res.json(rows[0]);
    } catch (e) {
      console.error("GET /auditoriums/:id failed:", e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // Create a new auditorium
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

  // Delete all auditoriums
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
