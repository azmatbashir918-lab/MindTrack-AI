# Frontend Deployment to Vercel

## 📋 Prerequisites

- ✅ Frontend code complete
- GitHub account
- Vercel account (free tier available)
- Git repository with frontend code

## 🚀 Step 1: Prepare Repository

```bash
# Make sure all changes are committed
git status
git add .
git commit -m "chore: prepare for Vercel deployment"
git push origin main
```

## 🔧 Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Use GitHub, GitLab, or email
4. Verify email

## 📦 Step 3: Deploy on Vercel

### Option A: Via Dashboard (Recommended for First Time)

1. **Go to Vercel Dashboard**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"

2. **Select Repository**
   - Find your MindTrack AI repository
   - Click "Import"

3. **Configure Project**
   ```
   Framework Preset: Vite
   Root Directory: ./frontend
   Build Command: npm run build
   Output Directory: dist
   ```

4. **Environment Variables**
   ```
   VITE_API_URL: http://localhost:8000/api  (for now)
   VITE_APP_NAME: MindTrack AI
   ```
   *(We'll update API_URL after backend is deployed)*

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Get your live URL!

### Option B: Via CLI (Advanced)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from frontend directory
cd frontend
vercel --prod

# Follow prompts to configure
```

## 🌍 Step 4: Verify Deployment

1. **Check Build Status**
   - Visit your Vercel dashboard
   - See deployment logs
   - Confirm "Ready" status

2. **Test Frontend**
   - Click your project URL
   - Verify pages load correctly
   - Check responsive design on mobile

3. **Common Issues & Fixes**

   **Issue**: Build fails with "module not found"
   ```
   Fix: Ensure all dependencies in package.json are correct
   npm install
   npm run build
   ```

   **Issue**: Page shows blank/404
   ```
   Fix: Check that vite.config.ts base path is correct
   // Should be "/" for root deploy
   ```

   **Issue**: Styles not loading
   ```
   Fix: Verify tailwind.config.js and postcss.config.cjs are in root
   ```

## 🔗 Step 5: Custom Domain (Optional)

1. **Add Domain**
   - Vercel Dashboard → Settings → Domains
   - Add your domain
   - Update DNS records
   - Wait for verification (5-30 mins)

2. **Example DNS Records**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel.com
   ```

## 🔄 Step 6: Auto-Deployment Setup

Vercel automatically deploys when you:
- Push to main branch
- Create pull requests
- Merge to main

**No additional setup needed!**

## 📊 Environment Variables by Stage

### Development (Local)
```
VITE_API_URL=http://localhost:8000/api
```

### Production (After Backend Deploy)
```
VITE_API_URL=https://mindtrack-api.onrender.com/api
```

**Update in Vercel Dashboard:**
1. Project Settings → Environment Variables
2. Add/Update `VITE_API_URL`
3. Redeploy

```bash
# Or via CLI
vercel env add VITE_API_URL
# Enter: https://mindtrack-api.onrender.com/api
vercel --prod  # Redeploy
```

## ✅ Post-Deployment Checklist

- [ ] Frontend loads without errors
- [ ] All pages accessible
- [ ] Navigation works
- [ ] Forms display correctly
- [ ] Mobile responsive works
- [ ] Images/assets load
- [ ] Dark theme applies
- [ ] Animations smooth
- [ ] No console errors
- [ ] Production build optimized

## 🔍 Verify Everything Works

### Test Login Page
```
URL: https://your-app.vercel.app/login
Expected: Login form displays
```

### Test Dashboard (Hardcoded Data)
```
URL: https://your-app.vercel.app/dashboard
Expected: Stats cards and charts load
```

### Test Routing
```
/login → Login page
/register → Register page
/dashboard → Dashboard (shows, but redirects to /login if not auth'd)
/habits → Habits page
/mood → Mood page
/chat → Chat page
/analytics → Analytics page
/reports → Reports page
/settings → Settings page
```

## 📝 Troubleshooting

### Deployment Failed
1. Check build logs in Vercel dashboard
2. Run `npm run build` locally to see errors
3. Fix issues and push to GitHub
4. Vercel auto-redeploys

### Page Not Found (404)
1. Check route in React Router
2. Verify all page imports are correct
3. Ensure component exports are named exports
4. Check for typos in file paths (case-sensitive)

### API Calls Fail
1. Backend not deployed yet (normal)
2. Will work after backend is on Render
3. Update `VITE_API_URL` in environment variables
4. Test with curl to backend URL first

### Styling Issues
1. Check Tailwind CSS builds correctly locally
2. Verify PostCSS config
3. Clear Vercel cache: Settings → Git → Clear Cache
4. Redeploy

## 🎯 Next Steps After Frontend Deploy

1. **Get Frontend URL**
   - Example: `https://mindtrack-ai.vercel.app`

2. **Note It Down**
   - You'll need this for CORS setup in backend

3. **Deploy Backend to Render** (Next)
   - Update CORS to allow frontend URL
   - Get backend URL
   - Update frontend VITE_API_URL

4. **Wire APIs**
   - Connect login/register to backend
   - Test end-to-end flows
   - Update environment variables

## 💡 Pro Tips

- **Vercel Analytics**: Free performance monitoring included
- **Preview URLs**: Get preview URLs for pull requests
- **Automatic Rollback**: Can rollback to previous version instantly
- **Edge Functions**: Available for advanced use cases

## 📚 Helpful Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [React Router Guide](https://reactrouter.com/)

---

**Congratulations!** Your frontend is now live on Vercel! 🎉

Next: Deploy backend to Render
