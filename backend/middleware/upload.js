const multer = require('multer');
const path = require('path');

// We'll use memory storage for Cloudinary uploads
// This stores the file in memory instead of disk, so we can upload directly to Cloudinary
const storage = multer.memoryStorage();

// File filter to accept any file type
const fileFilter = (req, file, cb) => {
  // Accept all file types
  cb(null, true);
};

// Create upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

module.exports = upload;
