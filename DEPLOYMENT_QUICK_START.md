# Quick Reference: Railway Deployment Steps

## 🎯 What You Need to Do on Railway

### 1. Push to GitHub
```bash
git add .
git commit -m "Add PostgreSQL production support"
git push
```

### 2. Railway Setup (5 minutes)

**A. Create Project:**
1. Go to https://railway.app/dashboard
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository

**B. Add PostgreSQL Database:**
1. In Railway project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. ✅ Done! `DATABASE_URL` is auto-configured

**C. Add Environment Variables:**
Click on your app service → "Variables" tab → Add:

```
NODE_ENV=production
JWT_SECRET=0a4576185613365fd545bc3773e50e12141e7416f1d53269e4bd2e7a466a066f0da8caae8e5c58a4f93a720f2978e4b5baf01976205dd6160adb34cc76ace895
RAZORPAY_KEY_ID=rzp_test_SWXmQkHwW73VmP
RAZORPAY_KEY_SECRET=i5qGQWX2BtVEnmUzzprdvhBb
```

**D. Generate Domain:**
1. App service → "Settings" → "Networking"
2. Click "Generate Domain"
3. Get your URL: `https://your-app.up.railway.app`

### 3. Verify Deployment

Check logs for:
```
🐘 Using PostgreSQL database
✅ Database initialized successfully
🚀 Server running
```

---

## ✅ What's Been Done (No Action Needed)

- ✅ Added `pg` (PostgreSQL driver) to dependencies
- ✅ Updated `database.js` - auto-detects SQLite vs PostgreSQL
- ✅ Updated all route files (auth, products, orders, users)
- ✅ Local development still uses SQLite (no changes needed)
- ✅ Production automatically uses PostgreSQL

---

## 🔄 How It Works

**Local Development:**
```bash
npm run dev
# Uses SQLite automatically (./database.db)
# No configuration needed!
```

**Production (Railway):**
- Detects `DATABASE_URL` environment variable
- Automatically switches to PostgreSQL
- All queries adapted for PostgreSQL syntax

---

## 📋 Deployment Checklist

- [ ] Push code to GitHub
- [ ] Create Railway project from GitHub repo
- [ ] Add PostgreSQL database in Railway
- [ ] Set environment variables
- [ ] Generate domain
- [ ] Test live URL
- [ ] Login as admin: `admin@shophub.com` / `admin123`

---

## 🆘 If Something Goes Wrong

**Check Railway Logs:**
1. Railway dashboard → Your app → "Deployments"
2. Click latest deployment → View logs

**Common Issues:**
- Database not connecting → Verify PostgreSQL service is added
- Products not showing → Check logs for "Database initialized successfully"
- Build fails → Make sure you committed `package-lock.json`

---

## 📚 Full Documentation

See `POSTGRESQL_RAILWAY_SETUP.md` for:
- Detailed step-by-step guide
- Database management
- Troubleshooting
- Security best practices
- Scaling tips

---

## 🎉 That's It!

Your app is ready for production deployment. Just follow the 5-minute Railway setup above!
