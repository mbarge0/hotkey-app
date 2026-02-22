# Quick Start Guide

**Get the content factory running in 5 minutes.**

---

## For Kelly: Capture Interesting Moments

When something cool happens while working:

```
/story
```

This opens a template in your editor. Fill in:
- What happened (2-3 sentences with specifics)
- Why it matters (for content)
- Suggested pillar (ai, real-estate, business-systems)
- Media files (if any)
- Score (60-100)

Save and close. Done.

**Files go to:** `~/Library/Mobile Documents/com~apple~CloudDocs/content-inbox/kelly-story-*.md`

---

## For Matt: Review & Approve

### Check for New Content

```bash
cd ~/clawd/content-factory
./scripts/content-workflow.js
```

This:
1. Finds new Kelly stories
2. Processes them (parses, scores, adds to queue)
3. Sends ranked list to Telegram

### Approve from Telegram

Reply to the Telegram notification:

```
post 1 3
```

This generates drafts for items #1 and #3.

Or:
- `details` - See full list
- `skip` - Ignore batch

### Manual Generation (if needed)

```bash
# From prompt
./auto-generate.js --prompt "Kelly fixed completion criteria" --pillar ai

# From file
./generate.js --source content-inbox/video.mov --pillar ai
```

---

## Automation (Set & Forget)

**Add cron job to check every 30 min:**

```bash
# Check for Kelly stories every 30 min
*/30 * * * * cd ~/clawd/content-factory && ./scripts/content-workflow.js >> logs/workflow.log 2>&1
```

This runs automatically, processes new stories, and pings you on Telegram.

---

## Workflow Summary

```
Kelly captures → /story → Writes to content-inbox
                              ↓
              Cron runs content-workflow.js every 30min
                              ↓
              Processes stories → Adds to queue
                              ↓
              Telegram notification with ranked list
                              ↓
        Matt replies: "post 1 3" → Drafts generated
                              ↓
              Review drafts → Approve → Publish
```

---

## Common Commands

```bash
# Process new Kelly stories
./scripts/content-workflow.js

# Check without processing
./scripts/content-workflow.js --check

# Handle approval manually
./scripts/approval-handler.js "post 1 3"

# View queue
./scripts/queue-manager.js pending

# Generate from prompt
./auto-generate.js --prompt "Description" --pillar ai
```

---

## Troubleshooting

**No stories found?**
- Check Kelly wrote to: `~/Library/Mobile Documents/com~apple~CloudDocs/content-inbox/`
- Files must match pattern: `kelly-story-*.md`

**Generation failed?**
- Check OpenClaw is running: `openclaw status`
- Verify profile exists: `cat profiles/matt-barge.json`
- Check pillar is valid: `ai`, `real-estate`, or `business-systems`

**Telegram not sending?**
- Check OpenClaw Telegram integration: `openclaw config get | jq .channels.telegram`
- Test manually: `openclaw message send --channel telegram --message "test"`

---

**That's it. The factory is operational.** 🏭
