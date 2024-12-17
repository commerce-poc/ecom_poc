const express = require("express");
const db = require("./config/database");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("Hello, this is your Node.js app connected to Neon PostgreSQL!");
});

// Fetch data from PostgreSQL
app.get("/products", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
