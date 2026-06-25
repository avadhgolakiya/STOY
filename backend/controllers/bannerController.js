const HeroBanner = require('../models/HeroBanner');

// Get all banners
exports.getBanners = async (req, res) => {
  try {
    const banners = await HeroBanner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Create a banner
exports.createBanner = async (req, res) => {
  try {
    const { title, desc, image, isActive } = req.body;

    const banner = new HeroBanner({
      title,
      desc,
      image,
      isActive: isActive === undefined ? false : isActive,
    });

    const createdBanner = await banner.save();
    res.status(201).json(createdBanner);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Update a banner
exports.updateBanner = async (req, res) => {
  try {
    const { title, desc, image, isActive } = req.body;
    const banner = await HeroBanner.findById(req.params.id);

    if (banner) {
      if (title !== undefined) banner.title = title;
      if (desc !== undefined) banner.desc = desc;
      if (image !== undefined) banner.image = image;
      if (isActive !== undefined) banner.isActive = isActive;

      const updatedBanner = await banner.save();
      res.json(updatedBanner);
    } else {
      res.status(404).json({ message: 'Banner not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Delete a banner
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await HeroBanner.findById(req.params.id);

    if (banner) {
      await banner.deleteOne();
      res.json({ message: 'Banner removed' });
    } else {
      res.status(404).json({ message: 'Banner not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
