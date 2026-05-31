# API Integration Guide

## 🔗 Connecting Frontend to Backend

After both frontend (Vercel) and backend (Render) are deployed, follow this guide to integrate them.

## 📋 Prerequisites

- ✅ Frontend deployed to Vercel
- ✅ Backend deployed to Render
- ✅ Backend API working and responding
- Frontend and backend URLs ready

## 🔧 Step 1: Update Frontend Environment Variables

### On Vercel Dashboard

1. **Navigate to Project Settings**
   - Vercel Dashboard → Your MindTrack Project
   - Settings → Environment Variables

2. **Update `VITE_API_URL`**
   - Variable: `VITE_API_URL`
   - Value: `https://your-mindtrack-api.onrender.com/api`
   - Environments: Production, Preview, Development
   - Save

3. **Redeploy**
   - Deployments tab
   - Click "Redeploy" on latest deployment
   - Wait for new build with updated API URL

### Or via Vercel CLI

```bash
cd frontend

# Add/update API URL
vercel env add VITE_API_URL
# Enter: https://your-mindtrack-api.onrender.com/api

# Redeploy with new env var
vercel --prod
```

## 🔄 Step 2: Update Backend CORS

### Update `backend/app/middleware/cors.py`

```python
# middleware/cors.py

ALLOWED_ORIGINS = [
    # Development
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    
    # Production
    "https://your-mindtrack.vercel.app",
]

# Make sure this is applied to FastAPI app
```

### Redeploy Backend

```bash
# Push changes to GitHub
git add .
git commit -m "fix: add Vercel frontend to CORS"
git push origin main

# Render auto-deploys
# Check logs: Render Dashboard → Logs
```

## 🧪 Step 3: Test API Integration

### Test 1: Health Check

```bash
curl https://your-mindtrack-api.onrender.com/health
# Should respond: {"status": "ok"}
```

### Test 2: Authentication Flow

**Register New User:**
```bash
curl -X POST https://your-mindtrack-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'

# Response:
# {
#   "user": {...},
#   "access_token": "eyJ0eXAi...",
#   "refresh_token": "eyJ0eXAi...",
#   "token_type": "bearer"
# }
```

**Login User:**
```bash
curl -X POST https://your-mindtrack-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

**Get Profile (Protected):**
```bash
curl -X GET https://your-mindtrack-api.onrender.com/api/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Test 3: Frontend Login

1. **Open Frontend**: `https://your-mindtrack.vercel.app/login`
2. **Try Login**:
   - Email: `test@example.com`
   - Password: `SecurePass123!`
3. **Expected**: Redirect to Dashboard
4. **Check**: Browser console for errors (F12 → Console)

## 📝 Verify Each Feature

### Habit Tracking
```bash
# Create Habit
curl -X POST https://your-api.onrender.com/api/habits/create \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Morning Jog",
    "description": "30 min jog",
    "category": "Fitness",
    "frequency": "Daily"
  }'

# List Habits
curl -X GET https://your-api.onrender.com/api/habits \
  -H "Authorization: Bearer TOKEN"
```

### Mood Tracking
```bash
# Create Mood Entry
curl -X POST https://your-api.onrender.com/api/mood/create \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mood_level": "good",
    "mood_score": 7,
    "notes": "Great day at work"
  }'

# Get Mood History
curl -X GET https://your-api.onrender.com/api/mood/history \
  -H "Authorization: Bearer TOKEN"
```

## 🔍 Troubleshooting

### Frontend Can't Connect to Backend

**Error**: Network error, CORS error, or timeout

**Check 1: Backend is Running**
```bash
curl https://your-api.onrender.com/health
# Should return {"status": "ok"}
```

**Check 2: CORS Configuration**
```
Backend CORS includes frontend domain?
Vercel domain in ALLOWED_ORIGINS?
No typos in domain?
```

**Check 3: Environment Variable**
```
Frontend has correct VITE_API_URL?
No trailing slash: 
  ✓ https://your-api.onrender.com/api
  ✗ https://your-api.onrender.com/api/
```

**Check 4: Browser Console**
```
Open Vercel app → Press F12
Console tab → Look for errors
Network tab → See actual requests
```

### API Returns 401 Unauthorized

**Cause**: Token invalid or missing

**Fix**:
1. Clear browser storage: `localStorage.clear()`
2. Login again
3. Check token in Network tab → Response

### API Returns 500 Server Error

**Check Backend Logs**
```
Render Dashboard → Select Web Service → Logs
Look for Python error stack trace
Fix error in code
Push to GitHub
Render auto-redeploys
```

## 🚀 Deployment Checklist

### Frontend (Vercel)
- [ ] App loads without errors
- [ ] Login/Register pages display
- [ ] All routes accessible
- [ ] Dark theme applies
- [ ] Mobile responsive
- [ ] VITE_API_URL environment variable set

### Backend (Render)
- [ ] Service shows "Live" status
- [ ] Health endpoint responds
- [ ] Database connected
- [ ] All 33 endpoints working
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] PostgreSQL backing up automatically

### Integration
- [ ] Frontend can reach backend
- [ ] User registration works end-to-end
- [ ] Login and token refresh work
- [ ] Habit creation works
- [ ] Mood logging works
- [ ] AI chat endpoint responds
- [ ] Analytics endpoints work
- [ ] No CORS errors
- [ ] No 401 errors
- [ ] Data persists in database

## 📊 Performance Monitoring

### Frontend (Vercel)
- Vercel Analytics: Automatic in dashboard
- Check Web Vitals
- Monitor error rates

### Backend (Render)
- Render Logs: Real-time logs
- Check response times
- Monitor CPU/memory usage

## 🔐 Security Considerations

- [ ] JWT secrets are strong (32+ characters)
- [ ] Database password is strong
- [ ] HTTPS enforced (automatic on both services)
- [ ] CORS restricted to your frontend domain
- [ ] No sensitive data in logs
- [ ] Environment variables not committed to git

## 📝 Example API Calls from Frontend

### In React Component

```typescript
// src/pages/Login.tsx
import { authService } from '@/services';

const handleLogin = async (email: string, password: string) => {
  try {
    const { data } = await authService.login({ email, password });
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    navigate('/dashboard');
  } catch (error) {
    setError('Login failed: ' + error.message);
  }
};
```

## 🎯 What's Next

### If Everything Works ✅
1. **User Testing**
   - Invite beta users
   - Gather feedback
   - Fix bugs

2. **Feature Completion**
   - Email verification flow
   - Password reset
   - OpenAI integration

3. **Performance Optimization**
   - Code splitting
   - Image optimization
   - Caching strategies

4. **Monitoring & Analytics**
   - Setup error tracking (Sentry)
   - Setup analytics (Mixpanel)
   - Monitor performance

### If Something Doesn't Work ❌
1. Check browser console (F12)
2. Check backend logs (Render)
3. Check network requests (Chrome DevTools)
4. Verify environment variables
5. Test API with curl
6. Check CORS configuration
7. Verify database connection

## 📚 Resources

- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com)
- [React Docs](https://react.dev)
- [Axios Docs](https://axios-http.com)

---

**Congratulations!** Your full-stack app is now live and integrated! 🎉

**Production URLs:**
- Frontend: `https://your-mindtrack.vercel.app`
- Backend: `https://your-mindtrack-api.onrender.com`
- API: `https://your-mindtrack-api.onrender.com/api`
