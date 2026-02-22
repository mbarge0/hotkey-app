# Deployment Fix - Feb 21, 2026 3:35 PM CST

## Problems Fixed

### 1. Netlify Not Serving JSON Files
**Issue:** `/batch.json` was returning HTML instead of JSON

**Root Cause:**  
`netlify.toml` had a catch-all redirect:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

This intercepted `/batch.json` and redirected to `/index.html`, causing the app to return the 404 page HTML instead of the JSON file.

**Fix:**  
Removed the catch-all redirect entirely. Next.js static export handles routing internally, doesn't need it.

**New `netlify.toml`:**
```toml
[build]
  command = "npm run build"
  publish = "out"
```

### 2. Header Order Wrong
**Issue:** Header showed: `ai | Score: 78 | App Store Defense System`  
**Wanted:** `App Store Defense System | ai | Score: 78`

**Fix:**  
Reordered JSX elements in header:
```tsx
<span className="text-sm font-medium text-gray-700">{batch.story.title}</span>
<span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
  {batch.story.pillar}
</span>
<span className="text-sm text-gray-500">Score: {batch.story.score}</span>
```

### 3. No Story Navigation
**Issue:** UI only showed first story, no way to navigate between multiple stories

**Fix:**  
1. Updated `generate-review-data.js` to create array of all pending stories:
```js
{
  batches: [...],  // All stories
  currentIndex: 0,
  total: 3
}
```

2. Added navigation controls to UI header:
```tsx
{batchData && batchData.total > 1 && (
  <div className="flex items-center gap-2">
    <button onClick={() => setCurrentIndex(currentIndex - 1)}>←</button>
    <span>{currentIndex + 1} / {batchData.total}</span>
    <button onClick={() => setCurrentIndex(currentIndex + 1)}>→</button>
  </div>
)}
```

3. Updated state management to handle batch array + current index

## Files Changed

- `netlify.toml` - Removed catch-all redirect
- `app/page.tsx` - Story navigation + header reorder
- `scripts/generate-review-data.js` - Multi-story output

## Testing

### Before:
- ❌ `/batch.json` returned HTML 404 page
- ❌ Header: `ai | Score: 78 | App Store Defense`
- ❌ No way to view other stories

### After:
- ✅ `/batch.json` serves actual JSON
- ✅ Header: `App Store Defense | ai | Score: 78`
- ✅ Navigation arrows when multiple stories exist

## Deploy Status

**Committed:** 30ff143  
**Pushed:** Yes  
**Netlify:** Auto-deploying now  
**URL:** https://content-factory-review.netlify.app

Expected deploy time: ~2 minutes

## Next Steps

1. Wait for Netlify deploy to complete
2. Test `/batch.json` serves correctly
3. Verify header order is correct
4. Test story navigation (when we have multiple stories)

## How to Add More Stories

Kelly just needs to capture more stories with `/story` command:
1. Kelly types `/story` after completing work
2. Story file created in iCloud content-inbox
3. Run `node scripts/link-media.js` to process
4. Run `git push` in review-ui folder
5. Navigation arrows appear automatically when multiple stories exist

---

**Deployment fixed and enhanced!** 🚀
