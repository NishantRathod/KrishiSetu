# KrishiSetu Backend API

Flask-based REST API for the KrishiSetu agricultural platform.

## Features

- **User Authentication** - JWT-based authentication with secure password hashing
- **Crop Management** - CRUD operations for crop tracking
- **Marketplace** - Product listing and management
- **User Profiles** - User profile management
- **MongoDB Integration** - NoSQL database for flexible data storage

## Tech Stack

- **Python 3.8+**
- **Flask** - Web framework
- **Flask-CORS** - Cross-Origin Resource Sharing
- **Flask-JWT-Extended** - JWT authentication
- **PyMongo** - MongoDB driver
- **bcrypt** - Password hashing
- **python-dotenv** - Environment variable management

## Project Structure

```
backend/
├── app.py                 # Main application file
├── config.py             # Configuration settings
├── database.py           # Database connection
├── requirements.txt      # Python dependencies
├── .env.example         # Environment variables template
├── models/              # Database models
│   ├── user.py          # User model
│   ├── crop.py          # Crop model
│   └── product.py       # Product model
└── routes/              # API routes
    ├── auth.py          # Authentication routes
    ├── crops.py         # Crop routes
    ├── marketplace.py   # Marketplace routes
    └── users.py         # User routes
```

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- MongoDB installed and running locally, or access to MongoDB Atlas
- pip (Python package manager)

### Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create a virtual environment** (recommended)
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   # Copy the example file
   cp .env.example .env

   # Edit .env and add your configuration
   ```

5. **Configure MongoDB**
   - Make sure MongoDB is running locally on `mongodb://localhost:27017`
   - Or update `MONGO_URI` in `.env` with your MongoDB Atlas connection string

6. **Run the application**
   ```bash
   # Development mode
   python app.py

   # Or using Flask CLI
   flask run
   ```

The server will start on `http://localhost:5000`

## Environment Variables

Create a `.env` file with the following variables:

```env
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
MONGO_URI=mongodb://localhost:27017/krishisetu
PORT=5000
DEBUG=True
```

## API Endpoints

### Base URL
`http://localhost:5000`

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

**Register Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "phone": "1234567890",
  "role": "farmer"
}
```

**Login Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Crops (`/api/crops`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/crops/` | Get user's crops | Yes |
| POST | `/api/crops/` | Add new crop | Yes |
| GET | `/api/crops/<id>` | Get specific crop | Yes |
| GET | `/api/crops/all` | Get all crops (public) | No |

**Add Crop Request Body:**
```json
{
  "name": "Wheat Field 1",
  "crop_type": "wheat",
  "area": 5.5,
  "planting_date": "2024-03-01",
  "expected_harvest_date": "2024-07-15",
  "status": "planted"
}
```

### Marketplace (`/api/marketplace`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/marketplace/products` | Get all products | No |
| POST | `/api/marketplace/products` | Add new product | Yes |
| GET | `/api/marketplace/products/<id>` | Get specific product | No |
| GET | `/api/marketplace/my-products` | Get user's products | Yes |

**Add Product Request Body:**
```json
{
  "title": "Organic Fertilizer",
  "description": "High-quality organic fertilizer",
  "price": 500,
  "category": "fertilizer",
  "quantity": 100,
  "unit": "kg",
  "images": ["url1", "url2"]
}
```

### Users (`/api/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Get user profile | Yes |
| PUT | `/api/users/profile` | Update user profile | Yes |

## Authentication

This API uses JWT (JSON Web Tokens) for authentication.

1. Register or login to get an access token
2. Include the token in the Authorization header for protected routes:
   ```
   Authorization: Bearer <your_token_here>
   ```

## Testing the API

You can test the API using:
- **Postman** - Import the endpoints and test
- **cURL** - Command line testing
- **Thunder Client** (VS Code extension)

Example cURL request:
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

Error responses are in JSON format:
```json
{
  "error": "Error message here"
}
```

## Database Schema

### Users Collection
```javascript
{
  "_id": ObjectId,
  "name": String,
  "email": String (unique),
  "password": String (hashed),
  "phone": String,
  "role": String,
  "created_at": DateTime,
  "updated_at": DateTime
}
```

### Crops Collection
```javascript
{
  "_id": ObjectId,
  "name": String,
  "user_id": String,
  "crop_type": String,
  "area": Number,
  "planting_date": String,
  "expected_harvest_date": String,
  "status": String,
  "created_at": DateTime,
  "updated_at": DateTime
}
```

### Products Collection
```javascript
{
  "_id": ObjectId,
  "title": String,
  "description": String,
  "price": Number,
  "category": String,
  "seller_id": String,
  "quantity": Number,
  "unit": String,
  "images": Array,
  "status": String,
  "created_at": DateTime,
  "updated_at": DateTime
}
```

## Development

### Adding New Routes

1. Create a new blueprint in `routes/` folder
2. Register the blueprint in `app.py`
3. Add route handlers with appropriate decorators

### Adding New Models

1. Create a new model file in `models/` folder
2. Define model class with methods for CRUD operations
3. Use the model in your routes

## Future Enhancements

- [ ] File upload for product images
- [ ] Real-time notifications using Socket.io
- [ ] Weather API integration
- [ ] Crop disease detection ML model integration
- [ ] Payment gateway integration
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Rate limiting
- [ ] API documentation with Swagger

## License

MIT License
