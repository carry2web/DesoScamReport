#!/bin/bash

# Hetzner Deployment Script for DeSo Scam Report
# Run this script on your Hetzner server

echo "🚀 Starting DeSo Scam Report deployment on Hetzner..."

# Set variables
PROJECT_DIR="/var/www/desoscamreport"
REPO_URL="https://github.com/carry2web/DesoScamReport.git"
DOMAIN="desoscamreport.safetynet.social"

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "❌ Please don't run this script as root"
    exit 1
fi

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS if not installed
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ NPM version: $(npm --version)"

# Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    sudo npm install -g pm2
fi

# Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing Nginx..."
    sudo apt install nginx -y
fi

# Create project directory
echo "📁 Setting up project directory..."
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www

# Clone or update repository
if [ -d "$PROJECT_DIR" ]; then
    echo "🔄 Updating existing repository..."
    cd $PROJECT_DIR
    git pull origin master
else
    echo "📥 Cloning repository..."
    git clone $REPO_URL $PROJECT_DIR
    cd $PROJECT_DIR
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Create environment file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env.local
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local with your actual DeSo keys!"
    echo "   nano .env.local"
    echo ""
fi

# Build application
echo "🔨 Building application..."
npm run build

# Create PM2 ecosystem file
echo "📝 Creating PM2 configuration..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'desoscamreport',
    script: 'server.js',
    cwd: '$PROJECT_DIR',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    log_file: '/var/log/pm2/desoscamreport.log',
    error_file: '/var/log/pm2/desoscamreport-error.log',
    out_file: '/var/log/pm2/desoscamreport-out.log',
    time: true
  }]
}
EOF

# Create log directory
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

# Start application with PM2
echo "🚀 Starting application..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Create Nginx configuration
echo "📝 Creating Nginx configuration..."
sudo tee /etc/nginx/sites-available/desoscamreport > /dev/null << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Redirect to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    # SSL configuration (CloudFlare origin certificates)
    ssl_certificate /etc/ssl/certs/cloudflare-origin.pem;
    ssl_certificate_key /etc/ssl/private/cloudflare-origin.key;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Reverse proxy to Next.js
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Static assets caching
    location /_next/static {
        alias $PROJECT_DIR/.next/static;
        expires 365d;
        access_log off;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
EOF

# Enable Nginx site
sudo ln -sf /etc/nginx/sites-available/desoscamreport /etc/nginx/sites-enabled/
sudo nginx -t

# Create deployment script
echo "📝 Creating deployment script..."
cat > deploy-update.sh << 'EOF'
#!/bin/bash
echo "🔄 Updating DeSo Scam Report..."

cd /var/www/desoscamreport

# Pull latest changes
git pull origin master

# Install dependencies
npm ci

# Build application
npm run build

# Restart PM2 application
pm2 restart desoscamreport

echo "✅ Deployment completed successfully!"
echo "🌐 App available at: https://desoscamreport.safetynet.social"
EOF

chmod +x deploy-update.sh

echo ""
echo "🎉 Basic deployment setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Edit environment variables: nano .env.local"
echo "2. Setup CloudFlare origin certificates (see HETZNER_DEPLOYMENT.md)"
echo "3. Update CloudFlare DNS to point to this server"
echo "4. Reload Nginx: sudo systemctl reload nginx"
echo ""
echo "📊 Check application status: pm2 status"
echo "📝 View logs: pm2 logs desoscamreport"
echo "🔄 Future updates: ./deploy-update.sh"
echo ""
echo "🌐 Your app will be available at: https://$DOMAIN"
