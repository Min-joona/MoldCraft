const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const quoteRoutes = require('./routes/quotes');
const galleryRoutes = require('./routes/gallery');
const blogRoutes = require('./routes/blog');
const { materialsRouter: materialsRoutes } = require('./routes/materials');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'MoldCraft API is running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Falls back to local MongoDB if MONGODB_URI is not set in .env
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/moldcraft';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    const isLocal = MONGO_URI.includes('127.0.0.1') || MONGO_URI.includes('localhost');
    console.log('✅ Connected to MongoDB ' + (isLocal ? '(local)' : '(Atlas)'));
    app.listen(PORT, () => {
      console.log('\n🚀 Server : http://localhost:' + PORT);
      console.log('📦 Env    : ' + (process.env.NODE_ENV || 'development'));
      console.log('🗄️  DB     : ' + (isLocal ? 'Local MongoDB (localhost/moldcraft)' : 'MongoDB Atlas'));
      console.log('📧 Email  : ' + (process.env.EMAIL_USER || '⚠️  Not configured (emails skipped in dev)'));
      console.log('🖼️  Images : ' + (process.env.CLOUDINARY_CLOUD_NAME || '⚠️  Not configured (uploads skipped in dev)') + '\n');
    });
  })
  .catch((err) => {
    console.error('\n❌ MongoDB error:', err.message);
    if (MONGO_URI.includes('127.0.0.1') || MONGO_URI.includes('localhost')) {
      console.error('💡 Local MongoDB not running. Fix:');
      console.error('   Windows  : net start MongoDB');
      console.error('   Mac      : brew services start mongodb-community');
      console.error('   Linux    : sudo systemctl start mongod');
      console.error('   OR set MONGODB_URI in server/.env to use Atlas\n');
    }
    process.exit(1);
  });

module.exports = app;
