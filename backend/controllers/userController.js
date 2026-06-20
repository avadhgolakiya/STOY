const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const index = user.wishlist.indexOf(Number(productId));
    
    if (index === -1) {
      // Add to wishlist
      user.wishlist.push(Number(productId));
    } else {
      // Remove from wishlist
      user.wishlist.splice(index, 1);
    }

    await user.save();
    
    // Return updated wishlist
    const updatedUser = await User.findById(req.user._id).select('wishlist');
    
    res.json({ message: index === -1 ? 'Added to wishlist' : 'Removed from wishlist', wishlist: updatedUser.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
