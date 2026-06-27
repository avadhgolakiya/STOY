const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const {
  SITE_NAME,
  generateEmailTemplate,
  generateForgotPasswordTemplate,
  generatePasswordUpdatedTemplate,
  generateRegisterSuccessTemplate,
} = require('../utils/emailTemplates');
const fs = require('fs');
const path = require('path');

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
  } catch (e) { }
  if (process.env[key]) return process.env[key].trim();
  return '';
}

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, getEnv('JWT_SECRET') || 'secret123', {
    expiresIn: '30d',
  });
};

const createTransporter = () => {
  const smtpUser = getEnv('SMTP_USER') || 'avadhgolakiya88@gmail.com';
  const smtpPass = getEnv('SMTP_PASS') || 'zvtpdprzfebryjfe';
  const smtpHost = getEnv('SMTP_HOST');
  const smtpPort = getEnv('SMTP_PORT');
  const smtpSecure = getEnv('SMTP_SECURE');

  // If host is explicitly defined in env, use custom SMTP configuration
  if (smtpHost) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort ? parseInt(smtpPort) : 587,
      secure: smtpSecure === 'true',
      family: 4, // Force IPv4
      auth: {
        user: smtpUser || undefined,
        pass: smtpPass || undefined
      },
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 20000,
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  // Otherwise, default to Gmail service using specified credentials
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    family: 4, // Force IPv4
    auth: {
      user: smtpUser,
      pass: smtpPass
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000
  });
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
    const transporter = createTransporter();
    const smtpUser = getEnv('SMTP_USER') || 'avadhgolakiya88@gmail.com';

    try {
      await transporter.verify();
      console.log("SMTP Ready");
    } catch (err) {
      console.error("SMTP Verify Error:", err);
    }

    const mailOptions = {
      from: `"${SITE_NAME}" <${smtpUser}>`,
      to: user.email,
      subject: `🔑 ${SITE_NAME} — Verify Your Email`,
      text: `Welcome to ${SITE_NAME}! Your registration verification code is: ${otp}`,
      html: generateEmailTemplate(otp, 'Verify Your Email', `Welcome to ${SITE_NAME}! To complete your registration, please enter the verification code below.`, user)
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'OTP sent to email for verification' });
    } catch (emailError) {
      console.error('Failed to send verification email via SMTP:', emailError.message);
      console.log(`[OTP Verification Bypass] For email ${user.email}, the OTP is: ${otp}`);
      res.status(200).json({
        message: 'OTP sent to email for verification (Bypassed via console logs)',
        warning: 'Email sending failed. Please check server logs for the OTP.',
        otp: process.env.NODE_ENV !== 'production' ? otp : undefined
      });
    }
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

    // Send welcome confirmation email
    const transporter = createTransporter();
    const smtpUser = getEnv('SMTP_USER') || 'avadhgolakiya88@gmail.com';
    const mailOptions = {
      from: `"${SITE_NAME}" <${smtpUser}>`,
      to: user.email,
      subject: `✨ Welcome to ${SITE_NAME} — Account Verified!`,
      text: `Hi ${user.name || 'there'}! Your account has been verified successfully. Welcome to ${SITE_NAME}!`,
      html: generateRegisterSuccessTemplate(user)
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Failed to send registration success confirmation email:', emailError.message);
    }

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
    const transporter = createTransporter();
    const smtpUser = getEnv('SMTP_USER') || 'avadhgolakiya88@gmail.com';

    try {
      await transporter.verify();
      console.log("SMTP Ready");
    } catch (err) {
      console.error("SMTP Verify Error:", err);
    }

    const mailOptions = {
      from: `"${SITE_NAME}" <${smtpUser}>`,
      to: user.email,
      subject: `🔐 ${SITE_NAME} — Reset Your Password`,
      text: `Hi${user.name ? ` ${user.name}` : ''}, we received a request to reset your ${SITE_NAME} password. Your reset code is: ${otp}. This code expires in 10 minutes.`,
      html: generateForgotPasswordTemplate(otp, user),
    };

    try {
      await transporter.sendMail(mailOptions);
      res.json({ message: 'OTP sent to email' });
    } catch (emailError) {
      console.error('Failed to send forgot-password email via SMTP:', emailError.message);
      console.log(`[OTP Verification Bypass] For email ${user.email}, the OTP is: ${otp}`);
      res.json({
        message: 'OTP sent to email (Bypassed via console logs)',
        warning: 'Email sending failed. Please check server logs for the OTP.',
        otp: process.env.NODE_ENV !== 'production' ? otp : undefined
      });
    }

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

    // Send confirmation email
    const transporter = createTransporter();
    const smtpUser = getEnv('SMTP_USER') || 'avadhgolakiya88@gmail.com';
    const mailOptions = {
      from: `"${SITE_NAME}" <${smtpUser}>`,
      to: user.email,
      subject: `✅ Your ${SITE_NAME} Password Has Been Updated`,
      html: generatePasswordUpdatedTemplate(user)
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Failed to send password updated confirmation email:', emailError.message);
    }

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const AdminUser = require('../models/AdminUser');

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Seed default admin if none exist
    const adminCount = await AdminUser.countDocuments();
    if (adminCount === 0) {
      await AdminUser.create({
        email: 'admin@adultdesire.com',
        password: 'adminpassword',
      });
    }

    const admin = await AdminUser.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid admin email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
