# HotKey Telegram Notification Issue

**Date:** 2026-02-23
**Status:** Needs fix

## Problem
Telegram notifications for new content are too long - they include full text for Twitter, LinkedIn, and Instagram posts, causing multiple phone notifications.

## Current Format
```
📬 New Content Ready for Review

Story: [title]

**TWITTER** (full 280 char post)
...

**LINKEDIN** (~330 words full post)
...

**INSTAGRAM** (full post with emojis)
...
```

## Desired Format
```
📬 New Content Ready for Review

**Story:** [title] (Score: XX/100)

**Summary:** [2-sentence summary of what happened]

**Key stats:** [bullet points of specific numbers]

**Posts generated:** Twitter, LinkedIn, Instagram

👉 Review and approve at: https://hotkey-ai.netlify.app/review

Draft saved: [path]
```

## Implementation
Update content generation script to send short summary instead of full post text to Telegram.

Full posts should only be visible in the review UI, not in the notification.

## Files to Update
- `~/clawd/content-factory/scripts/kelly-story-processor.js` (or wherever Telegram message is sent)
- Message generation logic that calls `message` tool

## Priority
Medium - functional but annoying user experience
