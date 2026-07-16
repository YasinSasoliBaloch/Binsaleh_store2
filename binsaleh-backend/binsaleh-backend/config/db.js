// config/db.js
// MongoDB se connect karne wala function.
// server.js isay call karega app start hote hi.

const mongoose = require('mongoose');

async function connectDB() {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`✅ MongoDB connected: ${conn.connection.host}`);
}

module.exports = connectDB;
