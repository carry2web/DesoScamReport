@echo off
REM Windows batch script for Docker SSL deployment

echo 🚀 Starting DeSo Scam Report Docker deployment with SSL...

REM Configuration
set DOMAIN=desoscamreport.safetynet.social
set EMAIL=admin@safetynet.social
set STAGING=0

REM Create necessary directories
echo 📁 Creating directories...
if not exist nginx\logs mkdir nginx\logs
if not exist certbot\conf mkdir certbot\conf
if not exist certbot\www mkdir certbot\www
if not exist logs mkdir logs

REM Check if .env file exists
if not exist .env (
    echo ⚠️  Creating .env file - please update with your actual values
    echo # DeSo Configuration > .env
    echo DESO_SEED_HEX=your_actual_seed_hex_here >> .env
    echo. >> .env
    echo # Environment >> .env
    echo NODE_ENV=production >> .env
    echo.
    echo 📝 Please edit .env file with your actual DESO_SEED_HEX before continuing
    pause
)

REM Create temporary nginx config for initial certificate request
echo 🔐 Getting initial SSL certificate...
echo server { > nginx\conf.d\temp.conf
echo     listen 80; >> nginx\conf.d\temp.conf
echo     server_name %DOMAIN% www.%DOMAIN%; >> nginx\conf.d\temp.conf
echo. >> nginx\conf.d\temp.conf
echo     location /.well-known/acme-challenge/ { >> nginx\conf.d\temp.conf
echo         root /var/www/certbot; >> nginx\conf.d\temp.conf
echo     } >> nginx\conf.d\temp.conf
echo. >> nginx\conf.d\temp.conf
echo     location / { >> nginx\conf.d\temp.conf
echo         return 200 'OK'; >> nginx\conf.d\temp.conf
echo         add_header Content-Type text/plain; >> nginx\conf.d\temp.conf
echo     } >> nginx\conf.d\temp.conf
echo } >> nginx\conf.d\temp.conf

REM Start nginx temporarily for certificate validation
docker-compose up -d nginx

REM Wait for nginx to be ready
echo ⏳ Waiting for nginx to be ready...
timeout /t 10 /nobreak > nul

REM Request certificate
if %STAGING%==1 (
    echo 🧪 Using Let's Encrypt staging environment
    set STAGING_ARG=--staging
) else (
    set STAGING_ARG=
)

docker-compose run --rm certbot certonly --webroot -w /var/www/certbot %STAGING_ARG% --email %EMAIL% --agree-tos --no-eff-email -d %DOMAIN% -d www.%DOMAIN%

REM Remove temporary config
del nginx\conf.d\temp.conf

REM Stop nginx
docker-compose down

REM Build and start all services
echo 🏗️  Building and starting services...
docker-compose build
docker-compose up -d

REM Wait for services to be ready
echo ⏳ Waiting for services to start...
timeout /t 15 /nobreak > nul

REM Check if services are running
echo 🔍 Checking service status...
docker-compose ps

echo.
echo 🎉 Deployment completed!
echo.
echo 🌐 Your application should be available at:
echo    http://%DOMAIN% (redirects to HTTPS)
echo    https://%DOMAIN%
echo.
echo 📝 Useful commands:
echo    View logs:     docker-compose logs -f
echo    Stop services: docker-compose down
echo    Restart:       docker-compose restart
echo    Update app:    deploy-docker-update.cmd
echo.
echo 🔐 SSL Certificate will auto-renew every 12 hours
echo.

REM Show final status
echo 🏃 Running containers:
docker ps --format "table {{.Names}}	{{.Status}}	{{.Ports}}"

pause
