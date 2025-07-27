#!/bin/bash

# Test script for independent Docker deployment
# Run this on the Hetzner server after deployment

echo "🧪 Testing DeSo Scam Report Independent Docker Deployment"
echo "=================================================="

# Test 1: Check if containers are running
echo "1. Checking Docker containers..."
if docker-compose ps | grep -q "Up"; then
    echo "✅ Docker containers are running"
    docker-compose ps
else
    echo "❌ Docker containers are not running properly"
    docker-compose ps
    exit 1
fi

echo ""

# Test 2: Check application health directly
echo "2. Testing application health (direct port 3000)..."
if curl -f -s "http://localhost:3000/api/health" > /dev/null; then
    echo "✅ Application is responding on port 3000"
    curl -s "http://localhost:3000/api/health" | head -3
else
    echo "❌ Application is not responding on port 3000"
fi

echo ""

# Test 3: Check nginx proxy
echo "3. Testing nginx proxy (port 8080)..."
if curl -f -s "http://localhost:8080/api/health" > /dev/null; then
    echo "✅ Nginx proxy is working on port 8080"
    curl -s "http://localhost:8080/api/health" | head -3
else
    echo "❌ Nginx proxy is not working on port 8080"
fi

echo ""

# Test 4: Check HTTPS proxy
echo "4. Testing HTTPS proxy (port 8443)..."
if curl -f -s -k "https://localhost:8443/api/health" > /dev/null; then
    echo "✅ HTTPS proxy is working on port 8443"
    curl -s -k "https://localhost:8443/api/health" | head -3
else
    echo "❌ HTTPS proxy is not working on port 8443"
fi

echo ""

# Test 5: Check external domain
echo "5. Testing external domain access..."
if curl -f -s "https://desoscamreport.safetynet.social/api/health" > /dev/null; then
    echo "✅ External domain is accessible"
    curl -s "https://desoscamreport.safetynet.social/api/health" | head -3
else
    echo "⚠️  External domain may not be accessible yet (DNS/CloudFlare)"
    echo "   This is normal if DNS hasn't propagated or CloudFlare isn't configured"
fi

echo ""

# Test 6: Check port conflicts
echo "6. Checking for port conflicts..."
echo "Ports in use:"
netstat -tuln | grep -E ":(80|443|3000|8080|8443|17000|17001)" | sort
echo ""

# Test 7: Check Docker networks
echo "7. Checking Docker networks..."
echo "Networks:"
docker network ls | grep -E "(deso|scam)"
echo ""

# Test 8: Check SSL certificates
echo "8. Checking SSL certificates..."
if docker-compose ps | grep -q certbot; then
    echo "Certbot container is running"
    # Try to check certificates (may fail if just started)
    docker-compose exec certbot certbot certificates 2>/dev/null || echo "Certificates not ready yet (normal for new deployment)"
else
    echo "Certbot container not found"
fi

echo ""
echo "🎉 Testing completed!"
echo ""
echo "📝 Summary:"
echo "- If all tests pass, your deployment is working correctly"
echo "- External domain test may fail initially due to DNS/CloudFlare propagation"
echo "- You can access the app at: https://desoscamreport.safetynet.social"
echo "- Local testing: http://localhost:8080 or https://localhost:8443"
echo ""
echo "📊 Container status:"
docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
