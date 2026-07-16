// middleware/auth.js

const jwt = require('jsonwebtoken');

// "protect" — check karta hai ke request ke saath valid JWT token hai
// Frontend har protected request ke header mein bhejega:
//   Authorization: Bearer <token>
exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role } — aage controllers mein available hoga
    next();
  } catch (err) {
    res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

// "optionalProtect" — agar token hai to req.user set kar do, warna chup chap aage badho
// Guest checkout ke liye zaroori hai (order ke saath login mandatory nahi)
exports.optionalProtect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // invalid token — guest ki tarah treat karo, error mat do
    }
  }
  next();
};
// "isAdmin" — sirf admin role wale users ko allow karta hai
// admainpenal.html ke routes ko is se protect karenge
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access only' });
  }
};
