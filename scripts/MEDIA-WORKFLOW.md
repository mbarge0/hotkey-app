# Media Workflow - From Story to Review UI

## Overview

Media files (screenshots, videos) are automatically linked to stories by timestamp and displayed in the review UI.

## The Flow

```
Kelly captures story + media
        ↓
    iCloud folder
        ↓
content-processor.js (adds to queue)
        ↓
    link-media.js
        ↓
├─ Matches media by timestamp
├─ Links to story queue entries  
├─ Copies to review-ui/public/media/
└─ Generates review-ui/public/batch.json
        ↓
    Review UI displays media
```

## Commands

### Link Media (Run After New Stories)

```bash
cd ~/clawd/content-factory
node scripts/link-media.js
```

**What it does:**
1. Scans `~/Library/Mobile Documents/com~apple~CloudDocs/content-inbox/` for media files
2. Matches media to stories by timestamp (±5 min window)
3. Updates `content-work-queue.json` with media links
4. Copies media files to `review-ui/public/media/`
5. Auto-generates `review-ui/public/batch.json` for review UI

### Deploy Review UI

```bash
cd ~/clawd/content-factory/review-ui
git add -A
git commit -m "Update media and batch data"
git push
```

**Netlify auto-deploys:** https://content-factory-review.netlify.app

## File Structure

```
content-inbox/
  kelly-story-2026-02-21-1428.md          # Story file
  Multi agent factory pipeline design.mov  # Media (matched by timestamp)

content-factory/
  content-work-queue.json                  # Queue with media links
  review-ui/
    public/
      media/
        Multi agent factory pipeline design.mov  # Copied here
      batch.json                                 # Generated for UI
```

## Media Matching Logic

**Timestamp matching:**
- Stories: `kelly-story-2026-02-21-1428.md` → 2026-02-21 14:28
- Screenshots: `Screenshot 2026-02-21 at 11.16.38 AM.png` → 2026-02-21 11:16:38
- Videos (no timestamp): Uses file modification time
- Match window: ±5 minutes

**Multiple media per story:**
All media files within 5-minute window are linked to the story.

## Automation

Add to content-processor.js or run via cron:

```bash
# After processing new stories
node scripts/link-media.js

# Optionally auto-deploy
cd review-ui && git add -A && git commit -m "Auto-update" && git push
```

## Supported Media Types

- **Images:** `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`
- **Videos:** `.mp4`, `.mov`

## Review UI Display

- **Twitter:** Shows video/image in preview card
- **LinkedIn:** Shows video/image in preview card
- **Instagram:** Shows video/image in preview card

Platform-specific styling matches real platform look.

## Troubleshooting

**Media not showing?**
1. Check file exists: `ls ~/Library/Mobile\ Documents/com~apple~CloudDocs/content-inbox/`
2. Run link-media: `node scripts/link-media.js`
3. Check batch.json: `cat review-ui/public/batch.json | jq '.formats[].media'`
4. Verify copy: `ls review-ui/public/media/`

**Timestamp mismatch?**
- Stories and media must be within 5 minutes
- Check story timestamp: `grep timestamp content-work-queue.json`
- Check media file time: `ls -l content-inbox/`

## Next Steps

1. **Auto-run on story capture** - Hook into Kelly's `/story` trigger
2. **Support multiple stories** - Review UI shows batch selector
3. **Media generation** - Auto-create quote cards, code screenshots
4. **Video thumbnails** - Extract frame for preview before video plays
