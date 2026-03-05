# HotKey for Claude Code - PRD

**Status:** Draft
**Date:** 2026-03-04
**Author:** Matt Barge

---

## Overview

Rebuild the HotKey story capture system as a native Claude Code slash command that works on any machine without external dependencies. The current system relies on Kelly (OpenClaw AI agent), iCloud sync, and a cron job - none of which are reliable across 3 machines. The new system lives entirely inside Claude Code sessions, which are already running on all machines during development work.

---

## Problem Statement

### Current system friction points:

1. **Machine-specific**: The cron job and content-watcher.js only run on one machine. Stories captured on the MacBook Air won't process until the "main" machine checks.

2. **iCloud sync delay**: Documented 35+ minute delays before stories appear in content-inbox. The whole point of HotKey is capturing moments in the moment.

3. **Kelly dependency**: The `/story` command requires an active Kelly/OpenClaw session configured correctly. If Kelly isn't running or isn't configured, stories don't get captured.

4. **Two-step processing**: Capture the story → wait for cron → wait for iCloud sync → generate → wait for Netlify deploy. Total lag: 30-60 minutes.

5. **Brittle path**: Everything depends on `~/Library/Mobile Documents/com~apple~CloudDocs/content-inbox/` existing and syncing on the right machine.

### The new reality:

Matt is doing most development work inside Claude Code sessions. Claude Code runs on all 3 machines. Claude Code supports custom slash commands stored in the project repo. Claude is already in the conversation - no external API calls needed for content generation.

---

## Goals

1. Capture a story from any machine in under 60 seconds
2. Generated posts available in the review UI within 5 minutes (Netlify deploy time)
3. Zero external service dependencies for capture + generation
4. Single source of truth: the git repo
5. Works the same way on MacBook Air and both Mac Minis
6. No cron jobs, no iCloud sync, no Kelly session required

---

## Non-Goals

- Replacing the existing review UI (hotkey-ai.netlify.app/review) - it stays as-is
- Telegram notifications (deferred - can add later)
- Publer API integration (deferred - still blocked on API key)
- Replacing batch.json format (backwards compatible)
- Mobile capture (desktop-only for now)

---

## User Journey

### The ideal flow (any machine, any time):

```
Matt is working in Claude Code on Mac Mini #2.
Something interesting just happened.

1. Types: /story
2. Claude asks: "What happened? Give me the quick version."
3. Matt: "Built a multi-agent pipeline that processes 50 repos at once..."
4. Claude asks: "Why does this matter? What's the insight?"
5. Matt: "Shows that agent parallelization has a sweet spot at 8-12 workers..."
6. Claude picks a pillar, assigns a score, confirms with Matt
7. Claude generates Twitter thread, LinkedIn post, Instagram caption
8. Claude writes the story file + updates batch.json
9. Claude commits and pushes to main
10. Netlify deploys automatically (~2-3 min)
11. Matt opens review UI, sees the new post, approves

Total time investment: ~3 minutes
Total time to review UI: ~5-6 minutes
```

---

## Architecture

### How Claude Code custom commands work

Claude Code loads markdown files from `.claude/commands/` in the project root as slash commands. When you type `/story`, Claude Code reads `story.md` and executes it as a prompt - with full access to the filesystem, bash, and Claude's reasoning capabilities.

Storing commands in the repo means they sync automatically via git. Pull on any machine = commands available.

```
hotkey-app/
  .claude/
    commands/
      story.md          <- The /story command definition
  apps/review/
    public/
      batch.json        <- Updated directly by the command
  content-inbox/        <- Story .md files committed here (replaces iCloud)
```

### Content flow

```
/story command
     |
     v
Claude interviews Matt (2-3 questions)
     |
     v
Claude generates Twitter + LinkedIn + Instagram posts
(Claude IS the AI - no API key needed, no external call)
     |
     v
Writes: content-inbox/YYYY-MM-DD-[slug].md
Updates: apps/review/public/batch.json
     |
     v
git commit + push to main
     |
     v
Netlify auto-deploys
     |
     v
hotkey-ai.netlify.app/review shows new post
```

### Why git instead of iCloud

- Deterministic: no sync delays, no partial files, no conflicts
- Auditable: every story has a commit history
- Already the source of truth for batch.json and the review UI
- Works the same on all 3 machines as long as they can push to GitHub

---

## The `/story` Command Spec

**File:** `hotkey-app/.claude/commands/story.md`

### Behavior

When Matt types `/story`, Claude Code:

1. **Opens an interview** - asks for the story in natural language. No forms, no templates. Just conversation.

2. **Extracts structure** - from Matt's free-form answer, Claude pulls:
   - Title (punchy, <60 chars)
   - What happened (2-3 sentences, specific)
   - Why it matters (the insight, for content)
   - Content pillar: `ai` | `real-estate` | `business-systems` | `product`
   - Score (60-100, based on: specificity, insight quality, uniqueness)

3. **Asks about media** - "Any screenshots or recordings? Drop the filename or say no."

4. **Shows a preview** - displays the extracted structure, asks "Look right? Any changes before I generate?"

5. **Generates posts** - uses hook optimization principles:
   - Twitter: 5-7 tweet thread, hook in tweet 1, specifics + numbers, contrarian angle
   - LinkedIn: 1200-1500 chars, hook in first 2 lines, problem → what you built → why it matters → question
   - Instagram: 300-400 chars + 8-10 hashtags, behind-the-scenes vibe

6. **Shows post previews** - displays all 3 generated posts, asks "Approve all? Edit any? Skip one?"

7. **Writes files** - creates the story .md file and updates batch.json

8. **Commits and pushes** - single commit: `Add story: [title]`

9. **Confirms** - "Done. Review at hotkey-ai.netlify.app/review in ~3 min."

### Story file format

Written to `content-inbox/YYYY-MM-DD-[slug].md`:

```markdown
# [Story Title]

**Date:** YYYY-MM-DD HH:MM
**Pillar:** ai
**Score:** 85

## What Happened

[2-3 sentences, specific, with numbers and outcomes]

## Why It Matters

[The insight - what this demonstrates, why it's content-worthy]

## Media

[filename or None]
```

### batch.json update

Appends a new batch entry following the existing format. New entry goes at the end of `batches[]`. Increments `total`. Sets `generated` timestamp.

The three format entries (twitter, linkedin, instagram) use the already-established structure with `scheduleOptions`, `checked: false`, `publishType: 'auto'`.

---

## The `story.md` Command File

The command file tells Claude how to run the interview and generation. It must:

- Be conversational - no filling out forms
- Use Matt's voice profile (from `apps/review/app/config/profile.ts`)
- Apply hook optimization from `scripts/HOOK-OPTIMIZATION.md` and `scripts/HOOK-COMPARISON.md`
- Generate content that sounds like Matt, not generic AI content
- Be idempotent - if git push fails, don't write a duplicate to batch.json

### Key profile context to inject

```
Name: Matt Barge
Voice: technical, specific, contrarian, builds systems
Pillars: AI & automation, commercial real estate, business systems, product
Audience: Technical founders, developers building AI-powered products
Twitter: @matthewbarge
LinkedIn: Matt Barge, Founder & Developer
Instagram: @themattbarge
```

---

## Multi-Machine Setup

### One-time setup per machine

```bash
# On each machine, in the hotkey-app directory:
git pull origin main
# That's it. .claude/commands/story.md is now available.
```

### Keeping commands in sync

When the `/story` command is updated:
```bash
git pull  # on each machine before working
```

### Git credentials

Each machine needs push access to the repo. Options:
- SSH key already configured (most likely)
- GitHub CLI (`gh auth login`)
- Personal access token

### Working directory

The `/story` command must be run from within the `hotkey-app` project in Claude Code. The command uses relative paths to write files and update batch.json.

For non-hotkey-app Claude Code sessions (e.g., working in a different repo), Matt would need to either:
- Open a new Claude Code session in hotkey-app
- Or run `/story` from anywhere and have the command resolve the hotkey-app path explicitly

**Recommendation:** Hardcode the path to hotkey-app in the command so it works regardless of which project is open:
```
/Users/matthewbarge/DevProjects/hotkey-app/
```

---

## Story Content Guidelines (for the command prompt)

The command prompt should include these generation principles:

### Hook optimization (from existing scripts)

**What works:**
- Start with the problem or counterintuitive insight, not the solution
- Use specific numbers (12 rejection causes, 5 scripts, 15-minute monitoring)
- Before/after framing
- "Most people do X. I did Y instead."
- Show the system or pattern, not just the story

**Twitter thread structure:**
- Tweet 1: Hook - problem or insight that stops scroll. No more than 2 lines.
- Tweet 2-4: The specifics. What you built, the numbers, the details.
- Tweet 5-6: The insight or pattern. What this teaches.
- Tweet 7: Soft CTA or genuine question. Not "Follow me for more."

**LinkedIn structure:**
- First 2 lines visible before "see more" - make them count
- Short paragraphs (2-3 lines max)
- Conversational but substantive
- End with a real question, not a fishing-for-engagement one

**Instagram:**
- Emoji in first line
- Behind-the-scenes feel
- Keep it accessible (not too technical)
- Hashtags that are actually relevant

---

## Implementation Plan

### Phase 1: Core `/story` command (build now)

**Files to create:**
- `hotkey-app/.claude/commands/story.md` - The command

**Files to modify:**
- `apps/review/public/batch.json` - Updated by the command at runtime

**What it does:**
- Interactive interview (3-4 questions max)
- Generate 3 posts inline
- Write story .md to `content-inbox/`
- Update `batch.json`
- Commit + push

**Test:** Run `/story` on each machine, verify review UI updates.

### Phase 2: Quick capture mode (optional enhancement)

For when Matt doesn't want a full interview:

```
/story quick
"Built multi-agent pipeline, 50 repos at once, 8-12 worker sweet spot"
```

Claude infers all structure from the one-liner, still generates all 3 posts, asks for approval before committing.

### Phase 3: Story mining from Claude Code session (future)

Since Matt is working in Claude Code, Claude can analyze the current session for story-worthy moments and proactively suggest `/story` when something notable happens. This replaces the old "story mining from Kelly transcript" idea.

---

## Success Metrics

- Story captured in < 3 minutes of Matt's time
- Posts visible in review UI in < 6 minutes total
- Works identically on all 3 machines (MacBook Air + 2 Mac Minis)
- Zero failures due to iCloud sync, cron jobs, or external service outages
- Matt actually uses it (the real metric)

---

## Open Questions

1. **Should the command write to `content-inbox/` or directly to `batch.json` only?**
   Recommendation: both. `content-inbox/` for the raw story (audit trail, reprocessing), `batch.json` for immediate review UI updates.

2. **Should it auto-push or ask first?**
   Recommendation: auto-push. The whole point is zero friction. Matt can always revert if something looks wrong in the review UI.

3. **What if the push fails (offline)?**
   Recommendation: write the files locally, show the commit command to run manually. Don't lose the capture.

4. **Should the command be project-scoped or global?**
   Project-scoped (`.claude/commands/`) syncs via git. Global (`~/.claude/commands/`) would need manual setup on each machine. Project-scoped is better.

5. **What about `/story` from a different repo in Claude Code?**
   The command should use an absolute path to hotkey-app so it works from anywhere.

---

## Files Changed Summary

**New:**
- `hotkey-app/.claude/commands/story.md` - The command

**Not changed:**
- `apps/review/` - Review UI unchanged
- `apps/review/public/batch.json` - Same format, updated by command at runtime
- `scripts/content-watcher.js` - Keep for manual/cron use if needed
- `scripts/generate-with-claude.js` - Keep as fallback

**Deprecated (eventually):**
- iCloud content-inbox dependency - replaced by git-committed `content-inbox/`
- Cron job setup - replaced by on-demand command
