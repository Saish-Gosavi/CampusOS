const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Hostel Management API is running' });
});

// Example route using database
app.get('/api/db-status', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    res.json({ status: 'Connected', result: rows[0].solution });
  } catch (err) {
    res.status(500).json({ status: 'Error', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
