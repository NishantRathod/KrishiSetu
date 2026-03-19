@echo off
echo ========================================
echo   KrishiSetu Frontend Server
echo ========================================
echo.

cd /d "%~dp0"

echo Starting Frontend Server...
echo Frontend will run at: http://localhost:3000
echo.
echo Open your browser and go to:
echo http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

python -m http.server 3000

pause
