const Testimonial = require('../models/Testimonial');

const sanitizeImageUrl = (url) => {
  if (typeof url !== 'string') return url;
  if (url.includes('https://res.cloudinary.com/')) {
    const idx = url.indexOf('https://res.cloudinary.com/');
    if (idx > 0) {
      return url.substring(idx);
    }
  }
  return url;
};

// Get all testimonials
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Create a testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const { clientName, role, quote, rating, image } = req.body;

    const testimonial = new Testimonial({
      clientName,
      role,
      quote,
      rating,
      image: sanitizeImageUrl(image),
    });

    const createdTestimonial = await testimonial.save();
    res.status(201).json(createdTestimonial);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (testimonial) {
      await testimonial.deleteOne();
      res.json({ message: 'Testimonial removed' });
    } else {
      res.status(404).json({ message: 'Testimonial not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
