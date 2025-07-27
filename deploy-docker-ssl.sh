#!/bin/bash

# DeSo Scam Report Docker Deployment Script with SSL
# This script sets up DeSo Scam Report in Docker containers with automatic SSL certificates

set -e

echo "🚀 Starting DeSo Scam Report Docker deployment..."

# Configuration
DOMAIN="desoscamreport.safetynet.social"
EMAIL="admin@safetynet.social"  # Change this to your email
STAGING=0  # Set to 1 for Let's Encrypt staging (testing)

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p nginx/logs
mkdir -p certbot/conf
mkdir -p certbot/www
mkdir -p logs

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Creating .env file - please update with your actual values"
    cat > .env << EOF
# DeSo Configuration
DESO_SEED_HEX=your_actual_seed_hex_here

# Environment
NODE_ENV=production
EOF
    echo "📝 Please edit .env file with your actual DESO_SEED_HEX before continuing"
    read -p "Press Enter when ready to continue..."
fi

# Function to get initial certificate
get_initial_certificate() {
    echo "🔐 Getting initial SSL certificate..."
    
    # Create a temporary nginx config for initial certificate request
    cat > nginx/conf.d/temp.conf << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 200 'OK';
        add_header Content-Type text/plain;
    }
}
EOF

    # Start nginx temporarily for certificate validation
    docker-compose up -d nginx
    
    # Wait for nginx to be ready
    echo "⏳ Waiting for nginx to be ready..."
    sleep 10
    
    # Request certificate
    if [ $STAGING = 1 ]; then
        echo "🧪 Using Let's Encrypt staging environment"
        STAGING_ARG="--staging"
    else
        STAGING_ARG=""
    fi
    
    docker-compose run --rm certbot \
        certonly --webroot -w /var/www/certbot \
        $STAGING_ARG \
        --email $EMAIL \
        --agree-tos \
        --no-eff-email \
        -d $DOMAIN \
        -d www.$DOMAIN

    # Remove temporary config
    rm nginx/conf.d/temp.conf
    
    # Stop nginx
    docker-compose down
}

# Check if certificate already exists
if [ ! -d "certbot/conf/live/$DOMAIN" ]; then
    echo "📜 SSL certificate not found, requesting new certificate..."
    get_initial_certificate
else
    echo "✅ SSL certificate already exists"
fi

# Build and start all services
echo "🏗️  Building and starting services..."
docker-compose build
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 15

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

# Test the application
echo "🧪 Testing application..."
sleep 5

# Check if the application is responding
if curl -f -s "http://localhost:3000" > /dev/null; then
    echo "✅ Application is running on port 3000"
else
    echo "❌ Application is not responding on port 3000"
    docker-compose logs desoscamreport
fi

# Check nginx
if curl -f -s "http://localhost:8080" > /dev/null; then
    echo "✅ Nginx is running and accessible on port 8080"
else
    echo "❌ Nginx is not responding on port 8080"
    docker-compose logs nginx
fi

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "📊 Service Status:"
docker-compose ps
echo ""
echo "🌐 Your application should be available at:"
echo "   http://$DOMAIN (redirects to HTTPS)"
echo "   https://$DOMAIN"
echo "   Local testing: http://localhost:8080 or https://localhost:8443"
echo ""
echo "📝 Useful commands:"
echo "   View logs:     docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart:       docker-compose restart"
echo "   Update app:    ./deploy-docker-update.sh"
echo ""
echo "🔐 SSL Certificate will auto-renew every 12 hours"
echo ""

# Show final status
echo "🏃 Running containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
