const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    role: { type: String, default: 'Client' },
    quote: { type: String, required: true },
    rating: { type: Number, required: true, default: 5, min: 1, max: 5 },
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
