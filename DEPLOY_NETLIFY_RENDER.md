# KrishiSetu: Netlify Frontend + Render Flask Backend

## 1. Push this project to GitHub

Commit and push all files in this repository.

## 2. Deploy the backend on Render

Create a Render Web Service connected to this GitHub repository.

Use:

- Runtime: Python
- Root Directory: `.`
- Build Command:
  `pip install -r backend/requirements.txt`
- Start Command:
  `gunicorn --chdir backend wsgi:app --bind 0.0.0.0:$PORT --log-file -`
- Health Check Path:
  `/health`

The repository also contains `render.yaml` with these settings.

## 3. Render environment variables

Add these in Render:

- `FLASK_ENV` = `production`
- `DEBUG` = `False`
- `SECRET_KEY` = a long random secret
- `JWT_SECRET_KEY` = a different long random secret
- `MONGO_URI` = your MongoDB Atlas connection string
- `CORS_ORIGINS` = `https://nishantrathod-krishisetu-webapp.netlify.app`

Do NOT commit real secrets or your MongoDB URI to GitHub.

## 4. Test the backend

After deployment, open:

`https://YOUR-RENDER-SERVICE.onrender.com/health`

Expected:

`{"status":"healthy"}`

Also test:

`https://YOUR-RENDER-SERVICE.onrender.com/api`

## 5. Frontend configuration

`frontend/js/config.js` is configured to use:

`https://krishisetu-backend.onrender.com/api`

If Render assigns a different URL, update that one production URL in:

`frontend/js/config.js`

For local development it still uses:

`http://localhost:5000/api`

## 6. Deploy frontend on Netlify

If using the same repository:

- Publish directory: `frontend`
- Build command: leave empty
- Functions: none required

The frontend should remain available at:

`https://nishantrathod-krishisetu-webapp.netlify.app/`

## 7. Test login

Open:

`https://nishantrathod-krishisetu-webapp.netlify.app/auth.html`

Login should call:

`https://YOUR-RENDER-SERVICE.onrender.com/api/auth/login`

not `localhost:5000`.

## Important

If the Render service URL is not exactly:

`https://krishisetu-backend.onrender.com`

change the URL in `frontend/js/config.js` before testing production login.
