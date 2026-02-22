# Enable Auto-Deploy from GitHub

**Current Status:** Site is configured but needs GitHub integration

**Site ID:** 6593faf6-9aa7-404d-9308-456585c24a2a
**GitHub Repo:** https://github.com/mbarge0/content-review-ui

---

## Quick Setup (5 minutes)

### Step 1: Connect GitHub App

Go to: **https://app.netlify.com/projects/content-factory-review/settings/deploys**

1. Scroll to **"Continuous deployment"** section
2. Click **"Link repository"** or **"Configure repository"**
3. Choose **GitHub**
4. Authorize Netlify GitHub App (if not already)
5. Select repository: **mbarge0/content-review-ui**
6. Click **"Save"**

### Step 2: Verify Build Settings

Should auto-populate, but double-check:
- **Branch:** `main`
- **Build command:** `npm run build`
- **Publish directory:** `out`

Click **"Save"** if you made changes.

### Step 3: Test

```bash
cd ~/clawd/content-factory/review-ui
echo "test" >> README.md
git add README.md
git commit -m "Test auto-deploy"
git push
```

Watch build at: https://app.netlify.com/projects/content-factory-review/deploys

---

## What This Enables

**Before:** Manual `netlify deploy --prod` after every change
**After:** Just `git push` → auto-deploys in ~2 minutes

**Workflow:**
1. Make changes locally
2. `git add .`
3. `git commit -m "Description"`
4. `git push`
5. Netlify automatically builds and deploys
6. Live in 1-2 minutes

---

## Troubleshooting

### "Can't find repository"
- Make sure you authorized the Netlify GitHub App
- Check that mbarge0/content-review-ui is accessible

### "Build failed"
- Check build logs at the deploys page
- Verify `package.json` has `build` script
- Ensure `netlify.toml` is correct

### "Deploy succeeded but site not updated"
- Clear browser cache
- Check the deploy URL is the production one
- Verify publish directory is `out` not `.next`

---

## Alternative: GitHub Actions (If Netlify Integration Fails)

If the Netlify GitHub App doesn't work, you can use GitHub Actions:

**.github/workflows/deploy.yml:**
```yaml
name: Deploy to Netlify

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=out
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: 6593faf6-9aa7-404d-9308-456585c24a2a
```

Then add `NETLIFY_AUTH_TOKEN` to GitHub repo secrets.

---

**After setup:** Delete this file and the test commit
