const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String },
    customerEmail: { type: String },
    totalAmount: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    paymentMethod: { type: String, enum: ['cod', 'razorpay'], required: true },
    paymentStatus: { type: String, default: 'pending', enum: ['pending', 'paid', 'failed'] },
    deliveryStatus: { 
      type: String, 
      default: 'Not Confirmed yet', 
      enum: ['Not Confirmed yet', 'Order Confirmed', 'Processing', 'Shipped', 'Delivered'] 
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    items: { type: String, required: true }, // JSON representation of items
    shippingAddress: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
