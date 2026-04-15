# PostgreSQL + Railway Deployment Guide

## 🎯 Overview
Your e-commerce app now supports **PostgreSQL for production** and **SQLite for local development**. This guide will walk you through deploying to Railway with PostgreSQL.

---

## ✅ What Was Changed

### 1. Database Layer
- ✅ Added PostgreSQL support via `pg` package
- ✅ Auto-detection: Uses PostgreSQL in production, SQLite locally
- ✅ Unified query interface works with both databases
- ✅ All routes updated to use async/await patterns

### 2. SQL Compatibility
- ✅ Parameter placeholders: `$1, $2...` (PostgreSQL) vs `?` (SQLite)
- ✅ Auto-increment: `SERIAL` (PostgreSQL) vs `INTEGER PRIMARY KEY AUTOINCREMENT` (SQLite)
- ✅ Data types: Compatible across both databases
- ✅ RETURNING clause for PostgreSQL INSERT operations

### 3. Environment Variables
- ✅ `DATABASE_URL` - PostgreSQL connection string (production only)
- ✅ Local development works without any database configuration

---

## 🚀 Railway Deployment Steps

### Step 1: Push Your Code to GitHub

```bash
cd /Users/csharptek/Desktop/Kaam/e-com

# Initialize git if not already done
git init
git add .
git commit -m "Add PostgreSQL support for production"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/alankara-tribal.git
git branch -M main
git push -u origin main
```

---

### Step 2: Create Railway Project

1. Go to **https://railway.app/dashboard**
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authenticate with GitHub (if first time)
5. Select your repository: `alankara-tribal`

Railway will automatically:
- Detect it's a Node.js project
- Install dependencies
- Build and deploy

---

### Step 3: Add PostgreSQL Database

**This is the critical step for production!**

1. In your Railway project dashboard, click **"+ New"**
2. Select **"Database"**
3. Choose **"PostgreSQL"**
4. Railway will:
   - ✅ Create a PostgreSQL instance
   - ✅ Auto-generate database credentials
   - ✅ Set the `DATABASE_URL` environment variable

**Important:** The `DATABASE_URL` will be automatically linked to your app service!

---

### Step 4: Configure Environment Variables

1. Click on your **app service** (not the database)
2. Go to **"Variables"** tab
3. Add the following variables:

```env
NODE_ENV=production
PORT=5001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
RAZORPAY_KEY_ID=rzp_test_SWXmQkHwW73VmP
RAZORPAY_KEY_SECRET=i5qGQWX2BtVEnmUzzprdvhBb
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
ADMIN_EMAIL=admin@alankaratribal.com
```

**Security Notes:**
- ✅ Generate a strong JWT secret: `openssl rand -hex 64`
- ✅ For live payments, switch to Razorpay LIVE keys
- ✅ Use Gmail App Password, not your actual Gmail password

**Database URL:**
- ✅ `DATABASE_URL` should already be set automatically
- ✅ Verify it exists: It should look like `postgresql://postgres:...@...railway.app:5432/railway`

---

### Step 5: Deploy and Initialize Database

1. Railway will trigger a new deployment
2. Check the **"Deployments"** tab
3. Watch the logs - you should see:
   ```
   🐘 Using PostgreSQL database
   ✅ Database initialized successfully
   🚀 Server running on http://localhost:5001
   ```

4. Database tables are created automatically on first run!

---

### Step 6: Get Your Live URL

1. In Railway dashboard, click on your app service
2. Go to **"Settings"** tab
3. Scroll to **"Networking"** section
4. Click **"Generate Domain"**
5. You'll get a URL like: `https://alankara-tribal-production.up.railway.app`

---

### Step 7: Test Your Production App

Visit your Railway URL and test:

1. ✅ **Homepage** - Should load products
2. ✅ **Register** - Create a new account
3. ✅ **Login** - Sign in with your account
4. ✅ **Products** - Browse catalog
5. ✅ **Add to Cart** - Add items
6. ✅ **Checkout** - Test payment flow
7. ✅ **Admin Login** - Use: `admin@shophub.com` / `admin123`

**Test Payment:**
- Card: `4111 1111 1111 1111`
- CVV: `123`
- Expiry: Any future date

---

## 🔧 Troubleshooting

### Issue: "Database connection error"
**Solution:**
- Verify `DATABASE_URL` is set in Variables tab
- Check PostgreSQL service is running in Railway
- Look at deployment logs for specific error

### Issue: "No products showing"
**Solution:**
- Database may not have initialized
- Check logs for "Database initialized successfully"
- Restart the deployment if needed

### Issue: "Payment failing"
**Solution:**
- Verify Razorpay keys are correct
- Check Razorpay dashboard for error logs
- Ensure keys match test/live mode

### Issue: "Build failed"
**Solution:**
```bash
# Install dependencies locally first
cd server
npm install

# If successful, commit package-lock.json
git add server/package-lock.json
git commit -m "Add package-lock.json"
git push
```

---

## 📊 Database Management

### Viewing Database Data

1. In Railway, click on the **PostgreSQL** service
2. Go to **"Data"** tab
3. You can browse tables: `users`, `products`, `orders`, `order_items`

### Connecting with External Tools

Railway provides connection details for tools like pgAdmin, DBeaver, or Postico:

1. Click PostgreSQL service
2. Go to **"Connect"** tab
3. Copy connection details:
   - Host
   - Port
   - Database
   - Username
   - Password

### Running SQL Queries

In Railway PostgreSQL service:
1. Go to **"Query"** tab
2. Run SQL queries directly:

```sql
-- View all users
SELECT * FROM users;

-- View all products
SELECT * FROM products;

-- View recent orders
SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;
```

---

## 🔄 Local Development

Your local setup still uses SQLite - no changes needed!

```bash
# Local development
cd server
npm run dev

# Uses SQLite automatically
# Database file: ./database.db
```

To test with PostgreSQL locally:
1. Install PostgreSQL locally or use Docker
2. Set `DATABASE_URL` in `.env`:
   ```env
   DATABASE_URL=postgresql://localhost:5432/ecommerce
   ```

---

## 🚀 Production Checklist

Before going live with real payments:

- [ ] Switch to Razorpay LIVE keys
- [ ] Change default admin password
- [ ] Set strong JWT_SECRET
- [ ] Configure real SMTP credentials
- [ ] Set up domain (optional)
- [ ] Enable Railway backups
- [ ] Test all features end-to-end
- [ ] Monitor error logs

---

## 📈 Scaling & Performance

### Railway Benefits:
- ✅ Auto-scaling based on traffic
- ✅ Automatic SSL certificates
- ✅ CDN for static assets
- ✅ PostgreSQL backups
- ✅ Easy rollback to previous deployments

### PostgreSQL Performance:
- ✅ Handles thousands of concurrent connections
- ✅ ACID compliance for reliable transactions
- ✅ Built-in indexing for fast queries
- ✅ Better than SQLite for production workloads

---

## 💰 Railway Pricing

- **Free Tier:** $5 credit per month (enough for testing)
- **Usage-based:** ~$5-20/month for small apps
- PostgreSQL addon: Included in usage pricing

---

## 🎉 You're Done!

Your e-commerce app is now running on Railway with PostgreSQL!

**Key URLs:**
- 🌐 Live App: `https://your-app.up.railway.app`
- 📊 Railway Dashboard: https://railway.app/dashboard
- 💳 Razorpay Dashboard: https://dashboard.razorpay.com

**Need Help?**
- Railway Docs: https://docs.railway.app
- PostgreSQL Docs: https://www.postgresql.org/docs/
- Razorpay Docs: https://razorpay.com/docs/

---

## 🔐 Security Best Practices

1. **Never commit `.env` files**
   ```bash
   # Add to .gitignore
   echo ".env" >> .gitignore
   ```

2. **Rotate secrets regularly**
   - Change JWT_SECRET every 3-6 months
   - Update database passwords periodically

3. **Use different keys per environment**
   - Test keys for development
   - Live keys for production only

4. **Monitor logs**
   - Check Railway logs daily
   - Set up alerts for errors

---

**Happy Deploying! 🚀**
