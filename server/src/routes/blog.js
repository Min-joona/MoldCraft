const express = require('express');
const BlogPost = require('../models/BlogPost');
const { protect, adminOnly } = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../middleware/upload');

const router = express.Router();

// GET /api/blog (public)
router.get('/', async (req, res) => {
  try {
    const { category, tag, page = 1, limit = 9 } = req.query;
    const filter = { isPublished: true };
    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    const posts = await BlogPost.find(filter)
      .populate('author', 'name')
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-content');
    const total = await BlogPost.countDocuments(filter);
    res.json({ success: true, data: posts, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/blog/:slug (public, increments views)
router.get('/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOneAndUpdate(
      { slug: req.params.slug, isPublished: true },
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name');
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/blog (admin)
router.post('/', protect, adminOnly, upload.single('coverImage'), async (req, res) => {
  try {
    const coverImage = req.file ? await uploadToCloudinary(req.file.buffer, 'moldcraft/blog') : undefined;
    const post = await BlogPost.create({
      ...req.body,
      author: req.user._id,
      ...(coverImage && { coverImage }),
      ...(req.body.isPublished === 'true' && { publishedAt: new Date() }),
    });
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/blog/:id (admin)
router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.body.isPublished === true && !req.body.publishedAt) update.publishedAt = new Date();
    const post = await BlogPost.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/blog/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
