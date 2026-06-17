const mongoose = require('mongoose');
const slugify = require('slugify');

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true }, // Markdown or HTML
    coverImage: { url: String, publicId: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tags: [String],
    category: {
      type: String,
      enum: ['how-to', 'materials', 'tips', 'news', 'case-study'],
      default: 'news',
    },
    isPublished: { type: Boolean, default: false },
    publishedAt: Date,
    views: { type: Number, default: 0 },
    readTime: Number, // in minutes
  },
  { timestamps: true }
);

blogPostSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.content) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200);
  }
  next();
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
