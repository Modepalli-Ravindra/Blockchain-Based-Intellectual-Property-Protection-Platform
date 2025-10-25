const { DataTypes } = require('sequelize');
const db = require('../config/db');
const User = require('./User');
const Asset = require('./Asset');

const Share = db.define('Share', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  assetId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Asset,
      key: 'id'
    }
  },
  ownerId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  recipientId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  tableName: 'shares'
});

// Define associations
Share.belongsTo(Asset, { foreignKey: 'assetId', as: 'asset' });
Share.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });
Share.belongsTo(User, { as: 'recipient', foreignKey: 'recipientId' });

module.exports = Share;