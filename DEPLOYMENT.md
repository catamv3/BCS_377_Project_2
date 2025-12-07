# Q-Unit Deployment Guide

This guide will walk you through deploying your Q-Unit quiz application to Render (free hosting).

## Prerequisites

- ✅ GitHub account
- ✅ MongoDB Atlas account (free tier)
- ✅ Render account (free tier)
- ✅ Your quiz app code pushed to GitHub

---

## Step 1: Set Up MongoDB Atlas (Cloud Database)

Since Render needs a cloud database, we'll use MongoDB Atlas's free tier.

### 1.1 Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with email or Google (NO CREDIT CARD REQUIRED)

### 1.2 Create a Cluster

1. Choose **FREE** shared cluster (M0 Sandbox)
2. Select a cloud provider and region (choose closest to you)
3. Cluster Name: `QuizAppCluster` (or any name)
4. Click "Create Cluster" (takes 1-3 minutes)

### 1.3 Set Up Database Access

1. In left sidebar, click **Database Access**
2. Click **"Add New Database User"**
3. Authentication Method: **Password**
4. Username: `bcs377user`
5. Password: Click "Autogenerate Secure Password" and **SAVE IT**
6. Database User Privileges: **Read and write to any database**
7. Click **"Add User"**

### 1.4 Set Up Network Access

1. In left sidebar, click **Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This is needed because Render's IP changes
4. Click **"Confirm"**

### 1.5 Get Connection String

1. Click **"Database"** in left sidebar
2. Click **"Connect"** button on your cluster
3. Select **"Connect your application"**
4. Driver: **Node.js**, Version: **4.1 or later**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://bcs377user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with the password you saved earlier
7. Add database name before the `?`:
   ```
   mongodb+srv://bcs377user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/bcs377project2?retryWrites=true&w=majority
   ```
8. **SAVE THIS CONNECTION STRING** - you'll need it for Render

---

## Step 2: Prepare Your Code for Deployment

### 2.1 Verify package.json

Make sure your `package.json` has the start script:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 2.2 Update server.js Port Configuration

Ensure your server uses environment variable for port:

```javascript
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

This is already done in your code! ✅

### 2.3 Create .gitignore (Already Done)

You already have `.gitignore` that excludes:
- `node_modules/`
- `.env`
- `.DS_Store`

### 2.4 Push to GitHub

1. Initialize git (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Q-Unit quiz app"
   ```

2. Create a new repository on GitHub (don't initialize with README)

3. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/BCS_377_Project_2.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 3: Deploy to Render

### 3.1 Create Render Account

1. Go to https://render.com
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (recommended) or email
4. **NO CREDIT CARD REQUIRED**

### 3.2 Connect GitHub Repository

1. After signing in, you'll see the Render Dashboard
2. Click **"New +"** button (top right)
3. Select **"Web Service"**
4. Click **"Connect a repository"**
5. If first time: Click **"Connect GitHub"** and authorize Render
6. Find and select your `BCS_377_Project_2` repository
7. Click **"Connect"**

### 3.3 Configure Web Service

Fill in the following settings:

**Basic Settings:**
- **Name**: `BCS-377-Project-2` (or any name, will be part of your URL)
- **Region**: Choose closest to you (e.g., Oregon, Ohio, Frankfurt)
- **Branch**: `main`
- **Root Directory**: Leave blank
- **Runtime**: **Node**
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- Select **"Free"** (0.1 CPU, 512 MB RAM)
- Scroll down to see the Free option

### 3.4 Add Environment Variables

Scroll down to **"Environment Variables"** section:

1. Click **"Add Environment Variable"**

2. Add these three variables:

   **Variable 1:**
   - Key: `MONGO_URI`
   - Value: Your MongoDB Atlas connection string from Step 1.5

   **Variable 2:**
   - Key: `SESSION_SECRET`
   - Value: Any random string (e.g., `myRandomSecret123!@#`)

   **Variable 3:**
   - Key: `PORT`
   - Value: `3000`

3. Click **"Create Web Service"**

### 3.5 Wait for Deployment

1. Render will start building your app
2. You'll see logs in real-time
3. Look for:
   ```
   ==> Build successful 🎉
   ==> Deploying...
   ==> Your service is live 🎉
   ```
4. This takes 2-5 minutes for first deploy

### 3.6 Access Your Live App

1. Once deployed, Render gives you a URL like:
   ```
   https://BCS-377-Project-2.onrender.com
   ```
2. Click the URL or copy it
3. Your Q-Unit app is now live! 🎉

---

## Step 4: Test Your Deployed App

1. **Visit your app URL**
2. **Test sign up** - Create a new account
3. **Test login** - Log in with your credentials
4. **Take a quiz** - Complete a full quiz
5. **Check profile** - View your play history
6. **Check leaderboard** - See if your score appears

---

## Troubleshooting

### Build Fails

**Error:** `Cannot find module 'express'`
- **Solution:** Make sure all dependencies are in `package.json`
- Run `npm install` locally first to verify

### Database Connection Error

**Error:** `MongoDB connection error`
- **Solution:** Check your `MONGO_URI` in Render environment variables
- Make sure you replaced `<password>` with actual password
- Verify MongoDB Atlas allows access from anywhere (0.0.0.0/0)

### App Times Out

**Issue:** Render free tier "spins down" after 15 minutes of inactivity
- **Solution:** First request after inactivity takes 30-60 seconds to "wake up"
- This is normal for free tier
- Upgrade to paid tier ($7/month) for always-on service

### Session Issues

**Error:** Session not persisting between requests
- **Solution:** Make sure `SESSION_SECRET` is set in Render environment variables
- Don't use special characters that might need escaping

---

## Updating Your Deployed App

When you make changes to your code:

1. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update: description of changes"
   git push origin main
   ```

2. Render automatically detects the push and redeploys
3. Wait 2-3 minutes for new version to go live

You can also manually trigger deploy:
- Go to Render Dashboard
- Select your web service
- Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## Important Notes

### Free Tier Limitations

- ✅ **Free forever** (no credit card)
- ⏰ **Spins down after 15 min inactivity** (wakes up on first request)
- 💾 **512 MB RAM** (sufficient for quiz app)
- 🌐 **Custom domain** supported (optional, requires domain ownership)
- 📊 **750 hours/month** (enough for learning/testing)

### Security Best Practices

- ✅ Never commit `.env` file to GitHub
- ✅ Use strong passwords for MongoDB
- ✅ Change `SESSION_SECRET` to a random string
- ✅ Keep dependencies updated

---

## Submission Checklist

For your project submission, provide:

1. ✅ **GitHub Repository URL**
   - Example: `https://github.com/YourUsername/BCS_377_Project_2`

2. ✅ **Live App URL (Render)**
   - Example: `https://BCS-377-Project-2.onrender.com`

3. ✅ **README.md** (already created with team info and features)

---

## Alternative: Deploy to Heroku

If you prefer Heroku over Render:

### Quick Heroku Steps

1. Create account at https://heroku.com (free tier)
2. Install Heroku CLI
3. Login: `heroku login`
4. Create app: `heroku create BCS-377-Project-2`
5. Set environment variables:
   ```bash
   heroku config:set MONGO_URI="your-connection-string"
   heroku config:set SESSION_SECRET="your-secret"
   ```
6. Deploy: `git push heroku main`
7. Open app: `heroku open`

**Note:** Heroku removed free tier in 2022, but still has low-cost options.

---

## Success! 🎉

Your Q-Unit quiz app is now deployed and accessible worldwide!

**Next Steps:**
- Share the URL with friends to test multiplayer features
- Monitor performance in Render dashboard
- Check MongoDB Atlas for database usage
- Consider adding more features (Trivia API integration, etc.)

---

## Support Resources

- **Render Docs**: https://render.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Express.js Deployment**: https://expressjs.com/en/advanced/best-practice-performance.html
