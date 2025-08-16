require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./src/routes/auth');
const connectDB = require('./src/config/db');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Health endpoint
app.get('/ping', (req, res) => {
  console.log('Ping received');
  res.json({ ok: true, time: Date.now() });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});