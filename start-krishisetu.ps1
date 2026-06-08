# KrishiSetu Project Launcher (PowerShell)
# Run with: powershell -ExecutionPolicy RemoteSigned -File start-krishisetu.ps1

param(
    [switch]$Backend,
    [switch]$Frontend,
    [switch]$Both
)

$rootPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $rootPath "backend"
$frontendPath = Join-Path $rootPath "frontend"
$venvPath = Join-Path $rootPath ".venv"

# Color functions
function Write-Header {
    param([string]$text)
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  $text" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$text)
    Write-Host "[✓] $text" -ForegroundColor Green
}

function Write-Error-Custom {
    param([string]$text)
    Write-Host "[✗] $text" -ForegroundColor Red
}

function Write-Info {
    param([string]$text)
    Write-Host "[i] $text" -ForegroundColor Yellow
}

# Main menu if no flags specified
if (-not $Backend -and -not $Frontend -and -not $Both) {
    Write-Header "KrishiSetu Project Launcher"
    Write-Host ""
    Write-Host "Choose what to start:" -ForegroundColor Cyan
    Write-Host "1 - Backend Only (Flask API - Port 5000)" -ForegroundColor Gray
    Write-Host "2 - Frontend Only (Web UI - Port 3000)" -ForegroundColor Gray
    Write-Host "3 - Both (Backend + Frontend)" -ForegroundColor Gray
    Write-Host "Q - Quit" -ForegroundColor Gray
    Write-Host ""
    
    $choice = Read-Host "Enter your choice (1/2/3/Q)"
    
    switch($choice.ToUpper()) {
        "1" { $Backend = $true }
        "2" { $Frontend = $true }
        "3" { $Both = $true }
        "Q" { exit }
        default { Write-Error-Custom "Invalid choice"; exit 1 }
    }
}

# If Both selected, set both flags
if ($Both) {
    $Backend = $true
    $Frontend = $true
}

# Activate virtual environment
if (Test-Path "$venvPath\Scripts\Activate.ps1") {
    Write-Info "Activating virtual environment..."
    & "$venvPath\Scripts\Activate.ps1"
    Write-Success "Virtual environment activated"
} else {
    Write-Error-Custom "Virtual environment not found at $venvPath"
    exit 1
}

if ($Backend) {
    Write-Header "Starting Backend Server"
    Write-Info "Flask will run at: http://localhost:5000"
    Write-Info "Press Ctrl+C to stop"
    Write-Host ""
    
    Set-Location $backendPath
    
    # Check if dependencies are installed
    python -c "import flask" 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Info "Installing dependencies..."
        pip install -r requirements.txt
    }
    
    # Check for .env file
    if (-not (Test-Path ".env")) {
        Write-Info "Creating .env file from template..."
        if (Test-Path ".env.example") {
            Copy-Item ".env.example" ".env"
            Write-Info "Edit .env file with your MongoDB URI and configuration"
        }
    }
    
    Write-Success "Starting Flask server..."
    python app.py
}

if ($Frontend) {
    if ($Backend) {
        Write-Host ""
        Write-Host "Backend started. Press Enter to start frontend in new window..." -ForegroundColor Yellow
        Read-Host
    }
    
    Write-Header "Starting Frontend Server"
    Write-Info "Frontend will run at: http://localhost:3000"
    Write-Info "Press Ctrl+C to stop"
    Write-Host ""
    
    Set-Location $frontendPath
    
    Write-Success "Starting HTTP server..."
    python -m http.server 3000
}

Write-Host ""
Write-Host "Servers stopped." -ForegroundColor Yellow
