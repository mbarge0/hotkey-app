# Content Factory - Complete Workflow Documentation

**Status:** ✅ SYSTEM OPERATIONAL (Not Yet Publishing)

---

## The Complete Flow

```
Kelly writes /story
      ↓
Content inbox (iCloud folder)
      ↓
content-processor.js detects new file
      ↓
Added to content-work-queue.json
      ↓
[You approve story]
      ↓
process-story-approval.js generates content
      ↓
Drafts saved to drafts/YYYY-MM-DD-{id}/
      ↓
Auto-scheduled based on platform optimal times
      ↓
Added to content-schedule.json
      ↓
[Review in content review UI - optional]
      ↓
publish-scheduled.js runs (cron every 15 min)
      ↓
Posts via Publer API when time is due
      ↓
Live on Twitter, LinkedIn, Instagram!
```

---

## What's Built & Working

### ✅ Layer 1: Capture
- **Kelly's /story hotkey** writes to content-inbox
- **content-processor.js** detects new files
- **link-media-to-stories.js** associates media files with stories

### ✅ Layer 2: Storage
- **content-work-queue.json** - Master queue of all stories
- Stories include: title, description, pillar, score, media links

### ✅ Layer 3: Generation  
- **process-story-approval.js** - Main workflow orchestrator
- Generates prompts for Twitter, LinkedIn, Instagram
- Currently requires manual content generation (you write it)
- Saves content to `drafts/YYYY-MM-DD-{id}/[platform].md`

### ✅ Layer 4: Scheduling
- **Automatic smart scheduling** based on platform:
  - Twitter: 9 AM, 12 PM, 3 PM, 6 PM, 9 PM CST
  - LinkedIn: 8 AM, 12 PM, 5 PM CST (business hours)
  - Instagram: 6 PM, 9 PM CST (evenings)
- **content-schedule.json** - Master schedule
- Tracks: scheduled, published, failed states

### ✅ Layer 5: Publishing
- **publish-scheduled.js** - Publer API integration
- **Publer API key configured** (`~/.secrets/publer.json`)
- Connected accounts:
  - Twitter (@matthewbarge)
  - LinkedIn (Matt Barge)
  - Instagram (@themattbarge)
- Dry-run mode for testing
- Updates schedule.json with publish status

### ✅ Layer 6: Review UI
- **Next.js static site** at content-factory-review.netlify.app
- Platform-specific previews (Twitter dark mode, LinkedIn, Instagram)
- Real profile images
- Approve buttons
- Scheduling controls
- Currently using mock data (needs API integration)

---

## Current State

### What Works End-to-End

**Test Run (Just Completed):**
```bash
# 1. Story already in queue (Kelly's multi-agent pipeline)
# 2. Generate content (manually written)
# 3. Schedule posts
cd ~/clawd/content-factory
node scripts/process-story-approval.js --story-id 1771706178149-0c1to2etl --auto-schedule

# Result:
✅ Scheduled twitter for 2/21/2026, 6:00:00 PM
✅ Scheduled linkedin for 2/21/2026, 5:00:00 PM  
✅ Scheduled instagram for 2/21/2026, 6:00:00 PM

# 4. Test publisher (dry run)
node scripts/publish-scheduled.js --dry-run

# Result:
✅ Found overdue posts
✅ Would publish via Publer API
```

### Posts Currently Scheduled

1. **App Store Defense** (overdue - from 9 AM today)
   - Twitter ✅
   - LinkedIn (Mon 8 AM) ✅

2. **Multi-Agent Pipeline** (Kelly's latest)
   - Twitter (Today 6 PM) ✅
   - LinkedIn (Today 5 PM) ✅
   - Instagram (Today 6 PM) ✅

---

## The Missing Piece: Automated Content Generation

**Current:** You manually write the Twitter/LinkedIn/Instagram posts (like I did in this chat)

**Goal:** Script calls Claude API to auto-generate

**Why Not Built Yet:** 
- OpenClaw sessions don't expose direct Claude API access from Node scripts
- Would need to use Anthropic API directly with a key
- OR: Use the sessions_send approach to have main agent generate

**Two Options:**

### Option A: Anthropic API Direct
```javascript
// Use official Anthropic SDK
const Anthropic = require('@anthropic-ai/sdk');
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const response = await client.messages.create({
  model: 'claude-sonnet-4',
  messages: [{ role: 'user', content: prompt }]
});
```

**Pros:** Fast, direct, no dependency on OpenClaw
**Cons:** Need API key, costs money directly

### Option B: OpenClaw sessions_send
```javascript
// Use OpenClaw's existing session to generate
const result = await sessions_send({
  message: prompt,
  sessionKey: 'isolated-content-gen',
  timeoutSeconds: 60
});
```

**Pros:** Uses existing OpenClaw credits/setup
**Cons:** Slower, needs to route through main session

---

## What to Run Next

### To Publish Right Now (Test):
```bash
cd ~/clawd/content-factory

# Publish overdue posts (App Store defense)
node scripts/publish-scheduled.js

# This WILL post to real Twitter/LinkedIn!
```

### To Generate More Content:
```bash
# Process any story in the queue
node scripts/process-story-approval.js --story-id <STORY_ID> --auto-schedule

# Manual: Write content to drafts/{dir}/{platform}.md
# Then re-run with --auto-schedule to add to schedule
```

### To Set Up Cron (Auto-publish every 15 min):
```bash
crontab -e

# Add:
*/15 * * * * cd ~/clawd/content-factory && node scripts/publish-scheduled.js >> ~/clawd/logs/publisher.log 2>&1
```

---

## Files Created

**Scripts:**
- `scripts/process-story-approval.js` - Main workflow
- `scripts/publish-scheduled.js` - Publer publisher
- `scripts/link-media-to-stories.js` - Media association
- `scripts/generate-content.js` - Stub for auto-gen (not used yet)

**Data:**
- `content-schedule.json` - Schedule database
- `content-work-queue.json` - Story queue
- `drafts/*/` - Generated content

**Config:**
- `~/.secrets/publer.json` - Publer API credentials

**Review UI:**
- `review-ui/` - Next.js app (deployed to Netlify)

---

## Next Steps

**Priority 1: Test Real Publishing**
- Run `publish-scheduled.js` without --dry-run
- Verify posts appear on Twitter/LinkedIn
- Check error handling

**Priority 2: Build Auto-Generation**
- Decide: Anthropic API direct or sessions_send
- Wire into process-story-approval.js
- Test full automation

**Priority 3: Wire Review UI to Real Data**
- Build API endpoints to read drafts/
- Replace mock data with actual generated content
- Add media display (copy to public/ or use CDN)

**Priority 4: Telegram Approval Workflow**
- Send notification when story arrives
- Handle "approve" reply
- Trigger process-story-approval.js automatically

---

## Summary

**What Works:**
✅ Kelly writes stories
✅ Stories captured and queued
✅ Media linked automatically
✅ Content generation (manual for now)
✅ Smart scheduling per platform
✅ Publer API integration ready
✅ Review UI deployed

**What's Left:**
⏸️ Auto content generation (Claude API)
⏸️ Review UI real data loading
⏸️ Telegram approval automation
⏸️ Cron job for auto-publishing

**Status:** 
🟢 System is 90% complete
🟡 Ready to test real publishing
🔴 Not yet fully automated (requires manual content generation)

**Time to Full Automation:** ~4-6 hours
- 2 hours: Auto-generation via API
- 1 hour: Review UI data loading
- 1 hour: Telegram integration
- 2 hours: Testing & polish
