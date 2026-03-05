# /story - HotKey Auto Story Capture

You are running the HotKey story capture workflow. DO NOT interview Matt. DO NOT ask questions. Read the current session context and recent work, extract the story automatically, generate posts, and ship it.

**Matt's profile:**
- Name: Matt Barge | Twitter: @matthewbarge | LinkedIn: Matt Barge | Instagram: @themattbarge
- Voice: technical, specific, contrarian, systems-thinker, builder
- Content pillars: AI & automation, commercial real estate, business systems, product
- Audience: technical founders and developers building AI-powered products

**HOTKEY_APP_PATH:** /Users/matthewbarge/DevProjects/hotkey-app

---

## Step 1: Extract the story from context

Look at what just happened in this session. Use ALL of the following to build the story:

1. **Read the current conversation** - what was built, fixed, shipped, or figured out in this session?
2. **Check recent git activity in the current repo** (run these):
   ```bash
   git log --oneline -10
   git diff HEAD~3..HEAD --stat
   ```
3. **Look at recently modified files** - what changed, what's new?

From this context, extract:
- **Title**: punchy, <60 chars, specific (not vague like "productivity win")
- **What happened**: 2-3 sentences, concrete details, specific numbers if any
- **Why it matters**: the insight or pattern this demonstrates
- **Pillar**: `ai` | `real-estate` | `business-systems` | `product`
- **Score**: 60-100 (higher = more specific + more insight + more shareable)
- **Media**: any screenshot or recording filename mentioned in the session, or `None`

If the current session has no clear story (e.g., this is a brand new session with nothing built yet), say: "Nothing story-worthy in this session yet. Keep building."

---

## Step 2: Generate Posts

Apply these principles - content must sound like Matt wrote it, not generic AI:

**Twitter Thread (5-7 tweets):**
- Tweet 1: Hook. Lead with the problem, surprise, or counter-intuitive result. NOT "I built X today." Max 2 lines.
  - Proven patterns: "Most [people/devs] do X. I did Y instead." / "[N] [things] taught me one thing:" / "[Specific outcome]. Here's the system:"
- Tweets 2-4: Specifics. What was built, exact numbers, concrete details, before/after.
- Tweets 5-6: The broader pattern or insight. What does this demonstrate?
- Tweet 7: Genuine question or observation. NOT "Follow me for more."
- Style: short punchy sentences, line breaks for emphasis, no em dashes, no corporate speak

**LinkedIn Post (1,200-1,500 chars):**
- First 2 lines must hook before the "see more" cutoff
- Short paragraphs (2-3 lines max)
- Structure: Problem → What you did → Why it matters → Real question at the end
- Conversational but substantive

**Instagram Caption (300-400 chars + hashtags):**
- First line: emoji + punchy hook (accessible, not overly technical)
- Behind-the-scenes feel
- 8-10 hashtags: always include #BuildInPublic #AI #IndieHacker, plus relevant ones

---

## Step 3: Show a brief summary and post previews

Show Matt:
```
Story: [Title]
Pillar: [pillar] | Score: [score]

--- TWITTER ---
[thread]

--- LINKEDIN ---
[post]

--- INSTAGRAM ---
[caption]

Committing and pushing now...
```

Do NOT wait for approval. Do NOT ask "does this look good?". Proceed immediately to Step 4.

(If Matt wants to edit, he can do so in the review UI after it's live.)

---

## Step 4: Write Files

### 4a. Story file

Slug: lowercase title, hyphens, max 40 chars
Path: `/Users/matthewbarge/DevProjects/hotkey-app/content-inbox/YYYY-MM-DD-[slug].md`

```markdown
# [Title]

**Date:** YYYY-MM-DD HH:MM
**Pillar:** [pillar]
**Score:** [score]

## What Happened

[2-3 sentences, specific, with numbers]

## Why It Matters

[The insight]

## Media

[filename or None]
```

### 4b. Update batch.json

Read: `/Users/matthewbarge/DevProjects/hotkey-app/apps/review/public/batch.json`

Append to `batches[]`, increment `total`, set `generated` to current ISO timestamp.

```json
{
  "id": "YYYY-MM-DD-[slug]",
  "story": {
    "title": "[Title]",
    "rawTitle": "[Title]",
    "description": "[What happened text]",
    "pillar": "[pillar]",
    "score": [score],
    "timestamp": "YYYY-MM-DD HH:MM"
  },
  "formats": [
    {
      "id": "twitter",
      "name": "Twitter",
      "platform": "Twitter",
      "content": "[full twitter thread]",
      "score": 92,
      "publishType": "auto",
      "scheduleOptions": ["Now", "Mon 9 AM", "Tue 9 AM", "Wed 9 AM", "Custom"],
      "checked": false,
      "scheduleTime": "Mon 9 AM",
      "media": "[filename or null]"
    },
    {
      "id": "linkedin",
      "name": "LinkedIn",
      "platform": "LinkedIn",
      "content": "[full linkedin post]",
      "score": 88,
      "publishType": "auto",
      "scheduleOptions": ["Now", "Mon 8 AM", "Tue 8 AM", "Wed 8 AM", "Custom"],
      "checked": false,
      "scheduleTime": "Mon 8 AM",
      "media": "[filename or null]"
    },
    {
      "id": "instagram",
      "name": "Instagram Post",
      "platform": "Instagram",
      "content": "[full instagram caption with hashtags]",
      "score": 85,
      "publishType": "auto",
      "scheduleOptions": ["Now", "Mon 11 AM", "Tue 11 AM", "Wed 11 AM", "Custom"],
      "checked": false,
      "scheduleTime": "Mon 11 AM",
      "media": "[filename or null]"
    }
  ],
  "createdAt": "[current ISO timestamp]"
}
```

---

## Step 5: Commit and Push

```bash
cd /Users/matthewbarge/DevProjects/hotkey-app
git add content-inbox/ apps/review/public/batch.json
git commit -m "Add story: [Title]"
git push origin main
```

After push succeeds, tell Matt:
> "Shipped. Review UI updates in ~3 min: https://hotkey-ai.netlify.app/review"

If push fails (offline or auth):
> "Files written locally. Push when online: `cd /Users/matthewbarge/DevProjects/hotkey-app && git push origin main`"

---

## Rules

- Never ask Matt to describe what happened - you already know, you're in the session
- Never wait for approval before committing - that's what the review UI is for
- If there's nothing story-worthy yet, say so and stop
- If batch.json fails to parse, tell Matt and abort cleanly
- If slug already exists for today, append `-2`
