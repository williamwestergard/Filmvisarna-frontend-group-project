const express = require("express");

function createUsersRouter(pool) {
  const router = express.Router();

  // Fetch all users from the database
  router.get("/", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM users");
      res.json(rows);
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // Fetch a single user and their booking history
  router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
      // Get user info
      const [users] = await pool.query(
        "SELECT id, firstName, lastName, email, phoneNumber FROM users WHERE id = ?",
        [id]
      );

      if (users.length === 0) {
        return res
          .status(404)
          .json({ ok: false, message: "Användare hittades inte." });
      }

      // Get user bookings joined with movies, screenings, and auditoriums
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
      console.error("Error fetching user data:", e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // Create a new user
  router.post("/", async (req, res) => {
    try {
      // Clean and validate input
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
          .json({ ok: false, message: "Ogiltigt e-postformat." });
      }
      if (!nameRegex.test(firstName)) {
        return res
          .status(400)
          .json({ ok: false, message: "Förnamnet får endast innehålla bokstäver." });
      }
      if (!nameRegex.test(lastName)) {
        return res
          .status(400)
          .json({ ok: false, message: "Efternamnet får endast innehålla bokstäver." });
      }
      if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({
          ok: false,
          message:
            "Telefonnummer får endast innehålla siffror och giltiga symboler (+ - space ()).",
        });
      }

      // Insert user in the database
      const [result] = await pool.query(
        `
        INSERT INTO users (email, password, firstName, lastName, phoneNumber)
        VALUES (?, ?, ?, ?, ?)
        `,
        [email, password, firstName, lastName, phoneNumber]
      );

      // Respond with created user data
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

  // Delete all users (admin/debug endpoint)
  router.delete("/", async (req, res) => {
    try {
      const [result] = await pool.query("DELETE FROM users");
      res.json({
        ok: true,
        message: `Tog bort ${result.affectedRows} användare.`,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  // Delete a specific user by ID
  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ ok: false, message: "Användare hittades inte." });
      }

      res.json({
        ok: true,
        message: `Användare ${id} togs bort.`,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  return router;
}

module.exports = createUsersRouter;
