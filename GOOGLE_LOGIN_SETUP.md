# Google Login Setup Guide

## Overview
Google OAuth 2.0 login is implemented for the Bazi Fortune Teller application.

## Architecture

### Frontend (React + Vite)
- **File**: `bazi-frontend/src/components/GoogleSignInButton.jsx`
- Uses Google Identity Services (GIS) API
- Renders Google's official sign-in button
- Sends ID token to backend for verification

### Backend (Express + Node.js)
- **File**: `bazi-backend/src/auth.js` - Core auth logic
- **File**: `bazi-backend/src/routes/auth.js` - Auth endpoints
- Verifies Google ID tokens using `google-auth-library`
- Issues JWT tokens for session management

## Current Configuration

### Environment Variables

**Frontend** (`.env`):
```
VITE_GOOGLE_CLIENT_ID=459190608405-argcsqqnfsq8g6le54ntl6kagr8nc8re.apps.googleusercontent.com
VITE_API_BASE_URL=https://bazi-backend-one.vercel.app
```

**Backend** (`.env`):
```
GOOGLE_CLIENT_ID=459190608405-argcsqqnfsq8g6le54ntl6kagr8nc8re.apps.googleusercontent.com
JWT_SECRET=bazi-fortune-jwt-secret-string
FRONTEND_ORIGIN=http://localhost:5173
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/google` | POST | Verify Google token & login/signup |
| `/api/auth/me` | GET | Get current user (protected) |
| `/api/auth/logout` | POST | Logout user |

## How It Works

1. User clicks Google Sign-In button
2. Google's GIS popup appears for account selection
3. After successful Google auth, frontend receives ID token
4. Frontend sends ID token to `/api/auth/google`
5. Backend verifies token with Google
6. Backend creates/updates user in memory store
7. Backend returns JWT token + user data
8. Frontend stores token in localStorage
9. User is now authenticated

## Testing Locally

1. Start backend:
   ```bash
   cd bazi-backend
   npm run dev
   ```

2. Start frontend:
   ```bash
   cd bazi-frontend
   npm run dev
   ```

3. Open http://localhost:5173
4. Click "Login" → "Sign in with Google"

## Production Deployment Checklist

- [ ] Update `FRONTEND_ORIGIN` in backend `.env` to production domain
- [ ] Add production domain to Google Cloud Console authorized origins
- [ ] Ensure `VITE_API_BASE_URL` points to production backend
- [ ] Set strong `JWT_SECRET` for production

## Google Cloud Console Setup

1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Add authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - `https://your-production-domain.com` (production)
4. Copy Client ID to both frontend and backend `.env` files

## Troubleshooting

### "Google Sign-In not configured"
- Check `VITE_GOOGLE_CLIENT_ID` is set in frontend `.env`

### "Authentication failed" / Token errors
- Ensure backend `GOOGLE_CLIENT_ID` matches frontend
- Check that the Google Client ID is for "Web application" type

### CORS errors
- Verify `FRONTEND_ORIGIN` in backend matches your frontend URL
- For production, update to your actual domain
