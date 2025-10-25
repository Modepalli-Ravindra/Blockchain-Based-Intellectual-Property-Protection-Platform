# IP Protection Platform

A full-stack platform to register, verify, share, and manage intellectual property (IP) assets using a modern React frontend and a Node.js/Express + MySQL backend.

## Stack
- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express + Sequelize (MySQL)
- Storage/Uploads: Multer + Cloudinary (optional)
- Auth: JWT (Bearer tokens)

## Monorepo Layout
```
ipprotect/
├── backend/        # API server (Express + MySQL)
└── frontend/       # React app (Vite)
```

### Backend Highlights
- `server.js`: Express app bootstrap, CORS, routes, error handling
- `config/db.js`: Sequelize connection to MySQL
- `models/`: Sequelize models (`User`, `Asset`, `Share`)
- `controllers/`: Route handlers (auth, assets, files, shares)
- `routes/`: Route definitions (`/api/auth`, `/api/assets`, `/api/shares`)
- `middleware/`: `auth` (JWT), `rateLimiter`, `upload` (Multer)
- `migrations/`: DB schema updates

### Frontend Highlights
- `components/`: Pages and UI (Auth, Dashboard, AssetList, RegisterAssetForm, ShareAsset, etc.)
- `services/blockchainService.ts`: API helpers and core asset functions
- `contexts/`: Auth/Theme/Toast providers
- `hooks/`: Reusable hooks
- `vite.config.ts`: Dev server and alias config

## Getting Started

### Prerequisites
- Node.js 18+ (or 20+ recommended)
- MySQL running and reachable

### 1) Backend Setup
```
cd backend
npm install
```
Create `.env` (example):
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ipprotect
JWT_SECRET=super_secret_jwt
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```
Run dev API server:
```
npm run dev
```
- Server listens at `http://localhost:${PORT}` (default `5000`).
- Main API base: `http://localhost:5000/api`.

### 2) Frontend Setup
```
cd frontend
npm install
npm run dev
```
- App runs at `http://localhost:3000` (Vite may auto-increment if busy).
- The frontend expects the backend at `http://localhost:5000/api`.

If you need to change API base, edit:
```
frontend/services/blockchainService.ts
const API_BASE_URL = 'http://localhost:5000/api'
```

## Core Features
- Register user (JWT stored in `localStorage`)
- Login and persistent session
- Register IP assets (metadata, upload, hashing)
- Verify assets and render certificate (`pdfCertificateService.ts`)
- Share assets and view shared records
- List, filter, and delete assets (with confirmation + loading states)

## API Overview
- Auth
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- Assets
  - `GET /api/assets` (list)
  - `POST /api/assets` (create)
  - `DELETE /api/assets/:id` (remove)
- Files
  - `POST /api/files/upload` (if enabled via Cloudinary/Multer)
- Shares
  - `POST /api/shares` (create share)
  - `GET /api/shares` (list)

Routes map to controllers in `backend/controllers/*` and use JWT middleware for protected endpoints.

## Database
Sequelize models:
- `User`: `id`, `name`, `email`, `password`, `rewards`
- `Asset`: `id`, `userId`, `title`, `description`, `hash`, `filepath`, etc.
- `Share`: `id`, `assetId`, `recipientEmail`, metadata

Use `init-db.js`, `update-schema.js`, or migrations as needed to bootstrap/adjust schema.

## Build & Deploy
- Frontend build:
```
cd frontend
npm run build
```
Outputs Vite build (configure hosting/CDN as desired).

- Backend production:
```
cd backend
npm start
```
Ensure environment variables and database connectivity in production.

## Troubleshooting
- CORS errors: verify backend CORS allows `http://localhost:3000`
- 401/403: ensure valid JWT in `Authorization: Bearer <token>`
- DB connection: check `.env` credentials and MySQL service
- Uploads: verify Cloudinary keys and `middleware/upload.js`

## Security Notes
- Passwords hashed with `bcryptjs`
- Rate limiting via `express-rate-limit`
- JWT secrets managed in `.env`

## Development Tips
- Frontend HMR is enabled via Vite
- Ports: frontend `3000`, backend `5000`
- API calls logged in `blockchainService.ts` for easier debugging

With this layout, you can work on `frontend` and `backend` independently, while keeping the API base stable (`http://localhost:5000/api`).