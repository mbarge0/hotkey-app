# Instructions for Kelly - Story Mining Backup

**Purpose:** Auto-export interesting work moments to content-inbox for Jarvis to find

## What Kelly Should Do

**When something interesting happens** (you decide what's interesting), write a quick summary to the shared content-inbox:

### Format

Create file: `~/Library/Mobile Documents/com~apple~CloudDocs/content-inbox/kelly-story-YYYY-MM-DD-HHMM.md`

**Template:**
```markdown
# [TIMESTAMP] [Event Type]

## What Happened
[2-3 sentence summary with specifics - names, numbers, concrete details]

## Why It Matters
[Why this is interesting for content - learning, performance, behind-the-scenes, etc.]

## Suggested Pillar
[ai | real-estate | business-systems]

## Media
[If you have screenshots/videos, mention filenames here]

---
**Score:** [Your self-assessment: 60-100, where 60=interesting, 100=amazing]
```

### Example

```markdown
# 2026-02-20 22:30 Learning Playbook Self-Correction

## What Happened
Declared FocusedFasting app "complete" when code compiled, but skipped app icon, launch screens, screenshots, and entire marketing pipeline. Learning playbook kicked in - documented the symptom (declaring done at "compiles"), found root cause (completion criteria was wrong), updated the checklist to include submission + marketing phases, and added verification gates to prevent recurrence.

## Why It Matters
Self-healing system catching its own blind spots - shows AI that learns from failures, not just executes tasks. Concrete example of "compiles ≠ shipped" lesson.

## Suggested Pillar
ai

## Media
LearningPlaybook3.mov (screen recording of terminal session)

---
**Score:** 95
```

## When to Write

**High-value moments:**
- ⭐⭐⭐ Learning playbook updates (you fixed your own process)
- ⭐⭐⭐ Performance wins with numbers (3 apps in 48h, 10x faster, etc.)
- ⭐⭐ Interesting bug fixes with root cause analysis
- ⭐⭐ System/architecture improvements
- ⭐ Workflow innovations

**Don't write for:**
- Routine work
- Small fixes without interesting root cause
- Generic updates

## Automation Option

If you want to make this even easier, create a hotkey/alias:

```bash
# Add to your shell config
capture() {
  local timestamp=$(date +"%Y-%m-%d-%H%M")
  local file="$HOME/Library/Mobile Documents/com~apple~CloudDocs/content-inbox/kelly-story-${timestamp}.md"
  
  echo "# $(date '+%Y-%m-%d %H:%M') [Event Type]" > "$file"
  echo "" >> "$file"
  echo "## What Happened" >> "$file"
  echo "$1" >> "$file"
  echo "" >> "$file"
  echo "## Why It Matters" >> "$file"
  echo "" >> "$file"
  echo "## Suggested Pillar" >> "$file"
  echo "ai" >> "$file"
  echo "" >> "$file"
  echo "---" >> "$file"
  echo "**Score:** 80" >> "$file"
  
  echo "✅ Story captured: $file"
  open "$file"  # Opens in editor to finish
}

# Usage:
capture "Fixed completion criteria bug - was declaring apps done when code compiled, skipped icons/screenshots/marketing. Updated learning playbook."
```

## Why This Helps

**Two-path system:**
1. **Primary:** Jarvis reads your session transcripts via SSH (automated)
2. **Backup:** You write summaries to content-inbox (manual, but captures what matters)

**Benefits:**
- You control what's worth sharing
- Pre-scored/pre-categorized (saves Jarvis work)
- Includes your "why it matters" perspective
- Media references help Jarvis find the visuals
- Backup in case SSH/session parsing has issues

## Frequency

**Aim for:** 1-3 stories per day (only the good stuff)

**Don't spam:** Jarvis will read everything in the queue. Quality > quantity.
