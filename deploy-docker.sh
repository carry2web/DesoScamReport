#!/bin/bash

# Docker Deployment Script for DeSo Validator Server
# This script adds DeSo Scam Report as a new container to existing docker-compose setup

echo "🐳 Adding DeSo Scam Report to Docker-based DeSo Validator..."

# Variables
COMPOSE_DIR="/opt/deso-validator"  # Adjust this to your actual docker-compose directory
REPO_URL="https://github.com/carry2web/DesoScamReport.git"
APP_NAME="desoscamreport"

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml not found in current directory"
    echo "Please run this script from your DeSo validator docker-compose directory"
    echo "Expected location: $COMPOSE_DIR"
    exit 1
fi

# Backup current docker-compose.yml
echo "📋 Backing up current docker-compose.yml..."
cp docker-compose.yml docker-compose.yml.backup.$(date +%Y%m%d_%H%M%S)

# Clone DeSo Scam Report repository
echo "📥 Cloning DeSo Scam Report repository..."
if [ -d "$APP_NAME-source" ]; then
    echo "🔄 Updating existing repository..."
    cd $APP_NAME-source
    git pull origin master
    cd ..
else
    git clone $REPO_URL $APP_NAME-source
fi

# Copy necessary files
echo "📁 Copying application files..."
cp $APP_NAME-source/Dockerfile ./Dockerfile.$APP_NAME
cp $APP_NAME-source/healthcheck.js ./healthcheck.$APP_NAME.js

# Create environment file for the container
echo "📝 Creating environment file..."
cat > .env.$APP_NAME << EOF
NODE_ENV=production
NEXT_PUBLIC_DESO_NODE_URL=https://safetynet.social
NEXT_PUBLIC_IDENTITY_URL=https://identity.safetynet.social
NEXT_PUBLIC_APP_NAME=DeSo Scam Report
NEXT_PUBLIC_APP_DOMAIN=desoscamreport.safetynet.social
DESO_PUBLIC_KEY=BC1YLitoF835xNLJJriQpfCQBXQzJVsqpcU7KMGnuTQiNyASu4CoSAD
DESO_SEED_HEX=your_actual_seed_hex_here
EOF

echo "⚠️  IMPORTANT: Edit .env.$APP_NAME and add your actual DESO_SEED_HEX"

# Add service to docker-compose.yml
echo "🐳 Adding service to docker-compose.yml..."

# Check if service already exists
if grep -q "desoscamreport:" docker-compose.yml; then
    echo "⚠️  Service 'desoscamreport' already exists in docker-compose.yml"
    echo "Please remove it manually or restore from backup if needed"
else
    # Add the new service before the last line of the file
    cat >> docker-compose.yml << 'EOF'

  desoscamreport:
    build:
      context: ./desoscamreport-source
      dockerfile: ../Dockerfile.desoscamreport
    container_name: desoscamreport
    restart: unless-stopped
    env_file:
      - .env.desoscamreport
    expose:
      - "3000"
    depends_on:
      - backend
    healthcheck:
      test: ["CMD", "node", "/app/healthcheck.js"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
    networks:
      internal:
        ipv4_address: 172.20.0.9
EOF
    echo "✅ Added desoscamreport service to docker-compose.yml"
fi

# Update nginx configuration
echo "🔧 Updating nginx configuration..."

# Backup nginx config
if [ -f "nginx.conf" ]; then
    cp nginx.conf nginx.conf.backup.$(date +%Y%m%d_%H%M%S)
fi

if [ -f "default.conf" ]; then
    cp default.conf default.conf.backup.$(date +%Y%m%d_%H%M%S)
fi

# Create nginx config addition
cat > nginx.desoscamreport.conf << 'EOF'
# DeSo Scam Report configuration
# Add this to your existing nginx configuration

server {
    listen 80;
    server_name desoscamreport.safetynet.social;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name desoscamreport.safetynet.social;

    # SSL configuration (using existing certificates)
    ssl_certificate /etc/letsencrypt/live/safetynet.social/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/safetynet.social/privkey.pem;
    
    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Proxy to DeSo Scam Report container
    location / {
        proxy_pass http://172.20.0.9:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static assets caching
    location /_next/static {
        proxy_pass http://172.20.0.9:3000;
        proxy_cache_valid 200 365d;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }
}
EOF

echo "📋 Created nginx.desoscamreport.conf"
echo "⚠️  You need to manually integrate this configuration into your existing nginx setup"

# Instructions for SSL certificate
echo ""
echo "🔐 SSL Certificate Setup:"
echo "1. Add 'desoscamreport.safetynet.social' to your certbot renewal"
echo "2. If using a wildcard certificate, it should already cover this subdomain"
echo "3. If not, run: docker-compose exec certbot certbot --expand -d safetynet.social -d desoscamreport.safetynet.social"

# Build and start the container
echo ""
echo "🚀 Building and starting DeSo Scam Report container..."
echo "Make sure to:"
echo "1. Edit .env.desoscamreport with your actual DESO_SEED_HEX"
echo "2. Update your nginx configuration"
echo "3. Update your SSL certificates if needed"
echo ""

read -p "Do you want to proceed with building the container? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔨 Building container..."
    docker-compose build desoscamreport
    
    echo "🚀 Starting container..."
    docker-compose up -d desoscamreport
    
    echo "📊 Checking container status..."
    docker-compose ps desoscamreport
    
    echo "📝 Checking logs..."
    docker-compose logs --tail=20 desoscamreport
    
    echo ""
    echo "✅ Deployment completed!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Update CloudFlare DNS: desoscamreport.safetynet.social → $(curl -s ifconfig.me)"
    echo "2. Update nginx configuration with nginx.desoscamreport.conf content"
    echo "3. Reload nginx: docker-compose exec nginx nginx -s reload"
    echo "4. Test: curl -I https://desoscamreport.safetynet.social"
    echo ""
    echo "🔍 Monitor with:"
    echo "  - docker-compose logs -f desoscamreport"
    echo "  - docker-compose ps"
    echo "  - docker stats desoscamreport"
else
    echo "⏸️  Build cancelled. Run the following when ready:"
    echo "  docker-compose build desoscamreport"
    echo "  docker-compose up -d desoscamreport"
fi
