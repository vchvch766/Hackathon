const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json()); // 🔥 VERY IMPORTANT

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.post("/api/requests", async (req, res) => {
  try {
    console.log(req.body); // 🔍 debug

    const { name, anonymous, location, locality, help_type, urgency } = req.body;

    const result = await pool.query(
      `INSERT INTO requests 
      (name, anonymous, location, locality, help_type, urgency)
      VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
      [name, anonymous, location, locality, help_type, urgency]
    );

    res.json({ id: result.rows[0].id });

  } catch (err) {
    console.error("ERROR:", err); // 🔥 IMPORTANT
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
