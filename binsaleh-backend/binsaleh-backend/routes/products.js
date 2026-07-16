// routes/products.js

const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Public routes — koi bhi frontend page ye use kar sakta hai
router.get('/', getProducts);
router.get('/:id', getProductById);

// ⚠️ Ye teeno routes sirf admin ke liye honi chahiye.
// Abhi ke liye open hain — Step 3 (Auth) ke baad hum yahan
// "protect" aur "isAdmin" middleware laga denge:
//   router.post('/', protect, isAdmin, createProduct);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
