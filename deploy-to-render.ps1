Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Agir Safely - Render Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Git is available
try {
    $gitVersion = git --version
    Write-Host "Git version: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Git is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Git from https://git-scm.com/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[1/6] Checking current Git status..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "You have uncommitted changes:" -ForegroundColor Yellow
    Write-Host $gitStatus -ForegroundColor White
    $response = Read-Host "Do you want to commit these changes? (y/n)"
    if ($response -eq 'y' -or $response -eq 'Y') {
        git add .
        $commitMessage = Read-Host "Enter commit message (or press Enter for default)"
        if (-not $commitMessage) {
            $commitMessage = "Prepare for Render deployment"
        }
        git commit -m $commitMessage
    }
}

Write-Host ""
Write-Host "[2/6] Checking if remote repository exists..." -ForegroundColor Yellow
$remoteUrl = git remote get-url origin 2>$null
if (-not $remoteUrl) {
    Write-Host "No remote repository found." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please create a GitHub repository and add it as remote:" -ForegroundColor Cyan
    Write-Host "1. Go to https://github.com/new" -ForegroundColor White
    Write-Host "2. Create a new repository named 'agir-safely'" -ForegroundColor White
    Write-Host "3. Copy the repository URL" -ForegroundColor White
    Write-Host ""
    $repoUrl = Read-Host "Enter your GitHub repository URL (e.g., https://github.com/username/agir-safely.git)"
    if ($repoUrl) {
        git remote add origin $repoUrl
        Write-Host "Remote repository added successfully!" -ForegroundColor Green
    } else {
        Write-Host "ERROR: Repository URL is required" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "Remote repository found: $remoteUrl" -ForegroundColor Green
}

Write-Host ""
Write-Host "[3/6] Pushing code to GitHub..." -ForegroundColor Yellow
git push -u origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to push to GitHub" -ForegroundColor Red
    Write-Host "Please check your GitHub credentials and try again" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[4/6] Checking MongoDB Atlas setup..." -ForegroundColor Yellow
Write-Host "Have you set up MongoDB Atlas?" -ForegroundColor Cyan
Write-Host "1. Go to https://www.mongodb.com/atlas" -ForegroundColor White
Write-Host "2. Create a free account and cluster" -ForegroundColor White
Write-Host "3. Create a database user" -ForegroundColor White
Write-Host "4. Get your connection string" -ForegroundColor White
Write-Host ""
$mongoSetup = Read-Host "Have you completed MongoDB Atlas setup? (y/n)"
if ($mongoSetup -ne 'y' -and $mongoSetup -ne 'Y') {
    Write-Host ""
    Write-Host "Please complete MongoDB Atlas setup first:" -ForegroundColor Yellow
    Write-Host "1. Go to https://www.mongodb.com/atlas" -ForegroundColor White
    Write-Host "2. Sign up for free account" -ForegroundColor White
    Write-Host "3. Create M0 Free cluster" -ForegroundColor White
    Write-Host "4. Create database user with read/write permissions" -ForegroundColor White
    Write-Host "5. Allow access from anywhere (0.0.0.0/0)" -ForegroundColor White
    Write-Host "6. Get your connection string" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter when you're ready to continue"
}

Write-Host ""
Write-Host "[5/6] Deploying to Render..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Now follow these steps to deploy to Render:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to https://render.com" -ForegroundColor White
Write-Host "2. Sign up with your GitHub account" -ForegroundColor White
Write-Host "3. Click 'New' → 'Web Service'" -ForegroundColor White
Write-Host "4. Connect your GitHub repository" -ForegroundColor White
Write-Host "5. Configure the service:" -ForegroundColor White
Write-Host "   - Name: agir-safely-backend" -ForegroundColor Gray
Write-Host "   - Environment: Node" -ForegroundColor Gray
Write-Host "   - Build Command: cd backend && npm install" -ForegroundColor Gray
Write-Host "   - Start Command: cd backend && npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "6. Set Environment Variables:" -ForegroundColor White
Write-Host "   - MONGODB_URI: your-mongodb-connection-string" -ForegroundColor Gray
Write-Host "   - JWT_SECRET: your-secret-key" -ForegroundColor Gray
Write-Host "   - NODE_ENV: production" -ForegroundColor Gray
Write-Host "   - PORT: 10000" -ForegroundColor Gray
Write-Host ""
Write-Host "7. Click 'Create Web Service'" -ForegroundColor White
Write-Host ""

$renderUrl = Read-Host "Enter your Render service URL (e.g., https://agir-safely-backend.onrender.com)"
if ($renderUrl) {
    Write-Host ""
    Write-Host "[6/6] Updating mobile app configuration..." -ForegroundColor Yellow
    
    # Update network configuration
    $networkConfigPath = "src/config/network.ts"
    if (Test-Path $networkConfigPath) {
        $content = Get-Content $networkConfigPath -Raw
        $updatedContent = $content -replace 'production: \{[^}]*\}', "production: {
    baseUrl: '$renderUrl',
    timeout: 10000,
  }"
        Set-Content $networkConfigPath $updatedContent
        Write-Host "Updated network configuration with Render URL" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "✅ Deployment preparation completed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Complete Render deployment using the steps above" -ForegroundColor White
    Write-Host "2. Test your API: $renderUrl" -ForegroundColor White
    Write-Host "3. Build your APK: .\build-apk.ps1" -ForegroundColor White
    Write-Host "4. Install and test your app!" -ForegroundColor White
} else {
    Write-Host "Please complete Render deployment and provide the URL later." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Deployment preparation completed!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Read-Host "Press Enter to exit" 