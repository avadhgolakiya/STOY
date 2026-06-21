const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    discount: { type: Number, required: true },
    desc: { type: String, required: true },
    image: { type: String, required: true },
    additionalImages: { type: [String], default: [] },
    tag: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    size: { type: String, enum: ['Small', 'Medium', 'Large', ''] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
