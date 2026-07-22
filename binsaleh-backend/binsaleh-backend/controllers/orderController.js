// controllers/orderController.js

const Order = require('../models/Order');

// POST /api/orders
// addTocurt.html ka placeOrder() ye call karega
exports.createOrder = async (req, res) => {
  try {
    const body = req.body;

    if (!body.items || !body.items.length) {
      return res.status(400).json({ message: 'Order must have at least one item' });
    }

    const order = await Order.create({
      user: req.user ? req.user.id : null, // logged-in hai to link, warna guest
      items: body.items,
      contact: body.contact,
      shippingAddress: body.shippingAddress,
      shippingMethod: body.shippingMethod,
      shippingCost: body.shippingCost,
      paymentMethod: body.paymentMethod,
      subtotal: body.subtotal,
      total: body.total,
      currency: body.currency || 'PKR'
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/orders
// Admin panel ke liye — sab orders (renderOrders() ab mock data ki jagah ye use karega)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/my
// Logged-in customer apni orders dekhe (profile.html ke liye)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/orders/:id/status
// Admin panel se order status change karna (pending -> shipped -> delivered, etc.)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/orders/:id
// Admin panel se order delete karna
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
