# Azure Deployment Recovery Guide

## Issue: Socket Hang Up After 23m 52s

### Root Causes:
1. **Large file size** (480MB+ project)
2. **Network timeout** during zip upload
3. **Azure build timeout** during deployment
4. **node_modules** included in deployment

### Solution 1: Use Azure CLI (Recommended)

```bash
# Install Azure CLI if not already installed
# https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

# Login to Azure
az login

# Deploy with optimized settings
az webapp deployment source config-zip \
  --resource-group appsvc_linux_westeurope \
  --name DesoScamReport \
  --src deployment.zip \
  --timeout 600
```

### Solution 2: GitHub Actions Deployment

1. **Push code to GitHub repository**
2. **Set up GitHub Actions** (we already have .github/workflows/azure-deploy.yml)
3. **Add Azure publish profile to GitHub Secrets**
4. **Let GitHub handle the deployment**

### Solution 3: Optimized VS Code Deployment

1. **Exclude large files** (added .deployignore)
2. **Clear local builds** before deployment
3. **Use Azure extension with retry**

## Quick Recovery Steps:

### Step 1: Clean Project
```bash
# Remove build artifacts
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force out -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
```

### Step 2: Create Deployment Package
```bash
# Install only production dependencies
npm ci --production

# Build for production
npm run build

# Create deployment zip (excluding dev files)
# Use built-in Azure deployment tools
```

### Step 3: Deploy via Azure Portal
1. **Azure Portal** → **App Services** → **DesoScamReport**
2. **Deployment Center** → **FTPS credentials**
3. **Upload via FTP** (more reliable for large files)

## Prevention for Next Time:
- Use `.deployignore` (✓ Added)
- Implement GitHub Actions CI/CD
- Use Azure DevOps pipelines
- Deploy only production build artifacts
