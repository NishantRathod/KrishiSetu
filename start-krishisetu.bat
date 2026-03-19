@echo off
echo ========================================
echo   KrishiSetu Project Launcher
echo ========================================
echo.

cd /d "%~dp0"

REM Check if MongoDB is running
echo Checking MongoDB status...
powershell -Command "Get-Service -Name 'MongoDB' -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Status" > temp_mongo_status.txt
set /p MONGO_STATUS=<temp_mongo_status.txt
del temp_mongo_status.txt

if "%MONGO_STATUS%"=="Running" (
    echo [OK] MongoDB is running
) else (
    echo [WARNING] MongoDB is not running!
    echo Please start MongoDB service or use MongoDB Compass
    echo.
    pause
)

echo.
echo Starting Backend and Frontend servers...
echo.
echo This will open 2 terminal windows:
echo 1. Backend Server (Flask API) - Port 5000
echo 2. Frontend Server (Web UI) - Port 3000
echo.
echo Press any key to continue...
pause > nul

REM Start Backend in new window
start "KrishiSetu Backend" cmd /k "cd /d "%~dp0backend" && start-backend.bat"

REM Wait 3 seconds for backend to start
timeout /t 3 /nobreak > nul

REM Start Frontend in new window
start "KrishiSetu Frontend" cmd /k "cd /d "%~dp0frontend" && start-frontend.bat"

REM Wait 2 seconds
timeout /t 2 /nobreak > nul

REM Open browser
echo.
echo Opening browser...
start http://localhost:3000

echo.
echo ========================================
echo   KrishiSetu is now running!
echo ========================================
echo.
echo Backend API: http://localhost:5000
echo Frontend UI: http://localhost:3000
echo.
echo To stop the servers, close the terminal windows
echo or press Ctrl+C in each window
echo.
pause
