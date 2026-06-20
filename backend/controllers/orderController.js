const Order = require('../models/Order');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Helper to manually parse .env if dotenvx ignores our newly appended keys
function getEnv(key) {
  try {
    const envPath = path.join(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n');
      for (const line of lines) {
        if (line.startsWith(key + '=')) {
          return line.substring(key.length + 1).trim();
        }
      }
    }
  } catch(e) {}
  if (process.env[key]) return process.env[key].trim();
  return '';
}

exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod } = req.body;
    const deliveryFee = paymentMethod === 'cod' ? 40 : 0;
    const finalAmount = totalAmount + deliveryFee;

    // Create DB Order
    const order = new Order({
      customerName: req.user ? req.user.name : 'Guest',
      customerEmail: req.user ? req.user.email : 'guest@example.com',
      totalAmount: finalAmount,
      deliveryFee,
      paymentMethod,
      items: JSON.stringify(items),
      paymentStatus: 'pending',
    });

    if (paymentMethod === 'cod') {
      await order.save();
      return res.status(201).json({ success: true, order, message: 'COD Order created successfully' });
    }

    if (paymentMethod === 'razorpay') {
      const rzpId = getEnv('RAZORPAY_KEY_ID');
      const rzpSecret = getEnv('RAZORPAY_KEY_SECRET');

      const isDummyKey = !rzpId || rzpId === 'dummy_key_id';

      if (isDummyKey) {
        // Mock Razorpay order for demonstration purposes when keys are missing
        const mockOrderId = `order_dummy_${Date.now()}`;
        order.razorpayOrderId = mockOrderId;
        await order.save();

        return res.status(201).json({
          success: true,
          order,
          razorpayOrder: {
            id: mockOrderId,
            amount: Math.round(finalAmount * 100),
            currency: 'INR',
            isDummy: true // Flag to tell frontend to bypass real widget
          },
        });
      }

      // Create Real Razorpay Order
      const key_id = rzpId;
      const key_secret = rzpSecret;
      
      console.log('Initializing Razorpay with key:', key_id);

      const razorpay = new Razorpay({
        key_id,
        key_secret,
      });

      const options = {
        amount: Math.round(finalAmount * 100), // amount in smallest currency unit (paise)
        currency: 'INR',
        receipt: `receipt_order_${Date.now()}`,
      };

      const razorpayOrder = await razorpay.orders.create(options);
      
      order.razorpayOrderId = razorpayOrder.id;
      await order.save();

      return res.status(201).json({
        success: true,
        order,
        razorpayOrder,
      });
    }

    res.status(400).json({ message: 'Invalid payment method' });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', getEnv('RAZORPAY_KEY_SECRET') || 'dummy_key_secret')
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update order in DB
      const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
      if (order) {
        order.paymentStatus = 'paid';
        order.razorpayPaymentId = razorpay_payment_id;
        await order.save();
      }

      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerEmail: req.user.email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
