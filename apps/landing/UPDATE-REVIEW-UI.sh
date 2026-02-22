#!/bin/bash
# Quick script to update review UI after changes

set -e

echo "🔄 Updating Review UI..."

# 1. Build review UI
echo "📦 Building review UI..."
cd ../content-factory/review-ui
npm run build

# 2. Copy to hotkey-landing
echo "📋 Copying to hotkey-landing..."
cd ../../hotkey-landing
rm -rf review
cp -r ../content-factory/review-ui/out review/

echo "✅ Review UI updated!"
echo ""
echo "🚀 Next steps:"
echo "   git add review/"
echo "   git commit -m 'Update review UI'"
echo "   netlify deploy --prod"
