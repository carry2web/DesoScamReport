#!/bin/bash

# Update script for DeSo Scam Report Docker deployment
set -e

echo "🔄 Updating DeSo Scam Report..."

# Pull latest changes
echo "📥 Pulling latest code..."
git pull origin master

# Rebuild and restart the application
echo "🏗️  Rebuilding application..."
docker-compose build desoscamreport

echo "🔄 Restarting services..."
docker-compose up -d

# Wait for restart
echo "⏳ Waiting for services to restart..."
sleep 10

# Check status
echo "🔍 Checking service status..."
docker-compose ps

# Test application
if curl -f -s "http://localhost:3000/health" > /dev/null 2>&1; then
    echo "✅ Application updated successfully"
    echo "🌐 Available at: https://desoscamreport.safetynet.social"
else
    echo "❌ Application may have issues, checking logs..."
    docker-compose logs --tail=20 desoscamreport
fi

echo "🎉 Update completed!"
