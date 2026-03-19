# KrishiSetu 🌾

**Smart Agricultural Platform for Modern Farming**

KrishiSetu is a comprehensive web platform designed to connect farmers, agricultural experts, and the farming community. The platform provides tools for crop management, marketplace access, and community engagement.

## Features

- **User Authentication** - Secure login and registration system
- **Dashboard** - Personalized dashboard for farmers to manage their activities
- **Marketplace** - Buy and sell agricultural products, equipment, and services
- **Modern UI** - Clean and intuitive interface with responsive design

## Technologies Used

### Frontend
- HTML5
- CSS3 (with modern animations and effects)
- JavaScript (Vanilla JS)

### Backend
- Python 3.8+
- Flask (Web Framework)
- MongoDB (PyMongo)
- Flask-JWT-Extended (JWT Authentication)
- bcrypt (Password Hashing)

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/NishantRathod/KrishiSetu.git
cd KrishiSetu
```

### Frontend Setup

2. Navigate to the frontend directory and open in browser
```bash
cd frontend
# Open index.html in your browser or use a local server
npx http-server -p 3000
```

### Backend Setup

3. Navigate to the backend directory
```bash
cd backend
```

4. Create a virtual environment (recommended)
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

5. Install Python dependencies
```bash
pip install -r requirements.txt
```

6. Create `.env` file from example
```bash
cp .env.example .env
```

7. Make sure MongoDB is running (locally or use MongoDB Atlas)

8. Start the backend server
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## Project Structure

```
KrishiSetu/
├── frontend/              # Frontend web application
│   ├── index.html        # Landing page
│   ├── auth.html         # Login/Registration page
│   ├── dashboard.html    # User dashboard
│   ├── marketplace.html  # Agricultural marketplace
│   ├── css/
│   │   └── styles.css    # Main stylesheet
│   ├── js/
│   │   └── app.js        # Application logic
│   └── README.md         # Frontend documentation
│
├── backend/              # Backend API server (Flask/Python)
│   ├── app.py            # Main application file
│   ├── config.py         # Configuration settings
│   ├── database.py       # Database connection
│   ├── requirements.txt  # Python dependencies
│   ├── .env.example      # Environment variables template
│   ├── models/           # Database models
│   │   ├── user.py       # User model
│   │   ├── crop.py       # Crop model
│   │   └── product.py    # Product model
│   ├── routes/           # API routes
│   │   ├── auth.py       # Authentication routes
│   │   ├── crops.py      # Crop management routes
│   │   ├── marketplace.py # Marketplace routes
│   │   └── users.py      # User profile routes
│   └── README.md         # Backend documentation
│
├── .gitignore
└── README.md
```

## API Endpoints

The backend provides the following REST API endpoints:

- **Authentication**: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- **Crops**: `/api/crops/` (GET, POST), `/api/crops/<id>` (GET)
- **Marketplace**: `/api/marketplace/products` (GET, POST), `/api/marketplace/my-products` (GET)
- **Users**: `/api/users/profile` (GET, PUT)

See `backend/README.md` for detailed API documentation.

## Future Enhancements

- ✅ Python Flask Backend with REST API (Completed)
- ✅ MongoDB Integration (Completed)
- ✅ JWT Authentication (Completed)
- ✅ User, Crop, and Product Models (Completed)
- [ ] File upload for product images
- [ ] Real-time notifications using WebSockets
- [ ] Weather API integration
- [ ] Crop disease detection using Machine Learning
- [ ] Mobile app development (React Native/Flutter)
- [ ] Payment gateway integration
- [ ] Email verification and password reset

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

---
Made with ❤️ for farmers
