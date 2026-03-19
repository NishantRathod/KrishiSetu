# KrishiSetu Backend

Backend API server for KrishiSetu agricultural platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration

4. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Base URL
`http://localhost:5000`

### Endpoints (Coming Soon)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/crops` - Get all crops
- `POST /api/marketplace/products` - Add product
- `GET /api/marketplace/products` - Get all products

## Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT for authentication
