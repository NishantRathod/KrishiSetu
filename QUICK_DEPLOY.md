# KrishiSetu - Quick Deployment Guide

## ⚡ Quick Start (5 Minutes)

### Step 1: Verify Project Structure
Your project is ready for deployment! Here's what was configured:

✅ **Frontend Entry Point:** `frontend/index.html`
✅ **Backend:** Flask app updated to serve frontend
✅ **Dependencies:** Gunicorn added to requirements.txt
✅ **Configuration:** Production-ready setup

### Step 2: Local Testing
```bash
cd c:\Users\nisha\Desktop\Shortcut\KrishiSetu

# Install all dependencies
pip install -r backend/requirements.txt

# Start the server
cd backend
python app.py

# Open browser
http://localhost:5000
```

**Expected:** You should see the KrishiSetu home page with the hero section.

### Step 3: Environment Setup
Create `.env` file in the backend folder:

```env
FLASK_ENV=production
SECRET_KEY=your-strong-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here
MONGO_URI=mongodb://localhost:27017/krishisetu
DEBUG=False
PORT=5000
```

### Step 4: Deploy to Heroku

```bash
# Install Heroku CLI, then login
heroku login

# Create app
heroku create your-krishisetu-app

# Set environment variables
heroku config:set FLASK_ENV=production
heroku config:set SECRET_KEY=your-secret-key
heroku config:set MONGO_URI=your-mongodb-uri

# Deploy
git push heroku main

# View live
heroku open
```

### Step 5: Alternative: Deploy to Render

1. Go to [render.com](https://render.com)
2. Connect GitHub repository
3. Create Web Service with these settings:
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `gunicorn --chdir backend wsgi:app`
   - **Environment Variables:** Add FLASK_ENV, SECRET_KEY, MONGO_URI
4. Click "Create Web Service"

## 📍 Key Deployment Paths

| What | Where |
|------|-------|
| **Main Website** | `frontend/index.html` |
| **Styles** | `frontend/css/styles.css` |
| **Scripts** | `frontend/js/app.js` |
| **Backend API** | `backend/app.py` |
| **Production Server** | `backend/wsgi.py` |

## 🔧 Deployment Checklist

- [ ] **Frontend**: All HTML, CSS, JS files present in `frontend/` folder
- [ ] **Backend**: Flask app configured (app.py updated ✅)
- [ ] **Dependencies**: requirements.txt includes gunicorn ✅
- [ ] **Environment**: .env file created with all required variables
- [ ] **Database**: MongoDB connection string ready
- [ ] **SSL/TLS**: Enabled on hosting platform
- [ ] **CORS**: Configured for your domain
- [ ] **Local Test**: Application runs on localhost:5000
- [ ] **Production Test**: Application runs with production config

## 📱 What Gets Deployed

```
KrishiSetu Website (Your Domain)
│
├─ / (Home)                           → frontend/index.html
├─ /marketplace.html                   → frontend/marketplace.html  
├─ /auth.html                          → frontend/auth.html
├─ /profile.html                       → frontend/profile.html
├─ /dashboard-farmer.html              → frontend/dashboard-farmer.html
├─ /dashboard-consumer.html            → frontend/dashboard-consumer.html
├─ /css/styles.css                     → frontend/css/styles.css
├─ /js/app.js                          → frontend/js/app.js
│
└─ /api/auth                           → Backend API (Python)
  ├─ /api/crops
  ├─ /api/marketplace
  ├─ /api/users
  └─ [other endpoints...]
```

## 🚀 One-Command Deploy (Heroku)

```bash
# Automatic deployment after git push
git add .
git commit -m "Ready for deployment"
git push heroku main
```

## 🎯 After Deployment

1. **Test Frontend**: Visit your domain and see the home page
2. **Test Navigation**: Click through all pages
3. **Test API**: Visit `/api` endpoint
4. **Test Auth**: Try login on `/auth.html`
5. **Check Styles**: Verify CSS loads correctly

## ⚠️ Common Issues

| Issue | Fix |
|-------|-----|
| CSS not loading | Check `frontend/css/styles.css` exists |
| Pages show 404 | Verify HTML files in `frontend/` folder |
| API not working | Check `/api` endpoint returns JSON |
| Database connection fails | Update MONGO_URI environment variable |
| Port already in use | Kill process or use different port |

## 📞 Need Help?

1. Check `DEPLOYMENT_GUIDE.md` for detailed instructions
2. Review application logs: `heroku logs --tail`
3. Test locally first: `python app.py`
4. Verify environment variables are set correctly

---

**Your frontend entry point for deployment:** `frontend/index.html`

You're all set! Your application is ready to go live! 🌾
