# KrishiSetu Troubleshooting Guide

## Quick Fix for Common Errors

### Error: "Python not found" or "'python' is not recognized"

**Solution:**
1. Make sure Python is installed: [Download Python](https://www.python.org/downloads/)
2. During installation, check "Add Python to PATH"
3. Restart your terminal/command prompt

**Test if Python is installed:**
```bash
python --version
```

---

### Error: "MongoDB connection failed" or "ServerSelectionTimeoutError"

**Solution 1: Start MongoDB Service**
```bash
# Open Services (Win + R, type: services.msc)
# Find "MongoDB Server" → Right-click → Start
```

**Solution 2: Check MongoDB Compass**
- Open MongoDB Compass
- Connect to `mongodb://localhost:27017`
- If connection fails, MongoDB is not running

**Solution 3: Start MongoDB manually**
```bash
# Find your MongoDB installation path, usually:
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
```

---

### Error: "Port 5000 is already in use" or "Address already in use"

**Solution:**
Change the port in `.env` file:
```env
PORT=5001
```

Then restart the backend server.

---

### Error: "No module named 'flask'" or import errors

**Solution:**
Make sure you're in the virtual environment and dependencies are installed:
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

---

### Error: ".env file not found" or configuration errors

**Solution:**
```bash
cd backend
copy .env.example .env
```

---

### Error: "ModuleNotFoundError: No module named 'models'" or "No module named 'routes'"

**Solution:**
Make sure you're running the app from the backend folder:
```bash
cd C:\Users\nisha\Desktop\KrishiSetu\backend
python app.py
```

---

### Error: Frontend shows "Cannot GET /" or blank page

**Solution:**
Make sure you're accessing the correct URL:
```
http://localhost:3000/index.html
```

Or use the batch script which handles this automatically.

---

### Error: "CORS error" in browser console

**Solution:**
Make sure the backend server is running. Flask-CORS is already configured in the backend.

---

### Error: "venv\Scripts\activate.bat" not working

**Solution:**
Use PowerShell instead:
```powershell
venv\Scripts\Activate.ps1
```

Or if execution policy error:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## Easy Way to Run - Use Batch Scripts!

I've created automated scripts for you:

### Option 1: Run Everything at Once (EASIEST)
Double-click: `start-krishisetu.bat` in the KrishiSetu folder

This will:
- Check MongoDB
- Start backend server
- Start frontend server
- Open browser automatically

### Option 2: Run Manually
1. Double-click: `backend/start-backend.bat`
2. Double-click: `frontend/start-frontend.bat`
3. Open browser: `http://localhost:3000`

---

## System Requirements

- ✅ Python 3.8 or higher
- ✅ MongoDB (running locally or MongoDB Atlas)
- ✅ 500MB free disk space
- ✅ Windows 10/11

---

## Still Having Issues?

### Check Backend is Running:
Open browser and visit: `http://localhost:5000`
You should see:
```json
{
  "message": "Welcome to KrishiSetu API",
  "version": "1.0.0",
  "status": "Server is running"
}
```

### Check MongoDB is Running:
```bash
# In Command Prompt
mongosh
# If it connects, MongoDB is working
```

### View Backend Logs:
The backend terminal will show error messages. Look for:
- Import errors → Install dependencies
- Connection errors → Start MongoDB
- Port errors → Change port in .env

---

## Getting Help

If you're still stuck:
1. Take a screenshot of the error
2. Note which command you ran
3. Check if MongoDB is running
4. Make sure you're in the correct directory

---

Created by Claude for KrishiSetu Project
