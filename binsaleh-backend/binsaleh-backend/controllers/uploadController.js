// controllers/uploadController.js
// Cloudinary image upload controller
// Supports: upload from PC (multipart) and upload by URL (fetch + upload to Cloudinary)

const { cloudinary } = require('../config/cloudinary');
const axios = require('axios');

// POST /api/upload
// Upload image from PC (multipart/form-data)
exports.uploadImage = async (req, res) => {
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
};

// POST /api/upload/url
// Upload image from URL (fetch image and upload to Cloudinary)
exports.uploadFromUrl = async (req, res) => {
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
};

// POST /api/upload/delete
// Delete an image from Cloudinary by public_id or URL
exports.deleteImage = async (req, res) => {
  try {
    const { public_id, url } = req.body;
    let id = public_id;

    // Extract public_id from URL if only url is provided
    if (!id && url) {
      const parts = url.split('/');
      const fileWithExt = parts[parts.length - 1];
      const folder = 'binsaleh-products';
      id = folder + '/' + fileWithExt.split('.')[0];
    }

    if (!id) {
      return res.status(400).json({ message: 'No public_id or URL provided' });
    }

    await cloudinary.uploader.destroy(id);
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
