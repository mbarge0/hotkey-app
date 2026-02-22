#!/bin/bash

# Fetch profile images from social platforms
# Usage: ./scripts/fetch-profile-images.sh

AVATARS_DIR="public/avatars"
mkdir -p "$AVATARS_DIR"

echo "🔍 Fetching profile images..."
echo ""

# Twitter
echo "📱 Twitter (@matthewbarge)..."
TWITTER_URL=$(curl -s "https://twitter.com/matthewbarge" 2>/dev/null | grep -o 'https://pbs.twimg.com/profile_images/[^"]*_400x400[^"]*' | head -1)

if [ -n "$TWITTER_URL" ]; then
  echo "   Found: $TWITTER_URL"
  curl -s -o "$AVATARS_DIR/twitter.jpg" "$TWITTER_URL"
  echo "   ✅ Saved to $AVATARS_DIR/twitter.jpg"
else
  echo "   ❌ Could not fetch Twitter image"
  echo "   Manual: Go to twitter.com/matthewbarge, right-click profile pic → Save image"
fi

echo ""

# LinkedIn (harder to fetch programmatically)
echo "💼 LinkedIn..."
echo "   ℹ️  LinkedIn requires authentication to fetch images"
echo "   Manual steps:"
echo "   1. Go to linkedin.com/in/yourprofile"
echo "   2. Right-click profile picture → Save image as"
echo "   3. Save to: $AVATARS_DIR/linkedin.jpg"

echo ""

# Instagram (also requires auth or workarounds)
echo "📸 Instagram (@themattbarge)..."
echo "   ℹ️  Instagram blocks direct fetching"
echo "   Manual steps:"
echo "   1. Go to instagram.com/themattbarge"
echo "   2. Right-click profile picture → Save image as"
echo "   3. Save to: $AVATARS_DIR/instagram.jpg"

echo ""
echo "─────────────────────────────────────────"
echo ""
echo "Next steps:"
echo "1. Manually save LinkedIn & Instagram images to $AVATARS_DIR/"
echo "2. Update app/config/profile.ts with these paths:"
echo ""
echo "   twitter: { avatar: '/avatars/twitter.jpg' }"
echo "   linkedin: { avatar: '/avatars/linkedin.jpg' }"
echo "   instagram: { avatar: '/avatars/instagram.jpg' }"
echo ""
echo "3. Rebuild: npm run build"
echo "4. Deploy: netlify deploy --prod --dir=out"
echo ""
