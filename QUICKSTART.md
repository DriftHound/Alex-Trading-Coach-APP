# Quick Start Guide

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env.local` file:
```bash
echo "NEXT_PUBLIC_API_BASE_URL=https://api.manus.im/v1" > .env.local
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## Deployment to Netlify

**⚠️ Important**: This is a Next.js app, not a static HTML site. **Drag-and-drop will NOT work**.

### Recommended Method: Git-Based Deployment

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Select your GitHub repository
   - Netlify auto-detects Next.js settings
   - Add environment variable: `NEXT_PUBLIC_API_BASE_URL`
   - Click "Deploy"

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

---

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Login/Signup pages
│   ├── (dashboard)/       # Protected dashboard pages
│   └── api/auth/          # Authentication API routes
├── components/            # React components
│   ├── layout/           # Sidebar, TopBar, etc.
│   ├── workflow/         # 6-step workflow components
│   ├── journal/          # Trade journal components
│   └── settings/         # Settings components
├── lib/                   # Utilities and API client
├── store/                 # Zustand state management
└── types/                 # TypeScript definitions
```

---

## Key Features

- ✅ JWT Authentication with httpOnly cookies
- ✅ 6-step trade validation workflow
- ✅ Real-time "Alex Time" session tracking
- ✅ Pattern validation with confluence scoring
- ✅ R:R calculation with 1:2 minimum enforcement
- ✅ Trade journal with AI coaching insights
- ✅ Screenshot upload for trade evidence
- ✅ AOI monitoring and weekly reports

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Forms**: React Hook Form + Zod
- **Charts**: TradingView Lightweight Charts (ready for integration)
- **Deployment**: Netlify / Vercel

---

## Need Help?

- See [README.md](./README.md) for full documentation
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment guide
- See [walkthrough.md](./.gemini/antigravity/brain/71744fd3-f596-4cdc-ab44-d3ef0d3ca942/walkthrough.md) for implementation details
