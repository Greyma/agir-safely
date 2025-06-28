# Deployment Guide - Agir Safely Backend

## Overview
This guide will help you deploy your Agir Safely backend server to the cloud so you can access your app from anywhere.

## Prerequisites
1. **MongoDB Atlas Account** (Free tier available)
2. **Cloud Platform Account** (Heroku, Railway, or Render - all have free tiers)

## Step 1: Set Up MongoDB Atlas (Database)

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (M0 Free tier is sufficient)

### 1.2 Configure Database
1. Create a database user with read/write permissions
2. Add your IP address to the IP whitelist (or use 0.0.0.0/0 for all IPs)
3. Get your connection string

### 1.3 Update Environment Variables
Create a `.env` file in your backend folder:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agir-safely
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=production
```

## Step 2: Deploy to Cloud Platform

### Option A: Deploy to Railway (Recommended - Free Tier)

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Initialize Project**:
   ```bash
   cd backend
   railway init
   ```

4. **Deploy**:
   ```bash
   railway up
   ```

5. **Set Environment Variables**:
   ```bash
   railway variables set MONGODB_URI=your-mongodb-connection-string
   railway variables set JWT_SECRET=your-secret-key
   ```

### Option B: Deploy to Render (Free Tier)

1. **Connect GitHub Repository**:
   - Go to [Render](https://render.com)
   - Connect your GitHub account
   - Select your repository

2. **Create Web Service**:
   - Service Type: Web Service
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node

3. **Set Environment Variables**:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your secret key
   - `NODE_ENV`: production

### Option C: Deploy to Heroku (Free Tier Discontinued)

1. **Install Heroku CLI**:
   ```bash
   npm install -g heroku
   ```

2. **Create Heroku App**:
   ```bash
   heroku create your-app-name
   ```

3. **Deploy**:
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

4. **Set Environment Variables**:
   ```bash
   heroku config:set MONGODB_URI=your-mongodb-connection-string
   heroku config:set JWT_SECRET=your-secret-key
   ```

## Step 3: Update Mobile App Configuration

Once your backend is deployed, update the network configuration:

### Update `src/config/network.ts`:
```typescript
export const NETWORK_CONFIG = {
  // Production URL (your deployed backend)
  production: {
    baseUrl: 'https://your-app-name.railway.app', // or your deployed URL
    timeout: 10000,
  },
  // Development URLs (for local development)
  development: {
    baseUrl: 'http://192.168.1.5:5000',
    timeout: 10000,
  },
  local: {
    baseUrl: 'http://localhost:5000',
    timeout: 10000,
  },
};

export const getNetworkConfig = () => {
  // Use production URL for release builds
  if (__DEV__) {
    return NETWORK_CONFIG.development;
  }
  return NETWORK_CONFIG.production;
};
```

## Step 4: Test Your Deployment

1. **Test API Endpoints**:
   ```bash
   curl https://your-app-name.railway.app/
   # Should return: {"message":"Agir Safely API is running!"}
   ```

2. **Test from Mobile App**:
   - Build and install your mobile app
   - Try logging in or registering
   - Check if data is being saved to MongoDB Atlas

## Step 5: Build Production APK

After updating the configuration:

```bash
# Build production APK
.\build-apk.ps1
```

## Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Update CORS configuration in `server.js` to include your production domain

2. **MongoDB Connection Issues**:
   - Check if your IP is whitelisted in MongoDB Atlas
   - Verify connection string format

3. **Environment Variables**:
   - Ensure all required variables are set in your cloud platform

4. **Port Issues**:
   - Most cloud platforms use `process.env.PORT`
   - Your app is already configured for this

## Cost Estimation

- **MongoDB Atlas**: Free tier (512MB storage, shared RAM)
- **Railway**: Free tier (500 hours/month)
- **Render**: Free tier (750 hours/month)
- **Total**: $0/month for development/testing

## Next Steps

1. Deploy your backend following the steps above
2. Update your mobile app configuration
3. Test the full application
4. Build and distribute your APK

Your app will now be accessible from anywhere with an internet connection! 