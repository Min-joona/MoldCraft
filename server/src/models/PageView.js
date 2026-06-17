const mongoose = require('mongoose');

const pageViewSchema = new mongoose.Schema({
  path: { type: String, required: true, index: true },
  country: { type: String, default: 'Unknown' },
  city: { type: String, default: '' },
  ip: { type: String },
  userAgent: { type: String },
  referrer: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now, index: true },
});

pageViewSchema.index({ timestamp: -1 });
pageViewSchema.index({ country: 1, timestamp: -1 });

module.exports = mongoose.model('PageView', pageViewSchema);
