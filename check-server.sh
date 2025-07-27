#!/bin/bash

# Hetzner Server Information Script
# Run this on your Hetzner server to get IP and setup info

echo "🔍 DeSo Scam Report - Hetzner Server Information"
echo "================================================"

# Get public IP address
echo "📍 Server Information:"
echo "   Hostname: $(hostname)"
echo "   Public IP: $(curl -s ifconfig.me || curl -s ipinfo.io/ip)"
echo "   Local IP: $(hostname -I | awk '{print $1}')"

# Get system information
echo ""
echo "💻 System Information:"
echo "   OS: $(lsb_release -d | cut -f2)"
echo "   Kernel: $(uname -r)"
echo "   Architecture: $(uname -m)"

# Check if required software is installed
echo ""
echo "📦 Software Status:"

# Node.js
if command -v node &> /dev/null; then
    echo "   ✅ Node.js: $(node --version)"
else
    echo "   ❌ Node.js: Not installed"
fi

# NPM
if command -v npm &> /dev/null; then
    echo "   ✅ NPM: $(npm --version)"
else
    echo "   ❌ NPM: Not installed"
fi

# PM2
if command -v pm2 &> /dev/null; then
    echo "   ✅ PM2: $(pm2 --version)"
else
    echo "   ❌ PM2: Not installed"
fi

# Nginx
if command -v nginx &> /dev/null; then
    echo "   ✅ Nginx: $(nginx -v 2>&1 | cut -d' ' -f3)"
else
    echo "   ❌ Nginx: Not installed"
fi

# Git
if command -v git &> /dev/null; then
    echo "   ✅ Git: $(git --version | cut -d' ' -f3)"
else
    echo "   ❌ Git: Not installed"
fi

# Check ports
echo ""
echo "🔌 Network Ports:"
if command -v netstat &> /dev/null; then
    echo "   Port 22 (SSH): $(netstat -tuln | grep :22 | wc -l) listeners"
    echo "   Port 80 (HTTP): $(netstat -tuln | grep :80 | wc -l) listeners"
    echo "   Port 443 (HTTPS): $(netstat -tuln | grep :443 | wc -l) listeners"
    echo "   Port 3000 (DeSoScamReport): $(netstat -tuln | grep :3000 | wc -l) listeners"
    echo "   DeSo Validator ports: $(netstat -tuln | grep -E ':(17000|17001|18000|18001)' | wc -l) listeners"
else
    echo "   ⚠️  netstat not available"
fi

# Check firewall status
echo ""
echo "🔥 Firewall Status:"
if command -v ufw &> /dev/null; then
    UFW_STATUS=$(sudo ufw status | head -n 1)
    echo "   UFW: $UFW_STATUS"
    if [[ "$UFW_STATUS" == *"active"* ]]; then
        echo "   Active rules:"
        sudo ufw status numbered | grep -E "(22|80|443|3000)" | sed 's/^/      /'
    fi
else
    echo "   ⚠️  UFW not installed"
fi

# Check if application directory exists
echo ""
echo "📁 Application Status:"
if [ -d "/var/www/desoscamreport" ]; then
    echo "   ✅ App directory: /var/www/desoscamreport exists"
    cd /var/www/desoscamreport
    
    if [ -f "package.json" ]; then
        echo "   ✅ Package.json found"
        APP_NAME=$(grep '"name"' package.json | cut -d'"' -f4)
        echo "   📦 App name: $APP_NAME"
    fi
    
    if [ -d ".next" ]; then
        echo "   ✅ Build directory (.next) exists"
    else
        echo "   ❌ Build directory (.next) missing - need to run 'npm run build'"
    fi
    
    if [ -f ".env.local" ]; then
        echo "   ✅ Environment file (.env.local) exists"
    else
        echo "   ⚠️  Environment file (.env.local) missing"
    fi
else
    echo "   ❌ App directory: /var/www/desoscamreport not found"
fi

# PM2 process status
echo ""
echo "🔄 PM2 Process Status:"
if command -v pm2 &> /dev/null; then
    pm2 jlist 2>/dev/null | grep -q "desoscamreport" && echo "   ✅ desoscamreport process running" || echo "   ❌ desoscamreport process not running"
    echo ""
    echo "   PM2 Status:"
    pm2 status 2>/dev/null | head -n 10 | sed 's/^/      /'
else
    echo "   ❌ PM2 not installed"
fi

# SSL Certificate check
echo ""
echo "🔐 SSL Certificate Status:"
if [ -f "/etc/ssl/certs/cloudflare-origin.pem" ]; then
    echo "   ✅ CloudFlare origin certificate exists"
    CERT_EXPIRY=$(openssl x509 -in /etc/ssl/certs/cloudflare-origin.pem -noout -enddate 2>/dev/null | cut -d= -f2)
    echo "   📅 Certificate expires: $CERT_EXPIRY"
else
    echo "   ❌ CloudFlare origin certificate missing"
fi

if [ -f "/etc/ssl/private/cloudflare-origin.key" ]; then
    echo "   ✅ CloudFlare origin private key exists"
else
    echo "   ❌ CloudFlare origin private key missing"
fi

echo ""
echo "================================================"
echo "💡 Next Steps:"

PUBLIC_IP=$(curl -s ifconfig.me || curl -s ipinfo.io/ip)
echo "1. Update CloudFlare DNS A record:"
echo "   Name: desoscamreport"
echo "   Content: $PUBLIC_IP"
echo "   Proxy: Enabled (orange cloud)"
echo ""
echo "2. Add CNAME record:"
echo "   Name: www.desoscamreport"
echo "   Content: desoscamreport.safetynet.social"
echo "   Proxy: Enabled (orange cloud)"
echo ""
echo "3. Test your domain:"
echo "   curl -I https://desoscamreport.safetynet.social"
echo ""
echo "4. Monitor logs:"
echo "   pm2 logs desoscamreport"
echo "   sudo tail -f /var/log/nginx/error.log"
