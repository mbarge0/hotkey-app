# Schedule ↔ Review Page Sync Plan

**Status:** Filter working ✅ | State management needs implementation

## Current State

### What Works
- ✅ Schedule page filters by platform
- ✅ Can mark posts as "posted" (UI only)
- ✅ `post-status.json` file exists

### What Doesn't Work
- ❌ Status changes not persisted (only console.log)
- ❌ Review page doesn't read post-status.json
- ❌ No visual distinction between unscheduled/scheduled/posted
- ❌ Review shows all stories regardless of status
- ❌ No way to view completed stories

## Proposed Solution

### 1. State Persistence (Serverless Approach)

Since this is a static site, we need client-side persistence:

**Option A: localStorage + JSON download**
- Save post-status to localStorage
- Periodically export to downloadable JSON
- Import on new device/browser

**Option B: GitHub Gist API**
- Auto-save to private gist
- Sync across devices
- Requires GitHub token

**Recommended: Option A** (simpler, no auth needed)

### 2. Post Status States

```typescript
type PostStatus = 
  | 'unscheduled'  // Default - not acted on
  | 'scheduled'    // Added to schedule grid
  | 'posted'       // Published via Publer (or marked manually)
  | 'dismissed'    // User rejected/skipped
```

### 3. Visual Treatments

#### Schedule Page Unscheduled Sidebar

**Unscheduled** (default):
- White background
- Blue/Indigo/Pink platform badge
- "Auto-schedule" + "✓" + "×" buttons

**Scheduled**:
- Light green background `bg-green-50`
- Green badge "Scheduled"
- "View" button → shows scheduled time
- "Unschedule" button

**Posted**:
- Light gray background `bg-gray-100`
- Gray badge "Posted ✓"
- "View" button → shows published link (if available)
- No action buttons

**Dismissed**:
- Light red background `bg-red-50`
- "Restore" button

#### Review Page Story Cards

**Current:** Shows all stories with colored badges per format

**New:** Add status indicators per format

```tsx
<div className="format-status">
  {format.status === 'unscheduled' && (
    <span className="text-gray-500">⚪ Ready</span>
  )}
  {format.status === 'scheduled' && (
    <span className="text-green-600">📅 Scheduled</span>
  )}
  {format.status === 'posted' && (
    <span className="text-blue-600">✅ Posted</span>
  )}
</div>
```

### 4. Review Page Filtering

**Default View:** Only show stories with at least 1 unscheduled post

```typescript
const visibleBatches = batchData.batches.filter(batch => {
  return batch.formats.some(format => {
    const status = getPostStatus(format.id)
    return status === 'unscheduled' || !status
  })
})
```

**Add "History" Button:**
```tsx
<button onClick={() => setShowCompleted(!showCompleted)}>
  {showCompleted ? '← Active Queue' : 'View Completed →'}
</button>
```

**History View:** Show all stories where ALL formats are scheduled or posted

### 5. Status Sync Flow

```
Schedule Page:
  User clicks "✓ Mark Posted"
    ↓
  Update state: setUnscheduledPosts(...)
    ↓
  Save to localStorage: savePostStatus(postId, 'posted')
    ↓
  Export JSON: window.postStatus = {...}

Review Page:
  On load:
    ↓
  Read localStorage: loadPostStatus()
    ↓
  Merge with batch.formats
    ↓
  Filter: only show if hasUnscheduled
    ↓
  Render with status badges
```

### 6. Implementation Steps

#### Phase 1: Persistence (30 min)
- [ ] Create `utils/postStatus.ts` with save/load/export functions
- [ ] Update schedule page `savePostStatus()` to use localStorage
- [ ] Add export button: "Download Status JSON"
- [ ] Add import button: "Upload Status JSON"

#### Phase 2: Review Page Integration (20 min)
- [ ] Load post-status on review page mount
- [ ] Add status badges to format cards
- [ ] Filter: only show stories with unscheduled posts
- [ ] Add "View Completed" toggle button

#### Phase 3: Visual Improvements (20 min)
- [ ] Update unscheduled sidebar colors (scheduled = green, posted = gray)
- [ ] Change "✓" button icon/label: "✓" → "Posted" or "✅"
- [ ] Add "View Details" for scheduled/posted posts
- [ ] Improve dismissed state styling

#### Phase 4: Testing (10 min)
- [ ] Test status persistence across page refreshes
- [ ] Test filter updates in real-time
- [ ] Test export/import flow
- [ ] Verify completed stories view

## File Changes Needed

### New Files
- `apps/review/app/utils/postStatus.ts` - State management
- `apps/review/app/components/StatusBadge.tsx` - Reusable badge component

### Modified Files
- `apps/review/app/schedule/page.tsx` - Use postStatus utils
- `apps/review/app/page.tsx` - Load status, filter stories
- `apps/review/app/schedule/types.ts` - Add status type if needed

## Example postStatus.ts

```typescript
// apps/review/app/utils/postStatus.ts

export type PostStatus = 'unscheduled' | 'scheduled' | 'posted' | 'dismissed'

interface PostStatusData {
  posts: Record<string, {
    status: PostStatus
    timestamp: string
    scheduledTime?: string
    publishedUrl?: string
  }>
  lastUpdated: string
}

const STORAGE_KEY = 'hotkey-post-status'

export function savePostStatus(postId: string, status: PostStatus, meta?: any) {
  const data = loadPostStatus()
  data.posts[postId] = {
    status,
    timestamp: new Date().toISOString(),
    ...meta
  }
  data.lastUpdated = new Date().toISOString()
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  return data
}

export function loadPostStatus(): PostStatusData {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return { posts: {}, lastUpdated: new Date().toISOString() }
  }
  return JSON.parse(stored)
}

export function getPostStatus(postId: string): PostStatus | null {
  const data = loadPostStatus()
  return data.posts[postId]?.status || null
}

export function exportPostStatus() {
  const data = loadPostStatus()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `hotkey-status-${new Date().toISOString().split('T')[0]}.json`
  a.click()
}

export function importPostStatus(file: File): Promise<PostStatusData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        resolve(data)
      } catch (err) {
        reject(err)
      }
    }
    reader.readAsText(file)
  })
}
```

## UI Mockups

### Schedule Sidebar - Unscheduled (current)
```
┌─────────────────────────┐
│ Unscheduled (23)        │
│ [All][T][L][I]          │
├─────────────────────────┤
│ ⚪ LinkedIn              │
│ "Title here..."         │
│ [Auto-schedule][✓][×]   │  ← confusing
└─────────────────────────┘
```

### Schedule Sidebar - Better Labels
```
┌─────────────────────────┐
│ Unscheduled (23)        │
│ [All][T][L][I]          │
├─────────────────────────┤
│ ⚪ LinkedIn              │
│ "Title here..."         │
│ [Auto-schedule][Posted][Dismiss] │ ← clear
└─────────────────────────┘
```

### Schedule Sidebar - Scheduled/Posted States
```
┌─────────────────────────┐
│ 📅 LinkedIn              │  ← green bg
│ "Title here..."         │
│ Scheduled: Mon 9:00 AM  │
│ [View][Unschedule]      │
└─────────────────────────┘

┌─────────────────────────┐
│ ✅ LinkedIn              │  ← gray bg
│ "Title here..."         │
│ Posted: 2 hours ago     │
│ [View Post]             │
└─────────────────────────┘
```

### Review Page - Story with Mixed Status
```
┌────────────────────────────────┐
│ App Store Defense System       │
│ Score: 78 | AI Pillar          │
├────────────────────────────────┤
│ Twitter   ⚪ Ready              │
│ LinkedIn  ✅ Posted             │
│ Instagram 📅 Scheduled (Mon)    │
└────────────────────────────────┘
```

### Review Page - Header with History Toggle
```
┌────────────────────────────────┐
│ HotKey Review                  │
│ [← Back] [Schedule] [Download] │
│ Showing: 12 active stories     │
│ [View Completed Stories (45) →]│
└────────────────────────────────┘
```

## Next Steps

**Immediate (Matt's approval needed):**
1. Confirm localStorage approach is acceptable
2. Confirm visual styling (colors, icons, labels)
3. Priority: Do we implement all phases or just Phase 1-2?

**Once approved:**
1. Implement postStatus utils
2. Update schedule page to persist
3. Update review page to filter
4. Deploy and test

**Estimated Time:** ~1.5 hours total

## Questions for Matt

1. **Persistence:** localStorage OK, or prefer GitHub Gist sync?
2. **Button Label:** "Posted", "Mark Posted", or "✅ Done"?
3. **Completed View:** Separate page or toggle on main review?
4. **Status Badge Icons:** Plain text or emoji (⚪📅✅)?
5. **Priority:** Implement all now, or just persistence + filtering first?
