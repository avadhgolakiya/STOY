const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

const generateEmailTemplate = (otp, title, message) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        background-color: #1a0b1c; /* Deep velvet dark mode default */
        color: #ffffff;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #2d1633;
        border: 1px solid rgba(219, 39, 119, 0.2);
        border-radius: 12px;
        padding: 40px;
        text-align: center;
        box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      }
      .logo {
        font-size: 32px;
        font-style: italic;
        color: #db2777; /* luxePink-500 */
        margin-bottom: 10px;
        font-weight: bold;
      }
      .subtitle {
        font-size: 10px;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: #db2777;
        margin-bottom: 30px;
      }
      .title {
        font-size: 24px;
        font-weight: 300;
        letter-spacing: 2px;
        text-transform: uppercase;
        margin-bottom: 20px;
        color: #ffffff;
      }
      .message {
        font-size: 14px;
        color: #d1d5db;
        line-height: 1.6;
        margin-bottom: 30px;
      }
      .otp-box {
        background-color: rgba(219, 39, 119, 0.1);
        border: 1px solid #db2777;
        border-radius: 8px;
        padding: 20px;
        font-size: 32px;
        letter-spacing: 8px;
        font-weight: bold;
        color: #ffffff;
        margin-bottom: 30px;
        display: inline-block;
      }
      .footer {
        font-size: 12px;
        color: #9ca3af;
        margin-top: 30px;
        border-top: 1px solid rgba(255,255,255,0.1);
        padding-top: 20px;
      }

      /* Light Mode Override */
      @media (prefers-color-scheme: light) {
        body {
          background-color: #fce7f3; /* pink-100 */
          color: #1f2937;
        }
        .container {
          background-color: #ffffff;
          border: 1px solid #fbcfe8;
          box-shadow: 0 10px 25px rgba(219, 39, 119, 0.1);
        }
        .title {
          color: #1f2937;
        }
        .message {
          color: #4b5563;
        }
        .otp-box {
          background-color: #fdf2f8;
          color: #be185d;
        }
        .footer {
          border-top: 1px solid #fbcfe8;
          color: #6b7280;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">Adut Store</div>
      <div class="subtitle">Exclusive Velvet & Pink Atelier</div>
      <div class="title">${title}</div>
      <div class="message">${message}</div>
      <div class="otp-box">${otp}</div>
      <div class="message">This code will expire in 10 minutes. Please do not share it with anyone.</div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Adut Store. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({ message: 'User already exists and is verified' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    if (user && !user.isVerified) {
      // Update existing unverified user
      user.name = name;
      user.password = hashedPassword;
      user.verificationOTP = otp;
      user.verificationOTPExpires = Date.now() + 10 * 60 * 1000;
      await user.save();
    } else {
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        isVerified: false,
        verificationOTP: otp,
        verificationOTPExpires: Date.now() + 10 * 60 * 1000,
      });
    }

    // Setup Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'avadhgolakiya7204@gmail.com',
        pass: 'uuyaxaaxtfzaeioa'
      }
    });

    const mailOptions = {
      from: 'avadhgolakiya7204@gmail.com',
      to: user.email,
      subject: 'Adut Store - Registration OTP',
      html: generateEmailTemplate(otp, 'Verify Your Email', 'Welcome to Adut Store! To complete your registration, please enter the verification code below.')
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent to email for verification' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.verifyRegistrationOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ 
      email, 
      verificationOTP: otp,
      verificationOTPExpires: { $gt: Date.now() } 
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.verificationOTP = undefined;
    user.verificationOTPExpires = undefined;
    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.isVerified) {
        return res.status(401).json({ message: 'Please verify your email first' });
      }
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No account with that email found' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save to DB (valid for 10 minutes)
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Setup Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'avadhgolakiya7204@gmail.com',
        pass: 'uuyaxaaxtfzaeioa'
      }
    });

    const mailOptions = {
      from: 'avadhgolakiya7204@gmail.com',
      to: user.email,
      subject: 'Adut Store - Password Reset OTP',
      html: generateEmailTemplate(otp, 'Reset Your Password', 'We received a request to reset your Adut Store password. Please use the verification code below to set a new password.')
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'OTP sent to email' });

  } catch (error) {
    res.status(500).json({ message: 'Error sending email', error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ 
      email, 
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() } 
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    res.json({ message: 'OTP verified' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const user = await User.findOne({ 
      email, 
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() } 
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
