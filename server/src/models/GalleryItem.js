const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    images: [{ url: String, publicId: String }],
    material: { type: String, enum: ['PP', 'ABS', 'HDPE', 'Nylon', 'TPU', 'PC', 'PVC', 'Other'] },
    color: String,
    industry: {
      type: String,
      enum: ['hardware', 'consumer', 'industrial', 'educational', 'prototype', 'other'],
      default: 'other',
    },
    tags: [String],
    featured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GalleryItem', galleryItemSchema);
