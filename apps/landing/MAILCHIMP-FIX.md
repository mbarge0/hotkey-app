# Fix Mailchimp Integration

## Problem
The form action URL is wrong:
```
https://matthewbarge.us10.list-manage.com/subscribe/post?u=250ca7a18e&id=250ca7a18e
```

This doesn't work because the `id=` parameter needs to be the actual HotKey list ID.

---

## Solution: Get Correct Embed Code from Mailchimp

### Step 1: Create HotKey List (if not exists)
1. Log in to https://mailchimp.com
2. Go to **Audience** → **All contacts**
3. Click "**Create Audience**" or use existing one
4. Name it: **HotKey Waitlist** (or similar)

### Step 2: Get Embed Form Code
1. Go to **Audience** → **Signup forms**
2. Click "**Embedded forms**"
3. Select your HotKey list
4. Scroll down to find the `<form action="...">` tag
5. Copy the FULL action URL (looks like):
   ```
   https://matthewbarge.us10.list-manage.com/subscribe/post?u=250ca7a18e&id=XXXXXXXXXX
   ```
   The `XXXXXXXXXX` is your real list ID

### Step 3: Update index.html
Replace line ~479 in `index.html`:

**OLD:**
```javascript
const MAILCHIMP_ACTION_URL = 'https://matthewbarge.us10.list-manage.com/subscribe/post?u=250ca7a18e&id=250ca7a18e';
```

**NEW:**
```javascript
const MAILCHIMP_ACTION_URL = 'YOUR_REAL_URL_HERE';
```

### Step 4: Redeploy
```bash
cd ~/clawd/hotkey-landing
git add index.html
git commit -m "Fix Mailchimp list ID"
netlify deploy --prod
```

---

## Alternative: Use Mailchimp API Script

```bash
cd ~/clawd/hotkey-landing
node get-mailchimp-form.js
```

This will query your Mailchimp account and show the correct URL (if your API key has access).

---

## How to Find Your List ID Manually

1. Go to https://mailchimp.com
2. Click **Audience** → **Settings**
3. Look for "**Audience name and defaults**"
4. Click "**Audience name and campaign defaults**"
5. The **Audience ID** is shown at the top (format: `a1b2c3d4e5`)
6. Your form URL is:
   ```
   https://matthewbarge.us10.list-manage.com/subscribe/post?u=250ca7a18e&id=a1b2c3d4e5
   ```
   (Replace `a1b2c3d4e5` with your actual ID)

---

## Test After Fix

1. Open https://content-factory-review.netlify.app/
2. Enter a test email
3. Check Mailchimp → Audience → All contacts
4. Verify the email appears in the HotKey list
