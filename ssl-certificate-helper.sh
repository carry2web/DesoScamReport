#!/bin/bash

# DeSo Scam Report - SSL Certificate Helper
# This script helps configure SSL certificates when port 80 is already in use

echo "🔧 SSL Certificate Helper for DeSo Scam Report"
echo ""
echo "⚠️  IMPORTANT: Port 80 is already in use by safetynet.social"
echo "This script will help you configure SSL certificates properly."
echo ""

# Check if main nginx is running
if systemctl is-active --quiet nginx; then
    echo "✅ Main nginx is running on the system"
    MAIN_NGINX_RUNNING=true
else
    echo "❌ Main nginx is not running on the system"
    MAIN_NGINX_RUNNING=false
fi

# Check if our Docker containers are running
if docker-compose -f docker-compose-http.yml ps | grep -q "Up"; then
    echo "✅ DeSo Scam Report Docker containers are running"
    DOCKER_RUNNING=true
else
    echo "❌ DeSo Scam Report Docker containers are not running"
    DOCKER_RUNNING=false
fi

echo ""
echo "🛠️  SOLUTION OPTIONS:"
echo ""

echo "1️⃣  OPTION 1: Configure main nginx to proxy challenge requests"
echo "   Add this to your main nginx config for safetynet.social:"
echo ""
cat << 'EOF'
server {
    listen 80;
    server_name desoscamreport.safetynet.social;
    
    # Proxy Let's Encrypt challenges to our Docker container
    location /.well-known/acme-challenge/ {
        proxy_pass http://127.0.0.1:8081/.well-known/acme-challenge/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}
EOF
echo ""
echo "   Then reload nginx: sudo systemctl reload nginx"
echo ""

echo "2️⃣  OPTION 2: Use DNS challenge (bypasses HTTP entirely)"
echo "   Run this command instead:"
echo ""
echo "   # Install CloudFlare plugin first (if not already installed)"
echo "   docker-compose -f docker-compose-http.yml run --rm certbot pip install certbot-dns-cloudflare"
echo ""
echo "   # Create CloudFlare credentials file"
echo "   echo 'dns_cloudflare_api_token = YOUR_CLOUDFLARE_API_TOKEN' > cloudflare.ini"
echo "   chmod 600 cloudflare.ini"
echo ""
echo "   # Request certificate using DNS challenge"
echo "   docker-compose -f docker-compose-http.yml run --rm -v \$(pwd)/cloudflare.ini:/cloudflare.ini certbot certonly \\"
echo "     --dns-cloudflare \\"
echo "     --dns-cloudflare-credentials /cloudflare.ini \\"
echo "     --email admin@safetynet.social \\"
echo "     --agree-tos \\"
echo "     --no-eff-email \\"
echo "     -d desoscamreport.safetynet.social"
echo ""

echo "3️⃣  OPTION 3: Temporarily stop main nginx (risky)"
echo "   sudo systemctl stop nginx"
echo "   # Run certificate command"
echo "   sudo systemctl start nginx"
echo ""

echo "🎯 RECOMMENDED: Use Option 1 (nginx proxy) as it's the cleanest solution"
echo "that doesn't interfere with your existing safetynet.social setup."
