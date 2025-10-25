const { DataTypes } = require('sequelize');
const db = require('./config/db');
const User = require('./models/User');
const Asset = require('./models/Asset');
const Share = require('./models/Share');

const updateSchema = async () => {
  try {
    console.log('Updating database schema...');
    
    // Sync the models with the database
    await db.sync({ alter: true });
    
    console.log('Database schema updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating database schema:', error);
    process.exit(1);
  }
};

updateSchema();