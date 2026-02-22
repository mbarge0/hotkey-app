# Content Review UI

**Purpose:** Web interface for reviewing and scheduling multiplied content formats

**Built with:** Next.js 14 + TypeScript + Tailwind CSS

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd ~/clawd/content-factory/review-ui
npm install
```

### 2. Run Locally

```bash
npm run dev
```

Visit http://localhost:3000

### 3. Build for Production

```bash
npm run build
```

This creates a static export in `/out` directory.

---

## 📦 Deploy to Netlify

### Option A: Netlify CLI (Recommended)

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod
```

### Option B: Git-based Deploy

1. **Create Git repo for review-ui:**
```bash
cd ~/clawd/content-factory/review-ui
git init
git add .
git commit -m "Initial commit: Content Review UI"
```

2. **Create GitHub repo:**
- Go to https://github.com/new
- Name: `content-review-ui`
- Push code:
```bash
git remote add origin git@github.com:YOUR_USERNAME/content-review-ui.git
git push -u origin main
```

3. **Connect to Netlify:**
- Go to https://app.netlify.com/
- Click "Add new site" → "Import an existing project"
- Connect to GitHub
- Select `content-review-ui` repo
- Build settings:
  - Build command: `npm run build`
  - Publish directory: `out`
- Click "Deploy site"

### Option C: Drag & Drop

```bash
# Build locally
npm run build

# Drag the /out folder to https://app.netlify.com/drop
```

---

## 🔗 Custom Domain (Optional)

After deploying to Netlify:

1. Go to Site settings → Domain management
2. Add custom domain (e.g., `content.yourdomain.com`)
3. Update DNS records as instructed
4. Enable HTTPS (automatic)

---

## 📊 Features

### Current (MVP)
- ✅ Review multiplied content formats
- ✅ Filter by publish type (auto/manual/design/video)
- ✅ Multiselect formats
- ✅ Per-format scheduling options
- ✅ Preview modal for full content
- ✅ Schedule selected batch
- ✅ Save as drafts
- ✅ Discard unselected

### Next Phase
- [ ] Load real batches from API
- [ ] Connect to scheduling-engine.js
- [ ] Connect to Publer API for auto-publish
- [ ] Auth/security (token-based)
- [ ] History of scheduled posts
- [ ] Analytics (which formats perform best)

---

## 🔌 Integration Points

### Data Flow

```
Multiplication (multiply.js)
    ↓
Drafts folder (~/content-factory/drafts/BATCH_ID/)
    ↓
Review UI (loads from API)
    ↓
User selects + schedules
    ↓
Scheduling engine (scheduling-engine.js)
    ↓
Content schedule (content-schedule.json)
    ↓
Publer cron (publishes at scheduled time)
```

### API Endpoints (To Build)

**Load batch:**
```
GET /api/batch/:batchId
→ Returns { story, formats[] }
```

**Schedule posts:**
```
POST /api/schedule
Body: { batchId, selected: [formatId], schedules: {...} }
→ Updates content-schedule.json
```

**Save drafts:**
```
POST /api/drafts/save
Body: { batchId, formatIds: [...] }
→ Keeps drafts in backlog
```

---

## 🎨 Customization

### Colors

Edit `tailwind.config.ts` to match your brand:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      // ...
    }
  }
}
```

### Mock Data

Current version uses mock data in `page.tsx`. To load real batches:

1. Create API route: `app/api/batch/[id]/route.ts`
2. Read from `~/clawd/content-factory/drafts/[batchId]/`
3. Parse markdown files into format objects
4. Return JSON

---

## 📝 TODO

- [ ] Build API routes for real data
- [ ] Add authentication (simple token)
- [ ] Wire scheduling to scheduling-engine.js
- [ ] Add batch history page
- [ ] Add analytics/performance tracking
- [ ] Mobile responsive improvements
- [ ] Dark mode toggle

---

## 🐛 Troubleshooting

**Build fails:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Port 3000 in use:**
```bash
PORT=3001 npm run dev
```

**Static export issues:**
- Check `next.config.js` has `output: 'export'`
- Remove any server-side features (API routes won't work in static export)
- Use client-side data fetching instead

---

## 📚 Tech Stack

- **Next.js 14** - React framework with static export
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Netlify** - Static hosting with instant deploys

---

**Deployed URL:** https://content-factory-review.netlify.app
**GitHub Repo:** https://github.com/mbarge0/content-review-ui
**Netlify Dashboard:** https://app.netlify.com/projects/content-factory-review

**Local:** http://localhost:3000
# Auto-deploy test
