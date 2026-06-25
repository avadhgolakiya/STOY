const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');

// Get all banners
router.get('/', bannerController.getBanners);

// Create a banner
router.post('/', bannerController.createBanner);

// Update a banner
router.put('/:id', bannerController.updateBanner);

// Delete a banner
router.delete('/:id', bannerController.deleteBanner);

module.exports = router;
