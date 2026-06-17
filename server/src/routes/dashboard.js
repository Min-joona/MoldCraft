const express = require('express');
const Quote = require('../models/Quote');
const BlogPost = require('../models/BlogPost');
const GalleryItem = require('../models/GalleryItem');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/dashboard — combined dashboard stats (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const [totalQuotes, totalGallery, totalBlog, totalUsers, recentQuotes, recentPosts, statusBreakdown] = await Promise.all([
      Quote.countDocuments(),
      GalleryItem.countDocuments(),
      BlogPost.countDocuments(),
      User.countDocuments(),
      Quote.find().sort({ createdAt: -1 }).limit(5).select('name quoteNumber status material quantity createdAt'),
      BlogPost.find().sort({ createdAt: -1 }).limit(5).select('title slug isPublished views createdAt'),
      Quote.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    const publishedBlog = await BlogPost.countDocuments({ isPublished: true });

    res.json({
      success: true,
      data: {
        counts: {
          totalQuotes,
          totalGallery,
          totalBlog,
          publishedBlog,
          totalUsers,
        },
        statusBreakdown: statusBreakdown.map(s => ({ status: s._id, count: s.count })),
        recentQuotes,
        recentPosts,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
