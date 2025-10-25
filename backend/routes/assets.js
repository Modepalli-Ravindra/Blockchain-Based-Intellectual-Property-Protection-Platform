const express = require('express');
const router = express.Router();
const { registerAsset, getUserAssets, verifyAsset, downloadAsset, deleteAsset } = require('../controllers/assetController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Protected routes
router.post('/register', auth, upload.single('file'), registerAsset);
router.get('/user', auth, getUserAssets);
router.post('/verify', auth, verifyAsset);
router.get('/download/:assetId', auth, downloadAsset);
router.delete('/:assetId', auth, deleteAsset);

module.exports = router;