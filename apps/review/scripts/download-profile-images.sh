#!/bin/bash

# Download profile images from social platforms
# Platforms block automated scraping, so this provides manual + semi-automated options

AVATARS_DIR="$(dirname "$0")/../public/avatars"
mkdir -p "$AVATARS_DIR"

echo "🎨 Downloading Profile Images"
echo "────────────────────────────────────────"
echo ""

# Method 1: Browser automation (easiest for you)
echo "📱 METHOD 1: Browser Download (Recommended)"
echo ""
echo "1. Twitter (@matthewbarge):"
echo "   → Open: https://twitter.com/matthewbarge"
echo "   → Right-click profile picture → 'Save Image As...'"
echo "   → Save to: $AVATARS_DIR/twitter.jpg"
echo ""
echo "2. LinkedIn:"
echo "   → Open: https://linkedin.com/in/matt-barge (or your profile URL)"
echo "   → Right-click profile picture → 'Save Image As...'"
echo "   → Save to: $AVATARS_DIR/linkedin.jpg"
echo ""
echo "3. Instagram (@themattbarge):"
echo "   → Open: https://instagram.com/themattbarge"
echo "   → Right-click profile picture → 'Save Image As...'"
echo "   → Save to: $AVATARS_DIR/instagram.jpg"
echo ""
echo "────────────────────────────────────────"
echo ""

# Method 2: Use browser DevTools to get URLs
echo "📱 METHOD 2: Get URLs via DevTools"
echo ""
echo "For each platform:"
echo "1. Open the profile page in browser"
echo "2. Right-click profile pic → 'Inspect'"
echo "3. Find the <img> tag with the profile picture"
echo "4. Copy the src URL"
echo "5. Run: curl -o $AVATARS_DIR/PLATFORM.jpg 'URL'"
echo ""
echo "────────────────────────────────────────"
echo ""

# Check if images exist
echo "📊 Current Status:"
echo ""
for platform in twitter linkedin instagram; do
    if [ -f "$AVATARS_DIR/$platform.jpg" ]; then
        size=$(du -h "$AVATARS_DIR/$platform.jpg" | cut -f1)
        echo "   ✅ $platform.jpg ($size)"
    else
        echo "   ❌ $platform.jpg (missing)"
    fi
done
echo ""

# Offer to generate placeholder if none exist
if [ ! -f "$AVATARS_DIR/twitter.jpg" ] && [ ! -f "$AVATARS_DIR/linkedin.jpg" ] && [ ! -f "$AVATARS_DIR/instagram.jpg" ]; then
    echo "Would you like me to generate placeholder avatars with initials 'MB'?"
    echo "These will work until you add real photos."
    echo ""
    echo "Run: ./scripts/generate-placeholder-avatars.sh"
fi

echo "────────────────────────────────────────"
echo ""
echo "After downloading, update the config:"
echo "Edit: app/config/profile.ts"
echo ""
echo "Change avatar URLs to:"
echo "  twitter: { avatar: '/avatars/twitter.jpg' }"
echo "  linkedin: { avatar: '/avatars/linkedin.jpg' }"
echo "  instagram: { avatar: '/avatars/instagram.jpg' }"
echo ""
echo "Then rebuild and deploy:"
echo "  npm run build"
echo "  netlify deploy --prod --dir=out"
echo ""
