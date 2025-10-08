// backend/routes/ticketTypesRoutes.js
const express = require("express");

module.exports = function createTicketTypesRouter(pool) {
  const router = express.Router();

  // GET /api/ticket-types
  router.get("/", async (req, res) => {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM ticketTypes ORDER BY minAge"
      );
      res.json(rows);
    } catch (e) {
      console.error("TICKET TYPES ERROR:", e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });
  router.get("/eligible", async (req, res) => {
    try {
      const age = Number(req.query.age);
      if (Number.isNaN(age) || age < 0) {
        return res
          .status(400)
          .json({ ok: false, message: "age must be a non-negative number" });
      }

      const [rows] = await pool.query(
        `SELECT id, name, price, minAge, maxAge
      FROM ticketTypes
      WHERE ? >= minAge AND (maxAge IS NULL OR ? <= maxAge)
      ORDER BY minAge, name`,
        [age, age]
      );

      res.json(rows);
    } catch (e) {
      console.error("ELIGIBLE TICKETS ERROR:", e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });
  return router;
};
