# Azure Deployment Guide for DeSo Scam Report

## Prerequisites

1. **Azure Account**: Free Azure account with Web App service
2. **GitHub Repository**: Code pushed to GitHub repository  
3. **CloudFlare Account**: For domain management
4. **Domain**: `desoscamreport.safetynet.social`

## Azure Web App Setup

### 1. Create Azure Web App

```bash
# Using Azure CLI (optional)
az webapp create \
  --resource-group myResourceGroup \
  --plan myAppServicePlan \
  --name desoscamreport-webapp \
  --runtime "NODE|20-lts"
```

Or use Azure Portal:
1. Go to **App Services** → **Create**
2. **Runtime Stack**: Node 20 LTS
3. **Operating System**: Linux
4. **App Service Plan**: Free F1

### 2. Configure App Settings

In Azure Portal → Your Web App → **Configuration** → **Application settings**:

```
NODE_ENV=production
WEBSITE_NODE_DEFAULT_VERSION=~20
SCM_DO_BUILD_DURING_DEPLOYMENT=true
NEXT_PUBLIC_DESO_NODE_URL=https://node.deso.org
NEXT_PUBLIC_IDENTITY_URL=https://identity.deso.org
NEXT_PUBLIC_APP_NAME=DeSo Scam Report
NEXT_PUBLIC_APP_DOMAIN=desoscamreport.safetynet.social
```

### 3. Deployment Options

#### Option A: GitHub Actions (Recommended)

1. Go to **Deployment Center** in Azure Portal
2. Choose **GitHub** as source
3. Select your repository and branch
4. Download the publish profile
5. Add `AZURE_WEBAPP_PUBLISH_PROFILE` to GitHub Secrets

#### Option B: Continuous Deployment

1. **Deployment Center** → **GitHub**
2. Authorize and select repository
3. Azure will auto-configure build pipeline

#### Option C: Manual Deployment

```bash
# Build locally
npm run build

# Deploy using Azure CLI
az webapp deployment source config-zip \
  --resource-group myResourceGroup \
  --name desoscamreport-webapp \
  --src build.zip
```

## CloudFlare Domain Setup

### 1. Add Domain to CloudFlare

1. **Add Site**: `safetynet.social`
2. **Change Nameservers** at your domain registrar
3. **DNS Records**:

```
Type: CNAME
Name: desoscamreport
Target: desoscamreport-webapp.azurewebsites.net
Proxy: Enabled (Orange Cloud)
```

### 2. SSL/TLS Configuration

1. **SSL/TLS** → **Overview** → **Full (strict)**
2. **Edge Certificates** → **Always Use HTTPS**: On
3. **HSTS**: Enable with max-age 31536000

### 3. Performance Optimization

1. **Speed** → **Optimization**:
   - Auto Minify: CSS, HTML, JavaScript
   - Brotli: On
   - Early Hints: On

2. **Caching** → **Configuration**:
   - Caching Level: Standard
   - Browser TTL: 4 hours
   - Edge TTL: 2 hours

## Azure Web App Configuration

### Custom Domain Setup

1. **Custom domains** → **Add custom domain**
2. Domain: `desoscamreport.safetynet.social`
3. **SSL binding**: SNI SSL with CloudFlare origin certificate

### Performance Settings

1. **Configuration** → **General settings**:
   - Stack: Node
   - Version: 20 LTS
   - Always On: On (if not on Free tier)

2. **Monitoring** → **Application Insights**: Enable

## Verification Steps

### 1. Health Check

Your app should be accessible at:
- `https://desoscamreport-webapp.azurewebsites.net`
- `https://desoscamreport.safetynet.social`

### 2. Test Functionality

1. **DeSo Authentication**: Login with DeSo Identity
2. **Report Submission**: Submit a test scammer report
3. **About Page**: Check comprehensive documentation
4. **API Endpoints**: Test `/api/reports` endpoints

### 3. Performance Verification

```bash
# Load testing
curl -w "@curl-format.txt" -o /dev/null -s "https://desoscamreport.safetynet.social"

# SSL verification
curl -I https://desoscamreport.safetynet.social
```

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Node version (20 LTS)
   - Verify all dependencies in package.json
   - Check build logs in Azure portal

2. **Runtime Errors**:
   - Check Application Insights logs
   - Verify environment variables
   - Test API endpoints individually

3. **Domain Issues**:
   - Verify CNAME record in CloudFlare
   - Check SSL certificate status
   - Test DNS propagation

### Log Monitoring

```bash
# Stream Azure logs
az webapp log tail --name desoscamreport-webapp --resource-group myResourceGroup

# Download logs
az webapp log download --name desoscamreport-webapp --resource-group myResourceGroup
```

## Production Optimization

### 1. Azure Optimizations

- **Application Insights**: Monitor performance
- **Auto-scaling**: Configure based on CPU/memory
- **Backup**: Regular app backups

### 2. CloudFlare Optimizations

- **Page Rules**: Cache static assets
- **Workers**: Advanced edge processing
- **Analytics**: Monitor traffic patterns

### 3. Security

- **Web Application Firewall**: Enable in CloudFlare
- **Rate Limiting**: Protect API endpoints
- **Bot Management**: Filter malicious traffic

## Cost Management

### Free Tier Limitations

- **Compute**: 60 minutes/day
- **Storage**: 1 GB
- **Bandwidth**: 165 MB/day
- **Custom Domains**: 1 (with SSL)

### Upgrade Considerations

When ready to scale:
1. **Basic B1**: $7.30/month - Always On, Custom domains
2. **Standard S1**: $36.50/month - Auto-scaling, Staging slots
3. **Premium P1V3**: $73/month - Advanced features

---

## Quick Start Commands

```bash
# 1. Prepare for deployment
npm run build

# 2. Test production build locally  
npm start

# 3. Deploy via GitHub Actions
git push origin main

# 4. Monitor deployment
# Check Azure Portal → App Services → desoscamreport-webapp → Deployment Center
```
