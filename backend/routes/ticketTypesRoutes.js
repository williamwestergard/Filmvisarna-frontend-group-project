// backend/routes/ticketTypesRoutes.js
const express = require("express");

module.exports = function createTicketTypesRouter(pool) {
  const router = express.Router();

  // GET /api/ticket-types
  router.get("/", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM ticketTypes ORDER BY minAge");
      res.json(rows);
    } catch (e) {
      console.error("TICKET TYPES ERROR:", e);
      res.status(500).json({ ok: false, message: e.message });
    }
  });

  return router;
};