const { DataTypes } = require('sequelize');
const db = require('../config/db');
const User = require('./User');

// Function to generate a unique asset ID
const generateUniqueAssetId = () => {
  const timestamp = Date.now().toString(36);
  const randomString = Math.random().toString(36).substring(2, 10);
  return `asset_${timestamp}${randomString}`;
};

const Asset = db.define('Asset', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fileType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  hash: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: true
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  tableName: 'assets',
  hooks: {
    beforeCreate: (asset) => {
      // Generate ID if not provided
      if (!asset.id) {
        asset.id = generateUniqueAssetId();
      }
    }
  }
});

// Define associations
Asset.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Asset, { foreignKey: 'userId', as: 'assets' });

module.exports = Asset;