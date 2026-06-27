const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.registerUser);
router.post('/verify-registration-otp', authController.verifyRegistrationOTP);
router.post('/login', authController.loginUser);
router.post('/admin/login', authController.loginAdmin);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp', authController.verifyOTP);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
