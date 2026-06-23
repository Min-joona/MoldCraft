const mongoose = require('mongoose');

const heroSlideSchema = new mongoose.Schema({
  image: { type: String, required: true },
  publicId: { type: String, default: '' },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  link: { type: String, default: '' },
  linkText: { type: String, default: 'Learn More' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('HeroSlide', heroSlideSchema);
