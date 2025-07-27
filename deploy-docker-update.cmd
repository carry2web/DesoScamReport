@echo off
REM Windows update script for DeSo Scam Report Docker deployment

echo 🔄 Updating DeSo Scam Report...

REM Pull latest changes
echo 📥 Pulling latest code...
git pull origin master

REM Rebuild and restart the application
echo 🏗️  Rebuilding application...
docker-compose build desoscamreport

echo 🔄 Restarting services...
docker-compose up -d

REM Wait for restart
echo ⏳ Waiting for services to restart...
timeout /t 10 /nobreak > nul

REM Check status
echo 🔍 Checking service status...
docker-compose ps

REM Test application
curl -f -s "http://localhost:3000/api/health" > nul 2>&1
if %errorlevel%==0 (
    echo ✅ Application updated successfully
    echo 🌐 Available at: https://desoscamreport.safetynet.social
) else (
    echo ❌ Application may have issues, checking logs...
    docker-compose logs --tail=20 desoscamreport
)

echo 🎉 Update completed!
pause
