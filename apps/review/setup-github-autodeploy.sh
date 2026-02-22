#!/bin/bash
# Setup GitHub auto-deploy for Netlify

echo "Setting up GitHub auto-deploy..."

# The manual way (requires browser):
echo ""
echo "To enable auto-deploy from GitHub:"
echo "1. Go to: https://app.netlify.com/projects/content-factory-review/settings/deploys"
echo "2. Scroll to 'Build & deploy'"
echo "3. Click 'Link repository'"
echo "4. Choose GitHub"
echo "5. Select: mbarge0/content-review-ui"
echo "6. Branch: main"
echo "7. Build command: npm run build"
echo "8. Publish directory: out"
echo "9. Click 'Save'"
echo ""
echo "After that, every 'git push' will auto-deploy!"
