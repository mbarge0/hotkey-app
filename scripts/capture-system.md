# Content Capture System - Layer 0

**Goal:** Zero-friction content capture with automatic context extraction

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   CONTENT SOURCES                       │
├─────────────────────────────────────────────────────────┤
│  Manual Capture        │       Story Mining             │
│  (Kelly hotkey)        │    (Background analysis)       │
└─────────────────────────────────────────────────────────┘
                         ↓
                  Context + Media
                         ↓
                   Work Queue
                         ↓
              Content Generation
                         ↓
            Human Review & Approval
                         ↓
                    Publish
```

## Components

### 1. Kelly Hotkey Capture

**File:** `scripts/kelly-capture.sh`

**Trigger:** Keyboard shortcut in Kelly session (Cmd+Shift+C)

**What it does:**
1. Sends message to Kelly: "Analyze the last 10 messages. What just happened? Why is it interesting for content? Be specific - include numbers, names, outcomes. 2-3 sentences max."
2. Kelly responds with context summary
3. Script extracts response
4. Appends to iCloud QUICK-NOTES.md with timestamp
5. Shows confirmation: "✅ Context captured [2026-02-20 23:15:42]"

**Context format:**
```markdown
## [YYYY-MM-DD HH:MM:SS] Kelly Auto-Capture

{Kelly's 2-3 sentence summary with specifics}

---
```

**Installation:**
- Add to Kelly's terminal hotkey config
- Or: simple alias `alias capture='~/clawd/content-factory/scripts/kelly-capture.sh'`
- Matt types `capture` when something cool happens

---

### 2. Media Auto-Linking

**File:** `scripts/link-media-context.js`

**Runs:** Every time new media lands in iCloud Drive (via file watcher)

**What it does:**
1. Detects new media file (screenshot/video)
2. Gets file creation timestamp
3. Finds nearest context entry in QUICK-NOTES.md (within ±5 min)
4. Links them in work queue:
   ```json
   {
     "media": "screenshot-123.png",
     "timestamp": "2026-02-20T23:15:42Z",
     "context": "Kelly fixed completion criteria bug...",
     "confidence": "high" // high = <2min gap, medium = 2-5min, low = >5min
   }
   ```

**Fallback:** If no context found, marks as "needs_context" and asks Matt

---

### 3. Story Mining Engine

**File:** `scripts/story-mine.js`

**Runs:** Every 4 hours (or on-demand via `./story-mine.js --now`)

**What it does:**

#### A. Fetch Kelly's transcript
```javascript
// Use OpenClaw sessions API
const history = await sessions_history({
  sessionKey: 'kelly',
  limit: 500, // last ~24h
  includeTools: true
});
```

#### B. Analyze for interesting events

**Event patterns to detect:**
- Learning playbook updates (`learning/processed/`)
- Bug fixes (error → solution)
- Performance improvements (numbers, metrics)
- New features shipped
- Workflow innovations
- System architecture changes
- Failures with lessons

**Scoring algorithm:**
```javascript
function scoreEvent(event) {
  let score = 0;
  
  // Learning playbook = automatic high value
  if (event.includes('learning playbook')) score += 40;
  
  // Numbers/metrics
  if (/\d+%|\d+x|$\d+/.test(event)) score += 15;
  
  // Before/after comparisons
  if (event.includes('before:') || event.includes('after:')) score += 10;
  
  // System improvements
  if (event.includes('now') && event.includes('previously')) score += 10;
  
  // Concrete outcomes
  if (/shipped|deployed|fixed|solved/.test(event)) score += 10;
  
  // Pillar relevance
  if (matchesPillar(event, 'ai')) score += 15;
  if (matchesPillar(event, 'real-estate')) score += 10;
  if (matchesPillar(event, 'business-systems')) score += 10;
  
  // Recency bonus (last 6h)
  if (event.timestamp > Date.now() - 6*60*60*1000) score += 10;
  
  return score;
}
```

#### C. Output ranked list

**Format:**
```markdown
# Story Mining Results - Last 24 Hours
**Generated:** 2026-02-20 23:30 CST
**Events analyzed:** 47
**Interesting moments:** 8

---

## #1 [Score: 95] Kelly Learning Playbook Self-Correction
**Time:** 2026-02-20 22:30  
**Event:** Declared FocusedFasting "done" when code compiled, skipped app icon, launch screens, screenshots, and marketing pipeline. Learning playbook kicked in - updated completion criteria, added verification gates.  
**Why it matters:** Self-healing system catching its own blind spots  
**Pillar:** AI (self-healing systems)  
**Platforms:** Twitter, LinkedIn, Instagram  
**Media:** LearningPlaybook3.mov (already captured)

---

## #2 [Score: 87] FocusedFasting V2.0 Complete Rebuild
**Time:** 2026-02-20 18:45  
**Event:** Rebuilt entire app from scratch using latest factory practices - new underwriting model, submission gates, marketing pipeline.  
**Why it matters:** Before/after demonstration of factory evolution  
**Pillar:** AI, Business Systems  
**Platforms:** LinkedIn, Instagram  
**Media:** 3 screenshots (already in inbox)

---

## #3 [Score: 72] Submission Gate Implementation
**Time:** 2026-02-20 20:15  
**Event:** Created submission-gate.sh verification script that blocks incomplete submissions - must pass icon, launch screen, screenshots, ASC setup checks.  
**Why it matters:** Prevention > detection - gates stop bad patterns from recurring  
**Pillar:** AI  
**Platforms:** Twitter, LinkedIn

---

[Continue for top 5-8 events]
```

#### D. Send to Telegram for approval

**Message:**
```
📊 Story Mining Results (8 interesting moments detected)

Top 3:
1. Kelly self-correction [95 pts]
2. FocusedFasting V2.0 rebuild [87 pts]  
3. Submission gates [72 pts]

Reply:
- "post 1 3" → Generate those drafts
- "details" → See full ranked list
- "skip" → Ignore this batch
```

---

### 4. Unified Work Queue

**File:** `content-work-queue.json`

**Enhanced structure:**
```json
{
  "items": [
    {
      "id": "uuid",
      "source": "manual_capture", // or "story_mining"
      "timestamp": "2026-02-20T23:15:42Z",
      "context": "Kelly fixed completion criteria...",
      "media": ["screenshot.png", "video.mov"],
      "pillar": "ai", // auto-detected or manual
      "score": 95, // from story mining, or null for manual
      "platforms": ["twitter", "linkedin", "instagram"],
      "status": "pending", // pending | generating | review | approved | published
      "draft_path": null,
      "telegram_msg_id": null
    }
  ]
}
```

---

## Workflows

### Workflow A: Manual Capture (Immediate)
```
1. Matt sees cool moment in Kelly session
2. Presses hotkey (or types `capture`)
3. Kelly analyzes last 10 messages → writes context
4. Matt screenshots/records (media auto-timestamped)
5. Background script links media + context
6. Added to work queue
7. Next generation cycle → creates drafts
8. Matt reviews & approves via Telegram
```

### Workflow B: Story Mining (Automated Discovery)
```
1. Cron runs every 4h: ./story-mine.js
2. Analyzes Kelly's .jsonl transcript (last 24h)
3. Scores events by interestingness
4. Sends ranked list to Telegram
5. Matt replies: "post 1 3 5"
6. System generates drafts for those events
7. Matt reviews & approves via Telegram
```

### Workflow C: Hybrid (Best of Both)
```
- Manual capture for "I know this is gold" moments
- Story mining catches what Matt missed
- Both feed into same queue
- Deduplication prevents posting same thing twice
- Matt reviews everything before it goes live
```

---

## Implementation Priority

### Phase 1 (Tonight) ✅
- [x] Basic content factory (Layers 1-5)
- [x] Manual generation scripts

### Phase 2 (Next)
**Story Mining MVP:**
1. `scripts/story-mine.js` - Read Kelly .jsonl, score events
2. Telegram notification with ranked list
3. Matt replies with numbers to approve
4. Auto-generate drafts for approved events

**Effort:** ~2-3 hours

### Phase 3 (Later)
**Kelly Hotkey Capture:**
1. `scripts/kelly-capture.sh` - Prompt Kelly for context
2. Append to iCloud QUICK-NOTES.md with timestamp
3. Media auto-linking by timestamp

**Effort:** ~1-2 hours

### Phase 4 (Polish)
**Advanced Features:**
- Deduplication (don't post same event twice)
- Best-time-to-post intelligence
- A/B testing framework
- Performance tracking

---

## File Structure

```
content-factory/
├── scripts/
│   ├── kelly-capture.sh           # Hotkey capture
│   ├── link-media-context.js      # Auto-link media to context
│   ├── story-mine.js              # Analyze Kelly transcripts
│   ├── story-scoring.js           # Event scoring algorithm
│   └── queue-manager.js           # Work queue operations
├── config/
│   └── story-criteria.json        # What makes events interesting
└── ...existing files...
```

---

## Next Steps

**Want me to build:**
1. ✅ Story mining script first? (Analyze Kelly's last 24h, rank events)
2. ✅ Kelly hotkey capture? (Immediate context extraction)
3. Both?

Story mining seems like the highest value - it would surface the Learning Playbook event, FocusedFasting rebuild, and other moments automatically.

Then add hotkey capture for future "I know this is gold" moments.

Sound good?
