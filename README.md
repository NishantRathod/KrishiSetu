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
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

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

4. Install dependencies
```bash
npm install
```

5. Create `.env` file from example
```bash
cp .env.example .env
```

6. Start the backend server
```bash
npm run dev  # Development mode with auto-reload
# or
npm start    # Production mode
```

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
├── backend/              # Backend API server
│   ├── server.js         # Main server file
│   ├── package.json      # Dependencies
│   ├── .env.example      # Environment variables template
│   └── README.md         # Backend documentation
│
├── .gitignore
└── README.md
```

## Future Enhancements

- ✅ Backend structure with Node.js and Express (In Progress)
- Database integration with MongoDB
- User authentication API with JWT
- REST API for crops and marketplace
- Real-time chat support using Socket.io
- Weather API integration
- Crop disease detection using Machine Learning
- Mobile app development
- Payment gateway integration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

---
Made with ❤️ for farmers
