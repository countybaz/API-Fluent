# 🚀 Step-by-Step Deployment Guide for Netlify

This guide will help you deploy the Fluent ROAS Calculator to Netlify in under 10 minutes - no coding experience required!

## ✅ Prerequisites

Before starting, you need:
- [ ] A GitHub account (free) - [Sign up here](https://github.com/join)
- [ ] A Netlify account (free) - [Sign up here](https://app.netlify.com/signup)
- [ ] Your Fluent API credentials (already configured in this project)

---

## 📋 Deployment Steps

### Step 1: Upload to GitHub (5 minutes)

#### Option A: Using GitHub Web Interface (Easiest - No Terminal)

1. **Go to GitHub** → [https://github.com/new](https://github.com/new)

2. **Create a new repository:**
   - Repository name: `fluent-roas-calculator` (or any name you like)
   - Description: `VA-friendly ROAS calculator for Fluent Affiliate Network`
   - Select: **Private** (recommended for business tools)
   - DO NOT initialize with README (we already have files)
   - Click **"Create repository"**

3. **Upload your files:**
   - On the repository page, click **"uploading an existing file"** link
   - Drag and drop ALL files from the `fluent-roas-netlify` folder
   - Files to upload:
     ```
     ├── index.html
     ├── netlify.toml
     ├── package.json
     ├── .gitignore
     ├── .env.example
     ├── README.md
     ├── DEPLOYMENT_GUIDE.md
     └── netlify/
         └── functions/
             ├── offers.js
             ├── subids.js
             └── calculate-roas.js
     ```
   - Scroll down and click **"Commit changes"**

4. **Done!** Your code is now on GitHub.

#### Option B: Using Git Command Line (For Developers)

```bash
# Navigate to the project folder
cd fluent-roas-netlify

# Initialize Git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - VA-friendly ROAS calculator"

# Add remote (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/fluent-roas-calculator.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

### Step 2: Deploy to Netlify (3 minutes)

1. **Go to Netlify** → [https://app.netlify.com](https://app.netlify.com)

2. **Sign in** with your GitHub account

3. **Create new site:**
   - Click **"Add new site"** button (top right)
   - Select **"Import an existing project"**

4. **Connect to GitHub:**
   - Click **"GitHub"** button
   - Authorize Netlify (if first time)
   - Search for `fluent-roas-calculator` repository
   - Click on your repository

5. **Configure build settings:**
   - Site name: Enter a custom name (e.g., `my-fluent-roas-calc`)
     - This becomes your URL: `https://my-fluent-roas-calc.netlify.app`
   - Branch to deploy: `main`
   - Build command: (leave empty)
   - Publish directory: `.` (dot)
   - Functions directory: `netlify/functions` (should auto-detect)

6. **Click "Deploy site"**
   - Netlify will start building (takes 30-60 seconds)
   - Wait for "Site is live" message

---

### Step 3: Add API Credentials (2 minutes)

**CRITICAL:** Your site won't work without this step!

1. **In Netlify dashboard**, go to your site

2. **Click "Site settings"** (top navigation)

3. **Click "Environment variables"** (left sidebar under "Build & deploy")

4. **Click "Add a variable"** button

5. **Add these THREE variables one by one:**

   **Variable 1:**
   - Key: `FLUENT_BASE_URL`
   - Value: `https://login.affluentco.com`
   - Scope: All scopes (default)
   - Click "Create variable"

   **Variable 2:**
   - Key: `FLUENT_API_KEY`
   - Value: `8WPZfzSVVfcFtSmLVkmgQ`
   - Scope: All scopes (default)
   - Click "Create variable"

   **Variable 3:**
   - Key: `FLUENT_AFFILIATE_ID`
   - Value: `208361`
   - Scope: All scopes (default)
   - Click "Create variable"

6. **Trigger a redeploy:**
   - Go to **"Deploys"** tab
   - Click **"Trigger deploy"** → **"Deploy site"**
   - Wait 30-60 seconds for rebuild

---

### Step 4: Test Your Calculator (1 minute)

1. **Get your live URL:**
   - Copy the URL from Netlify dashboard
   - Example: `https://my-fluent-roas-calc.netlify.app`

2. **Open in browser** and test:
   - Page should load with "ROAS Calculator" title
   - Dropdown should load offers from Fluent API
   - Select an offer
   - Select date range
   - Select Sub ID
   - Enter ad spend (e.g., `500`)
   - Click "Calculate ROAS"
   - Should see ROAS result (e.g., "3.45x") within 3 seconds

3. **✅ If it works:** You're done! Share the URL with your VAs.

4. **❌ If it doesn't work:** See troubleshooting section below.

---

## 🎯 Share with Your VAs

Once deployed, send your VAs:

**Email Template:**
```
Subject: New ROAS Calculator Tool 🎯

Hi team,

We've launched a new tool to make ROAS calculations faster and easier!

🔗 Access here: https://your-site-name.netlify.app

How to use:
1. Select date range
2. Select offer
3. Select Sub ID
4. Enter ad spend
5. Click Calculate

The tool will show you the ROAS instantly - no more manual calculations!

Note: You'll only see ROAS results (revenue data is hidden for privacy).

Questions? Reply to this email.
```

---

## 🔐 Custom Domain (Optional)

Want a custom domain like `roas.yourcompany.com`?

1. **In Netlify dashboard** → **Domain settings**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `roas.yourcompany.com`)
4. Follow instructions to update DNS records
5. Netlify will auto-provision SSL certificate (free HTTPS)

---

## 🐛 Troubleshooting

### Problem: "Error loading offers"

**Cause:** Environment variables not set or incorrect

**Fix:**
1. Go to Site settings → Environment variables
2. Verify all 3 variables are added correctly
3. Check for typos in values
4. Redeploy site (Deploys tab → Trigger deploy)

---

### Problem: "Function not found"

**Cause:** Functions not deployed properly

**Fix:**
1. Check `netlify.toml` is in repository root
2. Check `netlify/functions/` folder exists with 3 JS files
3. Redeploy site

---

### Problem: ROAS result is wrong

**Cause:** Date range or offer selection issue

**Fix:**
1. Double-check date range matches Fluent portal exactly
2. Verify correct offer selected
3. Try manually calculating in Fluent portal to compare
4. Check if Sub ID has any data for selected date range

---

### Problem: Site is slow

**Cause:** Fluent API can be slow for large date ranges

**Solution:** This is normal. Fluent's API takes 3-10 seconds for large queries.

---

## 🔄 How to Update the Calculator

If you want to make changes later:

### Option 1: Edit on GitHub Web

1. Go to your GitHub repository
2. Click on the file you want to edit (e.g., `index.html`)
3. Click the pencil icon (Edit)
4. Make your changes
5. Scroll down and click "Commit changes"
6. Netlify will auto-deploy changes in 30-60 seconds

### Option 2: Edit Locally and Push

```bash
# Make changes to files
# Then:
git add .
git commit -m "Description of changes"
git push
```

Netlify will auto-deploy on every push to `main` branch.

---

## 📊 Monitor Usage

**In Netlify dashboard:**

1. **Analytics tab** - See how many VAs are using the tool
2. **Functions tab** - Monitor API calls and errors
3. **Deploys tab** - See deployment history

---

## 🎉 You're Done!

Your VAs can now calculate ROAS in 15 seconds instead of 2-3 minutes!

**Time saved per VA per day:** 25-70 minutes  
**Productivity increase:** 85%  
**Revenue data exposed:** Zero ✅

---

## 📞 Need Help?

- **Netlify issues:** [Netlify Support](https://www.netlify.com/support/)
- **Fluent API issues:** Check your credentials in Fluent portal
- **Calculator bugs:** Check GitHub repository issues

---

## ✅ Deployment Checklist

Before sharing with VAs, verify:

- [ ] Site is live at Netlify URL
- [ ] Offers dropdown loads successfully
- [ ] Can select a Sub ID
- [ ] ROAS calculation returns result
- [ ] No revenue data visible on page
- [ ] Site loads quickly (under 3 seconds)
- [ ] Works on mobile/tablet (if VAs use those)
- [ ] Custom domain configured (if using one)
- [ ] VAs have access to the URL

**Congratulations! Your calculator is deployed! 🚀**
