const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// Upload image file
router.post('/image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    // Return the URL to access the image
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ 
      url: imageUrl,
      filename: req.file.filename
    });
  } catch (err) {
    console.error('❌ Error uploading image:', err);
    res.status(500).json({ error: 'Failed to upload image', details: err.message });
  }
});

// Handle base64 image upload
router.post('/image/base64', (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'No image data provided' });
    }
    
    // Check if it's a base64 data URL
    const base64Match = image.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!base64Match) {
      return res.status(400).json({ error: 'Invalid base64 image format' });
    }
    
    const imageType = base64Match[1];
    const base64Data = base64Match[2];
    
    // Validate image type
    const allowedTypes = ['jpeg', 'jpg', 'png', 'gif', 'webp'];
    if (!allowedTypes.includes(imageType.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid image type. Only jpeg, jpg, png, gif, webp are allowed' });
    }
    
    // Check size (decode base64 and check)
    const buffer = Buffer.from(base64Data, 'base64');
    if (buffer.length > 5 * 1024 * 1024) { // 5MB limit
      return res.status(400).json({ error: 'Image too large. Maximum size is 5MB' });
    }
    
    // Save file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `image-${uniqueSuffix}.${imageType}`;
    const filepath = path.join(uploadsDir, filename);
    
    fs.writeFileSync(filepath, buffer);
    
    // Return the URL
    const imageUrl = `/uploads/${filename}`;
    res.json({ 
      url: imageUrl,
      filename: filename
    });
  } catch (err) {
    console.error('❌ Error uploading base64 image:', err);
    res.status(500).json({ error: 'Failed to upload image', details: err.message });
  }
});

module.exports = router;

