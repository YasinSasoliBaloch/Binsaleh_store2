// routes/upload.js
// Cloudinary image upload routes

const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { uploadImage, uploadFromUrl, deleteImage } = require('../controllers/uploadController');
const { protect, isAdmin } = require('../middleware/auth');

// Upload image from PC (multipart) — admin only
router.post('/', protect, isAdmin, upload.single('image'), uploadImage);

// Upload image from URL — admin only
router.post('/url', protect, isAdmin, uploadFromUrl);

// Delete an image from Cloudinary — admin only
router.delete('/delete', protect, isAdmin, deleteImage);

module.exports = router;
