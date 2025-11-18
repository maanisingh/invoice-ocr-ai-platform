# Railway Deployment Guide

## Quick Start

### Method 1: Railway Dashboard (Recommended)

1. **Login to Railway**
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `maanisingh/invoice-ocr-ai-platform`

3. **Deploy Frontend Service**
   - Railway will ask which service to deploy
   - Click "Add Service" → "GitHub Repo"
   - Set **Root Directory**: `frontend`
   - Railway will auto-detect the configuration

4. **Deploy Backend Service**
   - Click "New" → "GitHub Repo" (same repo)
   - Set **Root Directory**: `backend`
   - Railway will use Dockerfile

5. **Add Database (PostgreSQL)**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will create a database and provide connection URL

6. **Configure Environment Variables for Backend**

   Required:
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars
   SECRET_KEY=your-super-secret-key-for-sessions
   ```

   Optional:
   ```
   OPENAI_API_KEY=sk-...
   REDIS_URL=${{Redis.REDIS_URL}}
   FRONTEND_URL=${{Frontend.RAILWAY_PUBLIC_DOMAIN}}
   ```

7. **Configure Environment Variables for Frontend**
   ```
   VITE_API_URL=${{Backend.RAILWAY_PUBLIC_DOMAIN}}/api
   ```

### Method 2: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy Frontend
cd frontend
railway init
railway up

# Deploy Backend
cd ../backend
railway init
railway up
```

## Deployment Configuration Files

The repository includes multiple deployment options:

1. **railway.toml** - Railway-specific configuration
2. **nixpacks.toml** - Nixpacks build configuration
3. **Dockerfile** - Docker-based deployment (recommended for backend)

Railway will automatically detect and use the best option.

## Backend Requirements

Two requirement files are provided:

- **requirements.txt** - Full dependencies (for local development)
- **requirements-railway.txt** - Lightweight deps (for Railway deployment)

The Dockerfile uses `requirements-railway.txt` to keep build size manageable.

## Troubleshooting

### Frontend Build Fails

**Error**: `npm install` fails or times out

**Solution**:
- Make sure Node version is 18+
- Clear Railway cache: Settings → Clear Build Cache
- Check build logs for specific package errors

### Backend Build Too Large

**Error**: Build exceeds size limits or times out

**Solution**:
- Using `requirements-railway.txt` (already configured)
- Remove ML dependencies if not needed
- Consider using Railway Pro for larger builds

### Database Connection Fails

**Error**: `Cannot connect to database`

**Solution**:
1. Make sure PostgreSQL service is added
2. Verify `DATABASE_URL` is set correctly
3. Check network policies allow internal communication

### CORS Errors

**Error**: Frontend can't access backend API

**Solution**:
Add to backend environment variables:
```
CORS_ORIGINS=${{Frontend.RAILWAY_PUBLIC_DOMAIN}}
```

### Health Check Failures

**Error**: Service fails health checks

**Solutions**:

Frontend:
- Health check path: `/` (serves index.html)
- Make sure `serve` is installed (already in package.json)

Backend:
- Health check path: `/health`
- Ensure endpoint exists in `app/main.py`

## Post-Deployment

### Get Service URLs

Railway automatically provides public URLs:
- Frontend: `https://invoice-ocr-frontend-production.up.railway.app`
- Backend: `https://invoice-ocr-backend-production.up.railway.app`

### Update Frontend API URL

After backend is deployed, update frontend environment:
```
VITE_API_URL=https://your-backend.up.railway.app/api
```

Then redeploy frontend.

### Run Database Migrations

```bash
# SSH into backend service
railway run bash

# Run migrations
alembic upgrade head
```

Or set up automatic migrations in Railway:
```
# In backend railway.toml
[deploy]
startCommand = "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT"
```

## Custom Domain (Optional)

1. Go to service Settings
2. Click "Generate Domain" or "Custom Domain"
3. Add your domain:
   - Frontend: `invoices.alexandratechlab.com`
   - Backend: `api.invoices.alexandratechlab.com`
4. Update DNS records as shown

## Cost Optimization

Railway offers:
- **Hobby Plan**: $5/month (500 hours)
- **Pro Plan**: $20/month (unlimited)

Tips:
- Use lightweight dependencies
- Enable sleep mode for non-production services
- Monitor resource usage in dashboard

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- GitHub Issues: https://github.com/maanisingh/invoice-ocr-ai-platform/issues
