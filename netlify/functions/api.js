// netlify/functions/api.js
// BIN SALEH Store — Netlify Function (replaces standalone Express server)

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const serverless = require('serverless-http');

const app = express();

// ---------- MongoDB Connection (cached for serverless) ----------
let cachedDb = null;

async function connectDB() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  if (!process.env.MONGO_URI) {
    console.warn('⚠️ MONGO_URI not set — running without database');
    return null;
  }
  try {
    cachedDb = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // 5s timeout so function doesn't exceed 10s limit
      connectTimeoutMS: 5000
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    // Don't throw — let the function continue so it can return a meaningful error
    cachedDb = null;
  }
  return cachedDb;
}

// ---------- Middleware ----------
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Health Check ----------
app.get('/', (req, res) => {
  res.json({ message: 'BIN SALEH Store API is running 🚀' });
});

// ---------- Routes ----------
// NOTE: serverless-http strips the function base path (/.netlify/functions/api),
// so Express routes should NOT include /api prefix — Netlify redirect already adds it.
app.use('/products', require('./routes/products'));
app.use('/auth', require('./routes/auth'));
app.use('/orders', require('./routes/orders'));

// ---------- 404 Handler ----------
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ---------- Global Error Handler ----------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

// ---------- Netlify Function Handler ----------
const handler = serverless(app);

exports.handler = async (event, context) => {
  try {
    await connectDB();
    return await handler(event, context);
  } catch (err) {
    console.error('Function error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Internal server error: ' + err.message })
    };
  }
};
