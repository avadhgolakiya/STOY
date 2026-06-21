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
    const { items, totalAmount, paymentMethod, shippingAddress } = req.body;
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
      shippingAddress,
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

      let amountInPaise = Math.round(finalAmount * 100);
      // Razorpay test mode maximum limit is 500,000 INR (50,000,000 paise)
      // Cap it so testing high-value luxury items doesn't crash the API.
      if (amountInPaise > 50000000) {
        console.warn('Capping amount to 500,000 INR due to Razorpay test mode limit');
        amountInPaise = 50000000;
      }

      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: `receipt_order_${Date.now()}`.substring(0, 40),
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
    const errorMsg = error.error ? error.error.description : error.message;
    console.error('Error creating order:', errorMsg || error);
    res.status(500).json({ message: errorMsg || 'Server Error', stack: error.stack });
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

const nodemailer = require('nodemailer');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.deliveryStatus = deliveryStatus;
    await order.save();

    // Send Email Notification
    try {
      const transporter = nodemailer.createTransport({
        host: getEnv('SMTP_HOST') || 'smtp.ethereal.email',
        port: getEnv('SMTP_PORT') || 587,
        auth: {
          user: getEnv('SMTP_USER') || 'dummy_user@ethereal.email',
          pass: getEnv('SMTP_PASS') || 'dummy_pass'
        }
      });

      const mailOptions = {
        from: '"Adult store" <no-reply@adultstore.com>',
        to: order.customerEmail,
        subject: `Update on your Order #${order._id.toString().substring(0, 8)}`,
        text: `Hello ${order.customerName},\n\nYour order status has been updated to: ${deliveryStatus}.\n\nThank you for shopping with us!\nAdult store`,
        html: `<h3>Hello ${order.customerName},</h3><p>Your order status has been updated to: <strong>${deliveryStatus}</strong>.</p><p>Thank you for shopping with us!<br/>Adult store</p>`
      };

      if (!getEnv('SMTP_HOST')) {
        console.log('--- SIMULATED EMAIL NOTIFICATION ---');
        console.log(`To: ${order.customerEmail}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log(`Body: ${mailOptions.text}`);
        console.log('------------------------------------');
      } else {
        await transporter.sendMail(mailOptions);
      }
    } catch (emailError) {
      console.error('Failed to send status update email:', emailError);
      // We don't fail the API request if email fails, just log it.
    }

    res.json({ success: true, order, message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
