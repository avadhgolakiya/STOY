const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String },
    customerEmail: { type: String },
    totalAmount: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    paymentMethod: { type: String, enum: ['cod', 'razorpay'], required: true },
    paymentStatus: { type: String, default: 'pending', enum: ['pending', 'paid', 'failed'] },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    items: { type: String, required: true }, // JSON representation of items
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
