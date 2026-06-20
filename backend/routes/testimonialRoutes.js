const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');

// Get all testimonials
router.get('/', testimonialController.getTestimonials);

// Create a testimonial
router.post('/', testimonialController.createTestimonial);

// Delete a testimonial
router.delete('/:id', testimonialController.deleteTestimonial);

module.exports = router;
