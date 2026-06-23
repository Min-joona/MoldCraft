const express = require('express');
const HeroSlide = require('../models/HeroSlide');
const { protect, adminOnly } = require('../middleware/auth');

let cloudinary = null;
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary = require('cloudinary').v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const router = express.Router();

const uploadBase64 = async (base64, folder = 'moldcraft/hero') => {
  if (!cloudinary) {
    return { url: base64, publicId: '' };
  }
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(base64, { folder }, (err, result) => {
      if (err) reject(err);
      else resolve({ url: result.secure_url, publicId: result.public_id });
    });
  });
};

// GET /api/hero — public, active slides sorted by order
router.get('/', async (req, res) => {
  try {
    const slides = await HeroSlide.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: slides });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/hero/all — admin, all slides
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const slides = await HeroSlide.find().sort({ order: 1 });
    res.json({ success: true, data: slides });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/hero
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    let image = req.body.image || '';
    let publicId = '';
    if (image.startsWith('data:')) {
      const result = await uploadBase64(image);
      image = result.url;
      publicId = result.publicId;
    }
    const slide = await HeroSlide.create({ ...req.body, image, publicId });
    res.status(201).json({ success: true, data: slide });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/hero/:id
router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.image?.startsWith('data:')) {
      const existing = await HeroSlide.findById(req.params.id);
      if (existing?.publicId && cloudinary) {
        cloudinary.uploader.destroy(existing.publicId).catch(() => {});
      }
      const result = await uploadBase64(updates.image);
      updates.image = result.url;
      updates.publicId = result.publicId;
    }
    const slide = await HeroSlide.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!slide) return res.status(404).json({ success: false, message: 'Slide not found' });
    res.json({ success: true, data: slide });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/hero/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);
    if (!slide) return res.status(404).json({ success: false, message: 'Slide not found' });
    if (slide.publicId && cloudinary) {
      cloudinary.uploader.destroy(slide.publicId).catch(() => {});
    }
    await HeroSlide.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Slide deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
