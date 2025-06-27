# Troubleshooting Guide - Blue Screen Issue

## Problem
Your React Native app shows a blue screen with "something went wrong" when running on your phone.

## Solutions

### 1. Network Configuration Issue (Most Likely)
The app is trying to connect to `http://192.168.1.7:5000` which might not be accessible from your phone.

**Steps to fix:**
1. Make sure your backend server is running on your computer
2. Find your computer's IP address:
   - Windows: Run `ipconfig` in Command Prompt
   - Look for "IPv4 Address" under your WiFi adapter
3. Update the IP address in `src/config/network.ts`
4. Make sure your phone and computer are on the same WiFi network

### 2. Backend Server Not Running
Make sure your backend server is running:
```bash
cd backend
npm start
# or
node server.js
```

### 3. Use the Debug Screen
The app now includes a Debug tab that will help you identify the issue:
1. Open the app
2. Go to the "Debug" tab
3. Check the network tests to see which URLs are working
4. Use the "Clear Storage" button if there are authentication issues

### 4. Common Network URLs to Try
Update `src/config/network.ts` with these URLs based on your setup:

- **Same WiFi network**: `http://YOUR_COMPUTER_IP:5000`
- **Android Emulator**: `http://10.0.2.2:5000`
- **iOS Simulator**: `http://localhost:5000`
- **USB Debugging**: `http://localhost:5000`

### 5. Clear App Data
If the issue persists:
1. Go to your phone's Settings
2. Find the app in Apps/Application Manager
3. Clear data and cache
4. Reinstall the app

### 6. Check Console Logs
Run the app with Expo and check the console for error messages:
```bash
npx expo start
```

### 7. Test Backend Connection
Test if your backend is accessible:
```bash
curl http://YOUR_IP:5000/health
```

## Quick Fix
If you want to test without the backend, you can temporarily modify the API service to use mock data.

## Still Having Issues?
1. Check the Debug screen in the app
2. Look at the console logs
3. Make sure all dependencies are installed: `pnpm install`
4. Try running on an emulator first to isolate the issue 