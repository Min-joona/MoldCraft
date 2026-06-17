const express = require('express');
const PageView = require('../models/PageView');
const Event = require('../models/Event');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

function getCountry(req) {
  return req.headers['cf-ipcountry'] || req.headers['x-vercel-ip-country'] || req.headers['x-forwarded-for'] || 'Unknown';
}

// POST /api/analytics/track — track page view (public)
router.post('/track', async (req, res) => {
  try {
    const { path, referrer } = req.body;
    if (!path) return res.status(400).json({ success: false, message: 'Path required' });

    await PageView.create({
      path,
      country: getCountry(req),
      ip: req.ip,
      userAgent: req.headers['user-agent'] || '',
      referrer: referrer || '',
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/analytics/event — track event (public)
router.post('/event', async (req, res) => {
  try {
    const { event, page, element, label } = req.body;
    if (!event) return res.status(400).json({ success: false, message: 'Event name required' });

    await Event.create({
      event, page: page || '', element: element || '', label: label || '',
      country: getCountry(req), ip: req.ip,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/analytics/stats — dashboard stats (admin)
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [totalViews, views30d, views7d, uniquePaths, countryData, events30d, topPages] = await Promise.all([
      PageView.countDocuments(),
      PageView.countDocuments({ timestamp: { $gte: thirtyDaysAgo } }),
      PageView.countDocuments({ timestamp: { $gte: sevenDaysAgo } }),
      PageView.distinct('path').then(p => p.length),
      PageView.aggregate([
        { $match: { timestamp: { $gte: thirtyDaysAgo } } },
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Event.countDocuments({ timestamp: { $gte: thirtyDaysAgo } }),
      PageView.aggregate([
        { $match: { timestamp: { $gte: thirtyDaysAgo } } },
        { $group: { _id: '$path', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ]);

    // Daily views for chart
    const dailyViews = await PageView.aggregate([
      { $match: { timestamp: { $gte: thirtyDaysAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Top events
    const topEvents = await Event.aggregate([
      { $match: { timestamp: { $gte: thirtyDaysAgo } } },
      { $group: { _id: { event: '$event', element: '$element' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      success: true,
      data: {
        overview: { totalViews, views30d, views7d, uniquePaths, events30d },
        countries: countryData.map(c => ({ country: c._id, count: c.count })),
        topPages: topPages.map(p => ({ path: p._id, count: p.count })),
        dailyViews,
        topEvents: topEvents.map(e => ({ event: e._id.event, element: e._id.element, count: e.count })),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
