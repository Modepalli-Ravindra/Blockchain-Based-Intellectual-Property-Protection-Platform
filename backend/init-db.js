const db = require('./config/db');
const User = require('./models/User');
const Asset = require('./models/Asset');
const Share = require('./models/Share');

const initDb = async () => {
  try {
    // Test the database connection
    await db.authenticate();
    console.log('Database connection established successfully.');

    // Sync all models
    await db.sync({ force: true });
    console.log('Database synchronized successfully.');

    console.log('Database initialization completed!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await db.close();
  }
};

initDb();