# IPProtect Backend - MySQL Implementation

## Overview
This is a complete backend implementation for the IPProtect application using MySQL as the database. The backend provides RESTful APIs for user authentication, asset management, and asset sharing.

## Key Features Implemented

### 1. User Management
- User registration with email verification
- Secure login with JWT token generation
- Profile management (view/update)
- Password hashing with bcrypt

### 2. Asset Management
- Digital asset registration with cryptographic hashing
- Asset verification against registered assets
- User asset listing with sorting
- File upload handling with size limits

### 3. Asset Sharing
- Share assets with other registered users
- View assets shared with you
- Prevent duplicate sharing

### 4. Security
- JWT-based authentication middleware
- Rate limiting to prevent abuse
- CORS configuration for frontend integration
- Input validation and sanitization

### 5. Database Design
- Users table with profile information
- Assets table with cryptographic hashes
- Shares table for asset sharing relationships
- Proper foreign key relationships and constraints

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Assets
- `POST /api/assets/register` - Register new asset
- `GET /api/assets/user` - List user's assets
- `POST /api/assets/verify` - Verify asset ownership

### Shares
- `POST /api/shares` - Share asset with user
- `GET /api/shares/received` - List received shares

## Technology Stack
- Node.js with Express.js framework
- MySQL database with Sequelize ORM
- JSON Web Tokens for authentication
- Bcrypt.js for password hashing
- Multer for file handling

## Setup Instructions

1. **Prerequisites**:
   - Node.js (v14 or higher)
   - MySQL server

2. **Installation**:
   ```bash
   cd backend-mysql
   npm install
   ```

3. **Database Setup**:
   - Create MySQL database named `ipprotect`
   - Update `.env` with your database credentials
   - Run `npm run init-db` to create tables

4. **Running the Server**:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## Environment Variables
Create a `.env` file with the following variables:
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ipprotect
DB_USER=your_username
DB_PASSWORD=your_password
PORT=5000
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
```

## Integration with Frontend
The backend is designed to work seamlessly with the existing IPProtect frontend:
- CORS is configured to allow requests from the frontend
- API responses match the expected format
- Authentication flow aligns with frontend context

## Security Considerations
- All passwords are hashed before storage
- JWT tokens are used for secure authentication
- Rate limiting prevents abuse
- Input validation prevents injection attacks
- File size limits prevent resource exhaustion

## Future Enhancements
1. Add comprehensive test suite
2. Implement database migrations
3. Add data backup and recovery
4. Implement API documentation
5. Add logging and monitoring
6. Enhance file validation and processing