// netlify/functions/routes/upload.js
// Cloudinary image upload routes for Netlify Functions

const express = require('express');
const router = express.Router();
const { cloudinary, upload } = require('../config/cloudinary');
const { protect, isAdmin } = require('../middleware/auth');

// Upload image from PC (multipart) — admin only
router.post('/', protect, isAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({
      message: 'Image uploaded successfully',
      url: req.file.path,
      public_id: req.file.filename
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Upload image from URL — admin only
router.post('/url', protect, isAdmin, async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ message: 'No URL provided' });
    }
    const result = await cloudinary.uploader.upload(url, {
      folder: 'binsaleh-products',
      quality: 'auto'
    });
    res.json({
      message: 'Image uploaded from URL successfully',
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to upload from URL: ' + err.message });
  }
});

// Delete an image from Cloudinary — admin only
router.delete('/delete', protect, isAdmin, async (req, res) => {
  try {
    const { public_id, url } = req.body;
    let id = public_id;
    if (!id && url) {
      const parts = url.split('/');
      const fileWithExt = parts[parts.length - 1];
      id = 'binsaleh-products/' + fileWithExt.split('.')[0];
    }
    if (!id) return res.status(400).json({ message: 'No public_id or URL provided' });
    await cloudinary.uploader.destroy(id);
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
