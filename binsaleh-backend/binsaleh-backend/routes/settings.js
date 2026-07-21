// routes/settings.js

const express = require('express');
const router = express.Router();
const { getSetting, getAllSettings, updateSetting, deleteSetting } = require('../controllers/settingsController');
const { protect, isAdmin } = require('../middleware/auth');

// Admin-only: list all settings
router.get('/', protect, isAdmin, getAllSettings);

// Public read for store frontend (announcements, slider, etc.)
// Sensitive keys like admin_setup_key are protected
router.get('/:key', async (req, res) => {
  // Block sensitive keys from public access
  const sensitiveKeys = ['admin_setup_key', 'jwt_secret'];
  if (sensitiveKeys.includes(req.params.key)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  return getSetting(req, res);
});

// Admin-only: update or delete settings
router.put('/:key', protect, isAdmin, updateSetting);
router.delete('/:key', protect, isAdmin, deleteSetting);

module.exports = router;
