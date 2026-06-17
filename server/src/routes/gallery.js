const express = require('express');
const GalleryItem = require('../models/GalleryItem');
const { protect, adminOnly } = require('../middleware/auth');
const { upload, uploadToCloudinary, deleteFromCloudinary } = require('../middleware/upload');

const router = express.Router();

// GET /api/gallery (public)
router.get('/', async (req, res) => {
  try {
    const { material, industry, featured } = req.query;
    const filter = { isPublished: true };
    if (material) filter.material = material;
    if (industry) filter.industry = industry;
    if (featured) filter.featured = featured === 'true';
    const items = await GalleryItem.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/gallery (admin)
router.post('/', protect, adminOnly, upload.array('images', 10), async (req, res) => {
  try {
    const images = req.files?.length
      ? await Promise.all(req.files.map((f) => uploadToCloudinary(f.buffer, 'moldcraft/gallery')))
      : [];
    const item = await GalleryItem.create({ ...req.body, images });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/gallery/:id (admin)
router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const item = await GalleryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/gallery/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    await Promise.all(item.images.map((img) => deleteFromCloudinary(img.publicId)));
    await item.deleteOne();
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
