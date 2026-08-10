# KrishiSetu Deployment Guide

## Production architecture

KrishiSetu uses:

- Netlify: static frontend
- Render: Flask REST API
- MongoDB Atlas: production database

The frontend calls the Render API using `frontend/js/config.js`.

## Render

Build command:

```text
pip install -r backend/requirements.txt
```

Start command:

```text
gunicorn --chdir backend wsgi:app --bind 0.0.0.0:$PORT --log-file -
```

Health check:

```text
/health
```

Environment variables:

```text
FLASK_ENV=production
DEBUG=False
SECRET_KEY=<random-secret>
JWT_SECRET_KEY=<different-random-secret>
MONGO_URI=<mongodb-atlas-uri>
CORS_ORIGINS=https://nishantrathod-krishisetu-webapp.netlify.app
```

## Netlify

Publish directory:

```text
frontend
```

Build command: leave empty.

The production API URL is configured in:

```text
frontend/js/config.js
```

Set it to your actual Render service URL:

```javascript
return 'https://YOUR-RENDER-SERVICE.onrender.com/api';
```

## Local development

Backend:

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Frontend can be served from the `frontend` directory with any local static server.

Local API:

```text
http://localhost:5000/api
```

Production API:

```text
https://YOUR-RENDER-SERVICE.onrender.com/api
```
