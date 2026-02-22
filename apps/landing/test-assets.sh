#!/bin/bash
# Test if assets are accessible

echo "Testing asset paths..."
echo ""

echo "1. CSS file:"
curl -I "https://content-factory-review.netlify.app/review/_next/static/css/215d33a30e441d76.css" 2>&1 | grep -E "HTTP|content-type"
echo ""

echo "2. JS file:"
curl -I "https://content-factory-review.netlify.app/review/_next/static/chunks/117-f9bca466146858ac.js" 2>&1 | grep -E "HTTP|content-type"
echo ""

echo "3. batch.json:"
curl -I "https://content-factory-review.netlify.app/review/batch.json" 2>&1 | grep -E "HTTP|content-type"
echo ""

echo "4. Check local files:"
ls -la ~/clawd/hotkey-landing/review/_next/static/css/
ls -la ~/clawd/hotkey-landing/review/_next/static/chunks/ | head -10
