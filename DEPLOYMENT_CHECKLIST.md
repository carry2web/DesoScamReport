# 🚀 DeSo Scam Report Deployment Checklist

## Phase 1: Azure Acceptance Testing ✅

Current status: **DEPLOYED**
- URL: `https://desoscamreport-a2gwhugpd4fwbmct.westeurope-01.azurewebsites.net`
- Status: Ready for acceptance testing

## Phase 2: Hetzner Production Setup

### Prerequisites Checklist
- [ ] Hetzner dedicated server with Ubuntu/Debian
- [ ] SSH access to server (root or sudo user)
- [ ] Domain `safetynet.social` managed in CloudFlare
- [ ] CloudFlare account access

### Step 1: Server Preparation
```bash
# 1. Connect to your Hetzner server
ssh user@your-hetzner-ip

# 2. Download and run server info script
wget https://raw.githubusercontent.com/carry2web/DesoScamReport/master/check-server.sh
chmod +x check-server.sh
./check-server.sh
```

**Checklist:**
- [ ] Server IP address noted: `___________________`
- [ ] Ubuntu/Debian version confirmed
- [ ] SSH access working

### Step 2: Install Dependencies
```bash
# Run the deployment script
wget https://raw.githubusercontent.com/carry2web/DesoScamReport/master/deploy-hetzner.sh
chmod +x deploy-hetzner.sh
./deploy-hetzner.sh
```

**Checklist:**
- [ ] Node.js 20 LTS installed
- [ ] PM2 installed
- [ ] Nginx installed
- [ ] Application cloned to `/var/www/desoscamreport`
- [ ] Dependencies installed
- [ ] Application built successfully

### Step 3: CloudFlare DNS Configuration

Go to CloudFlare Dashboard → DNS → Records

#### Add A Record
```
Type: A
Name: desoscamreport
Content: [YOUR_HETZNER_SERVER_IP]
Proxy status: ✅ Proxied (orange cloud)
```

#### Add CNAME Record
```
Type: CNAME
Name: www.desoscamreport
Content: desoscamreport.safetynet.social
Proxy status: ✅ Proxied (orange cloud)
```

**Checklist:**
- [ ] A record added for `desoscamreport`
- [ ] CNAME record added for `www.desoscamreport`
- [ ] Both records have proxy enabled (orange cloud)
- [ ] DNS propagation verified (can take 5-15 minutes)

### Step 4: CloudFlare SSL Configuration

#### SSL/TLS Settings
Navigate to: **SSL/TLS** → **Overview**
- [ ] Encryption mode set to: **Full (strict)**

#### Edge Certificates
Navigate to: **SSL/TLS** → **Edge Certificates**
- [ ] Always Use HTTPS: **Enabled**
- [ ] HSTS: **Enabled** (Max Age: 31536000)
- [ ] Minimum TLS Version: **1.2**

#### Create Origin Certificate
Navigate to: **SSL/TLS** → **Origin Server** → **Create Certificate**

**Configuration:**
- [ ] Private key type: `RSA (2048)`
- [ ] Hostnames: `*.safetynet.social` and `safetynet.social`
- [ ] Certificate Validity: `15 years`
- [ ] Certificate downloaded and saved
- [ ] Private key downloaded and saved

### Step 5: Install SSL Certificate on Server
```bash
# Create SSL directories
sudo mkdir -p /etc/ssl/certs /etc/ssl/private

# Upload certificate (paste the certificate content)
sudo nano /etc/ssl/certs/cloudflare-origin.pem

# Upload private key (paste the private key content)
sudo nano /etc/ssl/private/cloudflare-origin.key

# Set proper permissions
sudo chmod 644 /etc/ssl/certs/cloudflare-origin.pem
sudo chmod 600 /etc/ssl/private/cloudflare-origin.key
```

**Checklist:**
- [ ] Certificate file created at `/etc/ssl/certs/cloudflare-origin.pem`
- [ ] Private key file created at `/etc/ssl/private/cloudflare-origin.key`
- [ ] Correct permissions set

### Step 6: Configure Environment Variables
```bash
cd /var/www/desoscamreport
nano .env.local
```

**Required variables:**
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

**Checklist:**
- [ ] Environment file created
- [ ] All required variables set
- [ ] DeSo keys configured (keep them secret!)

### Step 7: Start Application
```bash
# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Enable and start Nginx
sudo systemctl enable nginx
sudo systemctl reload nginx
```

**Checklist:**
- [ ] PM2 application started
- [ ] PM2 configured to auto-start on reboot
- [ ] Nginx configuration loaded
- [ ] Nginx restarted successfully

### Step 8: Configure Firewall
```bash
# Setup UFW firewall
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

**Checklist:**
- [ ] Firewall configured
- [ ] Required ports opened (22, 80, 443)
- [ ] Firewall enabled

### Step 9: Testing & Verification

#### DNS Test
```bash
# Check DNS resolution
nslookup desoscamreport.safetynet.social
dig desoscamreport.safetynet.social
```

#### Application Test
```bash
# Check if app is running
pm2 status
pm2 logs desoscamreport

# Test HTTP response
curl -I http://desoscamreport.safetynet.social
curl -I https://desoscamreport.safetynet.social
```

#### Browser Test
- [ ] Visit: `https://desoscamreport.safetynet.social`
- [ ] Verify SSL certificate (lock icon in browser)
- [ ] Test WWW redirect: `https://www.desoscamreport.safetynet.social`
- [ ] Check all pages load correctly
- [ ] Test DeSo authentication

**Checklist:**
- [ ] DNS resolves correctly
- [ ] PM2 shows application running
- [ ] HTTP redirects to HTTPS
- [ ] SSL certificate valid
- [ ] Application loads in browser
- [ ] All functionality working

### Step 10: Performance & Security

#### CloudFlare Optimization
Navigate to: **Speed** → **Optimization**
- [ ] Auto Minify enabled (JS, CSS, HTML)
- [ ] Brotli compression enabled

#### Security Settings
Navigate to: **Security** → **Settings**
- [ ] Security Level: Medium
- [ ] Bot Fight Mode: Enabled

**Final Checklist:**
- [ ] Application fully functional at `https://desoscamreport.safetynet.social`
- [ ] SSL/TLS A+ rating (test at ssllabs.com)
- [ ] Performance optimized
- [ ] Monitoring configured
- [ ] Backup plan established

---

## 🎯 Success Criteria

✅ **Azure Acceptance**: Working at Azure URL for testing
✅ **Hetzner Production**: Working at `https://desoscamreport.safetynet.social`
✅ **Performance**: Fast loading times via CloudFlare CDN
✅ **Security**: SSL/TLS encryption and CloudFlare protection
✅ **Reliability**: PM2 process management and auto-restart

## 📞 Support Commands

### Check Application Status
```bash
pm2 status
pm2 logs desoscamreport --lines 50
```

### Check Server Status
```bash
./check-server.sh
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### Update Application
```bash
cd /var/www/desoscamreport
./deploy-update.sh
```

---

## 🚨 Troubleshooting Quick Reference

| Issue | Command | Solution |
|-------|---------|----------|
| App not starting | `pm2 logs desoscamreport` | Check environment variables |
| 502 Bad Gateway | `pm2 restart desoscamreport` | Restart application |
| SSL errors | `sudo nginx -t` | Check Nginx config |
| DNS not resolving | `nslookup domain` | Wait for propagation |
| CloudFlare 520 error | `sudo ufw status` | Check firewall rules |

**Emergency Contact:**
- GitHub Issues: https://github.com/carry2web/DesoScamReport/issues
- Documentation: Check `CLOUDFLARE_SETUP.md` and `HETZNER_DEPLOYMENT.md`
