#!/bin/bash

# Pre-deployment verification script for Hetzner server
# Run this BEFORE deploying to check server readiness

echo "🔍 Pre-Deployment Verification for DeSo Scam Report"
echo "================================================="

# Check 1: Docker installation
echo "1. Checking Docker installation..."
if command -v docker &> /dev/null; then
    echo "✅ Docker is installed"
    docker --version
else
    echo "❌ Docker is not installed"
    echo "   Install with: curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh"
    exit 1
fi

# Check 2: Docker Compose installation
echo ""
echo "2. Checking Docker Compose installation..."
if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose is installed"
    docker-compose --version
else
    echo "❌ Docker Compose is not installed"
    echo "   Install with: sudo apt-get install docker-compose"
    exit 1
fi

# Check 3: Port availability
echo ""
echo "3. Checking port availability..."
PORTS=(3000 8080 8443)
CONFLICTS=()

for port in "${PORTS[@]}"; do
    if netstat -tuln 2>/dev/null | grep -q ":$port "; then
        echo "⚠️  Port $port is in use:"
        netstat -tuln | grep ":$port "
        CONFLICTS+=($port)
    else
        echo "✅ Port $port is available"
    fi
done

if [ ${#CONFLICTS[@]} -gt 0 ]; then
    echo ""
    echo "❌ Port conflicts detected: ${CONFLICTS[*]}"
    echo "   You may need to:"
    echo "   - Stop services using these ports"
    echo "   - Modify docker-compose.yml to use different ports"
    echo "   - Use docker-compose.override.yml for custom port mapping"
fi

# Check 4: Directory setup
echo ""
echo "4. Checking directory setup..."
PWD_CHECK=$(pwd)
if [[ "$PWD_CHECK" == *"desoscamreport"* ]] || [[ "$PWD_CHECK" == *"DesoScamReport"* ]]; then
    echo "✅ In DeSo Scam Report directory: $PWD_CHECK"
else
    echo "⚠️  Not in DeSo Scam Report directory: $PWD_CHECK"
    echo "   Make sure you're in the right directory before deploying"
fi

# Check 5: Required files
echo ""
echo "5. Checking required files..."
REQUIRED_FILES=("docker-compose.yml" "Dockerfile" ".env.example" "nginx/nginx.conf")
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file is missing"
    fi
done

# Check 6: Environment file
echo ""
echo "6. Checking environment configuration..."
if [ -f ".env" ]; then
    echo "✅ .env file exists"
    if grep -q "your_actual_seed_hex_here" .env; then
        echo "⚠️  .env file contains placeholder values - update before deploying"
    else
        echo "✅ .env file appears to be configured"
    fi
else
    echo "❌ .env file missing"
    echo "   Copy .env.example to .env and configure it"
fi

# Check 7: Git status
echo ""
echo "7. Checking git status..."
if [ -d ".git" ]; then
    echo "✅ Git repository detected"
    echo "   Current branch: $(git branch --show-current 2>/dev/null || echo 'unknown')"
    echo "   Latest commit: $(git log -1 --oneline 2>/dev/null || echo 'unknown')"
else
    echo "⚠️  Not a git repository - make sure you cloned the repo correctly"
fi

# Check 8: DNS resolution
echo ""
echo "8. Checking DNS resolution..."
if command -v nslookup &> /dev/null; then
    echo "Testing desoscamreport.safetynet.social..."
    if nslookup desoscamreport.safetynet.social &> /dev/null; then
        echo "✅ DNS resolves correctly"
        nslookup desoscamreport.safetynet.social | grep -A2 "Name:"
    else
        echo "❌ DNS does not resolve"
        echo "   Check CloudFlare DNS configuration"
    fi
else
    echo "⚠️  nslookup not available, skipping DNS check"
fi

echo ""
echo "🎯 Verification Summary:"
echo "========================"

if [ ${#CONFLICTS[@]} -eq 0 ] && [ -f ".env" ] && [ -f "docker-compose.yml" ]; then
    echo "✅ Server appears ready for deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Review .env file: nano .env"
    echo "2. Run deployment: ./deploy-docker-ssl.sh"
    echo "3. Test deployment: ./test-deployment.sh"
else
    echo "❌ Please resolve the issues above before deploying"
fi

echo ""
echo "📋 Useful commands:"
echo "- View this check again: ./verify-server.sh"
echo "- Deploy application: ./deploy-docker-ssl.sh"
echo "- Test deployment: ./test-deployment.sh"
echo "- View logs: docker-compose logs -f"
echo "- Stop services: docker-compose down"
