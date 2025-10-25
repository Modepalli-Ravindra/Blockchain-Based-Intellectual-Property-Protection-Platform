const Asset = require('../models/Asset');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cloudinary = require('../config/cloudinary');

// Function to calculate file hash from buffer
const calculateBufferHash = (buffer) => {
  const hash = crypto.createHash('sha256');
  hash.update(buffer);
  return hash.digest('hex');
};

// Helper: upload a Buffer to Cloudinary using upload_stream
const uploadBufferToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    uploadStream.end(buffer);
  });
};

// Helper: parse Cloudinary secure_url to extract resourceType and publicId
const parseCloudinaryUrl = (secureUrl) => {
  try {
    const u = new URL(secureUrl);
    const parts = u.pathname.split('/').filter(Boolean);
    // Example: /image/upload/v1729939999/ipprotect_assets/<hash>.pdf
    const resourceType = parts[0]; // image | video | raw
    const uploadIndex = parts.indexOf('upload');
    let rest = parts.slice(uploadIndex + 1);
    if (rest[0] && /^v\d+/.test(rest[0])) {
      rest = rest.slice(1);
    }
    const last = rest[rest.length - 1] || '';
    const lastNoExt = last.replace(/\.[^/.]+$/, '');
    const publicId = rest.slice(0, -1).concat(lastNoExt).join('/');
    return { resourceType, publicId };
  } catch (e) {
    return { resourceType: 'image', publicId: null };
  }
};

// Register a new asset
const registerAsset = async (req, res) => {
  try {
    // Safely access form fields without destructuring
    // Multer populates req.body with form fields when processing multipart/form-data
    const name = req.body && req.body.name;
    const description = req.body && req.body.description || '';
    const fileType = req.body && req.body.fileType;
    const file = req.file;

    // Check if required fields are present
    if (!name) {
      return res.status(400).json({ 
        message: 'Asset name is required' 
      });
    }

    if (!fileType) {
      return res.status(400).json({ 
        message: 'File type is required' 
      });
    }

    // Check if file was uploaded
    if (!file) {
      return res.status(400).json({ 
        message: 'File is required' 
      });
    }

    // Calculate file hash from buffer
    const hash = calculateBufferHash(file.buffer);

    // Check if asset with this hash already exists
    const existingAsset = await Asset.findOne({ where: { hash } });

    if (existingAsset) {
      const date = new Date(existingAsset.timestamp).toLocaleString();
      return res.status(400).json({ 
        message: `This asset has already been registered on ${date}` 
      });
    }

    // Upload file to Cloudinary
    const fileExtension = path.extname(file.originalname);
    try {
      const uploadResult = await uploadBufferToCloudinary(file.buffer, {
        resource_type: 'auto',
        public_id: hash,
        folder: 'ipprotect_assets',
        overwrite: true,
        use_filename: false
      });

      // Create asset with Cloudinary URL
      const asset = await Asset.create({
        userId: req.user.id,
        name,
        description,
        fileType,
        hash,
        filePath: uploadResult.secure_url
      });

      return res.status(201).json(asset);
    } catch (cloudErr) {
      return res.status(500).json({ message: `Error uploading to Cloudinary: ${cloudErr.message}` });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's assets
const getUserAssets = async (req, res) => {
  try {
    const assets = await Asset.findAll({ 
      where: { userId: req.user.id },
      order: [['timestamp', 'DESC']]
    });

    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify an asset
const verifyAsset = async (req, res) => {
  try {
    // Safely access hash without destructuring
    const hash = req.body && req.body.hash;

    // Check if hash is provided
    if (!hash) {
      return res.status(400).json({ 
        message: 'Hash is required' 
      });
    }

    // Find asset with this hash for the user
    const asset = await Asset.findOne({ 
      where: { 
        hash: hash,
        userId: req.user.id 
      }
    });

    if (asset) {
      res.json({
        asset: asset,
        isVerified: true
      });
    } else {
      res.json({
        asset: null,
        isVerified: false
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Download an asset file
const downloadAsset = async (req, res) => {
  try {
    const { assetId } = req.params;
    const userId = req.user.id;

    // Find asset that belongs to the user or is shared with the user
    const asset = await Asset.findOne({ 
      where: { 
        id: assetId,
        userId: userId
      }
    });

    // If not found, check if it's shared with the user
    if (!asset) {
      // In a full implementation, you would check if the asset is shared with the user
      // For now, we'll just return a 404
      return res.status(404).json({ message: 'Asset not found or not accessible' });
    }

    // For Cloudinary assets, redirect to the secure URL
    if (asset.filePath && asset.filePath.includes('cloudinary.com')) {
      return res.redirect(asset.filePath);
    } else {
      // Fallback for local files (legacy support)
      if (!asset.filePath || !fs.existsSync(asset.filePath)) {
        return res.status(404).json({ message: 'Asset file not found' });
      }

      // Set headers for file download
      const fileName = `${asset.name}${path.extname(asset.filePath)}`;
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Type', asset.fileType);

      // Stream file to response
      const fileStream = fs.createReadStream(asset.filePath);
      fileStream.pipe(res);

      fileStream.on('error', (error) => {
        res.status(500).json({ message: 'Error reading asset file' });
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an asset
const deleteAsset = async (req, res) => {
  try {
    const { assetId } = req.params;
    const userId = req.user.id;

    const asset = await Asset.findOne({ where: { id: assetId, userId } });
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    // Try to remove Cloudinary resource if applicable
    if (asset.filePath && asset.filePath.includes('res.cloudinary.com')) {
      const { resourceType, publicId } = parseCloudinaryUrl(asset.filePath);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId, { resource_type: resourceType || 'image' });
        } catch (e) {
          // Log and continue; deletion of DB record should proceed
          console.warn('Cloudinary deletion failed:', e.message);
        }
      }
    } else if (asset.filePath && fs.existsSync(asset.filePath)) {
      // Legacy local file deletion
      try {
        fs.unlinkSync(asset.filePath);
      } catch (e) {
        console.warn('Local file deletion failed:', e.message);
      }
    }

    await asset.destroy();
    return res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerAsset,
  getUserAssets,
  verifyAsset,
  downloadAsset,
  deleteAsset
};