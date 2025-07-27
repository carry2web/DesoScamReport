# DeSo Scam Report - Docker Deployment

## Quick Deployment Guide

### For Windows Development → Hetzner Linux Production

This setup allows you to develop on Windows and deploy to a Linux server using Docker containers that run independently alongside your existing DeSo validator.

## 🚀 Quick Start

### 1. On Hetzner Server (Linux)
```bash
# Create independent directory
mkdir -p /opt/desoscamreport
cd /opt/desoscamreport

# Clone repository
git clone https://github.com/carry2web/DesoScamReport.git .

# Verify server readiness
chmod +x verify-server.sh
./verify-server.sh

# Configure environment
cp .env.example .env
nano .env  # Add your DESO_SEED_HEX and other values

# Deploy with SSL
chmod +x deploy-docker-ssl.sh
./deploy-docker-ssl.sh

# Test deployment
chmod +x test-deployment.sh
./test-deployment.sh
```

### 2. Access Your Application
- **Production**: `https://desoscamreport.safetynet.social`
- **Local Test**: `http://server-ip:8080` or `https://server-ip:8443`

## 📁 Project Structure

```
/opt/desoscamreport/              # Independent deployment directory
├── docker-compose.yml           # Docker services configuration
├── nginx/                       # Nginx configuration
│   ├── nginx.conf
│   └── conf.d/
│       └── desoscamreport.conf
├── certbot/                     # SSL certificates (auto-created)
├── logs/                        # Application logs
├── .env                         # Environment variables
├── deploy-docker-ssl.sh         # Main deployment script
├── verify-server.sh             # Pre-deployment checks
└── test-deployment.sh           # Post-deployment testing
```

## 🔧 Configuration

### Environment Variables (.env)
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

### Ports Used
- `3000`: DeSo Scam Report application
- `8080`: HTTP proxy (external access)
- `8443`: HTTPS proxy (external access)

## 🐳 Docker Services

### Services Created
1. **desoscamreport**: Main Next.js application
2. **desoscamreport-nginx**: Nginx reverse proxy with SSL
3. **desoscamreport-certbot**: Let's Encrypt SSL certificate management

### Independent Operation
- Uses separate Docker network: `deso-scam-network`
- No interference with existing DeSo validator services
- Separate containers with unique names

## 🔧 Maintenance

### Update Application
```bash
cd /opt/desoscamreport
./deploy-docker-update.sh
```

### View Logs
```bash
docker-compose logs -f                    # All services
docker-compose logs -f desoscamreport     # Application only
docker-compose logs -f nginx              # Nginx only
```

### Restart Services
```bash
docker-compose restart                    # All services
docker-compose restart desoscamreport     # Application only
```

### Stop Services
```bash
docker-compose down                       # Stop all
docker-compose stop desoscamreport        # Stop application only
```

## 🛠️ Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# Check what's using ports
netstat -tuln | grep -E ":(3000|8080|8443)"

# Solution: Edit docker-compose.yml to use different ports
```

#### Application Not Starting
```bash
# Check logs
docker-compose logs desoscamreport

# Check environment
docker-compose exec desoscamreport env | grep DESO

# Test health endpoint
curl http://localhost:3000/api/health
```

#### SSL Issues
```bash
# Check certificates
docker-compose exec certbot certbot certificates

# Force renewal
docker-compose exec certbot certbot renew --force-renewal
```

### Useful Commands
```bash
# Container status
docker-compose ps

# Resource usage
docker stats

# Test connectivity
curl http://localhost:8080/api/health
curl -k https://localhost:8443/api/health

# External test
curl https://desoscamreport.safetynet.social/api/health
```

## 🌐 CloudFlare Setup

Ensure CloudFlare DNS is configured:
- **Type**: A Record
- **Name**: desoscamreport
- **Content**: [Your Hetzner Server IP]
- **Proxy**: Enabled (orange cloud)

## ✅ Verification Checklist

- [ ] Server has Docker and Docker Compose installed
- [ ] Ports 3000, 8080, 8443 are available
- [ ] `.env` file is configured with actual values
- [ ] CloudFlare DNS points to server IP
- [ ] `verify-server.sh` passes all checks
- [ ] `deploy-docker-ssl.sh` completes successfully
- [ ] `test-deployment.sh` passes all tests
- [ ] Application accessible at `https://desoscamreport.safetynet.social`

## 📞 Support

If you encounter issues:
1. Run `./verify-server.sh` to check server setup
2. Run `./test-deployment.sh` to diagnose problems
3. Check logs with `docker-compose logs -f`
4. Verify DNS with `nslookup desoscamreport.safetynet.social`

---

**Ready to deploy?** Run `./verify-server.sh` first, then `./deploy-docker-ssl.sh`!
