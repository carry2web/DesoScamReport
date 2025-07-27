#!/bin/bash

# Azure Linux Web App Deployment Script for Next.js

echo "Starting deployment for DeSo Scam Report..."

# Set environment
export NODE_ENV=production

# Check Node version
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Clean previous builds
echo "Cleaning previous builds..."
rm -rf .next
rm -rf out

# Install dependencies
echo "Installing dependencies..."
npm ci --only=production

# Build the application
echo "Building Next.js application..."
npm run build

# Verify build
if [ ! -d ".next" ]; then
    echo "Error: Build failed - .next directory not found"
    exit 1
fi

echo "Deployment completed successfully!"
echo "App should be available at: https://desoscamreport.azurewebsites.net"
