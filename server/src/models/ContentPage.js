const mongoose = require('mongoose');

const contentPageSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, trim: true },
  title: { type: String, default: '' },
  sections: [{
    type: { type: String, enum: ['hero', 'text', 'grid', 'cards', 'cta', 'gallery', 'stats'], default: 'text' },
    title: String,
    subtitle: String,
    content: String,
    image: String,
    items: [{
      title: String,
      subtitle: String,
      description: String,
      icon: String,
      image: String,
      link: String,
      value: String,
    }],
    order: { type: Number, default: 0 },
  }],
  meta: {
    description: String,
    keywords: [String],
    ogImage: String,
  },
  isActive: { type: Boolean, default: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('ContentPage', contentPageSchema);
