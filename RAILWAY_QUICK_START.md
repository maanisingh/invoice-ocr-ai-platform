# Railway Quick Start - Invoice OCR Platform

## ✅ Fixed: Railpack Build Error

The `start.sh` scripts have been added and committed to fix the Railpack detection issue.

## 🚀 Deploy in 5 Minutes

### Step 1: Create Project
1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose: `maanisingh/invoice-ocr-ai-platform`

### Step 2: Deploy Frontend

**Service Settings:**
- **Service Name**: `invoice-ocr-frontend`
- **Root Directory**: `frontend`
- **Builder**: Nixpacks (auto-detected)
- **Build Command**: Auto-detected from package.json
- **Start Command**: `./start.sh` (auto-detected from railway.toml)

**Environment Variables:**
```bash
# Add after backend is deployed
VITE_API_URL=https://[your-backend-url].up.railway.app/api
```

### Step 3: Deploy Backend

**Service Settings:**
- **Service Name**: `invoice-ocr-backend`
- **Root Directory**: `backend`
- **Builder**: Nixpacks (auto-detected)
- **Build Command**: Auto-detected (uses requirements-railway.txt)
- **Start Command**: `./start.sh` (auto-detected from railway.toml)

**Environment Variables:**
```bash
# Required
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
SECRET_KEY=your-super-secret-session-key-also-32-chars

# Optional
REDIS_URL=${{Redis.REDIS_URL}}
FRONTEND_URL=https://[your-frontend-url].up.railway.app
CORS_ORIGINS=https://[your-frontend-url].up.railway.app
```

### Step 4: Add Database

1. Click **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway creates database and sets `DATABASE_URL` automatically
3. Backend will reference it as `${{Postgres.DATABASE_URL}}`

### Step 5: Link Services

The services will automatically communicate using Railway's internal network.

## 📋 Verify Deployment

### Frontend Health Check
```bash
curl https://[your-frontend-url].up.railway.app
# Should return: index.html
```

### Backend Health Check
```bash
curl https://[your-backend-url].up.railway.app/health
# Should return: {"status": "ok"}
```

## 🔧 Configuration Files Reference

Each service has these files (auto-detected by Railway):

**Frontend:**
- `railway.toml` - Railway configuration
- `nixpacks.toml` - Build configuration
- `Dockerfile` - Alternative Docker build
- `start.sh` - Start command script
- `package.json` - Dependencies

**Backend:**
- `railway.toml` - Railway configuration
- `nixpacks.toml` - Build configuration
- `Dockerfile` - Alternative Docker build
- `start.sh` - Start command script
- `requirements-railway.txt` - Lightweight dependencies

## 🐛 Common Issues

### Issue: "start.sh not found"
**Status**: ✅ FIXED - Scripts added and committed

### Issue: Build timeout
**Solution**: Using `requirements-railway.txt` (lightweight, no ML deps)

### Issue: Port binding error
**Solution**: Scripts use `${PORT:-3000}` for Railway's dynamic port

### Issue: CORS errors
**Solution**: Add frontend URL to backend `CORS_ORIGINS` env var

## 🎯 Expected Build Times

- **Frontend**: ~2-3 minutes
- **Backend**: ~3-5 minutes (lightweight requirements)
- **Database**: ~1 minute (instant provision)

## 📊 Resource Usage

**Estimated Monthly Cost (Hobby Plan - $5/month):**
- Frontend: ~100 hours/month
- Backend: ~150 hours/month
- PostgreSQL: ~250 hours/month
- **Total**: ~500 hours (within Hobby plan limit)

## 🔗 Post-Deployment

After both services are deployed:

1. Copy backend URL
2. Update frontend environment variable `VITE_API_URL`
3. Redeploy frontend (Railway auto-redeploys on env change)
4. Test the platform at your frontend URL

## 🎉 You're Done!

Your Invoice OCR Platform should now be live with:
- ✅ Modern UI with glassmorphism effects
- ✅ Platform integrations (QuickBooks, Xero, SAP, etc.)
- ✅ Mobile and desktop responsive design
- ✅ Real company logos
- ✅ Production-ready deployment

---

**Need help?** Check the full guide: [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)
