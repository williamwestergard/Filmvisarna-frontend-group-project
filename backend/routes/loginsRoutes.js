const express = require("express");
const router = express.Router();

function createLoginRouter(pool) {
  // POST /api/login
  router.post("/", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ ok: false, message: "E-post och lösenord krävs." });
      }

      // Look up user by email
      const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);

      if (rows.length === 0) {
        return res
          .status(401)
          .json({ ok: false, message: "Fel e-postadress eller lösenord." });
      }

      const user = rows[0];

      // Simple plaintext password check (you can upgrade to bcrypt later)
      if (user.password !== password) {
        return res
          .status(401)
          .json({ ok: false, message: "Fel e-postadress eller lösenord." });
      }

      // Return a simple fake token for now
      const token = `fake-token-${user.id}-${Date.now()}`;

      res.json({
        ok: true,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        token,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  return router;
}

module.exports = createLoginRouter;
