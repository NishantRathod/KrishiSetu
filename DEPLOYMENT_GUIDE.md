# KrishiSetu Deployment Guide

## Project Structure for Web Deployment

Your KrishiSetu project is now configured for web deployment with both frontend and backend served from a single Flask application.

### File Structure Overview

```
KrishiSetu/
├── backend/                    # Flask backend application
│   ├── app.py                 # Main Flask application (UPDATED - serves frontend)
│   ├── wsgi.py               # WSGI entry point for production
│   ├── config.py             # Configuration (production/development)
│   ├── requirements.txt       # Python dependencies (UPDATED - includes gunicorn)
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   └── [other backend files]
│
├── frontend/                  # Frontend files (served by Flask)
│   ├── index.html           # Main entry point - DEPLOY THIS PATH
│   ├── auth.html            # Authentication page
│   ├── marketplace.html      # Marketplace page
│   ├── profile.html         # User profile page
│   ├── dashboard-*.html     # Role-based dashboards
│   ├── css/                 # Stylesheets
│   │   ├── styles.css
│   │   └── notifications.css
│   └── js/                  # JavaScript files
│       ├── app.js
│       ├── auth.js
│       ├── profile.js
│       └── role-dashboard.js
│
└── Procfile                  # Heroku deployment configuration

```

## Deployment Path Information

### Main Entry Point
**Path for deployment:** `frontend/index.html`

This is the root entry point of your web application. When users visit your deployed domain, they will be served this file.

### How Deployment Works Now

1. **Flask Backend** serves your frontend as static files
2. **API routes** are available at `/api/*` endpoints
3. **Frontend pages** are served directly from the `frontend/` folder
4. **Stylesheets and JavaScript** are served automatically from `css/` and `js/` subdirectories

## Deployment Steps

### 1. Local Testing

First, test your application locally:

```bash
# Navigate to the project directory
cd c:\Users\nisha\Desktop\Shortcut\KrishiSetu

# Install dependencies
pip install -r backend/requirements.txt

# Run the Flask application (development)
cd backend
python app.py

# Visit in browser
# http://localhost:5000
```

### 2. Deploy to Heroku

#### Prerequisites
- Install Heroku CLI
- Have a Heroku account
- Git repository initialized

#### Steps

```bash
# Login to Heroku
heroku login

# Create a new Heroku app
heroku create your-app-name

# Deploy to Heroku
git push heroku main

# View logs
heroku logs --tail
```

### 3. Deploy to Other Platforms

#### Render.com
1. Connect your GitHub repository
2. Create a new Web Service
3. Build Command: `pip install -r backend/requirements.txt`
4. Start Command: `gunicorn --chdir backend wsgi:app`
5. Set environment variables (DATABASE_URL, SECRET_KEY, etc.)

#### AWS, Azure, GCP
- Use the Dockerfile configuration
- Or upload and run on App Service / Elastic Beanstalk
- Update environment variables as needed

### 4. Environment Configuration

Create a `.env` file with the following variables:

```
FLASK_ENV=production
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here
MONGO_URI=your-mongodb-uri
DEBUG=False
PORT=5000
```

## Changes Made for Deployment

### 1. Updated `app.py`
- Now serves frontend files from the `frontend/` directory
- Serves static assets (CSS, JS) automatically
- Maintains all API endpoints at `/api/*`
- Serves `index.html` at root path `/`

### 2. Updated `requirements.txt`
- Added `gunicorn==22.0.0` for production WSGI server
- Gunicorn is required for Heroku and similar platforms

### 3. Heroku Configuration (Procfile)
```
web: gunicorn --chdir backend wsgi:app --log-file -
```

## Deployment Checklist

- [ ] Update environment variables (SECRET_KEY, DATABASE_URL, etc.)
- [ ] Test locally with `python app.py`
- [ ] Test with production config: `export FLASK_ENV=production`
- [ ] Install gunicorn: `pip install gunicorn`
- [ ] Update MongoDB connection string for production
- [ ] Configure CORS settings if needed (frontend domain)
- [ ] Set up SSL/TLS certificates
- [ ] Test all API endpoints
- [ ] Test frontend pages navigation
- [ ] Verify static assets load correctly (CSS, JS)
- [ ] Check error handling and logging
- [ ] Performance test with production database

## Frontend Routes

Your frontend automatically serves:

| Route | File | Purpose |
|-------|------|---------|
| `/` | `frontend/index.html` | Home/landing page |
| `/auth.html` | `frontend/auth.html` | Login & registration |
| `/marketplace.html` | `frontend/marketplace.html` | Product marketplace |
| `/profile.html` | `frontend/profile.html` | User profile |
| `/dashboard-farmer.html` | `frontend/dashboard-farmer.html` | Farmer dashboard |
| `/dashboard-fpo.html` | `frontend/dashboard-fpo.html` | FPO dashboard |
| `/dashboard-shg.html` | `frontend/dashboard-shg.html` | SHG dashboard |
| `/dashboard-processor.html` | `frontend/dashboard-processor.html` | Processor dashboard |
| `/dashboard-consumer.html` | `frontend/dashboard-consumer.html` | Consumer dashboard |
| `/dashboard-startup.html` | `frontend/dashboard-startup.html` | Startup dashboard |

## API Endpoints

All API endpoints remain unchanged and are available at:

```
/api/auth/
/api/crops/
/api/marketplace/
/api/users/
/api/dashboard/
/api/orders/
/api/farming-data/
```

## Troubleshooting

### Static Files Not Loading
- Ensure all CSS/JS files are in `frontend/css/` and `frontend/js/` folders
- Check file paths in HTML files
- Test with: `http://localhost:5000/css/styles.css`

### Frontend Routes Not Working
- Make sure HTML files are in the `frontend/` directory
- Check that file names match exactly (case-sensitive on Linux/Heroku)
- Test individual routes: `http://localhost:5000/auth.html`

### Port Issues
- Default port is 5000 for development
- Production uses the PORT environment variable
- For Heroku: automatically uses the PORT set by Heroku

### Database Connection
- Update MONGO_URI in environment variables
- For local development: `mongodb://localhost:27017/krishisetu`
- For MongoDB Atlas: Use your connection string

## Production Best Practices

1. **Enable HTTPS/SSL**
   - Use Let's Encrypt for free SSL certificates
   - Configure in your hosting platform

2. **Environment Variables**
   - Never commit `.env` to Git
   - Use platform-specific secret management

3. **Database**
   - Use MongoDB Atlas or managed MongoDB service
   - Enable IP whitelist
   - Regular backups

4. **Monitoring**
   - Set up error tracking (Sentry, etc.)
   - Monitor server logs
   - Set up alerts for critical errors

5. **Performance**
   - Enable gzip compression
   - Use CDN for static assets
   - Implement caching strategies

6. **Security**
   - Update SECRET_KEY regularly
   - Implement rate limiting
   - Validate all user inputs
   - Enable CORS properly for your domain

## Support and Questions

For deployment issues, check:
1. Heroku logs: `heroku logs --tail`
2. Application logs in your hosting platform
3. Test API with Postman: `http://your-domain/api/auth/login`
4. Verify frontend loads: `http://your-domain/`

---

**Last Updated:** 2025-06-08
**Version:** 1.0.0
