# KrishiSetu Frontend

Frontend web application for KrishiSetu - Smart Agricultural Platform.

## Features

- **Landing Page** - Modern, responsive homepage showcasing platform features
- **Authentication** - User login and registration with secure forms
- **Dashboard** - Personalized farmer dashboard for managing activities
- **Marketplace** - Browse and list agricultural products, equipment, and services

## Project Structure

```
frontend/
├── index.html          # Landing page
├── auth.html           # Login/Registration page
├── dashboard.html      # User dashboard
├── marketplace.html    # Agricultural marketplace
├── css/
│   └── styles.css      # Global styles and animations
└── js/
    └── app.js          # Application logic and interactions
```

## Technologies Used

- HTML5
- CSS3 (Modern animations, glassmorphism, responsive design)
- Vanilla JavaScript

## Getting Started

Simply open any HTML file in your web browser:

```bash
# For local development, you can use a simple HTTP server
npx http-server -p 3000
```

Then visit `http://localhost:3000`

## Features in Detail

### Landing Page (index.html)
- Hero section with call-to-action
- Features showcase
- Modern UI with animations

### Authentication (auth.html)
- User registration form
- Login form
- Form validation

### Dashboard (dashboard.html)
- User profile management
- Crop management interface
- Quick stats and overview

### Marketplace (marketplace.html)
- Product listings
- Search and filter functionality
- Product details view

## Future Enhancements

- Integration with backend API
- Real-time updates using WebSockets
- Progressive Web App (PWA) features
- Offline support
