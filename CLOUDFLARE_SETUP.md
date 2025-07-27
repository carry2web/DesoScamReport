# CloudFlare Setup Guide for DeSo Scam Report

## Overview
Step-by-step guide to configure CloudFlare for `desoscamreport.safetynet.social` pointing to your Hetzner server.

## Prerequisites
- CloudFlare account with `safetynet.social` domain
- Hetzner server IP address
- Access to CloudFlare dashboard

## Step 1: DNS Configuration

### 1.1 Add DNS Records
In CloudFlare Dashboard → DNS → Records:

#### Main Domain Record
```
Type: A
Name: desoscamreport
Content: [YOUR_HETZNER_SERVER_IP]
Proxy status: ✅ Proxied (orange cloud icon)
TTL: Auto
```

#### WWW Subdomain Record
```
Type: CNAME
Name: www.desoscamreport
Content: desoscamreport.safetynet.social
Proxy status: ✅ Proxied (orange cloud icon)
TTL: Auto
```

### 1.2 Verify DNS Records
After adding, you should see:
- ✅ `desoscamreport.safetynet.social` → `[Your Hetzner IP]`
- ✅ `www.desoscamreport.safetynet.social` → `desoscamreport.safetynet.social`

## Step 2: SSL/TLS Configuration

### 2.1 SSL/TLS Settings
Navigate to: **SSL/TLS** → **Overview**

**Set Encryption Mode:**
```
🔒 Full (strict)
```
This ensures end-to-end encryption between CloudFlare and your server.

### 2.2 Always Use HTTPS
Navigate to: **SSL/TLS** → **Edge Certificates**

**Enable:**
- ✅ Always Use HTTPS
- ✅ HTTP Strict Transport Security (HSTS)
  - Max Age: `31536000` (1 year)
  - Include Subdomains: ✅
  - Preload: ✅

### 2.3 Minimum TLS Version
Set minimum TLS version to: **TLS 1.2**

## Step 3: Origin Certificate (For Your Server)

### 3.1 Create Origin Certificate
Navigate to: **SSL/TLS** → **Origin Server** → **Create Certificate**

**Configuration:**
- Private key type: `RSA (2048)`
- Hostnames: 
  ```
  *.safetynet.social
  safetynet.social
  ```
- Certificate Validity: `15 years`

### 3.2 Download Certificate Files
You'll get two files:
1. **Certificate** (save as `cloudflare-origin.pem`)
2. **Private Key** (save as `cloudflare-origin.key`)

### 3.3 Install on Hetzner Server
Upload these files to your server:

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
sudo chown root:root /etc/ssl/certs/cloudflare-origin.pem
sudo chown root:root /etc/ssl/private/cloudflare-origin.key
```

## Step 4: Performance Optimization

### 4.1 Speed Settings
Navigate to: **Speed** → **Optimization**

**Enable:**
- ✅ Auto Minify
  - ✅ JavaScript
  - ✅ CSS
  - ✅ HTML
- ✅ Brotli compression

### 4.2 Caching
Navigate to: **Caching** → **Configuration**

**Settings:**
- Caching Level: `Standard`
- Browser Cache TTL: `1 month`

### 4.3 Page Rules (Optional)
Navigate to: **Rules** → **Page Rules**

Create rule for static assets:
```
URL: desoscamreport.safetynet.social/_next/static/*
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month
  - Browser Cache TTL: 1 month
```

## Step 5: Security Configuration

### 5.1 Security Level
Navigate to: **Security** → **Settings**

**Set Security Level:** `Medium`

### 5.2 Bot Fight Mode
Navigate to: **Security** → **Bots**

**Enable:** ✅ Bot Fight Mode

### 5.3 DDoS Protection
Navigate to: **Security** → **DDoS**

DDoS protection is automatically enabled with CloudFlare.

## Step 6: Firewall Rules (Optional)

### 6.1 Country Blocking (if needed)
Navigate to: **Security** → **WAF** → **Custom Rules**

Example rule to block specific countries:
```
Rule name: Block High-Risk Countries
Field: Country
Operator: equals
Value: [Select countries to block]
Action: Block
```

### 6.2 Rate Limiting
Create rate limiting rule:
```
Rule name: API Rate Limit
Field: URI Path
Operator: equals
Value: /api/*
Rate: 100 requests per minute
Action: Challenge
```

## Step 7: Monitoring & Analytics

### 7.1 Analytics
Navigate to: **Analytics & Logs** → **Web Analytics**

Enable Web Analytics to monitor:
- Page views
- Unique visitors
- Top pages
- Referrers
- Geographic data

### 7.2 Real User Monitoring (RUM)
Enable in: **Speed** → **Optimization** → **Enhanced HTTP/2 Prioritization**

## Step 8: Deployment Testing

### 8.1 DNS Propagation Check
Test DNS propagation:
```bash
# Check DNS resolution
nslookup desoscamreport.safetynet.social

# Check from different locations
dig @8.8.8.8 desoscamreport.safetynet.social
dig @1.1.1.1 desoscamreport.safetynet.social
```

### 8.2 SSL Test
Verify SSL configuration:
```bash
# Test SSL certificate
openssl s_client -connect desoscamreport.safetynet.social:443 -servername desoscamreport.safetynet.social

# Online SSL test
# Visit: https://www.ssllabs.com/ssltest/
```

### 8.3 Performance Test
Test page load times:
```bash
# Command line test
curl -w "@curl-format.txt" -o /dev/null -s "https://desoscamreport.safetynet.social"

# Online tests:
# - GTmetrix: https://gtmetrix.com/
# - PageSpeed Insights: https://pagespeed.web.dev/
```

## Troubleshooting Guide

### Common Issues & Solutions

#### DNS Not Resolving
```bash
# Clear local DNS cache
sudo systemctl flush-dns  # Ubuntu
ipconfig /flushdns        # Windows

# Check CloudFlare DNS status
# CloudFlare Dashboard → Overview → Domain Status
```

#### SSL Errors
```bash
# Verify certificate on server
sudo openssl x509 -in /etc/ssl/certs/cloudflare-origin.pem -text -noout

# Check Nginx SSL configuration
sudo nginx -t
sudo systemctl reload nginx
```

#### 502 Bad Gateway
```bash
# Check if application is running
pm2 status

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Check application logs
pm2 logs desoscamreport
```

#### CloudFlare 520 Error
This indicates CloudFlare can't connect to your origin server:
```bash
# Check firewall
sudo ufw status

# Ensure ports 80 and 443 are open
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check if Nginx is running
sudo systemctl status nginx
```

## Maintenance Checklist

### Weekly Tasks
- [ ] Check SSL certificate expiry (15 years for CloudFlare Origin)
- [ ] Review analytics for unusual traffic patterns
- [ ] Check application performance metrics

### Monthly Tasks
- [ ] Update server packages: `sudo apt update && sudo apt upgrade`
- [ ] Review CloudFlare security logs
- [ ] Check application updates: `cd /var/www/desoscamreport && ./deploy-update.sh`

### Quarterly Tasks
- [ ] Review and update firewall rules
- [ ] Backup configuration files
- [ ] Performance optimization review

## Quick Reference Commands

### CloudFlare API (Optional)
If you want to automate DNS updates:
```bash
# Install jq for JSON parsing
sudo apt install jq

# Example: Update A record via API
curl -X PUT "https://api.cloudflare.com/client/v4/zones/ZONE_ID/dns_records/RECORD_ID" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"type":"A","name":"desoscamreport","content":"NEW_IP_ADDRESS","proxied":true}'
```

### Health Check Script
Create a simple health check:
```bash
#!/bin/bash
# health-check.sh

URL="https://desoscamreport.safetynet.social"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $URL)

if [ $STATUS -eq 200 ]; then
    echo "✅ Site is UP ($STATUS)"
else
    echo "❌ Site is DOWN ($STATUS)"
    # Add notification logic here (email, Slack, etc.)
fi
```

---

## Summary

Once configured, your setup will provide:
- ✅ **Global CDN**: Fast content delivery worldwide
- ✅ **DDoS Protection**: Automatic protection against attacks
- ✅ **SSL/TLS**: End-to-end encryption
- ✅ **Performance**: Optimized caching and compression
- ✅ **Analytics**: Detailed traffic insights
- ✅ **Security**: Web Application Firewall and bot protection

Your final architecture:
```
Users → CloudFlare CDN → Hetzner Server (Nginx) → Next.js App
```

**Access URLs:**
- Production: `https://desoscamreport.safetynet.social`
- WWW Redirect: `https://www.desoscamreport.safetynet.social` → redirects to main domain
