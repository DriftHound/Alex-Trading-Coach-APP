# Deployment Guide for Netlify

## Important: Next.js Deployment Method

This is a **Next.js application**, not a static HTML site. Netlify requires a specific setup for Next.js apps.

## Option 1: Deploy via Netlify Dashboard (Recommended)

### Step 1: Push to Git
```bash
cd "/Users/brain/Desktop/Confluence Checklist Coach APP"

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - Confluence Checklist Coach App"

# Push to GitHub/GitLab/Bitbucket
# (Create a new repository first on your Git provider)
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### Step 2: Connect to Netlify
1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose your Git provider (GitHub/GitLab/Bitbucket)
4. Select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 20
6. Add environment variable:
   - Key: `NEXT_PUBLIC_API_BASE_URL`
   - Value: `https://api.manus.im/v1` (or your actual API URL)
7. Click "Deploy site"

Netlify will automatically detect it's a Next.js app and use the `@netlify/plugin-nextjs` plugin.

---

## Option 2: Deploy via Netlify CLI

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify
```bash
netlify login
```

### Step 3: Initialize Netlify Site
```bash
cd "/Users/brain/Desktop/Confluence Checklist Coach APP"
netlify init
```

Follow the prompts:
- Create & configure a new site
- Choose your team
- Site name: `confluence-checklist-coach` (or your preferred name)
- Build command: `npm run build`
- Directory to deploy: `.next`

### Step 4: Set Environment Variables
```bash
netlify env:set NEXT_PUBLIC_API_BASE_URL "https://api.manus.im/v1"
```

### Step 5: Deploy
```bash
# Deploy to production
netlify deploy --prod

# Or deploy to preview first
netlify deploy
```

---

## Why Drag-and-Drop Doesn't Work

Next.js applications require:
1. **Server-side rendering** - Not just static HTML files
2. **API routes** - Your `/api/auth/*` endpoints need a Node.js server
3. **Dynamic routing** - Next.js handles routing dynamically
4. **Build process** - The `.next` folder contains compiled server code

Netlify's drag-and-drop is designed for **static HTML sites only**. For Next.js, you must use Git-based deployment or the CLI.

---

## Verifying Deployment

After deployment, Netlify will:
1. Install dependencies (`npm install`)
2. Build your app (`npm run build`)
3. Deploy the `.next` folder
4. Automatically configure serverless functions for API routes
5. Set up CDN caching

Your site will be live at: `https://YOUR_SITE_NAME.netlify.app`

---

## Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Ensure Node version is set to 20
- Verify all dependencies are in `package.json`

### Environment Variables
- Add `NEXT_PUBLIC_API_BASE_URL` in Netlify dashboard
- Go to Site settings → Environment variables
- Redeploy after adding variables

### API Routes Not Working
- Ensure `@netlify/plugin-nextjs` is installed (automatic)
- Check that `netlify.toml` is in the root directory
- Verify API routes are in `app/api/` directory

---

## Quick Start (Recommended Path)

```bash
# 1. Push to GitHub
cd "/Users/brain/Desktop/Confluence Checklist Coach APP"
git init
git add .
git commit -m "Initial commit"
# Create repo on GitHub, then:
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main

# 2. Go to Netlify Dashboard
# - Import from GitHub
# - Select your repo
# - Click Deploy

# Done! Netlify handles the rest automatically.
```

---

## Alternative: Vercel Deployment

If you prefer, this Next.js app can also deploy to Vercel (made by Next.js creators):

```bash
npm install -g vercel
vercel login
vercel
```

Vercel has even better Next.js support and zero configuration needed.
