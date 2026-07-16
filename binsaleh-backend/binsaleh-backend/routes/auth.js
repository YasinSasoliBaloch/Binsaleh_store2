// routes/auth.js

const express = require('express');
const router = express.Router();
const { register, login, getMe, registerAdmin, subscribeNewsletter } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/register-admin', registerAdmin); // Secure admin registration
router.post('/login', login);
router.get('/me', protect, getMe); // token chahiye is route ke liye
router.post('/newsletter/subscribe', subscribeNewsletter); // Newsletter signup

module.exports = router;
