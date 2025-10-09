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
      const { email, password, firstName, lastName, phoneNumber } = req.body;

      const [result] = await pool.query(
        `INSERT INTO users (email, password, firstName, lastName, phoneNumber)
       VALUES (?, ?, ?, ?, ?)`,
        [email, password, firstName, lastName, phoneNumber]
      );

      res.json({
        ok: true,
        user: {
          id: result.insertId,
          email,
          firstName,
          lastName,
          phoneNumber,
        },
      });
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
