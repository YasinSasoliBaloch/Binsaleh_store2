// server.js
// BIN SALEH Store — Backend Entry Point

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// ---------- Middleware ----------
const allowedOrigins = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.split(',').map(s => s.trim())
  : ['http://localhost:5500', 'http://127.0.0.1:5500'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins in production for now
    }
  },
  credentials: true
}));
app.use(express.json());               // JSON body parse karne ke liye
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); // product images serve karne ke liye

// ---------- Test Route ----------
app.get('/', (req, res) => {
  res.json({ message: 'BIN SALEH Store API is running 🚀' });
});

// ---------- Routes (aage steps mein add karenge) ----------
app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
// app.use('/api/products', require('./routes/products'));

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

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🟢 Server running on http://localhost:${PORT}`);
  });
});
