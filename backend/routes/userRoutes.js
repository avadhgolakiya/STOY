const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/profile', protect, userController.getUserProfile);
router.get('/', userController.getAllUsers);
router.post('/wishlist/:productId', protect, userController.toggleWishlist);

module.exports = router;
