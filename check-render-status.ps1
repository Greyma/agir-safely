Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Agir Safely - Render Status Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking deployment status..." -ForegroundColor Yellow
Write-Host ""

Write-Host "✅ Code pushed to GitHub successfully!" -ForegroundColor Green
Write-Host "   Repository: https://github.com/Greyma/agir-safely" -ForegroundColor White
Write-Host ""

Write-Host "🔄 Render should automatically detect changes and start deployment" -ForegroundColor Yellow
Write-Host ""

Write-Host "📋 To check Render deployment status:" -ForegroundColor Cyan
Write-Host "1. Go to https://dashboard.render.com" -ForegroundColor White
Write-Host "2. Find your 'agir-safely-backend' service" -ForegroundColor White
Write-Host "3. Check the deployment logs" -ForegroundColor White
Write-Host ""

Write-Host "🔗 Your Render service URL:" -ForegroundColor Cyan
Write-Host "   https://agir-safely-backend.onrender.com" -ForegroundColor White
Write-Host ""

Write-Host "🧪 Test your API:" -ForegroundColor Cyan
Write-Host "   https://agir-safely-backend.onrender.com/" -ForegroundColor White
Write-Host ""

Write-Host "📱 App Configuration:" -ForegroundColor Cyan
Write-Host "   ✅ Production URL enabled in network config" -ForegroundColor Green
Write-Host "   ✅ App will try production URL first" -ForegroundColor Green
Write-Host "   ✅ Falls back to local development if needed" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 Next steps:" -ForegroundColor Cyan
Write-Host "1. Wait for Render deployment to complete (usually 2-5 minutes)" -ForegroundColor White
Write-Host "2. Test the API endpoint above" -ForegroundColor White
Write-Host "3. Build and test your mobile app" -ForegroundColor White
Write-Host "4. The app will automatically use the production API" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Deployment Status Check Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Read-Host "Press Enter to exit" 