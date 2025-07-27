#!/bin/bash

# DeSo Scam Report HTTP-Only Docker Deployment
# Use this for initial deployment to get SSL certificates

echo "🚀 Starting DeSo Scam Report HTTP deployment..."

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p certbot/www
mkdir -p certbot/conf

# Start with HTTP-only configuration
echo "🌐 Starting HTTP-only services..."
docker-compose -f docker-compose-http.yml up -d

echo "⏳ Waiting for application to be ready..."
sleep 10

# Test if application is accessible
echo "🧪 Testing application..."
if curl -f http://localhost:8081/api/health > /dev/null 2>&1; then
    echo "✅ Application is running on HTTP"
    echo "📋 Ready for SSL certificate creation"
    echo ""
    echo "Next steps:"
    echo "1. Verify DNS: nslookup desoscamreport.safetynet.social"
    echo "2. Get SSL certificate: docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot/ -d desoscamreport.safetynet.social"
    echo "3. Switch to SSL: ./deploy-docker-ssl.sh"
else
    echo "❌ Application failed to start"
    echo "📋 Checking logs..."
    docker-compose logs
fi
