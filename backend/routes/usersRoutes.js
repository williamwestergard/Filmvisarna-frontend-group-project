const express = require("express");

function createUsersRouter(pool) {
  const router = express.Router();

  // GET /api/ users
  router.get("/", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM users");
      res.json(rows);
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // POST /api/users
  router.post("/", async (req, res) => {
    try {
      const { name } = req.body;
      const [result] = await pool.query("INSERT INTO users (name) VALUES (?)", [
        name,
      ]);
      res.json({ id: result.insertId, name });
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // DELETE all users
  router.delete("/", async (req, res) => {
    try {
      const [result] = await pool.query("DELETE FROM users");
      res.json({
        ok: true,
        message: `Deleted ${result.affectedRows} user(s)`,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  return router;
}

module.exports = createUsersRouter;
