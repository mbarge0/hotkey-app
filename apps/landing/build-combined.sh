#!/bin/bash
# Build script for combined landing page + review UI deployment

set -e

echo "🏗️  Building combined HotKey site..."

# 1. Build review UI
echo "📦 Building review UI..."
cd ../content-factory/review-ui
npm run build

# 2. Copy review UI to landing page /review folder
echo "📋 Copying review UI to /review..."
cd ../../hotkey-landing
rm -rf review
mkdir -p review
cp -r ../content-factory/review-ui/out/* review/

echo "✅ Build complete!"
echo ""
echo "📂 Structure:"
echo "   / → Landing page (index.html)"
echo "   /review → Review UI (Next.js app)"
echo ""
echo "🚀 Deploy with: netlify deploy --prod"
