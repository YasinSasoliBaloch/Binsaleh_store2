const express = require('express');
const router = express.Router();
const { getSetting, getAllSettings, updateSetting, deleteSetting } = require('../controllers/settingsController');
const { protect, isAdmin } = require('../middleware/auth');

router.get('/', protect, isAdmin, getAllSettings);
router.get('/:key', getSetting); // Public read for store frontend
router.put('/:key', protect, isAdmin, updateSetting);
router.delete('/:key', protect, isAdmin, deleteSetting);

module.exports = router;
