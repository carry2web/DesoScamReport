# GitHub Repository Setup Guide

## Create New Repository on GitHub

### 1. Go to GitHub
- Navigate to: https://github.com/carry2web
- Click **"New repository"** or **"+"** → **"New repository"**

### 2. Repository Settings
- **Repository name**: `DesoScamReport`
- **Description**: `Community-driven DeSo scammer reporting system with blockchain transparency`
- **Visibility**: Public (recommended for open-source security tool)
- **Initialize**: Leave unchecked (we have existing code)

### 3. After Creating Repository
Run these commands in your terminal:

```bash
# Push to the new repository
git push -u origin master
```

## GitHub Actions will automatically:
1. **Build** your Next.js application
2. **Deploy** to Azure Web App
3. **Use environment variables** from Azure App Settings

## Next Steps After Repository Creation:
1. **Create repository** on GitHub
2. **Push code** using the command above
3. **Set up Azure publish profile** in GitHub Secrets
4. **Configure environment variables** in Azure Portal
5. **Automatic deployment** on every commit

The repository will be at: https://github.com/carry2web/DesoScamReport
