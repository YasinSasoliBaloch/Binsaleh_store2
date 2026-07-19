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
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    cachedDb = null;
  }
  return cachedDb;
}

// ---------- Middleware ----------
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug: echo the request path for troubleshooting
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path} (original: ${req.originalUrl})`);
  next();
});

// ---------- Routes ----------
// serverless-http strips the basePath from event.path before passing to Express.
// Since Netlify proxy redirect maps /api/* → /.netlify/functions/api/:splat,
// and event.path starts with /.netlify/functions/api, we set basePath to that
// so Express receives paths like /auth/register-admin (without /api prefix).
app.use('/products', require('./routes/products'));
app.use('/auth', require('./routes/auth'));
app.use('/orders', require('./routes/orders'));

// ---------- 404 Handler ----------
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found. Path: ' + req.originalUrl });
});

// ---------- Global Error Handler ----------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

// ---------- Netlify Function Handler ----------
// Explicit basePath tells serverless-http to strip the function mount point
// from the request path before passing it to Express.
const handler = serverless(app, {
  basePath: '/.netlify/functions/api'
});

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
