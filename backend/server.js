const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('./middleware/rateLimiter');
const db = require('./config/db');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const assetRoutes = require('./routes/assets');
const shareRoutes = require('./routes/shares');

// Create Express app
const app = express();

// Middleware
app.use(rateLimit);

// Simple CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000', 
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:3005',
    'http://localhost:3006',
    'http://localhost:3007',
    'http://localhost:3008',
    'http://localhost:3009'
  ],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Explicitly handle preflight requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Global JSON parser with a higher limit, but we'll override it for routes that need it
app.use(express.json({ limit: '10mb' }));

// Note: We're also using express.json() selectively for specific routes to ensure compatibility with Multer
app.use('/api/auth', express.json({ limit: '10mb' }));
app.use('/api/shares', express.json({ limit: '10mb' }));
app.use('/api/assets/verify', express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/shares', shareRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'IPProtect backend is running' });
});

// Debug endpoint to test database connection
app.get('/api/debug/data', async (req, res) => {
  try {
    // Test database connection
    await db.authenticate();
    res.status(200).json({ 
      status: 'Connected to database',
      message: 'Database connection successful'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'Database connection failed',
      error: error.message
    });
  }
});

// Connect to database and start server
db.authenticate()
  .then(() => {
    console.log('Database connected successfully');
    
    // Sync models
    return db.sync();
  })
  .then(() => {
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
    console.log('Server will start without database connection. Some features may not work.');
    
    // Start server even if database connection fails
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} (database connection failed)`);
    });
  });

module.exports = app;