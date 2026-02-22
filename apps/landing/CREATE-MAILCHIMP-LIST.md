# Create HotKey Mailchimp List

## Step 1: Create New Audience

1. Go to https://mailchimp.com and log in
2. Click **Audience** in the left sidebar
3. Click **Audience dashboard**
4. Click **Manage Audience** dropdown → **Create Audience**
5. Fill in the form:
   - **Audience name:** HotKey Waitlist
   - **Default From email address:** matt@matthewbarge.com
   - **Default From name:** Matt Barge
   - **Remind people how they signed up:** You signed up for early access to HotKey at gethotkey.com
   - **Contact info:** Your business address (required by Mailchimp)
6. Click **Save**

## Step 2: Get the Form Action URL

1. In the HotKey Waitlist audience, go to **Signup forms** → **Embedded forms**
2. Scroll down to find the form HTML code
3. Look for the `<form action="...">` tag
4. Copy the FULL URL inside `action="..."`
   
   It will look like:
   ```
   https://matthewbarge.us10.list-manage.com/subscribe/post?u=XXXX&id=YYYY
   ```

## Step 3: Update index.html

Replace line ~477 in `index.html`:

**Find:**
```javascript
const MAILCHIMP_ACTION_URL = 'https://matthewbarge.us10.list-manage.com/subscribe/post?u=334e6a55e44a2dde8ff9835ee&id=250ca7a18e';
```

**Replace with your new URL:**
```javascript
const MAILCHIMP_ACTION_URL = 'YOUR_URL_HERE';
```

## Step 4: Rebuild & Deploy

```bash
cd ~/clawd/hotkey-landing
git add index.html
git commit -m "Update Mailchimp to HotKey Waitlist"
./build-combined.sh
netlify deploy --prod
```

## Step 5: Test

1. Go to https://content-factory-review.netlify.app/
2. Enter a test email
3. Check Mailchimp → HotKey Waitlist audience
4. Verify the email appears

---

## Why Manual Creation?

The Mailchimp API key doesn't have permission to create audiences (returned 403 error). This is a security restriction on your account. Manual creation via the web UI works fine.

---

## After You Create It

Send me the form action URL and I'll update the landing page automatically.
