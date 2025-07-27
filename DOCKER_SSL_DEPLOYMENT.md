# Docker Deployment Guide with SSL - Side-by-Side Setup

## Overview
This guide sets up DeSo Scam Report in Docker containers with automatic SSL certificate management via Let's Encrypt Certbot. The setup is designed to run alongside your existing DeSo validator services without conflicts.

## Features
- 🐳 **Containerized Application**: DeSo Scam Report runs in its own Docker container
- 🔐 **Automatic SSL**: Let's Encrypt certificates with auto-renewal
- 🔄 **Zero-Downtime Updates**: Easy application updates without service interruption
- 🌐 **Nginx Reverse Proxy**: Optimized for performance and security
- 🔧 **Side-by-Side Compatible**: Runs alongside existing DeSo validator services
- 📊 **Health Monitoring**: Built-in health checks and monitoring

## Architecture

```
Internet → CloudFlare → Nginx (Docker) → DeSo Scam Report (Docker)
                      ↓
                   Certbot (Docker) ← Let's Encrypt
```

## Prerequisites

### Server Requirements
- Docker and Docker Compose installed
- Domain: `desoscamreport.safetynet.social` pointed to your server
- Ports available: 
  - `3000` for the application (or adjust in override file)
  - `80/443` for nginx (or use `8080/8443` if conflicting with existing services)

### Existing Services Check
```bash
# Check what ports are currently in use
netstat -tuln | grep -E ":(80|443|3000|8080|8443)"

# Check existing Docker networks
docker network ls

# Check existing containers
docker ps
```

## Quick Start

### 1. Clone and Setup
```bash
cd /opt  # or your preferred directory
git clone https://github.com/carry2web/DesoScamReport.git desoscamreport
cd desoscamreport
```

### 2. Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit with your actual values
nano .env
```

Required environment variables:
```env
NODE_ENV=production
DESO_SEED_HEX=your_actual_seed_hex_here
DESO_PUBLIC_KEY=BC1YLitoF835xNLJJriQpfCQBXQzJVsqpcU7KMGnuTQiNyASu4CoSAD
NEXT_PUBLIC_DESO_NODE_URL=https://safetynet.social
NEXT_PUBLIC_IDENTITY_URL=https://identity.deso.org
NEXT_PUBLIC_APP_NAME=DeSo Scam Report
NEXT_PUBLIC_APP_DOMAIN=desoscamreport.safetynet.social
PORT=3000
```

### 3. Deploy with SSL
```bash
# Make scripts executable
chmod +x deploy-docker-ssl.sh
chmod +x deploy-docker-update.sh

# Deploy (this will request SSL certificates automatically)
./deploy-docker-ssl.sh
```

### 4. Verify Deployment
```bash
# Check all containers are running
docker-compose ps

# Test application directly
curl http://localhost:3000/api/health

# Test through nginx
curl http://localhost/api/health

# Check SSL certificate (if using standard ports)
curl -k https://localhost/api/health
```

## Configuration for Side-by-Side Deployment

If you have existing services using ports 80/443, use the override configuration:

### Option 1: Different Ports
```bash
# Use the override file to run on different ports
cp docker-compose.override.yml docker-compose.override.yml.backup

# Edit the override file to use ports 8080/8443
nano docker-compose.override.yml
```

Start with different ports:
```bash
docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d
```

### Option 2: Shared Nginx
If you want to use your existing nginx, you can run just the application:

```bash
# Run only the application container
docker-compose up -d desoscamreport

# Then configure your existing nginx to proxy to localhost:3000
```

Add this to your existing nginx configuration:
```nginx
# Add to your existing nginx
location /scamreport {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## SSL Certificate Management

### Automatic Setup
The `deploy-docker-ssl.sh` script automatically:
1. Creates necessary directories
2. Requests initial SSL certificates from Let's Encrypt
3. Configures nginx with proper SSL settings
4. Sets up automatic certificate renewal

### Manual Certificate Request
```bash
# Request new certificate manually
docker-compose run --rm certbot \
    certonly --webroot -w /var/www/certbot \
    --email admin@safetynet.social \
    --agree-tos --no-eff-email \
    -d desoscamreport.safetynet.social \
    -d www.desoscamreport.safetynet.social
```

### Certificate Renewal
Certificates automatically renew every 12 hours. To manually renew:
```bash
docker-compose exec certbot certbot renew
docker-compose exec nginx nginx -s reload
```

## Monitoring and Maintenance

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f desoscamreport
docker-compose logs -f nginx
docker-compose logs -f certbot
```

### Health Checks
```bash
# Application health
curl http://localhost:3000/api/health

# Nginx status
curl -I http://localhost

# Certificate status
docker-compose exec certbot certbot certificates
```

### Performance Monitoring
```bash
# Container resource usage
docker stats

# Nginx access logs
docker-compose exec nginx tail -f /var/log/nginx/access.log

# Application logs
docker-compose logs -f desoscamreport
```

## Updates and Maintenance

### Application Updates
```bash
# Pull latest changes and rebuild
./deploy-docker-update.sh
```

Manual update process:
```bash
# Pull latest code
git pull origin master

# Rebuild and restart
docker-compose build desoscamreport
docker-compose up -d desoscamreport

# Verify update
curl http://localhost:3000/api/health
```

### Configuration Updates
```bash
# Update nginx configuration
nano nginx/conf.d/desoscamreport.conf

# Restart nginx
docker-compose restart nginx
```

### Environment Updates
```bash
# Update environment variables
nano .env

# Restart application
docker-compose restart desoscamreport
```

## Backup and Recovery

### Backup SSL Certificates
```bash
# Backup certificates
tar -czf ssl-backup-$(date +%Y%m%d).tar.gz certbot/

# Store backup securely
```

### Application Backup
```bash
# Backup application data and logs
tar -czf app-backup-$(date +%Y%m%d).tar.gz logs/ .env docker-compose.yml
```

### Recovery
```bash
# Restore from backup
tar -xzf ssl-backup-YYYYMMDD.tar.gz
tar -xzf app-backup-YYYYMMDD.tar.gz

# Restart services
docker-compose up -d
```

## Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# Check what's using port 3000
lsof -i :3000

# Use different port in docker-compose.override.yml
```

#### SSL Certificate Issues
```bash
# Check certificate status
docker-compose exec certbot certbot certificates

# Test certificate request (staging)
docker-compose run --rm certbot \
    certonly --webroot -w /var/www/certbot \
    --staging \
    --email admin@safetynet.social \
    --agree-tos --no-eff-email \
    -d desoscamreport.safetynet.social
```

#### Application Not Starting
```bash
# Check logs
docker-compose logs desoscamreport

# Check environment variables
docker-compose exec desoscamreport env | grep DESO

# Test container directly
docker-compose exec desoscamreport node healthcheck.js
```

#### Nginx Issues
```bash
# Test nginx configuration
docker-compose exec nginx nginx -t

# Reload nginx
docker-compose exec nginx nginx -s reload

# Check nginx logs
docker-compose logs nginx
```

### Service Management

#### Stop Services
```bash
# Stop all services
docker-compose down

# Stop specific service
docker-compose stop desoscamreport
```

#### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart desoscamreport
```

#### Remove Everything
```bash
# Stop and remove containers, networks
docker-compose down

# Remove volumes too (careful - deletes SSL certificates!)
docker-compose down -v
```

## Security Considerations

### Container Security
- Application runs as non-root user (nextjs:1001)
- Health checks ensure service availability
- Resource limits can be added to docker-compose.yml

### Network Security
- Containers communicate on isolated Docker network
- nginx provides SSL termination and security headers
- Let's Encrypt provides free, auto-renewing SSL certificates

### Monitoring
```bash
# Monitor failed login attempts (if applicable)
docker-compose logs nginx | grep "40[0-9]"

# Monitor certificate expiry
docker-compose exec certbot certbot certificates
```

## CloudFlare Configuration

Ensure CloudFlare is configured for your domain:

### DNS Records
```
Type: A
Name: desoscamreport
Content: [YOUR_SERVER_IP]
Proxy status: Proxied (orange cloud)
```

### SSL/TLS Settings
- **SSL/TLS mode**: Full (strict) or Flexible
- **Always Use HTTPS**: On
- **HSTS**: Enabled
- **Minimum TLS Version**: 1.2

---

## Summary

This Docker setup provides:
- ✅ **Isolated Environment**: Runs independently of existing services
- ✅ **Automatic SSL**: Let's Encrypt with auto-renewal
- ✅ **Easy Updates**: Simple script-based deployment
- ✅ **Monitoring**: Health checks and logging
- ✅ **Security**: Best practices for container and web security
- ✅ **Scalability**: Easy to scale and modify

The application will be available at:
- **HTTP**: `http://desoscamreport.safetynet.social` (redirects to HTTPS)
- **HTTPS**: `https://desoscamreport.safetynet.social`

For support, check the logs and use the troubleshooting section above.
