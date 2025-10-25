
# Blockchain IP Protect

Blockchain IP Protect is an intellectual property protection platform that leverages blockchain technology to secure digital assets. This application provides a secure way to register, verify, and protect intellectual property with immutable records on the blockchain.

## Features

- **Immutable Records**: Once recorded on the blockchain, your IP records cannot be altered or deleted.
- **Secure Storage**: Your assets are stored securely with end-to-end encryption and blockchain verification.
- **Fast Verification**: Instantly verify ownership and authenticity of your intellectual property.
- **Ownership Transfer**: Transfer ownership of your IP through our platform, creating a transparent history of ownership.
- **Asset Sharing**: Share your verified IP with others while maintaining control and proof of ownership.

## Architecture

The application follows a modular frontend architecture with the following components:

### Frontend (React 19)
- Built with React 19 and React DOM
- Uses Vite 6.2.0 as the development server and bundler
- Written in TypeScript 5.8.2
- Integrated with Google's Gemini API via the \`GEMINI_API_KEY\` environment variable

### Backend (Node.js/Express)
- RESTful API for data persistence
- Connects to MySQL database for storing user and asset information
- Implements CORS configuration to support frontend-backend communication
- Uses Sequelize ORM for database operations

### Database
- MySQL database with host localhost:3306
- Database name: 'ipprotect'
- Stores user information, assets, and sharing records

## Project Structure

\[\](file://c:\Users\Modep\Downloads\ipprotect\App.tsx)\`
ipprotect/
├── backend-mysql/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── assetController.js
│   │   ├── authController.js
│   │   ├── fileController.js
│   │   └── shareController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── rateLimiter.js
│   │   └── upload.js
│   ├── migrations/
│   │   └── add-filepath-column.js
│   ├── models/
│   │   ├── Asset.js
│   │   ├── Share.js
│   │   └── User.js
│   ├── routes/
│   │   ├── assets.js
│   │   ├── auth.js
│   │   └── shares.js
│   ├── .env
│   ├── IMPLEMENTATION_SUMMARY.md
│   ├── README.md
│   ├── SUMMARY.md
│   ├── debug-db.js
│   ├── frontend-integration-example.js
│   ├── in-memory-db.js
│   ├── init-db.js
│   ├── package-lock.json
│   ├── package.json
│   ├── reset-schema.js
│   ├── server.js
│   ├── serverless-example.js
│   ├── test-asset-creation.js
│   ├── test-asset-upload-proper.js
│   ├── test-asset-upload.js
│   ├── test-connection.js
│   ├── test-cors.js
│   ├── test-db-access.js
│   ├── test-frontend-connection.js
│   ├── test-full-upload.js
│   ├── test-jwt.js
│   ├── test-multer.js
│   ├── test-mysql.js
│   ├── test-network.js
│   ├── test-postgres.js
│   ├── test-registration.js
│   ├── test-sharing.js
│   ├── test-upload.html
│   ├── test-user-id.js
│   └── update-schema.js
├── components/
│   ├── AssetList.tsx
│   ├── AuthPage.tsx
│   ├── Certificate.tsx
│   ├── CertificateDemo.tsx
│   ├── DashboardPage.tsx
│   ├── Header.tsx
│   ├── LandingPage.tsx
│   ├── Logo.tsx
│   ├── MyAssetsList.tsx
│   ├── ProfilePage.tsx
│   ├── PublicCertificatePage.tsx
│   ├── RegisterAssetForm.tsx
│   ├── ShareAsset.tsx
│   ├── ShareAssetPage.tsx
│   ├── SharedAssetsList.tsx
│   ├── ThemeProvider.tsx
│   ├── ThemeToggle.tsx
│   ├── ToastProvider.tsx
│   └── VerifyAsset.tsx
├── contexts/
│   ├── AuthContext.ts
│   ├── ThemeContext.ts
│   └── ToastContext.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useTheme.ts
│   └── useToast.ts
├── services/
│   ├── blockchainService.ts
│   └── pdfCertificateService.ts
├── App.tsx
├── README.md
├── index.css
├── index.html
├── index.tsx
├── library-test.html
├── metadata.json
├── package-lock.json
├── package.json
├── test.html
├── tsconfig.json
├── types.ts
├── view-assets.js
└── vite.config.ts
\[\](file://c:\Users\Modep\Downloads\ipprotect\App.tsx)\`

## Installation

1. Clone the repository:
\`\`bash
git clone https://github.com/yourusername/ipprotect.git
cd ipprotect
\`\`

2. Install dependencies:
\`\`bash
npm install
\`\`

3. Set up the environment variables:
Create a \`.env.local\` file in the root directory with the following content:
\`\`
GEMINI_API_KEY=your_gemini_api_key_here
\`\`

4. Start the development server:
\`\`bash
npm run dev
\`\`

## Usage

1. Visit \`http://localhost:3000\` (or the port displayed in the terminal) to access the application.
2. Register an account or log in if you already have one.
3. Upload your intellectual property for registration.
4. Verify your IP using the blockchain system.
5. Share your verified IP with others while maintaining control.

## How It Works

1. **Register**: Create an account and upload your intellectual property.
2. **Verify**: Our system verifies your IP and creates a blockchain record.
3. **Protect**: Your IP is now protected with an immutable blockchain record.
4. **Share**: Share your verified IP with others while maintaining control.

## Technical Details

### Frontend Technology Stack
- React 19
- React DOM
- Vite 6.2.0
- TypeScript 5.8.2
- @vitejs/plugin-react for React support

### Backend Technology Stack
- Node.js
- Express.js
- MySQL
- Sequelize ORM
- Multer for file uploads
- JWT for authentication

### Security Features
- End-to-end encryption for stored assets
- Immutable blockchain records for IP verification
- Secure authentication with JWT tokens
- Rate limiting to prevent abuse

### Data Storage
- Files uploaded as assets are stored permanently in backend-mysql/uploads/permanent/ directory
- File paths are stored in the Asset model for later retrieval
- The Share model uses a custom string-based ID format combining numbers and letters in the pattern: share_[timestamp][random_string]

## API Endpoints

### Authentication
- \`POST /api/auth/register\`: Register a new user
- \`POST /api/auth/login\`: Log in an existing user

### Assets
- \`GET /api/assets\`: Get all assets for the current user
- \`POST /api/assets\`: Upload a new asset
- \`GET /api/assets/:id\`: Get a specific asset
- \`DELETE /api/assets/:id\`: Delete an asset

### Shares
- \`POST /api/shares\`: Share an asset
- \`GET /api/shares\`: Get all shared assets
- \`GET /api/shares/:id\`: Get a specific shared asset

### Downloads
- \`GET /api/assets/download/:assetId\`: Download an actual asset file
- \`GET /api/shares/download/:assetId\`: Download a shared asset file

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a new branch (\`git checkout -b feature/your-feature\`)
3. Make your changes
4. Commit your changes (\`git commit -m 'Add some awesome feature'\`)
5. Push to the branch (\`git push origin feature/your-feature\`)
6. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Special thanks to the React and Vite teams for their excellent frameworks
- Thanks to the MySQL community for their reliable database solution
- Gratitude to the blockchain developers who made this technology possible
