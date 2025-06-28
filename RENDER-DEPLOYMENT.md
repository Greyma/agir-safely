# Deploy Agir Safely Backend to Render

## Prerequisites
1. **GitHub Account** (to host your code)
2. **Render Account** (free tier available)
3. **MongoDB Atlas Account** (free tier available)

## Step 1: Set Up MongoDB Atlas

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Choose "M0 Free" cluster (512MB storage, shared RAM)

### 1.2 Configure Database
1. **Create Database User**:
   - Go to "Database Access" → "Add New Database User"
   - Username: `agir-safely-user`
   - Password: Create a strong password
   - Role: "Read and write to any database"

2. **Configure Network Access**:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - This allows Render to connect to your database

3. **Get Connection String**:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Example: `mongodb+srv://agir-safely-user:yourpassword@cluster0.mongodb.net/agir-safely`

## Step 2: Prepare Your Code for GitHub

### 2.1 Create .gitignore (if not exists)
Create a `.gitignore` file in your project root:
```
node_modules/
.env
.DS_Store
*.log
```

### 2.2 Create .env.example
Create `backend/.env.example`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agir-safely
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=production
```

### 2.3 Push to GitHub
1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/agir-safely.git
   git push -u origin main
   ```

## Step 3: Deploy to Render

### 3.1 Create Render Account
1. Go to [Render](https://render.com)
2. Sign up with your GitHub account

### 3.2 Create New Web Service
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Select your repository

### 3.3 Configure the Service
Fill in these details:

**Basic Settings:**
- **Name**: `agir-safely-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`

**Build & Deploy Settings:**
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`
- **Root Directory**: Leave empty (or `backend` if you want to deploy only backend folder)

### 3.4 Set Environment Variables
Click "Environment" tab and add these variables:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | `mongodb+srv://agir-safely-user:yourpassword@cluster0.mongodb.net/agir-safely` |
| `JWT_SECRET` | `your-super-secret-jwt-key-change-this-in-production` |
| `NODE_ENV` | `production` |
| `PORT` | `10000` (Render uses this port) |

### 3.5 Deploy
1. Click "Create Web Service"
2. Render will automatically build and deploy your app
3. Wait for the build to complete (usually 2-5 minutes)

## Step 4: Test Your Deployment

### 4.1 Check Deployment Status
- Go to your service dashboard
- Check if status is "Live"
- Note your service URL (e.g., `https://agir-safely-backend.onrender.com`)

### 4.2 Test API Endpoints
```bash
# Test health check
curl https://your-app-name.onrender.com/

# Should return: {"message":"Agir Safely API is running!"}
```

## Step 5: Update Mobile App Configuration

### 5.1 Update Network Configuration
Edit `src/config/network.ts`:

```typescript
export const NETWORK_CONFIG = {
  // Production URL (your Render deployment)
  production: {
    baseUrl: 'https://your-app-name.onrender.com',
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

### 5.2 Update CORS Configuration
Edit `backend/server.js` to include your Render domain:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:8081',
    'http://localhost:8082',
    'http://192.168.1.5:8081',
    'http://192.168.1.5:8082',
    'exp://192.168.1.5:8081',
    'exp://192.168.1.5:8082',
    // Add your Render domain
    'https://your-app-name.onrender.com',
    // Allow all origins for development (remove in production)
    '*'
  ],
  credentials: true
}));
```

## Step 6: Build Production APK

After updating the configuration:

```bash
# Build production APK
.\build-apk.ps1
```

## Troubleshooting

### Common Issues:

1. **Build Fails**:
   - Check build logs in Render dashboard
   - Ensure all dependencies are in `package.json`
   - Verify build command is correct

2. **MongoDB Connection Issues**:
   - Check if your IP is whitelisted in MongoDB Atlas
   - Verify connection string format
   - Ensure database user has correct permissions

3. **CORS Errors**:
   - Add your Render domain to CORS configuration
   - Check if environment variables are set correctly

4. **Service Not Starting**:
   - Check start command in Render
   - Verify PORT environment variable is set
   - Check application logs in Render dashboard

## Cost
- **Render**: Free tier (750 hours/month)
- **MongoDB Atlas**: Free tier (512MB storage)
- **Total**: $0/month for development

## Next Steps
1. Test your deployed API
2. Update your mobile app configuration
3. Build and test your APK
4. Share your app with others!

Your backend will now be accessible from anywhere with an internet connection! 