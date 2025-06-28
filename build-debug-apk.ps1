Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Agir Safely - Debug APK Builder" -ForegroundColor Cyan
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

Write-Host "[1/4] Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[2/4] Prebuilding Android project..." -ForegroundColor Yellow
npx expo prebuild --platform android --clean
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to prebuild Android project" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[3/4] Building debug APK..." -ForegroundColor Yellow
Set-Location android
try {
    .\gradlew assembleDebug
    if ($LASTEXITCODE -eq 0) {
        Set-Location ..
        Write-Host ""
        Write-Host "[4/4] Debug APK created successfully!" -ForegroundColor Green
        Write-Host "Location: android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "You can now install this APK on your Android device for debugging." -ForegroundColor White
    } else {
        throw "Gradle build failed"
    }
} catch {
    Set-Location ..
    Write-Host "ERROR: Failed to build debug APK" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting tips:" -ForegroundColor Yellow
    Write-Host "1. Make sure Android Studio is installed" -ForegroundColor White
    Write-Host "2. Check that ANDROID_HOME environment variable is set" -ForegroundColor White
    Write-Host "3. Ensure Android SDK and build tools are installed" -ForegroundColor White
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Build completed successfully!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Read-Host "Press Enter to exit" 