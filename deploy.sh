#!/bin/bash

echo "🚀 Deploying Alex Trading Coach to Netlify..."
echo ""

# Check if changes are committed
if [[ -n $(git status -s) ]]; then
    echo "📝 Uncommitted changes detected. Committing..."
    git add .
    git commit -m "Integrate Manus OAuth and API - $(date +%Y-%m-%d)"
else
    echo "✅ No uncommitted changes"
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "Next steps:"
echo "1. Go to Netlify Dashboard: https://app.netlify.com"
echo "2. Check deployment status"
echo "3. Set environment variable:"
echo "   NEXT_PUBLIC_API_BASE_URL=https://3000-ivs6mmlhg9m3tj3d6stg6-3c645c19.manusvm.computer/api/agents"
echo "4. Trigger redeploy if needed"
echo ""
echo "📖 See MANUS_INTEGRATION.md for full integration guide"
