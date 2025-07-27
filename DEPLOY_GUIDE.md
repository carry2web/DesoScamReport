# Azure Web App Deployment - Quick Setup

## Your Azure Configuration
- **App Name**: DesoScamReport
- **Resource Group**: appsvc_linux_westeurope
- **Region**: West Europe
- **Runtime**: Node.js 22 LTS (Linux)

## Pre-Deployment Checklist

### 1. Environment Variables to Set in Azure Portal

Go to your Azure Web App → **Configuration** → **Application Settings** and add:

```
NODE_ENV=production
WEBSITE_NODE_DEFAULT_VERSION=22
SCM_DO_BUILD_DURING_DEPLOYMENT=true
NEXT_PUBLIC_DESO_NODE_URL=https://safetynet.social
NEXT_PUBLIC_IDENTITY_URL=https://identity.deso.org
NEXT_PUBLIC_APP_NAME=DeSo Scam Report
NEXT_PUBLIC_APP_DOMAIN=desoscamreport.safetynet.social
DESO_PUBLIC_KEY=BC1YLfjx3jKZeoShqvzVgxpbEkzNW4tdogjNVgA6QA4jbtc7dKEJEqs
DESO_SEED_HEX=your_actual_seed_hex_here
```

### 2. Deployment Commands

```bash
# Clean previous builds
npm run clean

# Install dependencies
npm ci --production

# Build for production
npm run build

# Start production server
npm start
```

## Quick Deploy Steps

1. **Right-click** on your project folder in VS Code
2. Select **"Deploy to Web App..."**
3. Choose your Azure subscription and web app
4. VS Code will automatically deploy the files

## Post-Deployment

Your app will be available at:
- https://desoscamreport.azurewebsites.net

Set up your custom domain `desoscamreport.safetynet.social` in:
**Azure Portal** → **Custom domains** → **Add custom domain**
