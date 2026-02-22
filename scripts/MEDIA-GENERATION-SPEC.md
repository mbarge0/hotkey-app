# Media Generation & Display Spec

## Current State

✅ **UI supports media** - Preview components already render images/videos
✅ **Mock data shows it working** - Placeholder images display correctly
❌ **No actual media generation** - Stories have descriptive text, not files
❌ **No media linking** - Generated content doesn't connect to media
❌ **No media serving** - No way to serve files to web UI

## Goal

Generate real media (screenshots, quote cards, videos) and wire them through the entire pipeline: multiply → generate → review → publish.

## Media Types

### 1. Screenshots (Automated)
- **What:** Code snippets, terminal output, dashboard views
- **Tool:** Playwright or Puppeteer to render and screenshot
- **Formats:** PNG, optimized for platform (1200x675 Twitter, 1080x1080 Instagram)
- **Example:** `asc-monitor.sh` output, submission-gate validation

### 2. Quote Cards (Automated via Bannerbear)
- **What:** Visual quotes, key stats, hooks
- **Tool:** Bannerbear API ($0-29/mo, already researched)
- **Templates:** Create 3-5 base templates (AI, Product, Story)
- **Dynamic:** Text overlay, profile image, pillar colors

### 3. Code Snippets (Automated)
- **What:** Pretty code blocks with syntax highlighting
- **Tool:** Carbon.now.sh API or local rendering
- **Style:** Match brand (dark theme, gradient accents)

### 4. Videos (Manual for now, automated Phase 2)
- **What:** Screen recordings, demos, walkthroughs
- **Current:** Manual capture and link
- **Future:** Auto-generate from Loom recordings or screen captures

### 5. Carousels (Design automation)
- **What:** Multi-image posts (LinkedIn, Instagram)
- **Tool:** Bannerbear or Canva API
- **Pages:** 3-8 slides per story

## Pipeline Architecture

```
Story Input
    ↓
Multiply (format selection)
    ↓
Media Generation (parallel)
    ├─ Screenshots (Playwright)
    ├─ Quote cards (Bannerbear)
    ├─ Code snippets (Carbon)
    └─ Videos (manual link)
    ↓
Link media to formats
    ↓
Generate content (with media paths)
    ↓
Review UI (display media)
    ↓
Publish (upload media to platforms)
```

## File Structure

```
content-factory/
  media/
    generated/
      YYYY-MM-DD-story-slug/
        twitter-preview.png
        linkedin-preview.png
        instagram-square.png
        quote-card-1.png
        code-snippet.png
        video-demo.mp4
    templates/
      bannerbear/
        ai-pillar.json
        product-pillar.json
        story-pillar.json
```

## Implementation Steps

### Phase 1: Screenshot Automation (2-3 hours)
1. Install Playwright: `npm install -D playwright`
2. Create `scripts/generate-screenshot.js`:
   - Accept code/terminal output
   - Render in browser with syntax highlighting
   - Screenshot at platform sizes
   - Save to `media/generated/{story-slug}/`
3. Wire into multiply.js

### Phase 2: Bannerbear Quote Cards (1-2 hours)
1. Sign up for Bannerbear (free tier)
2. Create 3 base templates (AI, Product, Story)
3. Create `scripts/generate-quote-card.js`:
   - Accept text, pillar, profile image
   - Call Bannerbear API
   - Save generated image
4. Wire into multiply.js

### Phase 3: Media Linking (1 hour)
1. Update format templates to specify media needs:
   ```js
   media: {
     type: 'screenshot', // screenshot | quote-card | code | video | carousel
     source: 'story.media.screenshots[0]', // path to source
     dimensions: { width: 1200, height: 675 },
     style: 'twitter-preview'
   }
   ```
2. Update multiply.js to generate media before content
3. Pass media paths to generation prompts

### Phase 4: Serving Media (30 min)
1. Update review UI to serve from `content-factory/media/generated/`
2. Add media files to git or upload to CDN
3. Update batch JSON to include media URLs

### Phase 5: Publishing with Media (1 hour)
1. Update Publer integration to upload media
2. Test Twitter, LinkedIn, Instagram uploads
3. Handle platform-specific media requirements

## Media Requirements by Platform

### Twitter
- Images: 1200x675 (16:9), max 5MB
- Videos: 1920x1080, max 512MB, max 2:20
- GIFs: max 15MB

### LinkedIn
- Images: 1200x627 (1.91:1), max 5MB
- Videos: 256x144 to 4096x2304, max 5GB, max 10min
- Documents: PDF supported

### Instagram
- Feed: 1080x1080 (1:1), 1080x1350 (4:5)
- Stories: 1080x1920 (9:16)
- Reels: 1080x1920 (9:16), max 90s

## Success Criteria

- [ ] Generate screenshot from code/terminal in <3s
- [ ] Generate quote card via Bannerbear in <5s
- [ ] Media files linked to correct formats
- [ ] Review UI displays all media types
- [ ] Published posts include media on all platforms

## Next Steps

1. **Get approval** - Review this spec
2. **Install Playwright** - Screenshot automation
3. **Build screenshot generator** - First media type
4. **Sign up Bannerbear** - Quote card automation
5. **Wire media into multiply.js** - Full pipeline
6. **Test end-to-end** - Story → media → review → publish

## Questions

1. **Manual videos OK for now?** - Or build video automation immediately?
2. **Bannerbear templates:** Should I design them, or do you want to customize?
3. **CDN or git?** - How to serve media files to review UI?
4. **Budget:** Bannerbear free tier = 50 images/month. Need more?
