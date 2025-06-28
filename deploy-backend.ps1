Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Agir Safely - Backend Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is available
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[1/5] Installing Railway CLI..." -ForegroundColor Yellow
npm install -g @railway/cli
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install Railway CLI" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[2/5] Checking Railway login..." -ForegroundColor Yellow
railway whoami
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please login to Railway..." -ForegroundColor Yellow
    railway login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to login to Railway" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host ""
Write-Host "[3/5] Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install backend dependencies" -ForegroundColor Red
    Set-Location ..
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[4/5] Initializing Railway project..." -ForegroundColor Yellow
railway init
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to initialize Railway project" -ForegroundColor Red
    Set-Location ..
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[5/5] Deploying to Railway..." -ForegroundColor Yellow
railway up
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Backend deployed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Get your deployment URL from Railway dashboard" -ForegroundColor White
    Write-Host "2. Set up MongoDB Atlas database" -ForegroundColor White
    Write-Host "3. Configure environment variables in Railway" -ForegroundColor White
    Write-Host "4. Update your mobile app configuration" -ForegroundColor White
    Write-Host ""
    Write-Host "Railway Dashboard: https://railway.app/dashboard" -ForegroundColor Yellow
} else {
    Write-Host "ERROR: Failed to deploy to Railway" -ForegroundColor Red
}

Set-Location ..
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Deployment process completed!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Read-Host "Press Enter to exit" 