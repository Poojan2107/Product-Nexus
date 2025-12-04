const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', auth, async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  } else {
    const order = new Order({
      orderItems,
      user: req.user.id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', auth, async (req, res) => {
  const orders = await Order.find({ user: req.user.id });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', auth, admin, async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
router.put('/:id/deliver', auth, admin, async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'Delivered';

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

module.exports = router;
