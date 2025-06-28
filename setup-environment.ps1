Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Agir Safely - Environment Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js is NOT installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js:" -ForegroundColor Yellow
    Write-Host "1. Go to https://nodejs.org/" -ForegroundColor White
    Write-Host "2. Download the LTS version" -ForegroundColor White
    Write-Host "3. Run the installer" -ForegroundColor White
    Write-Host "4. Make sure to check 'Add to PATH' during installation" -ForegroundColor White
    Write-Host "5. Restart this script after installation" -ForegroundColor White
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if npm is available
Write-Host "Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "npm is available: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "npm is NOT available" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Android SDK is available
Write-Host "Checking Android SDK..." -ForegroundColor Yellow
$androidHome = $env:ANDROID_HOME
if ($androidHome -and (Test-Path $androidHome)) {
    Write-Host "Android SDK found at: $androidHome" -ForegroundColor Green
} else {
    Write-Host "Android SDK NOT found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Android Studio:" -ForegroundColor Yellow
    Write-Host "1. Go to https://developer.android.com/studio" -ForegroundColor White
    Write-Host "2. Download and install Android Studio" -ForegroundColor White
    Write-Host "3. During installation, make sure to install Android SDK" -ForegroundColor White
    Write-Host "4. Set ANDROID_HOME environment variable" -ForegroundColor White
}

Write-Host ""
Write-Host "Environment check completed!" -ForegroundColor Green
Write-Host ""
Write-Host "To build debug APK, run:" -ForegroundColor Cyan
Write-Host "  .\build-apk.ps1" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit" 