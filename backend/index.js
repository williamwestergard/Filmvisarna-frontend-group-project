// backend/index.js
require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const mysql = require("mysql2/promise");

const createMoviesRouter = require("./routes/moviesRoutes");
const createCategoriesRouter = require("./routes/categoriesRoutes");
const createAuditoriumsRouter = require("./routes/auditoriumsRoutes");
const createSeatsRouter = require("./routes/seatsRoutes");
const createScreeningsRouter = require("./routes/screeningsRoutes");
const createTicketTypesRouter = require("./routes/ticketTypesRoutes");
const createBookingsRouter = require("./routes/bookingsRoutes");
const createUsersRouter = require("./routes/usersRoutes");
const createBookingTotalsRouter = require("./routes/bookingTotalsRoutes")

const app = express();
app.use(express.json()); // ✅ JSON parsing only — no CORS

// Database pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

// Root route
app.get("/", (req, res) => {
  res.send("Filmvisarna API är igång.");
});

// Health check
app.get("/health", async (req, res) => {
  try {
    const [[row]] = await pool.query("SELECT NOW() AS now, DATABASE() AS db");
    res.json({ ok: true, db: row.db, now: row.now });
  } catch (e) {
    console.error("DB ERROR:", e);
    res.status(500).json({ ok: false, code: e.code, message: e.message });
  }
});

// Mount movies routes
app.use("/api/movies", createMoviesRouter(pool));

// Mount categories routes
app.use("/api/categories", createCategoriesRouter(pool));

// Mount auditorium routes
app.use("/api/auditoriums", createAuditoriumsRouter(pool));

// Mount seats routes
app.use("/api/seats", createSeatsRouter(pool));

// Mount screenings routes
app.use("/api/screenings", createScreeningsRouter(pool));

// Mount ticket types routes
app.use("/api/ticket-types", createTicketTypesRouter(pool));

// Mount booking types routes
app.use("/api/bookings", createBookingsRouter(pool));

// Mount user types routes
app.use("/api/users", createUsersRouter(pool));

// Mount booking totals routes
app.use("/api/booking-totals", createBookingTotalsRouter(pool));


const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
