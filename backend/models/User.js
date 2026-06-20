const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetPasswordOTP: { type: String },
    resetPasswordExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    verificationOTP: { type: String },
    verificationOTPExpires: { type: Date },
    wishlist: [{ type: Number }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
