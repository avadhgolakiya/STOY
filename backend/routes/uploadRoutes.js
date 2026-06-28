const path = require('path');
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');
const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

// Multer Storage Configuration
// Standard local storage configuration
const diskStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Memory storage for Cloudinary
const memoryStorage = multer.memoryStorage();

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

// Multer instances
const uploadLocal = multer({
  storage: diskStorage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

const uploadCloudinary = multer({
  storage: memoryStorage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Stream helper for Cloudinary
const uploadFromBuffer = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'products' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    const readable = new Readable();
    readable._read = () => {};
    readable.push(fileBuffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

// Route
router.post('/', (req, res, next) => {
  if (isCloudinaryConfigured) {
    // Process Cloudinary Upload
    const uploadSingle = uploadCloudinary.single('image');
    uploadSingle(req, res, async (err) => {
      if (err) {
        return res.status(400).send({ message: err });
      }
      if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded' });
      }

      try {
        const result = await uploadFromBuffer(req.file.buffer);
        // Send Cloudinary URL directly to client
        res.send(result.secure_url);
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        res.status(500).send({ message: 'Cloudinary upload failed', error: uploadError.message });
      }
    });
  } else {
    console.warn('CLOUDINARY is not configured in .env. Falling back to local upload storage.');
    // Process Local Upload
    const uploadSingle = uploadLocal.single('image');
    uploadSingle(req, res, (err) => {
      if (err) {
        return res.status(400).send({ message: err });
      }
      if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded' });
      }
      // Send local relative path
      res.send(`/${req.file.path}`);
    });
  }
});

module.exports = router;
