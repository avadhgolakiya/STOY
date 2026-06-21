const Review = require('../models/Review');

exports.createReview = async (req, res) => {
  try {
    const { productId, rating, title, content, image, displayName, emailAddress } = req.body;

    if (!productId || !rating || !title || !content || !displayName || !emailAddress) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const review = await Review.create({
      productId,
      rating,
      title,
      content,
      image,
      displayName,
      emailAddress,
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
