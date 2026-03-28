# Railway Deployment Guide

## 🚀 Deploy E-Commerce App to Railway

This guide will help you deploy your full-stack e-commerce application with Razorpay integration to Railway.

---

## Prerequisites

1. ✅ Railway account (sign up at https://railway.app)
2. ✅ GitHub account (to connect your repository)
3. ✅ Razorpay account with API keys
4. ✅ Git installed on your machine

---

## Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not already done)
```bash
cd /Users/csharptek/Desktop/Kaam/e-com
git init
git add .
git commit -m "Initial commit - E-commerce app with Razorpay"
```

### 1.2 Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository (e.g., "ecommerce-razorpay")
3. **DO NOT** initialize with README (you already have files)
4. Copy the repository URL

### 1.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/ecommerce-razorpay.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy on Railway

### 2.1 Create New Project
1. Go to https://railway.app/dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authenticate with GitHub (if first time)
5. Select your repository: `ecommerce-razorpay`
6. Railway will automatically detect it's a Node.js project

### 2.2 Configure Environment Variables
1. In Railway dashboard, click on your project
2. Go to **"Variables"** tab
3. Add the following environment variables:

**Required Variables:**
```
NODE_ENV=production
PORT=5001
JWT_SECRET=0a4576185613365fd545bc3773e50e12141e7416f1d53269e4bd2e7a466a066f0da8caae8e5c58a4f93a720f2978e4b5baf01976205dd6160adb34cc76ace895
RAZORPAY_KEY_ID=rzp_test_SWXmQkHwW73VmP
RAZORPAY_KEY_SECRET=i5qGQWX2BtVEnmUzzprdvhBb
```

⚠️ **For production, use Razorpay LIVE keys instead of test keys**

### 2.3 Add Volume for Database (Optional but Recommended)
1. In Railway dashboard, go to **"Settings"**
2. Scroll to **"Volumes"**
3. Click **"Add Volume"**
4. Set:
   - Mount Path: `/app/server/database.db`
   - Name: `ecommerce-db`
5. Click **"Add"**

This ensures your SQLite database persists across deployments.

---

## Step 3: Deployment Process

Railway will automatically:
1. ✅ Clone your repository
2. ✅ Install server dependencies
3. ✅ Install client dependencies
4. ✅ Build React frontend (Vite)
5. ✅ Start the Express server
6. ✅ Server will serve the built React app

### Monitor Deployment
- Watch the **"Deploy Logs"** tab in Railway
- Look for: `🚀 Server running on http://localhost:5001`
- Deployment takes ~2-3 minutes

---

## Step 4: Get Your Live URL

1. In Railway dashboard, go to **"Settings"**
2. Scroll to **"Domains"**
3. Click **"Generate Domain"**
4. You'll get a URL like: `https://ecommerce-razorpay-production.up.railway.app`
5. **Copy this URL** - this is your live app!

---

## Step 5: Update Frontend for Production

### 5.1 Update Client Environment Variables
Since the app is deployed, you need to update the Vite build to use production API URL:

**Option A: Use Relative URLs (Recommended)**
The app is already configured to work with relative URLs since server serves the client.

**Option B: If using separate domains**
Create `client/.env.production`:
```
VITE_API_URL=https://your-railway-url.up.railway.app
VITE_RAZORPAY_KEY_ID=rzp_test_SWXmQkHwW73VmP
```

Then commit and push:
```bash
git add client/.env.production
git commit -m "Add production environment variables"
git push
```

Railway will auto-deploy the update.

---

## Step 6: Test Your Deployment

### 6.1 Access Your App
Open your Railway URL in a browser:
```
https://your-app-name.up.railway.app
```

### 6.2 Test Features
1. ✅ Register a new user
2. ✅ Login
3. ✅ Browse products
4. ✅ Add items to cart
5. ✅ Go to checkout
6. ✅ Click "Pay with Razorpay"
7. ✅ Use test payment details:
   - Card: `4111 1111 1111 1111`
   - CVV: `123`
   - Expiry: Any future date

---

## Step 7: Switch to Production Mode (For Real Payments)

### 7.1 Get Live Razorpay Keys
1. Login to Razorpay Dashboard
2. Complete KYC verification
3. Switch to **LIVE Mode**
4. Go to Settings → API Keys
5. Generate Live Keys (start with `rzp_live_`)

### 7.2 Update Railway Environment Variables
1. In Railway dashboard, update:
```
RAZORPAY_KEY_ID=rzp_live_XXXXXX
RAZORPAY_KEY_SECRET=YYYYYY
```

2. Update client build:
```bash
# Update client/.env.production locally
VITE_RAZORPAY_KEY_ID=rzp_live_XXXXXX

# Commit and push
git add client/.env.production
git commit -m "Switch to live Razorpay keys"
git push
```

---

## Troubleshooting

### Build Fails
- Check Railway build logs
- Ensure all dependencies are in `package.json`
- Verify Node.js version (should be >=18.0.0)

### Database Issues
- Ensure volume is mounted at `/app/server/database.db`
- Check if database initializes on first run

### Payment Fails
- Verify Razorpay keys are correct
- Check browser console for errors
- Test with Razorpay test cards first

### 404 Errors
- Ensure server serves React build in production
- Check `server.js` has static file serving code

---

## Useful Railway Commands

### View Logs
```bash
railway logs
```

### Redeploy
```bash
git commit --allow-empty -m "Trigger rebuild"
git push
```

### Environment Variables via CLI
```bash
railway variables set KEY=value
```

---

## Database Backup (Important!)

Since you're using SQLite with a volume:

1. **Regular Backups:**
   - In Railway dashboard → Project → Settings
   - Download volume snapshot regularly

2. **Migrate to PostgreSQL (Recommended for production):**
   - Railway offers free PostgreSQL
   - More reliable for production
   - Better performance at scale

---

## Cost & Limits

**Railway Free Tier:**
- ✅ $5 free credits per month
- ✅ Enough for hobby projects
- ✅ 500 hours of usage
- ⚠️ Add credit card for more usage

**Upgrade if needed:**
- Pay-as-you-go after free tier
- ~$5-10/month for small apps

---

## Next Steps After Deployment

1. ✅ Set up custom domain (optional)
2. ✅ Enable SSL (automatic on Railway)
3. ✅ Set up monitoring/alerts
4. ✅ Configure backup strategy
5. ✅ Add admin user for production
6. ✅ Test payment flows thoroughly

---

## Support

- Railway Docs: https://docs.railway.app
- Razorpay Docs: https://razorpay.com/docs/
- Community: https://discord.gg/railway

---

## Quick Reference

**Your URLs:**
- Live App: `https://YOUR-APP.up.railway.app`
- Railway Dashboard: https://railway.app/dashboard
- GitHub Repo: `https://github.com/YOUR-USERNAME/ecommerce-razorpay`

**Environment Variables:**
```
NODE_ENV=production
PORT=5001
JWT_SECRET=[your-secret]
RAZORPAY_KEY_ID=[your-key-id]
RAZORPAY_KEY_SECRET=[your-key-secret]
```

---

🎉 **Congratulations!** Your e-commerce app is now live on Railway!
