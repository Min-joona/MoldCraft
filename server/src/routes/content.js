const express = require('express');
const ContentPage = require('../models/ContentPage');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/content/:key — get page content (public)
router.get('/:key', async (req, res) => {
  try {
    const page = await ContentPage.findOne({ key: req.params.key, isActive: true });
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
    res.json({ success: true, data: page });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/content/:key — update page content (admin)
router.patch('/:key', protect, adminOnly, async (req, res) => {
  try {
    const page = await ContentPage.findOneAndUpdate(
      { key: req.params.key },
      { ...req.body, updatedBy: req.user._id },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: page });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/content — list all content pages (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const pages = await ContentPage.find().select('key title updatedAt isActive').sort({ key: 1 });
    res.json({ success: true, data: pages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
