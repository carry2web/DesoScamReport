# Quick Deployment to DeSo Validator Server

## Overview
Deploy DeSo Scam Report to your existing Hetzner server that hosts the DeSo validator (safetynet.social).

## 🚀 **Quick Setup Steps**

### Step 1: Add CloudFlare DNS Record
In CloudFlare Dashboard → DNS → Records, add:

```
Type: A
Name: desoscamreport
Content: [YOUR_HETZNER_VALIDATOR_IP] (same as safetynet.social)
Proxy status: ✅ Proxied (orange cloud)
```

### Step 2: Deploy Application on Server
SSH to your Hetzner server and run:

```bash
# Download and run deployment script
wget https://raw.githubusercontent.com/carry2web/DesoScamReport/master/deploy-hetzner.sh
chmod +x deploy-hetzner.sh
./deploy-hetzner.sh
```

### Step 3: Check Current Setup
```bash
# Check DeSo validator processes
ps aux | grep -E "(deso|bitclout)"

# Check Python monitoring scripts
ps aux | grep python

# Check ports in use (validator typically uses 17000, 17001, 18000, 18001)
netstat -tuln | grep -E "(3000|17000|17001|18000|18001)"

# Check nginx sites
ls -la /etc/nginx/sites-enabled/
```

### Step 4: Configure Environment
```bash
cd /var/www/desoscamreport
nano .env.local
```

Add your DeSo keys:
```env
NODE_ENV=production
NEXT_PUBLIC_DESO_NODE_URL=https://safetynet.social
NEXT_PUBLIC_IDENTITY_URL=https://identity.deso.org
NEXT_PUBLIC_APP_NAME=DeSo Scam Report
NEXT_PUBLIC_APP_DOMAIN=desoscamreport.safetynet.social

DESO_PUBLIC_KEY=BC1YLitoF835xNLJJriQpfCQBXQzJVsqpcU7KMGnuTQiNyASu4CoSAD
DESO_SEED_HEX=your_actual_seed_hex_here
```

### Step 5: Start Application
```bash
# Build and start
npm run build
pm2 start ecosystem.config.js
pm2 save

# Reload nginx
sudo systemctl reload nginx
```

### Step 6: Test
```bash
# Check app status
pm2 status

# Test locally
curl -I http://localhost:3000

# Test domain (after DNS propagates)
curl -I https://desoscamreport.safetynet.social
```

## 📋 **Expected Setup After Deployment**

### **Server Layout:**
```
Hetzner DeSo Validator Server (safetynet.social)
├── DeSo Validator Node (ports 17000, 17001, 18000, 18001)
├── Python DeSoMonitor Script (background process)
└── DeSo Scam Report Frontend (port 3000) → desoscamreport.safetynet.social
```

### **Process Overview:**
```bash
ps aux | grep -E "(deso|python|node)"
# Should show:
# ├── deso validator processes
# ├── python monitoring script
# └── node (DeSo Scam Report)
```

### **Nginx Virtual Hosts:**
```bash
ls /etc/nginx/sites-enabled/
# Should show:
# ├── safetynet.social (validator main site)
# ├── possibly other subdomains
# └── desoscamreport (new)
```

## 🔧 **Port Configuration**

- **DeSo Validator**: Ports 17000, 17001, 18000, 18001 (existing)
- **Python Monitor**: Background process (existing)
- **DeSo Scam Report**: Port 3000 (new)
- **Nginx**: Ports 80/443 (shared for all domains)

## ⚡ **Quick Commands**

### Update DeSo Scam Report
```bash
cd /var/www/desoscamreport
./deploy-update.sh
```

### Check Both Validator and App
```bash
# Check DeSo validator status
ps aux | grep deso

# Check Python monitoring
ps aux | grep python

# Check DeSo Scam Report
pm2 status
pm2 logs desoscamreport --lines 10
```

### Restart Services
```bash
# Restart only the web app (don't touch validator!)
pm2 restart desoscamreport

# If needed, restart nginx (be careful on production validator)
sudo systemctl reload nginx
```

## 🚨 **Troubleshooting**

### Port Conflicts
If port 3000 is in use:
```bash
# Check what's using port 3000
sudo lsof -i :3000

# Use different port (update ecosystem.config.js and nginx config)
nano ecosystem.config.js  # Change PORT to 3001 or 3002
sudo nano /etc/nginx/sites-available/desoscamreport  # Change proxy_pass accordingly
```

### DNS Not Resolving
```bash
# Check DNS propagation
nslookup desoscamreport.safetynet.social
# Wait 5-15 minutes for CloudFlare propagation
```

### SSL Issues
```bash
# SSL certs should already exist from validator setup
ls -la /etc/ssl/certs/cloudflare-origin.pem
ls -la /etc/ssl/private/cloudflare-origin.key

# If not, they may be in a different location
find /etc -name "*cloudflare*" -o -name "*ssl*" | grep -E "\.(pem|key|crt)$"
```

---

## ✅ **Success Criteria**

After successful deployment:
- ✅ DeSo Validator continues running normally (safetynet.social)
- ✅ Python monitoring scripts continue running
- ✅ DeSo Scam Report works at `https://desoscamreport.safetynet.social`
- ✅ No conflicts with validator operations
- ✅ SSL certificates shared between domains
- ✅ No downtime for existing services

**Total deployment time: ~10 minutes** (after DNS propagation)
