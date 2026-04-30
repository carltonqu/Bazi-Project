# Bazi App Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com
2. **Vercel CLI**: Install with `npm i -g vercel`
3. **Google OAuth Client ID**: From Google Cloud Console
4. **OpenClaw API Key**: For AI fortune generation

## Step 1: Deploy Backend

```bash
cd bazi-backend

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Backend Environment Variables (Vercel Dashboard)

Go to your project settings in Vercel and add these environment variables:

| Variable | Value |
|----------|-------|
| `GOOGLE_CLIENT_ID` | 459190608405-argcsqqnfsq8g6le54ntl6kagr8nc8re.apps.googleusercontent.com |
| `JWT_SECRET` | your-super-secret-jwt-key |
| `FRONTEND_ORIGIN` | https://your-frontend-domain.vercel.app |
| `OPENCLAW_BASE_URL` | https://api.openclaw.ai |
| `OPENCLAW_API_KEY` | your-openclaw-api-key |

**Note**: After deploying, copy the backend URL (e.g., `https://bazi-backend-xxxxx.vercel.app`)

## Step 2: Update Frontend Config

Edit `bazi-frontend/.env`:

```env
VITE_GOOGLE_CLIENT_ID=459190608405-argcsqqnfsq8g6le54ntl6kagr8nc8re.apps.googleusercontent.com
VITE_API_BASE_URL=https://your-backend-url.vercel.app
```

## Step 3: Deploy Frontend

```bash
cd bazi-frontend

# Deploy
vercel --prod
```

### Frontend Environment Variables (Vercel Dashboard)

| Variable | Value |
|----------|-------|
| `VITE_GOOGLE_CLIENT_ID` | 459190608405-argcsqqnfsq8g6le54ntl6kagr8nc8re.apps.googleusercontent.com |
| `VITE_API_BASE_URL` | https://your-backend-url.vercel.app |

## Step 4: Update Google OAuth Settings

1. Go to https://console.cloud.google.com/apis/credentials
2. Edit your OAuth 2.0 Client ID
3. Add these **Authorized JavaScript origins**:
   - `https://your-frontend-domain.vercel.app`
4. Save changes

## Step 5: Update Backend CORS

Update the `FRONTEND_ORIGIN` in your backend Vercel environment variables to match your actual frontend URL.

## Testing

1. Visit your frontend URL
2. Click "Login" button
3. Try Google Sign-In
4. Check that it redirects back and shows your profile

## Troubleshooting

### Google OAuth Error
- Make sure the domain is added to Authorized JavaScript origins
- Check that `VITE_GOOGLE_CLIENT_ID` is set correctly

### CORS Errors
- Verify `FRONTEND_ORIGIN` matches your frontend URL exactly
- Include `https://` and no trailing slash

### API Errors
- Check backend logs in Vercel dashboard
- Verify all environment variables are set

## URLs After Deployment

| Service | URL Example |
|---------|-------------|
| Frontend | https://bazi-frontend-xxxxx.vercel.app |
| Backend | https://bazi-backend-xxxxx.vercel.app |
# Deploy trigger Thu Apr 30 13:00:33 PST 2026
