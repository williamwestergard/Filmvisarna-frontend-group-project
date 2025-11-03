const express = require("express");

function createUsersRouter(pool) {
  const router = express.Router();

  // GET /api/users - fetch all users
  router.get("/", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM users");
      res.json(rows);
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // GET /api/users/:id - fetch a single user and their booking history
  router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
      // Fetch user information
      const [users] = await pool.query(
        "SELECT id, firstName, lastName, email, phoneNumber FROM users WHERE id = ?",
        [id]
      );

      if (users.length === 0) {
        return res.status(404).json({ ok: false, message: "Användare hittades inte" });
      }

      // Fetch user bookings
      const [bookings] = await pool.query(
        `
        SELECT 
          b.id AS bookingId,
          b.bookingNumber,
          b.status,
          m.title AS movieTitle,
          s.time AS screeningTime,
          a.name AS auditoriumName
        FROM bookings b
        JOIN screenings s ON b.screeningId = s.id
        JOIN movies m ON s.movieId = m.id
        JOIN auditoriums a ON s.auditoriumId = a.id
        WHERE b.userId = ?
        ORDER BY s.time DESC
        `,
        [id]
      );

      res.json({
        ok: true,
        user: users[0],
        bookings,
      });
    } catch (e) {
      console.error("Error fetching user:", e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // POST /api/users - create a new user
  router.post("/", async (req, res) => {
    try {
      const email = req.body.email?.replace(/\s+/g, "") || null;
      const password = req.body.password?.replace(/\s+/g, "") || null;
      const firstName = req.body.firstName?.replace(/\s+/g, "") || null;
      const lastName = req.body.lastName?.replace(/\s+/g, "") || null;
      const phoneNumber = req.body.phoneNumber?.replace(/\s+/g, "") || null;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
      const phoneRegex = /^[0-9+\-\s()]+$/;

      if (!emailRegex.test(email)) {
        return res
          .status(400)
          .json({ ok: false, message: "Inkorekt email struktur" });
      }
      if (!nameRegex.test(firstName)) {
        return res
          .status(400)
          .json({ ok: false, message: "Förnamnet kan bara innehålla bokstäver" });
      }
      if (!nameRegex.test(lastName)) {
        return res
          .status(400)
          .json({ ok: false, message: "Efternamnet kan bara innehålla bokstäver" });
      }
      if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({
          ok: false,
          message:
            "Telefonnummer måste bara innehålla siffror och godkända symboler ( + - space ())",
        });
      }

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

  // DELETE /api/users - delete all users
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

  // DELETE /api/users/:id - delete a specific user
  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ ok: false, message: "Användare hittades inte" });
      }

      res.json({ ok: true, message: `User ${id} användare togs bort korrekt` });
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  return router;
}

module.exports = createUsersRouter;
