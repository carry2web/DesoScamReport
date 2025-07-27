# Docker-based Deployment for DeSo Validator Server

## Overview
Add DeSo Scam Report as a new container to your existing DeSo validator Docker setup.

## Current Architecture Analysis
Your server runs a complete DeSo ecosystem with:
- **Backend**: DeSo node (ports 17000/17001)
- **Frontend**: MyDesoSpace frontend (port 8080)
- **Identity**: DeSo Identity service (port 8080)
- **Explorer**: DeSo explorer (port 3000)
- **Nginx**: Reverse proxy handling SSL/routing
- **PostgreSQL**: Data handler
- **Certbot**: SSL certificate management

## Integration Approach

### Option 1: Add as Docker Container (Recommended)

#### 1. Add DeSo Scam Report to docker-compose.yml

Add this service to your existing `docker-compose.yml`:

```yaml
  desoscamreport:
    build:
      context: .
      dockerfile: Dockerfile.desoscamreport
    container_name: desoscamreport
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_DESO_NODE_URL=https://safetynet.social
      - NEXT_PUBLIC_IDENTITY_URL=https://identity.safetynet.social
      - NEXT_PUBLIC_APP_NAME=DeSo Scam Report
      - NEXT_PUBLIC_APP_DOMAIN=desoscamreport.safetynet.social
      - DESO_PUBLIC_KEY=BC1YLitoF835xNLJJriQpfCQBXQzJVsqpcU7KMGnuTQiNyASu4CoSAD
      - DESO_SEED_HEX=your_actual_seed_hex_here
    expose:
      - "3000"
    depends_on:
      - backend
    networks:
      internal:
        ipv4_address: 172.20.0.9
```

#### 2. Create Dockerfile.desoscamreport

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Start the application
CMD ["npm", "start"]
```

#### 3. Update Nginx Configuration

Add this location block to your nginx configuration to route `desoscamreport.safetynet.social`:

```nginx
# Add to your existing nginx.conf or default.conf
server {
    listen 443 ssl http2;
    server_name desoscamreport.safetynet.social;

    # SSL configuration (using existing certificates)
    ssl_certificate /etc/letsencrypt/live/safetynet.social/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/safetynet.social/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

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
    }
}

# HTTP redirect
server {
    listen 80;
    server_name desoscamreport.safetynet.social;
    return 301 https://$server_name$request_uri;
}
```

### Option 2: Deploy Directly on Host (Alternative)

If you prefer not to containerize DeSo Scam Report:

#### 1. Deploy on Host System
```bash
# Clone repository to host (outside Docker)
cd /opt
sudo git clone https://github.com/carry2web/DesoScamReport.git
cd DesoScamReport

# Install Node.js 20 on host if not present
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install and build
npm ci
npm run build

# Install PM2 and start
sudo npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 2. Update Docker Nginx Configuration

Add volume mount to access the host-deployed app:

```yaml
# Update nginx service in docker-compose.yml
nginx:
  image: nginx:latest
  container_name: nginx
  restart: unless-stopped
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf:ro
    - ./default.conf:/etc/nginx/conf.d/default.conf:ro
    - ./data/certbot/www:/var/www/certbot:ro
    - ./data/certbot/conf:/etc/letsencrypt:ro
    - ./data/certbot/logs:/var/log/letsencrypt:ro
    - ./monitor-tool:/var/www/html/monitor-tool:ro
  extra_hosts:
    - "host.docker.internal:host-gateway"  # Allow access to host
  networks:
    internal:
      ipv4_address: 172.20.0.7
```

Then in nginx config, proxy to host:
```nginx
location / {
    proxy_pass http://host.docker.internal:3000;
    # ... rest of proxy config
}
```

## Deployment Steps

### For Docker Container Approach:

1. **Add application files to your validator server**
```bash
# On your Hetzner server
cd /path/to/your/docker-compose/directory
git clone https://github.com/carry2web/DesoScamReport.git desoscamreport-source
```

2. **Create Dockerfile**
```bash
cp desoscamreport-source/Dockerfile.desoscamreport ./
```

3. **Update docker-compose.yml**
Add the desoscamreport service as shown above

4. **Update nginx configuration**
Add the new server block for desoscamreport.safetynet.social

5. **Update certbot for new domain**
```bash
# Add desoscamreport.safetynet.social to your SSL certificate
# Update your certbot renewal script to include the new subdomain
```

6. **Deploy**
```bash
# Build and start the new container
docker-compose up -d --build desoscamreport

# Reload nginx to pick up config changes
docker-compose exec nginx nginx -s reload
```

### For Host Deployment Approach:

1. **Follow HETZNER_DEPLOYMENT.md** but with these modifications:
   - Port 3000 might conflict with explorer container
   - Use port 3001 instead
   - Update nginx container config to proxy to host

## SSL Certificate Management

Since you're using certbot in a container, you'll need to:

1. **Update certbot configuration** to include the new subdomain
2. **Ensure SSL certificates cover** `desoscamreport.safetynet.social`
3. **Modify the certbot renewal process** if needed

## Network Considerations

- **Docker Internal Network**: 172.20.0.0/16
- **Available IP**: 172.20.0.9 (for new container)
- **Port Conflicts**: Explorer uses 3000, so be careful with port allocation

## Monitoring Integration

Since you have existing monitoring, consider:
- **Adding DeSo Scam Report logs** to your monitoring stack
- **Health checks** for the new container
- **Resource monitoring** to ensure it doesn't impact validator performance

## Recommended Approach

I recommend **Option 1 (Docker Container)** because:
✅ Consistent with your existing architecture
✅ Better isolation and resource management
✅ Easier to manage with docker-compose
✅ Won't interfere with validator operations
✅ Easier rollbacks and updates

Would you like me to create the specific files needed for the Docker container approach?
