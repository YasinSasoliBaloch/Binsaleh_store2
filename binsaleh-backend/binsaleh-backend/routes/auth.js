// routes/auth.js

const express = require('express');
const router = express.Router();
const { register, login, getMe, registerAdmin, subscribeNewsletter, getSubscribers, getUsers, changePassword } = require('../controllers/authController');
const { protect, isAdmin } = require('../middleware/auth');

router.post('/register', register);
router.post('/register-admin', registerAdmin);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/newsletter/subscribe', subscribeNewsletter);
router.get('/subscribers', protect, isAdmin, getSubscribers);
router.get('/users', protect, isAdmin, getUsers);
router.post('/change-password', protect, changePassword);

module.exports = router;
