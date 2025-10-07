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

  // DELETE all movies
  router.delete("/", async (req, res) => {
    try {
      const [result] = await pool.query("DELETE FROM movies");
      res.json({
        ok: true,
        message: `Deleted ${result.affectedRows} movie(s)`,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // GET /api/movies/categories  → visar alla filmer + deras kategorier + id
  router.get("/categories", async (req, res) => {
    try {
      const [rows] = await pool.query(`
      SELECT 
        m.id AS movie_id,
        m.title AS film,
        GROUP_CONCAT(c.title ORDER BY c.title SEPARATOR ', ') AS kategorier
      FROM movies m
      LEFT JOIN movieCategories mc ON mc.movieId = m.id
      LEFT JOIN categories c ON c.id = mc.categoryId
      GROUP BY m.id
      ORDER BY m.title;
    `);

      res.json(rows);
    } catch (err) {
      console.error("MOVIES FULL VIEW ERROR:", err);
      res.status(500).json({ ok: false, message: err.message });
    }
  });

  return router;
}

module.exports = createMoviesRouter;
