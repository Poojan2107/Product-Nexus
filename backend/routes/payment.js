const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const Order = require('../models/Order');

let razorpay;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  } else {
    console.warn("RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET missing. Payment gateway disabled.");
  }
} catch (err) {
  console.error("Razorpay init error:", err);
}

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
router.post('/create-order', auth, async (req, res) => {
  try {
    if (!razorpay) return res.status(503).json({ message: 'Payment gateway not configured' });
    const { orderId } = req.body;
    
    const dbOrder = await Order.findById(orderId);
    if (!dbOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const options = {
      amount: Math.round(dbOrder.totalPrice * 100), // Convert to paise
      currency: 'INR',
      receipt: orderId.toString(),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Verify Payment Signature
// @route   POST /api/payment/verify-payment
// @access  Private
router.post('/verify-payment', auth, async (req, res) => {
  try {
    if (!razorpay) return res.status(503).json({ message: 'Payment gateway not configured' });
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment Verified
      const order = await Order.findById(order_id);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: razorpay_payment_id,
          status: 'COMPLETED',
          update_time: Date.now(),
          email_address: req.user.email,
        };
        order.status = 'Processing'; 
        await order.save();
        res.json({ message: "Payment verified successfully", success: true });
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } else {
      res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).send(error);
  }
});

// @desc    Get Razorpay Key
// @route   GET /api/payment/key
// @access  Private
router.get('/key', auth, (req, res) => {
  res.json({ keyId: process.env.RAZORPAY_KEY_ID });
});

module.exports = router;
