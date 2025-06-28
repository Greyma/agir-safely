Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Agir Safely - APK Builder" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/5] Checking dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[2/5] Installing Expo CLI..." -ForegroundColor Yellow
npm install -g @expo/cli
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Failed to install Expo CLI globally, using local version" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[3/5] Prebuilding Android project..." -ForegroundColor Yellow
npx expo prebuild --platform android --clean
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to prebuild Android project" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[4/5] Building APK..." -ForegroundColor Yellow
Write-Host "Trying method 1: Gradle build..." -ForegroundColor Green
Set-Location android
try {
    .\gradlew assembleRelease
    if ($LASTEXITCODE -eq 0) {
        Set-Location ..
        Write-Host ""
        Write-Host "[5/5] APK created successfully!" -ForegroundColor Green
        Write-Host "Location: android\app\build\outputs\apk\release\app-release.apk" -ForegroundColor Cyan
    } else {
        throw "Gradle build failed"
    }
} catch {
    Write-Host "Gradle build failed, trying alternative method..." -ForegroundColor Yellow
    Set-Location ..
    Write-Host ""
    Write-Host "Trying method 2: Expo build..." -ForegroundColor Green
    npx expo build:android --type apk
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "ERROR: All build methods failed" -ForegroundColor Red
        Write-Host ""
        Write-Host "Alternative solutions:" -ForegroundColor Yellow
        Write-Host "1. Check your internet connection" -ForegroundColor White
        Write-Host "2. Try using EAS Build (cloud-based)" -ForegroundColor White
        Write-Host "3. Install Android Studio and build manually" -ForegroundColor White
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Build completed!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Read-Host "Press Enter to exit" 