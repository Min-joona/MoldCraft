const multer = require('multer');

// Only configure Cloudinary if credentials are present
let cloudinary = null;
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary = require('cloudinary').v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only JPEG, PNG, WebP and GIF are allowed'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

const uploadToCloudinary = async (buffer, folder = 'moldcraft') => {
  if (!cloudinary) {
    // Dev fallback: return a placeholder so the app doesn't crash
    console.log('⚠️  [DEV] Cloudinary not configured — image upload skipped');
    return { url: 'https://placehold.co/400x400/161b24/f97316?text=No+Image', publicId: 'dev-placeholder' };
  }
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: 'image' }, (error, result) => {
        if (error) reject(error);
        else resolve({ url: result.secure_url, publicId: result.public_id });
      })
      .end(buffer);
  });
};

const deleteFromCloudinary = async (publicId) => {
  if (!cloudinary || publicId === 'dev-placeholder') return;
  return cloudinary.uploader.destroy(publicId);
};

module.exports = { upload, uploadToCloudinary, deleteFromCloudinary };
