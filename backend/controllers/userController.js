const User = require('../models/User');
const Order = require('../models/Order');

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

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    
    const usersWithOrderInfo = await Promise.all(users.map(async (user) => {
      const orders = await Order.find({ customerEmail: user.email }).sort({ createdAt: -1 });
      
      let phone = '';
      let lastAddress = '';
      
      if (orders.length > 0) {
        const latestOrder = orders[0];
        if (latestOrder.shippingAddress) {
          phone = latestOrder.shippingAddress.phone || '';
          const sa = latestOrder.shippingAddress;
          lastAddress = `${sa.addressLine1 || sa.address || ''}, ${sa.city || ''}, ${sa.state || ''} ${sa.postalCode || sa.zip || ''}`;
        }
      }

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        wishlistCount: user.wishlist ? user.wishlist.length : 0,
        ordersCount: orders.length,
        phone: phone,
        lastAddress: lastAddress
      };
    }));

    res.json(usersWithOrderInfo);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
