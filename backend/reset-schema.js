const { DataTypes } = require('sequelize');
const db = require('./config/db');
const User = require('./models/User');
const Asset = require('./models/Asset');
const Share = require('./models/Share');

const resetSchema = async () => {
  try {
    console.log('Resetting database schema...');
    
    // Drop all tables
    await db.drop();
    console.log('Dropped all tables');
    
    // Sync the models with the database
    await db.sync({ force: true });
    console.log('Recreated all tables with updated schema');
    
    console.log('Database schema reset successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting database schema:', error);
    process.exit(1);
  }
};

resetSchema();