const multer = require('multer');

// Configure multer to store files in memory.
// This is efficient because we will upload them directly to Cloudinary
// without saving them to the server's disk first.
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  // Optional: Add file filter for security
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

module.exports = upload;