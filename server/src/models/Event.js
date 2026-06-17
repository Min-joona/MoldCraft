const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  event: { type: String, required: true, index: true },
  page: { type: String, default: '' },
  element: { type: String, default: '' },
  label: { type: String, default: '' },
  country: { type: String, default: 'Unknown' },
  ip: { type: String },
  timestamp: { type: Date, default: Date.now, index: true },
});

eventSchema.index({ event: 1, timestamp: -1 });

module.exports = mongoose.model('Event', eventSchema);
