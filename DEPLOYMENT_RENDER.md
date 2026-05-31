# Backend Deployment to Render

## 📋 Prerequisites

- ✅ Backend code complete and tested locally
- GitHub account with backend code pushed
- Render account (free tier available)
- PostgreSQL database (Render provides)

## 🚀 Step 1: Prepare Backend for Deployment

### Update Environment Variables

1. **Create `.env.production` in backend/**
```env
# Database (Render provides PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/dbname

# JWT
JWT_SECRET_KEY=your-secret-key-here-min-32-chars
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
REFRESH_TOKEN_EXPIRATION_DAYS=7

# Frontend CORS
FRONTEND_URL=https://your-frontend.vercel.app

# Email (SendGrid - optional)
SENDGRID_API_KEY=your-sendgrid-key

# OpenAI (optional)
OPENAI_API_KEY=your-openai-key

# App
APP_NAME=MindTrack AI
DEBUG=False
```

2. **Verify `config.py` supports environment variables**
```python
# Should use environment variables, not .env
DATABASE_URL = os.getenv("DATABASE_URL")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
```

### Test Locally with Production Settings

```bash
cd backend

# Set production env vars (temporarily)
export DATABASE_URL=postgresql://localhost/mindtrack_prod
export JWT_SECRET_KEY=your-32-char-secret-key-here
export DEBUG=False

# Run tests
python -m pytest

# Run app
python -m uvicorn app.main:app --reload
```

## 📦 Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Click "Sign Up"
3. Use GitHub or email
4. Verify email

## 🔧 Step 3: Deploy Backend Service

### Via Render Dashboard (Recommended)

1. **Connect GitHub Repository**
   - Dashboard → "New +" → "Web Service"
   - Select "Build and deploy from a Git repository"
   - Click "Connect" next to your GitHub repo
   - Select your MindTrack AI repo
   - Click "Connect"

2. **Configure Web Service**
   ```
   Name: mindtrack-api
   Environment: Python 3
   Region: Choose closest to you (e.g., us-east-1)
   Branch: main
   Build Command: pip install -r backend/requirements.txt
   Start Command: cd backend && gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
   ```

3. **Add Environment Variables**
   - Click "Environment"
   - Add each variable from `.env.production`
   
   ```
   DATABASE_URL: (from Render PostgreSQL - see below)
   JWT_SECRET_KEY: (generate strong 32+ char key)
   FRONTEND_URL: (from Vercel deployment)
   DEBUG: False
   SENDGRID_API_KEY: (leave empty if not set up)
   OPENAI_API_KEY: (leave empty if not set up)
   ```

4. **Create PostgreSQL Database**
   - Dashboard → "New +" → "PostgreSQL"
   - Name: `mindtrack-db`
   - Region: (same as web service)
   - PostgreSQL Version: 15
   - Click "Create Database"
   - Copy `DATABASE_URL` from database dashboard
   - Paste in web service environment variables

5. **Deploy**
   - Click "Create Web Service"
   - Wait for build (3-5 minutes)
   - Get your API URL!

### Verify Database Connection

```
Render Dashboard → PostgreSQL Database → Connections
```

Copy the `External Database URL` and paste in web service environment variables.

## 🌍 Step 4: Verify Deployment

### Check Build Logs
1. Render Dashboard → Web Service
2. Click "Logs" tab
3. Look for "Your service is live"

### Test API Endpoints

```bash
# Get your Render backend URL
# Example: https://mindtrack-api.onrender.com

# Test health endpoint
curl https://mindtrack-api.onrender.com/health
# Should return: {"status": "ok"}

# Test API endpoint
curl https://mindtrack-api.onrender.com/api/auth/register \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"TestPass123"}'
```

## 🔄 Step 5: Setup Auto-Deployment

Render automatically deploys when you push to main:

1. **Enable Auto-Deploy** (default)
   - Should be already enabled
   - Verify in Settings

2. **Verify GitHub Integration**
   - Render Dashboard → Settings → Deploy Hooks
   - Add webhook to GitHub (usually auto-done)

## 📊 Database Migrations (If Needed)

If using SQLAlchemy migrations:

```bash
# Run migrations after deploy
# Add to web service start command:
cd backend && alembic upgrade head && gunicorn app.main:app ...
```

## 🔐 Update CORS Configuration

Update `backend/app/middleware/cors.py`:

```python
ALLOWED_ORIGINS = [
    "http://localhost:3000",      # Local dev
    "http://localhost:5173",      # Vite dev
    "https://your-frontend.vercel.app",  # Production frontend
]
```

Then redeploy backend.

## 📝 Common Issues & Fixes

### "Build Command Failed"
```
Error: pip install failed

Fix:
1. Check requirements.txt in root backend/
2. Ensure all dependencies are compatible
3. Try locally: pip install -r requirements.txt
4. Check Python version (3.10+)
```

### "Gunicorn not found"
```
Error: command 'gunicorn' not found

Fix:
1. Add to requirements.txt:
   gunicorn==21.2.0

2. Redeploy
```

### "Database Connection Failed"
```
Error: could not connect to database

Fix:
1. Verify DATABASE_URL is correct
2. Check PostgreSQL is running
3. Verify firewall allows connection
4. Test locally: psql $DATABASE_URL
```

### "Service crashes after deploy"
```
Check logs for errors:
1. Render → Logs tab
2. Look for Python error stack trace
3. Fix error in code
4. Push to GitHub
5. Render auto-redeploys
```

## ✅ Post-Deployment Checklist

- [ ] Build succeeds without errors
- [ ] Service shows "Live" status
- [ ] Health endpoint responds
- [ ] Database connected
- [ ] Can create users (test /auth/register)
- [ ] Can login (test /auth/login)
- [ ] API returns proper JSON
- [ ] Error handling works
- [ ] CORS allows frontend domain
- [ ] Environment variables set correctly

## 📝 Test All API Endpoints

### Authentication
```bash
BASE_URL=https://your-api.onrender.com

# Register
curl -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123"
  }'

# Login
curl -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
# Save the access_token from response

# Get Profile (requires token)
curl -X GET $BASE_URL/api/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Habits
```bash
# Create Habit
curl -X POST $BASE_URL/api/habits/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Morning Exercise",
    "description": "30 min workout",
    "category": "Fitness",
    "frequency": "Daily"
  }'

# Get Habits
curl -X GET $BASE_URL/api/habits \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🎯 Next Steps

1. **Frontend Integration**
   - Update `VITE_API_URL` in frontend environment:
   ```
   VITE_API_URL=https://your-api.onrender.com/api
   ```
   - Redeploy frontend to Vercel

2. **Connect Frontend to Backend**
   - Login page should now connect to real backend
   - Test user registration
   - Test habit creation

3. **Monitor API**
   - Render provides logs and metrics
   - Check response times
   - Monitor errors

4. **Optional: Add Custom Domain**
   - Render Dashboard → Settings → Custom Domain
   - Add your domain (e.g., api.yourdomain.com)
   - Update DNS records

## 💡 Pro Tips

- **Render Free Tier**: Has inactivity timeout (web service spins down after 15 mins of inactivity)
  - Solution: Use paid tier or manual restart
  
- **PostgreSQL Backups**: Render automatically backs up data daily
  
- **Monitor Performance**: Render Dashboard shows response times and logs
  
- **Scaling**: Easy to upgrade to more resources if needed

## 📚 Helpful Resources

- [Render Documentation](https://render.com/docs)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Gunicorn Documentation](https://gunicorn.org/)
- [PostgreSQL Guide](https://www.postgresql.org/docs/)

---

**Congratulations!** Your backend is now live on Render! 🎉

**Your API is ready to serve your frontend application!**
