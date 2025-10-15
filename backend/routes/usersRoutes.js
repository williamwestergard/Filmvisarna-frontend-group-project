const express = require("express");

function createUsersRouter(pool) {
  const router = express.Router();

  // GET /api/users
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
      // Clean the input BEFORE using it
      const email = req.body.email?.replace(/\s+/g, "") || null;
      const password = req.body.password?.replace(/\s+/g, "") || null;
      const firstName = req.body.firstName?.replace(/\s+/g, "") || null;
      const lastName = req.body.lastName?.replace(/\s+/g, "") || null;
      const phoneNumber = req.body.phoneNumber?.replace(/\s+/g, "") || null;

      // Insert cleaned values into the DB
      const [result] = await pool.query(
        `INSERT INTO users (email, password, firstName, lastName, phoneNumber)
         VALUES (?, ?, ?, ?, ?)`,
        [email, password, firstName, lastName, phoneNumber]
      );

      // Respond with the same cleaned values
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

  // DELETE /api/users/:id - delete one user by ID
  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ ok: false, message: "User not found" });
      }

      res.json({ ok: true, message: `User ${id} deleted successfully` });
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  return router;
}

module.exports = createUsersRouter;
