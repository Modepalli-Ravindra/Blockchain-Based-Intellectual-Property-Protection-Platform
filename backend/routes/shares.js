const express = require('express');
const router = express.Router();
const { shareAsset, getSharedAssets, downloadSharedAsset } = require('../controllers/shareController');
const auth = require('../middleware/auth');

// Protected routes
router.post('/', auth, shareAsset);
router.get('/received', auth, getSharedAssets);
router.get('/download/:assetId', auth, downloadSharedAsset);

module.exports = router;