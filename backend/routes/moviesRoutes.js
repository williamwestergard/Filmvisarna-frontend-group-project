// backend/moviesRoutes.js
const express = require("express");

function createMoviesRouter(pool) {
  const router = express.Router();

  // GET /api/movies
  router.get("/", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM movies");
      res.json(rows);
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // POST /api/movies
  router.post("/", async (req, res) => {
    try {
      const { title, releaseYear } = req.body;
      const [result] = await pool.query(
        "INSERT INTO movies (title, releaseYear) VALUES (?, ?)",
        [title, releaseYear]
      );
      res.json({ id: result.insertId, title, releaseYear });
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  return router;
}

module.exports = createMoviesRouter;
