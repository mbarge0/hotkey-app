# Publer API Integration Plan

## Current Flow (Manual)
1. `/story` hotkey → writes file to content-inbox
2. Screenshot/media added manually to content-inbox
3. (Manual) Notification to review
4. (Manual) Approve in UI Review
5. (Manual) Schedule in Schedule view

## Target Flow (Automated)
1. `/story` hotkey → writes file to content-inbox + media
2. **AUTO: Generate all 3 platform posts** (Twitter, LinkedIn, Instagram) using skills
3. **AUTO: Telegram notification** → "New post ready to review"
4. User opens UI Review → sees all 3 platform variations
5. User approves → posts move to Schedule
6. **AUTO: Schedule via Publer API** at next best time slot
7. **AUTO: Publer publishes** at scheduled time

## Implementation Steps

### Phase 1: Content Generation (Priority 1)
**File:** `~/clawd/content-factory/auto-generate.js` (already exists)

**Trigger:** When new file appears in content-inbox

**Process:**
```bash
# Watch for new files
# When matt-story-YYYY-MM-DD-HHMM.md appears:
./auto-generate.js --source content-inbox/matt-story-*.md --pillar ai

# Generates:
# - Twitter post (hook-optimized, <280 chars or thread)
# - LinkedIn post (1000-1500 chars, methodology)
# - Instagram post (caption + visual notes)

# Output: batch.json with all 3 posts
```

**Skills Used:**
- `~/clawd/content-factory/HOOK-OPTIMIZATION.md`
- `~/clawd/content-factory/HOOK-COMPARISON.md`
- Platform structures (Twitter, LinkedIn, Instagram)
- User profile (matt-barge.json)

**Model:** Currently using `anthropic/claude-sonnet-4-5` via OpenClaw sessions_send

### Phase 2: Telegram Notification (Priority 2)
**Tool:** OpenClaw `message` tool

**Trigger:** After batch.json is generated

**Process:**
```javascript
// After auto-generate completes
await message({
  action: 'send',
  channel: 'telegram',
  target: '@matthewbarge', // or telegram user ID
  message: '📝 New HotKey post ready to review!\n\n' +
           `Title: ${story.title}\n` +
           `Score: ${story.score}/100\n\n` +
           `Review: https://hotkey-ai.netlify.app/review`
})
```

### Phase 3: Publer API Integration (Priority 3)

#### Publer API Endpoints
**Base URL:** `https://api.publer.io/v1`

**Authentication:**
```
Headers:
  Authorization: Bearer {API_KEY}
```

**Create Post:**
```
POST /posts
{
  "text": "Post content",
  "platforms": ["twitter"],  // or ["linkedin"], ["instagram"]
  "media_urls": ["https://..."],
  "schedule_time": "2026-02-22T15:00:00Z"
}
```

**Account Setup:**
```
GET /accounts
Returns list of connected social accounts
```

#### Implementation
**File:** `~/clawd/hotkey-app/apps/review/app/api/publer.ts`

```typescript
const PUBLER_API_KEY = process.env.PUBLER_API_KEY
const PUBLER_BASE_URL = 'https://api.publer.io/v1'

interface PublerPost {
  text: string
  platforms: string[]
  media_urls?: string[]
  schedule_time?: string
}

export async function schedulePost(post: PublerPost) {
  const response = await fetch(`${PUBLER_BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PUBLER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(post)
  })
  
  return response.json()
}

export async function postNow(post: PublerPost) {
  // Same as schedulePost but without schedule_time
  const { schedule_time, ...postData } = post
  return schedulePost(postData)
}
```

#### Media Handling
**Current:** Media files in `/review/media/`

**Publer Requirement:** Public URLs

**Options:**
1. Upload media to Netlify (already served at `https://hotkey-ai.netlify.app/review/media/`)
2. Pass these URLs to Publer
3. Publer downloads and attaches to posts

**Example:**
```javascript
{
  text: "5 App Store rejections...",
  platforms: ["twitter"],
  media_urls: [
    "https://hotkey-ai.netlify.app/review/media/MandatoryReviewandLearningPlaybook.mov"
  ],
  schedule_time: "2026-02-22T15:00:00Z"
}
```

### Phase 4: Schedule Execution (Priority 4)

**Two Options:**

**Option A: Publer Handles Scheduling (Recommended)**
- When post is approved + scheduled in UI
- Immediately call Publer API with `schedule_time`
- Publer handles the actual posting at that time
- No need for our own executor

**Option B: Own Executor (More Control)**
- Store scheduled posts in database/JSON
- OpenClaw cron job checks every 15 min
- When time matches, call Publer API to post
- More complex but allows cancellation/editing

**Recommendation:** Use Option A (Publer scheduling)

### Phase 5: Full Pipeline Integration

**Auto-Generate Service:**
```javascript
// ~/clawd/content-factory/pipeline.js
async function processNewStory(storyFile) {
  // 1. Read story file
  const story = readStoryFile(storyFile)
  
  // 2. Generate all platform posts
  const posts = await generatePosts(story)
  
  // 3. Write to batch.json
  await writeBatchJson(posts)
  
  // 4. Send Telegram notification
  await notifyTelegram(story)
}

// Watch content-inbox
watchDirectory('content-inbox', processNewStory)
```

**Schedule → Publer:**
```javascript
// ~/clawd/hotkey-app/apps/review/app/schedule/page.tsx
async function handleApproveAndSchedule(post, scheduleTime) {
  // 1. Calculate actual timestamp
  const timestamp = calculateScheduleTime(scheduleTime)
  
  // 2. Call Publer API
  const result = await schedulePost({
    text: post.content,
    platforms: [post.platform],
    media_urls: post.media ? [`https://hotkey-ai.netlify.app${post.media}`] : [],
    schedule_time: timestamp.toISOString()
  })
  
  // 3. Update UI state
  setScheduledPosts([...scheduledPosts, {
    ...post,
    publerId: result.id,
    status: 'scheduled'
  }])
}
```

## Environment Variables Needed

```env
PUBLER_API_KEY=your_publer_api_key
ANTHROPIC_API_KEY=your_anthropic_key  # For content generation
TELEGRAM_BOT_TOKEN=your_telegram_token  # For notifications
```

## Testing Plan

1. **Manual Generation Test:**
   ```bash
   cd ~/clawd/content-factory
   ./auto-generate.js --source inbox/test-story.md --pillar ai
   ```

2. **Publer API Test:**
   ```bash
   curl -X GET https://api.publer.io/v1/accounts \
     -H "Authorization: Bearer $PUBLER_API_KEY"
   ```

3. **End-to-End Test:**
   - Create test story with `/story`
   - Verify generation happens
   - Check Telegram notification
   - Approve in UI Review
   - Schedule in Schedule view
   - Verify Publer receives request

## Current Status

- ✅ UI Review with modal + editing
- ✅ Schedule view with drag-drop
- ✅ Post Now button (placeholder)
- ✅ Status system (unscheduled/scheduled/dismissed)
- ⏳ Auto-generation on story capture
- ⏳ Telegram notifications
- ⏳ Publer API integration
- ⏳ Media URL handling

## Next Immediate Steps

1. Set up Publer account + get API key
2. Connect social accounts (Twitter, LinkedIn, Instagram)
3. Test Publer API with curl
4. Implement `/api/publer.ts` endpoints
5. Wire up Schedule → Publer
6. Add auto-generation watcher
7. Add Telegram notifications
8. End-to-end testing

## Notes

- Publer trial expires Mar 6, 2026
- Need to decide on plan before trial ends
- Consider cost per post vs manual posting
- Media must be publicly accessible URLs
- Test with small batch first before full automation
