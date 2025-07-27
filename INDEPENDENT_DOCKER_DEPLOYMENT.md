# DeSo Scam Report - Independent Docker Deployment

## Overview
Deploy DeSo Scam Report as an independent Docker application on Hetzner Linux server, running alongside existing DeSo validator services without conflicts.

## Architecture
```
Windows (Development) → GitHub → Hetzner Linux Server
                                      ↓
                               /opt/desoscamreport/ (separate directory)
                                      ↓
                               Docker Container (port 3000)
                                      ↓
                               Nginx Proxy → CloudFlare → Internet
```

## Server Directory Structure
```
/opt/
├── deso-validator/          # Existing DeSo validator
│   ├── docker-compose.yml  # Existing validator services
│   └── ...
└── desoscamreport/          # NEW: Independent DeSo Scam Report
    ├── docker-compose.yml  # Separate Docker setup
    ├── nginx/
    ├── certbot/
    ├── .env
    └── app files...
```

## Prerequisites

### Hetzner Server
- Linux server (Ubuntu/Debian)
- Docker and Docker Compose installed
- CloudFlare DNS: `desoscamreport.safetynet.social` → Server IP
- Separate subdirectory for independent deployment

### Port Requirements
- `3000`: DeSo Scam Report application
- `8081`: HTTP proxy (to avoid conflicts with 8080)
- `8444`: HTTPS proxy (to avoid conflicts with 8443)

## Deployment Steps

### 1. Server Setup (on Hetzner Linux)
```bash
# SSH into your Hetzner server
ssh root@your-server-ip

# Create separate directory for DeSo Scam Report
mkdir -p /opt/desoscamreport
cd /opt/desoscamreport

# Clone the repository
git clone https://github.com/carry2web/DesoScamReport.git .

# Make shell scripts executable
chmod +x *.sh

# Verify we're in the right place
pwd  # Should show: /opt/desoscamreport
ls   # Should show: docker-compose.yml, nginx/, src/, etc.
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit with production values
nano .env
```

Required `.env` contents:
```env
NODE_ENV=production
PORT=3000

# DeSo Configuration
DESO_PUBLIC_KEY=BC1YLitoF835xNLJJriQpfCQBXQzJVsqpcU7KMGnuTQiNyASu4CoSAD
DESO_SEED_HEX=your_actual_seed_hex_here
NEXT_PUBLIC_DESO_NODE_URL=https://safetynet.social
NEXT_PUBLIC_IDENTITY_URL=https://identity.deso.org
NEXT_PUBLIC_APP_NAME=DeSo Scam Report
NEXT_PUBLIC_APP_DOMAIN=desoscamreport.safetynet.social
```

### 3. Check Port Availability
```bash
# Check if ports 3000, 8081, 8444 are available
netstat -tuln | grep -E ":(3000|8081|8444)"

# If ports are free, you'll see no output
# If ports are taken, adjust docker-compose.yml accordingly
```

### 4. Deploy with Docker
```bash
# Scripts should already be executable, but verify
chmod +x deploy-docker-ssl.sh verify-server.sh test-deployment.sh

# Run deployment (this handles SSL certificates automatically)
./deploy-docker-ssl.sh
```

### 5. Verify Independent Deployment
```bash
# Check that containers are running
docker-compose ps

# Should show something like:
#       Name                 Command               State                    Ports
# desoscamreport         npm start                    Up      0.0.0.0:3000->3000/tcp
# desoscamreport-nginx   nginx -g daemon off;         Up      0.0.0.0:8081->80/tcp, 0.0.0.0:8444->443/tcp
# desoscamreport-certbot /bin/sh -c trap exit TERM;   Up

# Test application directly
curl http://localhost:3000/api/health

# Test through nginx proxy
curl http://localhost:8081/api/health
```

## Side-by-Side Verification

### Check Existing Services Don't Conflict
```bash
# List all Docker containers (existing + new)
docker ps -a

# List all Docker networks
docker network ls

# Check port usage
netstat -tuln | grep -E ":(80|443|3000|17000|17001|8081|8444)"
```

### Verify Independent Operation
```bash
# DeSo Scam Report logs (should be independent)
docker-compose logs -f desoscamreport

# Check existing DeSo validator is still running
# (from the validator directory)
cd /opt/deso-validator  # or wherever your validator is
docker-compose ps       # Existing services should still be up
```

## CloudFlare Configuration

Since `desoscamreport.safetynet.social` is already setup in CloudFlare DNS, just verify:

### 1. DNS Points to Server
```bash
# Test DNS resolution
nslookup desoscamreport.safetynet.social
# Should return your Hetzner server IP
```

### 2. CloudFlare Settings
- **SSL/TLS mode**: Full (strict) or Flexible
- **Always Use HTTPS**: On
- **Proxy status**: Proxied (orange cloud)

## Testing the Complete Setup

### 1. Test HTTP Access
```bash
# From server
curl http://localhost:8080/api/health

# From outside (if using port 8080)
curl http://desoscamreport.safetynet.social:8080/api/health
```

### 2. Test HTTPS Access
```bash
# From server
curl -k https://localhost:8443/api/health

# From outside (CloudFlare handles SSL termination)
curl https://desoscamreport.safetynet.social/api/health
```

### 3. Browser Test
Open in browser: `https://desoscamreport.safetynet.social`

## Docker Configuration Details

Our `docker-compose.yml` creates an independent setup:

```yaml
version: '3.8'

services:
  desoscamreport:
    build: .
    container_name: desoscamreport
    restart: unless-stopped
    ports:
      - "3000:3000"
    networks:
      - deso-scam-network  # Independent network
    environment:
      - NODE_ENV=production
      # ... other env vars

  nginx:
    image: nginx:alpine
    container_name: desoscamreport-nginx
    ports:
      - "8080:80"   # Different ports to avoid conflicts
      - "8443:443"
    networks:
      - deso-scam-network
    depends_on:
      - desoscamreport

networks:
  deso-scam-network:     # Separate network from validator
    driver: bridge
    name: deso-scam-network
```

## Alternative Port Configuration

If you want to use standard ports 80/443, you can:

### Option 1: Use Standard Ports (if available)
Edit `docker-compose.yml`:
```yaml
  nginx:
    ports:
      - "80:80"
      - "443:443"
```

### Option 2: Integrate with Existing Nginx
Stop the nginx container and configure existing nginx to proxy to port 3000:
```bash
# Stop our nginx container
docker-compose stop nginx

# Add to existing nginx configuration
location /scamreport {
    proxy_pass http://localhost:3000;
    # ... proxy headers
}
```

## Monitoring and Maintenance

### View Logs
```bash
cd /opt/desoscamreport
docker-compose logs -f
```

### Update Application
```bash
cd /opt/desoscamreport
./deploy-docker-update.sh
```

### Stop/Start Services
```bash
# Stop
docker-compose down

# Start
docker-compose up -d

# Restart
docker-compose restart
```

## Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# Check what's using conflicting ports
lsof -i :3000
lsof -i :8080
lsof -i :8443

# Solution: Edit docker-compose.yml to use different ports
```

#### DNS Issues
```bash
# Test DNS resolution
dig desoscamreport.safetynet.social
nslookup desoscamreport.safetynet.social

# Should return your server IP
```

#### SSL Certificate Issues
```bash
# Check certificate status
docker-compose exec certbot certbot certificates

# Force certificate renewal
docker-compose exec certbot certbot renew --force-renewal
```

#### Application Not Starting
```bash
# Check application logs
docker-compose logs desoscamreport

# Check environment variables
docker-compose exec desoscamreport env | grep DESO

# Test health endpoint
docker-compose exec desoscamreport curl http://localhost:3000/api/health
```

## Summary

This setup ensures:

✅ **Independent Deployment**: Runs in `/opt/desoscamreport/` separate from validator  
✅ **No Conflicts**: Uses separate Docker network and different ports  
✅ **Easy SSL**: Automatic Let's Encrypt certificates  
✅ **CloudFlare Ready**: Works with existing DNS setup  
✅ **Maintainable**: Easy updates and monitoring  
✅ **Side-by-Side**: Doesn't interfere with existing DeSo validator  

The application will be accessible at:
- **Direct**: `http://server-ip:8081` or `https://server-ip:8444`
- **CloudFlare**: `https://desoscamreport.safetynet.social`
