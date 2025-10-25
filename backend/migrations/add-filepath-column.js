const db = require('../config/db');

async function addFilePathColumn() {
  try {
    await db.authenticate();
    console.log('Database connected successfully');
    
    // Add filePath column to assets table
    await db.query("ALTER TABLE assets ADD COLUMN filePath VARCHAR(500) NULL DEFAULT NULL", { 
      type: db.QueryTypes.RAW 
    });
    
    console.log('Successfully added filePath column to assets table');
  } catch (error) {
    console.error('Error adding filePath column:', error.message);
  }
}

addFilePathColumn();