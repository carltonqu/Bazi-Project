# Bazi Project - Vercel Deployment Guide

## 📁 Project Structure

```
~/.openclaw/workspace/
├── bazi-frontend/          # React + Vite frontend
│   ├── src/
│   ├── dist/               # Build output
│   ├── vercel.json         # Vercel config
│   ├── deploy.sh           # Deployment script
│   └── package.json
│
└── bazi-backend/           # Express API (serverless)
    ├── api/
    │   └── index.js        # Vercel serverless entry
    ├── src/
    │   └── server.js       # Local dev server
    ├── vercel.json         # Vercel config
    ├── deploy.sh           # Deployment script
    └── package.json
```

---

## 🚀 Deployment Steps

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

---

## 📦 Backend Deployment (First)

### Option A: Using the deploy script

```bash
cd ~/.openclaw/workspace/bazi-backend
./deploy.sh
```

### Option B: Manual deployment

```bash
cd ~/.openclaw/workspace/bazi-backend
vercel --prod
```

### Set Environment Variables

After first deploy, add these in Vercel Dashboard:

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENCLAW_BASE_URL` | Your OpenClaw gateway URL | `http://localhost:3000` |
| `OPENCLAW_API_KEY` | Your OpenClaw API key | `sk-...` |
| `OPENCLAW_MODEL` | (Optional) Model override | `openai-codex/gpt-5.3-codex` |
| `FRONTEND_ORIGIN` | Your frontend URL (after deploy) | `https://bazi-frontend.vercel.app` |

**To set env vars via CLI:**
```bash
cd ~/.openclaw/workspace/bazi-backend
vercel env add OPENCLAW_BASE_URL
vercel env add OPENCLAW_API_KEY
```

### Get Backend URL

After deployment, note your backend URL:
```
https://bazi-backend-xxx.vercel.app
```

---

## 🎨 Frontend Deployment

### Update API URL

Edit `~/.openclaw/workspace/bazi-frontend/src/config.js`:

```javascript
export const API_BASE_URL = "https://bazi-backend-xxx.vercel.app";
```

Or create `.env.production`:
```
VITE_API_BASE_URL=https://bazi-backend-xxx.vercel.app
```

### Deploy Frontend

```bash
cd ~/.openclaw/workspace/bazi-frontend
./deploy.sh
```

Or manually:
```bash
cd ~/.openclaw/workspace/bazi-frontend
vercel --prod
```

---

## 🔗 Connecting Frontend to Backend

### Update CORS on Backend

After deploying both, update the backend's `FRONTEND_ORIGIN` env var:

```bash
cd ~/.openclaw/workspace/bazi-backend
vercel env add FRONTEND_ORIGIN
# Enter your frontend URL: https://bazi-frontend-xxx.vercel.app
vercel --prod
```

---

## 🧪 Testing Locally

### Backend
```bash
cd ~/.openclaw/workspace/bazi-backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

### Frontend
```bash
cd ~/.openclaw/workspace/bazi-frontend
npm install
cp .env.example .env.local
# Edit .env.local: VITE_API_BASE_URL=http://localhost:3000
npm run dev
```

---

## 📝 Environment Files

### Backend `.env`
```
OPENCLAW_BASE_URL=http://localhost:3000
OPENCLAW_API_KEY=your_openclaw_api_key
OPENCLAW_MODEL=openai-codex/gpt-5.3-codex
FRONTEND_ORIGIN=http://localhost:5173
```

### Frontend `.env.local`
```
VITE_API_BASE_URL=http://localhost:3000
```

---

## 🔄 Redeployment

After making changes:

```bash
# Backend
cd ~/.openclaw/workspace/bazi-backend && vercel --prod

# Frontend
cd ~/.openclaw/workspace/bazi-frontend && vercel --prod
```

---

## 📊 Vercel Dashboard

Manage your deployments at:
https://vercel.com/dashboard

---

## 🐛 Troubleshooting

### CORS Errors
- Ensure `FRONTEND_ORIGIN` is set correctly on backend
- Check that it matches your frontend URL exactly

### API Not Responding
- Check environment variables are set in Vercel dashboard
- View logs: `vercel logs --prod`

### Build Failures
- Check `vercel.json` configuration
- Ensure all dependencies are in `package.json`

---

## 🎯 Quick Deploy Checklist

- [ ] Install Vercel CLI
- [ ] Login to Vercel
- [ ] Deploy backend first
- [ ] Set backend environment variables
- [ ] Note backend URL
- [ ] Update frontend API URL
- [ ] Deploy frontend
- [ ] Update backend CORS with frontend URL
- [ ] Test the live app!
