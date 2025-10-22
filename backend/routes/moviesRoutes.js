// backend/moviesRoutes.js
const express = require("express");

const fs = require("fs");
const WEEKLY_FILE = "./weeklyMovie.json";

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

 // VECKANS FILM 
let cachedWeeklyMovie = null; // store the movie object
let lastPicked = null; // store the timestamp of last pick

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000; // one week in milliseconds

router.get("/weekly", async (req, res) => {
  try {
    const now = new Date();

    // 🧩 Try to load cached weekly movie from file (if available)
    if (!cachedWeeklyMovie && fs.existsSync(WEEKLY_FILE)) {
      const saved = JSON.parse(fs.readFileSync(WEEKLY_FILE, "utf8"));
      cachedWeeklyMovie = saved.movie;
      lastPicked = new Date(saved.timestamp);
      console.log("📂 Loaded weekly movie from file:", cachedWeeklyMovie.title);
    }

    // 🎬 Pick a new one if none cached or more than a week has passed
    if (!cachedWeeklyMovie || !lastPicked || now - lastPicked > ONE_WEEK) {
      const [rows] = await pool.query("SELECT * FROM movies ORDER BY RAND() LIMIT 1");

      if (rows.length === 0)
        return res.status(404).json({ ok: false, message: "No movies found" });

      cachedWeeklyMovie = rows[0];
      cachedWeeklyMovie.paketpris = {
        liten: { antal: 2, pris: 60 },
        litenEn: { antal: 1, pris: 30 },
      };
      lastPicked = now;

      // 💾 Save the new weekly movie to file
      fs.writeFileSync(
        WEEKLY_FILE,
        JSON.stringify({ movie: cachedWeeklyMovie, timestamp: now }, null, 2)
      );

      console.log("💾 Saved new weekly movie:", cachedWeeklyMovie.title);
    }

    console.log("✅ Weekly movie cached:", cachedWeeklyMovie.title, "ID:", cachedWeeklyMovie.id);
    res.json(cachedWeeklyMovie);
  } catch (err) {
    console.error("FEL VID HÄMNTNING AV VECKANS FILM:", err);
    res.status(500).json({ ok: false, message: err.message });
  }
});

  return router;
}

module.exports = createMoviesRouter;
