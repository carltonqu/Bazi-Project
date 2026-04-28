#!/bin/bash

# Bazi Backend Deployment Script for Vercel

echo "🚀 Deploying Bazi Backend to Vercel..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm i -g vercel
fi

# Check for required environment variables
if [ -z "$OPENCLAW_BASE_URL" ]; then
    echo "⚠️  Warning: OPENCLAW_BASE_URL not set"
fi

if [ -z "$OPENCLAW_API_KEY" ]; then
    echo "⚠️  Warning: OPENCLAW_API_KEY not set"
fi

# Deploy to Vercel
echo "📦 Deploying serverless functions..."
vercel --prod

echo "✅ Backend deployment complete!"
echo ""
echo "📝 Don't forget to set environment variables in Vercel dashboard:"
echo "   - OPENCLAW_BASE_URL"
echo "   - OPENCLAW_API_KEY"
echo "   - OPENCLAW_MODEL (optional)"
echo "   - FRONTEND_ORIGIN (your frontend URL)"
