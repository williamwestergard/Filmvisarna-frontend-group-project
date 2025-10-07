// backend/categoriesRoutes.js
const express = require("express");

function createCategoriesRouter(pool) {
  const router = express.Router();

  // GET /api/categories
  router.get("/", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM categories");
      res.json(rows);
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // POST /api/categories
  router.post("/", async (req, res) => {
    try {
      const { title, releaseYear } = req.body;
      const [result] = await pool.query(
        "INSERT INTO categories (title, releaseYear) VALUES (?, ?)",
        [title, releaseYear]
      );
      res.json({ id: result.insertId, title, releaseYear });
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // DELETE all categories
  router.delete("/", async (req, res) => {
    try {
      const [result] = await pool.query("DELETE FROM categories");
      res.json({
        ok: true,
        message: `Deleted ${result.affectedRows} categorie(s)`,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  return router;
}

module.exports = createCategoriesRouter;
