const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept all file types for now
  cb(null, true);
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Hash a file using crypto
const hashFile = (buffer) => {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

module.exports = {
  upload,
  hashFile
};