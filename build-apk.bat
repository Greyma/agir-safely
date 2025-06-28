@echo off
echo ========================================
echo    Agir Safely - APK Builder
echo ========================================
echo.

echo [1/5] Checking dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/5] Installing Expo CLI...
call npm install -g @expo/cli
if %errorlevel% neq 0 (
    echo WARNING: Failed to install Expo CLI globally, using local version
)

echo.
echo [3/5] Prebuilding Android project...
call npx expo prebuild --platform android --clean
if %errorlevel% neq 0 (
    echo ERROR: Failed to prebuild Android project
    pause
    exit /b 1
)

echo.
echo [4/5] Building APK...
echo Trying method 1: Gradle build...
cd android
call gradlew assembleRelease
if %errorlevel% neq 0 (
    echo Gradle build failed, trying alternative method...
    cd ..
    echo.
    echo Trying method 2: Expo build...
    call npx expo build:android --type apk
    if %errorlevel% neq 0 (
        echo.
        echo ERROR: All build methods failed
        echo.
        echo Alternative solutions:
        echo 1. Check your internet connection
        echo 2. Try using EAS Build (cloud-based)
        echo 3. Install Android Studio and build manually
        pause
        exit /b 1
    )
) else (
    cd ..
    echo.
    echo [5/5] APK created successfully!
    echo Location: android\app\build\outputs\apk\release\app-release.apk
)

echo.
echo ========================================
echo    Build completed!
echo ========================================
pause 