// models/Product.js
// Ye fields exactly admainpenal.html ke saveProduct() function se match karte hain,
// taake frontend mein zyada tabdeeli na karni pade.

const mongoose = require('mongoose');

const colorVariantSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  hex: { type: String, trim: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  category:  { type: String, required: true, trim: true }, // tops, bottoms, footwear, accessories, fragrances, tracksuits
  price:     { type: Number, required: true },
  oldPrice:  { type: Number, default: 0 },
  currency:  { type: String, default: 'PKR' },              // PKR / AED / USD
  badge:     { type: String, default: '' },                 // e.g. "New", "Sale"
  inStock:   { type: Boolean, default: true },

  images:    [{ type: String }],  // gallery image URLs
  img:       { type: String },    // main/cover image (images[0])

  colors:    [colorVariantSchema],

  details:   { type: String, default: '' },
  care:      { type: String, default: '' },
  size:      { type: String, default: '' },
  shipping:  { type: String, default: '' }
}, {
  timestamps: true // createdAt, updatedAt auto add ho jayenge
});

// Ensure 'id' is included in JSON output alongside '_id'
productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
