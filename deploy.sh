#!/bin/bash

echo "🚀 Bazi App Deployment Script"
echo "=============================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if logged in
echo ""
echo "🔑 Checking Vercel login..."
vercel whoami || (echo "Please login first:" && vercel login)

echo ""
echo "📦 Step 1: Deploying Backend..."
cd bazi-backend

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found in bazi-backend"
    echo "Make sure to set environment variables in Vercel dashboard"
fi

echo "Deploying backend to Vercel..."
vercel --prod

BACKEND_URL=$(vercel --version > /dev/null 2>&1 && vercel ls 2>/dev/null | grep bazi-backend | head -1 | awk '{print $2}')
if [ -z "$BACKEND_URL" ]; then
    echo ""
    echo "⚠️  Could not auto-detect backend URL"
    echo "Please check your Vercel dashboard for the backend URL"
    echo "Then update bazi-frontend/.env with:"
    echo "VITE_API_BASE_URL=https://your-backend-url.vercel.app"
else
    echo ""
    echo "✅ Backend deployed!"
    echo "Backend URL: https://$BACKEND_URL"
    echo ""
    echo "📝 Update your frontend .env file:"
    echo "VITE_API_BASE_URL=https://$BACKEND_URL"
fi

cd ..

echo ""
echo "📦 Step 2: Deploying Frontend..."
cd bazi-frontend

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found in bazi-frontend"
fi

echo "Deploying frontend to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Go to Vercel dashboard and set environment variables"
echo "2. Update Google Cloud Console with your frontend domain"
echo "3. Test the login functionality"
echo ""
echo "📚 See DEPLOY.md for detailed instructions"
