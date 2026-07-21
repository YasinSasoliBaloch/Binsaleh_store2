// server.js
// BIN SALEH Store — Backend Entry Point

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// ---------- Middleware ----------
// Simple CORS: allow ALL origins so the frontend works from any domain
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

// ---------- Test Route ----------
app.get('/', (req, res) => {
  res.json({ message: 'BIN SALEH Store API is running 🚀' });
});

// ---------- Routes ----------
app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/settings', require('./routes/settings'));

// ---------- 404 Handler ----------
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ---------- Global Error Handler ----------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;

// Server ko hamesha start karo, chahe DB connect ho ya na ho
connectDB()
  .then(() => {
    console.log('✅ MongoDB connected — all features available');
  })
  .catch(err => {
    console.warn('⚠️ Server started without MongoDB. Some features may not work.');
  })
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`🟢 Server running on http://localhost:${PORT}`);
    });
  });
