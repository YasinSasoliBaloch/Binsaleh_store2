// config/db.js
// MongoDB se connect karne wala function.
// server.js isay call karega app start hote hi.

const mongoose = require('mongoose');

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    // DB connect nahi hua to server ko band kar do,
    // taake pata chal jaye kuch galat hai (silent fail na ho)
    process.exit(1);
  }
}

module.exports = connectDB;
