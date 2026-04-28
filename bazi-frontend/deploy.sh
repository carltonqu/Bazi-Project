#!/bin/bash

# Bazi Frontend Deployment Script for Vercel

echo "🚀 Deploying Bazi Frontend to Vercel..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm i -g vercel
fi

# Deploy to Vercel
echo "📦 Building and deploying..."
vercel --prod

echo "✅ Frontend deployment complete!"
