# HotKey UX Improvements - Implementation Plan

**Date:** 2026-02-22
**Issues:** Multiple UX/workflow improvements requested

---

## Issues Identified

1. **Browser default:** Always use `profile="openclaw"` first, not Chrome extension
2. **Schedule page filters:** Need Twitter/LinkedIn/Instagram filters for unscheduled posts
3. **Dismissal/Posted status:** 
   - Dismissed posts still show in Review page
   - No visual indication in Review when individual posts are dismissed
   - Need "posted" status for manually posted content
4. **Navigation:** Current single forward/backward doesn't make sense for 14 items
5. **Content detection:** `/story` command not creating story files (35+ min delay, no notification)

---

## Solutions

### 1. Browser Default ✅
**Fix:** Mental note - always use `browser(..., profile="openclaw")` first

**Status:** DONE (procedural fix)

---

### 2. Schedule Page - Platform Filters for Unscheduled

**Current state:** Only filters timeline view
**Needed:** Filter unscheduled sidebar by platform too

**Implementation:**
```typescript
// Add filter state
const [unscheduledFilter, setUnscheduledFilter] = useState<Platform | 'all'>('all')

// Filter unscheduled posts
const filteredUnscheduled = displayedUnscheduled.filter(p => 
  unscheduledFilter === 'all' || p.platform === unscheduledFilter
)

// Add filter buttons in unscheduled sidebar header
<div className="flex gap-1 mb-3">
  {(['all', 'twitter', 'linkedin', 'instagram'] as const).map(filter => (
    <button
      key={filter}
      onClick={() => setUnscheduledFilter(filter)}
      className={`px-2 py-1 rounded text-xs font-medium ${
        unscheduledFilter === filter
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase()}
    </button>
  ))}
</div>
```

**Files to modify:**
- `apps/review/app/schedule/page.tsx`

---

### 3. Dismissal/Posted Status System

**Problem:** Three-state system needed, not two:
1. **unscheduled** - Available to schedule
2. **scheduled** - On the timeline
3. **dismissed** - User doesn't want to use this
4. **posted** - Already manually posted (LinkedIn, etc.)

**Current issue:** 
- Review page doesn't know about dismissed/posted status
- Shows all posts regardless of action taken
- No visual feedback

**Solution A: Shared State File**

Create `apps/review/public/post-status.json`:
```json
{
  "posts": {
    "app-store-defense-twitter": { "status": "posted", "postedAt": "2026-02-22T...", "platform": "twitter" },
    "app-store-defense-linkedin": { "status": "dismissed", "dismissedAt": "2026-02-22T..." },
    "hook-optimization-instagram": { "status": "scheduled", "scheduledFor": "2026-02-24T09:00" }
  },
  "lastUpdated": "2026-02-22T16:15:00Z"
}
```

**Update schedule page:**
- Load status on mount
- Update status on dismiss/schedule/post
- Save to `post-status.json`

**Update review page:**
- Load status on mount
- Grey out individual posts with status !== 'unscheduled'
- Hide story groups where ALL 3 platforms are dismissed/posted/scheduled

**Visual treatment:**
```css
/* Individual post that's dismissed */
.post-dismissed {
  opacity: 0.4;
  filter: grayscale(80%);
  pointer-events: none;
}

/* Individual post that's posted */
.post-posted {
  opacity: 0.6;
  border: 2px solid green;
  background: linear-gradient(to right, rgba(0,255,0,0.1), transparent);
}
.post-posted::after {
  content: "✓ Posted";
  position: absolute;
  top: 8px;
  right: 8px;
  background: green;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
}

/* Story group where all 3 are actioned - remove from list */
```

**Files to create/modify:**
- `apps/review/public/post-status.json` (new)
- `apps/review/app/schedule/page.tsx` (load/save status)
- `apps/review/app/page.tsx` (load status, filter display, visual treatment)

---

### 4. Navigation Improvements

**Current:** Single forward/backward button for 14 items
**Problem:** Can't see what you're navigating to, can't jump

**Solution: Hybrid Navigation**

Option A: **Thumbnail Strip** (best UX)
```
┌─────────────────────────────────────────────┐
│ [< Prev]  [Story 3 of 14]  [Next >]        │
├─────────────────────────────────────────────┤
│ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐       │
│ │1 │ │2 │ │3*│ │4 │ │5 │ │6 │ │7 │ ...   │
│ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘       │
└─────────────────────────────────────────────┘
```

- Current story highlighted
- Click any thumbnail to jump
- Previous/Next for keyboard navigation
- Show story title on hover

Option B: **Dropdown + Arrows** (simpler)
```
[< Prev]  [App Store Defense ▼]  [Next >]
          └─ Dropdown shows all 14 titles
```

**Recommendation:** Option A (thumbnail strip)
- More visual
- See progress at a glance
- Fast navigation

**Files to modify:**
- `apps/review/app/page.tsx` (navigation component)

---

### 5. Content Detection Fix

**Problem:** User added 2 stories via `/story` at 3:35pm, 40+ minutes later no notification

**Root cause analysis:**
```bash
# Files in content-inbox at 3:35pm:
ScreenRecording_02-22-2026 15-35-06_1.MP4
ScreenRecording_02-22-2026 15-39-52_1.MP4

# No corresponding matt-story-*.md files!
```

**Issue:** `/story` command captures media but doesn't create story markdown file

**Two scenarios:**
1. `/story` is manual - user should create `matt-story-YYYY-MM-DD-HHMM.md`
2. `/story` is automated - needs to generate the .md file

**Solution depends on workflow:**

**If manual `/story`:**
- Update documentation to show file format
- Create template in `content-inbox/STORY-TEMPLATE.md`

**If automated `/story` via OpenClaw:**
- Need to implement story file creation
- Extract context from conversation
- Generate markdown file with template

**Current blocker:** Not clear if `/story` is a manual process or should be automated

**Recommendation:** Check with user on workflow expectation

---

## Implementation Priority

### Phase 1: Quick Wins (30 min)
1. ✅ Browser default (done - procedural)
2. Platform filters for unscheduled sidebar
3. Add "posted" button to schedule page

### Phase 2: Status System (1 hour)
1. Create `post-status.json` structure
2. Update schedule page to load/save status
3. Update review page to filter by status
4. Add visual treatment (grey out, badges)

### Phase 3: Navigation (45 min)
1. Build thumbnail strip component
2. Add jump-to functionality
3. Keyboard shortcuts (←/→)

### Phase 4: Content Detection (needs clarification)
1. Understand `/story` workflow
2. Implement file generation if needed
3. Fix Telegram notification

---

## Status Transition Diagram

```
unscheduled 
    ├─> scheduled (drag to timeline)
    ├─> dismissed (click X)
    └─> posted (manual "Mark as Posted" button)

scheduled
    ├─> unscheduled (drag back)
    └─> posted (after publishing via Publer)

dismissed
    └─> unscheduled (click "Restore")

posted
    └─> [terminal state, can't undo]
```

---

## Files Changed Summary

**New files:**
- `apps/review/public/post-status.json`
- `content-inbox/STORY-TEMPLATE.md` (if needed)

**Modified files:**
- `apps/review/app/schedule/page.tsx`
  - Add unscheduled platform filters
  - Load/save post-status.json
  - Add "Mark as Posted" button
  
- `apps/review/app/page.tsx`
  - Load post-status.json
  - Filter stories where all 3 platforms actioned
  - Grey out individual posts by status
  - Add thumbnail navigation strip
  
- `apps/review/app/schedule/types.ts`
  - Extend status type: 'unscheduled' | 'scheduled' | 'dismissed' | 'posted'

---

## Testing Checklist

- [ ] Platform filters work in unscheduled sidebar
- [ ] Dismissing a post updates status across both pages
- [ ] Marking a post as "Posted" shows checkmark
- [ ] Review page hides stories where all 3 are dismissed/posted/scheduled
- [ ] Thumbnail navigation jumps to correct story
- [ ] Keyboard arrows (←/→) work
- [ ] Status persists across page reloads
- [ ] Content watcher detects new story files
- [ ] Telegram notification sends within 5 minutes

---

## User Question

**Re: `/story` workflow:**

When you type `/story` in chat:
1. Should it just capture media (current behavior)?
2. Or should it also prompt you for title/description and create the .md file?
3. Or should it auto-generate the .md file from recent conversation context?

This determines how we fix the content detection issue.
