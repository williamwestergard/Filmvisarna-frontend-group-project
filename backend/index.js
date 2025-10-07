// backend/index.js
require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const createMoviesRouter = require("./routes/moviesRoutes");
const createCategoriesRouter = require("./routes/categoriesRoutes");
const createAuditoriumRouter = require("./routes/auditoriumRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Databaspool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

// Grundroute
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

// Mount movies routes
app.use("/api/categories", createCategoriesRouter(pool));

// Mount auditorium routes
app.use("/api/auditorium", createAuditoriumRouter(pool));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
