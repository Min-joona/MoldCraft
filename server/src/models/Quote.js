const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema(
  {
    // Customer info
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    company: { type: String, trim: true },

    // Part details
    partDescription: { type: String, required: true },
    material: {
      type: String,
      enum: ['PP', 'ABS', 'HDPE', 'Nylon', 'TPU', 'PC', 'PVC', 'Other'],
      required: true,
    },
    color: { type: String, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: { type: String, default: 'mm' },
    },
    hasMold: { type: Boolean, default: false },
    referenceImages: [{ url: String, publicId: String }],
    additionalNotes: { type: String },

    // Quote tracking
    quoteNumber: { type: String, unique: true },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'quoted', 'accepted', 'rejected', 'completed'],
      default: 'pending',
    },
    quotedPrice: { type: Number },
    adminNotes: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Auto-generate quote number before saving
quoteSchema.pre('save', async function (next) {
  if (!this.quoteNumber) {
    const count = await mongoose.model('Quote').countDocuments();
    this.quoteNumber = `MC-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Quote', quoteSchema);
