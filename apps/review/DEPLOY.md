# Deploy Content Review UI to New Netlify Site

**IMPORTANT:** Do NOT deploy to buyboxcre site! That's for BuyBox.

---

## Option 1: Netlify Web UI (Recommended - 2 minutes)

### Step 1: Build
```bash
cd ~/clawd/content-factory/review-ui
npm run build
```

The build creates the `out/` folder.

### Step 2: Drag & Drop Deploy

1. Go to https://app.netlify.com/drop
2. Drag the entire `out/` folder onto the dropzone
3. Wait for upload (30 seconds)
4. Netlify will give you a random URL like `https://random-name-123456.netlify.app`

### Step 3: Rename Site (Optional)

1. Go to Site settings → General → Site details
2. Click "Change site name"
3. Enter: `content-review-factory` (or whatever you want)
4. New URL: `https://content-review-factory.netlify.app`

---

## Option 2: Netlify CLI (Non-interactive)

```bash
cd ~/clawd/content-factory/review-ui

# Build first
npm run build

# Create new site
netlify sites:create --name content-review-factory --manual

# Note the site ID from output, then:
netlify link --id YOUR_SITE_ID

# Deploy
netlify deploy --prod --dir=out
```

---

## Option 3: GitHub + Netlify Auto-Deploy

### Step 1: Create GitHub Repo

```bash
cd ~/clawd/content-factory/review-ui

# Initialize git
git init
git add .
git commit -m "Initial commit: Content Review UI"

# Create repo on GitHub (via web or gh CLI)
gh repo create content-review-ui --public --source=. --push
# OR manually: https://github.com/new
```

### Step 2: Connect to Netlify

1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub
4. Select `content-review-ui` repo
5. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `out`
6. Click "Deploy site"

**Benefit:** Every git push auto-deploys!

---

## Current Status

❌ **REMOVED from buyboxcre** (that's for BuyBox, not this!)
⏳ **Ready to deploy** to new site

**Next:** Choose one of the 3 options above and deploy to a NEW Netlify site.

---

## After Deployment

Update these files with the new URL:

1. `~/Desktop/CONTENT-FACTORY-DEPLOYMENT-SUMMARY.md`
2. `~/clawd/content-factory/review-ui/README.md`
3. Any Telegram messages with the URL

The old URL (https://buyboxcre.netlify.app) should revert to whatever BuyBox content was there before.
