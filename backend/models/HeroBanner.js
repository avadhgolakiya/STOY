const mongoose = require('mongoose');

const heroBannerSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    desc: { type: String, default: "" },
    image: { type: String, required: true },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HeroBanner', heroBannerSchema);
