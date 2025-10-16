// backend/moviesRoutes.js
const express = require("express");

function createMoviesRouter(pool) {
  const router = express.Router();

  // GET /api/movies → lista alla filmer
  router.get("/", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM movies");
      res.json(rows);
    } catch (e) {
      console.error("MOVIES LIST ERROR:", e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // POST /api/movies → lägg till ny film
  router.post("/", async (req, res) => {
    try {
      const { title, releaseYear, ageLimit } = req.body;
      const [result] = await pool.query(
        "INSERT INTO movies (title, releaseYear, ageLimit) VALUES (?, ?, ?)",
        [title, releaseYear, ageLimit || 0]
      );
      res.json({ id: result.insertId, title, releaseYear, ageLimit });
    } catch (e) {
      console.error("MOVIE CREATE ERROR:", e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // DELETE /api/movies → ta bort alla filmer
  router.delete("/", async (req, res) => {
    try {
      const [result] = await pool.query("DELETE FROM movies");
      res.json({
        ok: true,
        message: `Deleted ${result.affectedRows} movie(s)`,
      });
    } catch (e) {
      console.error("MOVIE DELETE ERROR:", e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // GET /api/movies/categories → visar filmer + kategorier
  router.get("/categories", async (req, res) => {
    try {
      const [rows] = await pool.query(`
      SELECT 
      m.id AS movie_id,
      m.title AS film,
      m.posterUrl,
      GROUP_CONCAT(c.title ORDER BY c.title SEPARATOR ', ') AS kategorier
      FROM movies m
      LEFT JOIN movieCategories mc ON mc.movieId = m.id
      LEFT JOIN categories c ON c.id = mc.categoryId
      GROUP BY m.id
      ORDER BY m.title;
      `);
      res.json(rows);
    } catch (err) {
      console.error("MOVIES CATEGORIES ERROR:", err);
      res.status(500).json({ ok: false, message: err.message });
    }
  });

  // GET /api/movies/family → barnvänliga filmer
  router.get("/family", async (req, res) => {
    try {
      const maxAge = Number(req.query.maxAge) || 7; // Standard 7 år

      const [rows] = await pool.query(
        `
        SELECT DISTINCT 
          m.id, 
          m.title, 
          m.releaseYear, 
          m.ageLimit, 
          GROUP_CONCAT(c.title ORDER BY c.title SEPARATOR ', ') AS kategorier
        FROM movies m
        LEFT JOIN movieCategories mc ON mc.movieId = m.id
        LEFT JOIN categories c ON c.id = mc.categoryId
        WHERE 
          (m.ageLimit <= ?) 
          AND (c.title NOT IN ('Skräck', 'Rysare'))
        GROUP BY m.id
        ORDER BY m.title;
        `,
        [maxAge]
      );

      res.json(rows);
    } catch (e) {
      console.error("MOVIES FAMILY FILTER ERROR:", e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  return router;
}

module.exports = createMoviesRouter;
