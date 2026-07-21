// models/Settings.js
// Key-value store for CMS settings (announcements, slider, setup key, categories, coupons, etc.)

const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  key:   { type: String, required: true, unique: true, trim: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

settingsSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Settings', settingsSchema);
