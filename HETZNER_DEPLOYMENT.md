# Hetzner Dedicated Server Deployment Guide

## Overview
Deploy DeSo Scam Report to Hetzner dedicated server with custom domain and CloudFlare configuration.

## Prerequisites
- Hetzner dedicated server with Ubuntu/Debian (hosting DeSo validator safetynet.social)
- Domain: `desoscamreport.safetynet.social`
- CloudFlare account managing `safetynet.social` (already configured)
- Node.js 20 LTS installed on server (may need installation)
- Nginx already running (for DeSo validator and other subdomains)

**Note**: This guide deploys DeSo Scam Report as a standalone application on your DeSo validator server. The application runs independently and integrates only through the existing nginx reverse proxy configuration.

## Server Setup

### 1. Verify Existing Setup
```bash
# Check if Node.js is installed (needed for standalone app)
node --version  # Should show v20.x.x or may not exist
npm --version

# Check if PM2 is installed (needed for process management)
pm2 --version

# Check current Docker processes (validator should be running)
docker ps

# Check nginx container status
docker ps | grep nginx

# Check available ports (avoid conflicts with Docker containers)
netstat -tuln | grep -E ":(3000|3001|8080|17000|17001)"
```

### 2. Install Node.js and PM2 (Host System)
```bash
# Install Node.js 20 LTS on the host system (outside Docker)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version

# Install PM2 for process management on host
sudo npm install -g pm2

# Note: nginx runs in Docker, we'll update its configuration
docker ps | grep nginx
```

### 3. Configure Nginx in Docker for DeSo Scam Report
Since nginx runs in Docker for the DeSo validator, we need to update the Docker nginx configuration:

```bash
# First, check the nginx container and find configuration directory
docker ps | grep nginx
docker exec -it <nginx_container_name> ls -la /etc/nginx/conf.d/

# Find the nginx configuration directory on host (mapped to container)
# This is typically in the DeSo deployment directory
# Check the docker-compose or docker run command for volume mounts
```

Create nginx configuration file in the host directory that maps to the container:
```bash
# Create configuration for desoscamreport subdomain
# File location depends on your Docker nginx volume mount
sudo nano /path/to/nginx/conf.d/desoscamreport.conf
```

### Nginx Configuration (`desoscamreport.conf`)
```nginx
server {
    listen 80;
    server_name desoscamreport.safetynet.social www.desoscamreport.safetynet.social;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name desoscamreport.safetynet.social www.desoscamreport.safetynet.social;

    # SSL configuration (CloudFlare origin certificates - likely already exist)
    ssl_certificate /etc/ssl/certs/cloudflare-origin.pem;
    ssl_certificate_key /etc/ssl/private/cloudflare-origin.key;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Reverse proxy to DeSo Scam Report running on host
    location / {
        proxy_pass http://host.docker.internal:3000;  # Access host from container
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static assets caching
    location /_next/static {
        alias /var/www/desoscamreport/.next/static;
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
```

**Note**: 
- DeSo Scam Report runs on the host system on port `3000` (standalone Next.js app)
- nginx runs in Docker container for the DeSo validator
- Use `host.docker.internal:3000` to access host from Docker container
- SSL certificates should already exist from validator setup for `*.safetynet.social`
- If nginx doesn't support `host.docker.internal`, use the server's actual IP address

### 4. Reload Nginx Configuration in Docker
```bash
# Test the nginx configuration
docker exec <nginx_container_name> nginx -t

# Reload nginx if configuration is valid
docker exec <nginx_container_name> nginx -s reload

# If you need to restart the entire nginx container
docker restart <nginx_container_name>
```

## CloudFlare Configuration

### 1. DNS Records
Set these DNS records in CloudFlare for `safetynet.social`:

```
Type: A
Name: desoscamreport
Content: [YOUR_HETZNER_SERVER_IP]
Proxy status: Proxied (orange cloud)

Type: CNAME  
Name: www.desoscamreport
Content: desoscamreport.safetynet.social
Proxy status: Proxied (orange cloud)
```

### 2. CloudFlare Origin Certificate
1. Go to CloudFlare Dashboard → SSL/TLS → Origin Server
2. Create Certificate for `*.safetynet.social` and `safetynet.social`
3. Download the certificate and private key
4. Upload to server:
   ```bash
   sudo mkdir -p /etc/ssl/certs /etc/ssl/private
   sudo nano /etc/ssl/certs/cloudflare-origin.pem    # Paste certificate
   sudo nano /etc/ssl/private/cloudflare-origin.key  # Paste private key
   sudo chmod 600 /etc/ssl/private/cloudflare-origin.key
   ```

### 3. CloudFlare Settings
- **SSL/TLS mode**: Full (strict)
- **Always Use HTTPS**: On
- **HSTS**: Enable with max-age 31536000
- **Minimum TLS Version**: 1.2

## Application Deployment

### 1. Clone Repository
```bash
cd /var/www
sudo git clone https://github.com/carry2web/DesoScamReport.git desoscamreport
sudo chown -R $USER:$USER /var/www/desoscamreport
cd /var/www/desoscamreport
```

### 2. Install Dependencies and Build
```bash
npm ci
npm run build
```

### 3. Environment Variables
Create production environment file:
```bash
cp .env.example .env.local
nano .env.local
```

Add your environment variables:
```env
NODE_ENV=production
NEXT_PUBLIC_DESO_NODE_URL=https://safetynet.social
NEXT_PUBLIC_IDENTITY_URL=https://identity.deso.org
NEXT_PUBLIC_APP_NAME=DeSo Scam Report
NEXT_PUBLIC_APP_DOMAIN=desoscamreport.safetynet.social

# Add your actual DeSo keys
DESO_PUBLIC_KEY=BC1YLitoF835xNLJJriQpfCQBXQzJVsqpcU7KMGnuTQiNyASu4CoSAD
DESO_SEED_HEX=your_actual_seed_hex_here
```

### 4. PM2 Configuration
Create PM2 ecosystem file:
```bash
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'desoscamreport',
    script: 'server.js',
    cwd: '/var/www/desoscamreport',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000  // First Node.js frontend on this validator server
    },
    log_file: '/var/log/pm2/desoscamreport.log',
    error_file: '/var/log/pm2/desoscamreport-error.log',
    out_file: '/var/log/pm2/desoscamreport-out.log',
    time: true
  }]
}
```

### 5. Start Application
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Deployment Script
Create automated deployment script:

```bash
nano deploy-to-hetzner.sh
chmod +x deploy-to-hetzner.sh
```

```bash
#!/bin/bash
# Automated deployment script for Hetzner

echo "🚀 Deploying DeSo Scam Report to Hetzner..."

# Navigate to project directory
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
```

## Security Considerations

### 1. Firewall (UFW)
```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 2. Auto-updates
```bash
sudo apt install unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades
```

### 3. Monitoring
```bash
# Install monitoring tools
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

## Maintenance

### Update Application
```bash
cd /var/www/desoscamreport
./deploy-to-hetzner.sh
```

### View Logs
```bash
pm2 logs desoscamreport
```

### Monitor Performance
```bash
pm2 monit
```

## Troubleshooting

### Check Application Status
```bash
pm2 status
pm2 logs desoscamreport --lines 50
```

### Check Nginx
```bash
sudo nginx -t
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### Check SSL Certificate
```bash
openssl x509 -in /etc/ssl/certs/cloudflare-origin.pem -text -noout
```

---

## Next Steps After Deployment

1. **Update CloudFlare IP**: Point `desoscamreport.safetynet.social` to your Hetzner server IP
2. **Test Domain**: Verify `https://desoscamreport.safetynet.social` loads correctly
3. **Monitor**: Watch logs and performance metrics
4. **Backup**: Setup automated backups of application and database (if any)
