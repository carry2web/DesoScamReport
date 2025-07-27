#!/bin/bash

# DeSo Scam Report - DNS Challenge SSL Certificate Script
# This bypasses all HTTP/port conflicts by using CloudFlare DNS API

echo "🔐 DeSo Scam Report - DNS Challenge SSL Setup"
echo ""

# Check if CloudFlare API token is provided
if [ -z "$1" ]; then
    echo "❌ CloudFlare API token required"
    echo ""
    echo "Usage: $0 <cloudflare_api_token>"
    echo ""
    echo "Get your token from: https://dash.cloudflare.com/profile/api-tokens"
    echo "Required permissions:"
    echo "  - Zone:DNS:Edit"
    echo "  - Zone:Zone:Read"
    echo "  - Zone Resources: safetynet.social"
    exit 1
fi

CLOUDFLARE_TOKEN="$1"
DOMAIN="desoscamreport.safetynet.social"
EMAIL="admin@safetynet.social"

echo "🌐 Domain: $DOMAIN"
echo "📧 Email: $EMAIL"
echo ""

# Create CloudFlare credentials file
echo "📝 Creating CloudFlare credentials file..."
cat > cloudflare.ini << EOF
dns_cloudflare_api_token = $CLOUDFLARE_TOKEN
EOF
chmod 600 cloudflare.ini

echo "✅ Credentials file created"
echo ""

# Create certificate directories
echo "📁 Creating certificate directories..."
mkdir -p certbot/conf certbot/www

# Request certificate using DNS challenge
echo "🔐 Requesting SSL certificate using DNS challenge..."
echo "This will take 1-2 minutes while CloudFlare DNS propagates..."
echo ""

docker run --rm \
  -v $(pwd)/certbot/conf:/etc/letsencrypt \
  -v $(pwd)/cloudflare.ini:/cloudflare.ini \
  certbot/dns-cloudflare certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /cloudflare.ini \
  --email $EMAIL \
  --agree-tos \
  --no-eff-email \
  --non-interactive \
  -d $DOMAIN

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SSL certificate created successfully!"
    echo ""
    echo "📂 Certificate files:"
    ls -la certbot/conf/live/$DOMAIN/
    echo ""
    echo "🚀 Now you can run the SSL deployment:"
    echo "./deploy-docker-ssl.sh"
    echo ""
    echo "🔒 Your certificate will auto-renew every 12 hours"
else
    echo ""
    echo "❌ Certificate creation failed"
    echo "Check the error messages above"
    echo ""
    echo "Common issues:"
    echo "  - Invalid CloudFlare API token"
    echo "  - Token doesn't have DNS:Edit permission"
    echo "  - Token isn't for safetynet.social zone"
fi

# Clean up credentials file
echo "🧹 Cleaning up credentials file..."
rm -f cloudflare.ini

echo ""
echo "✅ DNS challenge complete!"
