const Share = require('../models/Share');
const Asset = require('../models/Asset');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// Share an asset with another user
const shareAsset = async (req, res) => {
  try {
    const { assetId, recipientId } = req.body;
    const ownerId = req.user.id;
    
    // Check if user is trying to share with themselves
    if (ownerId === recipientId) {
      return res.status(400).json({ message: 'You cannot share an asset with yourself' });
    }
    
    // Check if recipient exists
    const recipient = await User.findByPk(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }
    
    // Check if asset exists and belongs to the owner
    const asset = await Asset.findOne({ where: { id: assetId, userId: ownerId } });
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    
    // Check if asset is already shared with this recipient
    const existingShare = await Share.findOne({ where: { assetId, recipientId } });
    if (existingShare) {
      return res.status(400).json({ message: 'This asset has already been shared with this user' });
    }
    
    // Create share record
    const share = await Share.create({
      assetId,
      ownerId,
      recipientId
    });
    
    res.status(201).json(share);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get assets shared with the user
const getSharedAssets = async (req, res) => {
  try {
    // Get all shares where the user is the recipient
    const shares = await Share.findAll({ 
      where: { recipientId: req.user.id },
      include: [
        {
          model: Asset,
          as: 'asset'
        },
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email', 'rewards']
        }
      ],
      order: [['timestamp', 'DESC']]
    });
    
    // Format the response to match the frontend expectations
    const sharedAssets = shares.map(share => ({
      asset: share.asset,
      owner: {
        id: share.owner.id,
        name: share.owner.name,
        email: share.owner.email,
        rewards: share.owner.rewards
      },
      sharedAt: share.timestamp
    }));
    
    res.json(sharedAssets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Download a shared asset file
const downloadSharedAsset = async (req, res) => {
  try {
    const { assetId } = req.params;
    const userId = req.user.id;
    
    // Check if the asset is shared with this user
    const share = await Share.findOne({ 
      where: { 
        assetId: assetId,
        recipientId: userId 
      },
      include: [{
        model: Asset,
        as: 'asset'
      }]
    });
    
    if (!share) {
      return res.status(404).json({ message: 'Asset not found or not shared with you' });
    }
    
    // Check if file exists
    if (!share.asset.filePath || !fs.existsSync(share.asset.filePath)) {
      return res.status(404).json({ message: 'Asset file not found' });
    }
    
    // Set headers for file download
    const fileName = `${share.asset.name}${path.extname(share.asset.filePath)}`;
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', share.asset.fileType);
    
    // Stream file to response
    const fileStream = fs.createReadStream(share.asset.filePath);
    fileStream.pipe(res);
    
    fileStream.on('error', (error) => {
      res.status(500).json({ message: 'Error reading asset file' });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  shareAsset,
  getSharedAssets,
  downloadSharedAsset
};