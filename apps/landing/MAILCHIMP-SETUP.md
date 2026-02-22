# Mailchimp Integration Setup

## Step 1: Get Your Mailchimp Form Action URL

1. Log in to Mailchimp
2. Go to **Audience** → **Signup forms** → **Embedded forms**
3. Scroll down to find the form `<form action="...">` tag
4. Copy the full action URL (looks like: `https://XXXXX.usX.list-manage.com/subscribe/post?u=XXXXX&id=XXXXX`)

## Step 2: Update index.html

Find this line in `index.html`:

```javascript
const MAILCHIMP_ACTION_URL = 'PASTE_YOUR_MAILCHIMP_FORM_ACTION_HERE';
```

Replace with your actual Mailchimp URL:

```javascript
const MAILCHIMP_ACTION_URL = 'https://YOUR-URL-HERE.usX.list-manage.com/subscribe/post?u=XXXXX&id=XXXXX';
```

## Step 3: Test the Form

1. Open `index.html` in a browser
2. Enter a test email
3. Click "Get Early Access"
4. Check your Mailchimp audience to verify the email was added

## Alternative: AJAX Submission (Better UX)

Replace the form submission code with this for better UX:

```javascript
forms.forEach(formId => {
    const form = document.getElementById(formId);
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = form.querySelector('input[name="email"]').value;
            
            const button = form.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            button.textContent = 'Signing up...';
            button.disabled = true;
            
            try {
                // AJAX submit to Mailchimp
                const formData = new FormData();
                formData.append('EMAIL', email);
                
                const response = await fetch(MAILCHIMP_ACTION_URL, {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors' // Required for Mailchimp
                });
                
                // Success (no-cors means we can't read response, but submission worked)
                button.textContent = '✓ You're on the list!';
                button.classList.add('bg-green-500');
                
                // Increment counter
                document.querySelectorAll('[id^="signup-count"]').forEach(el => {
                    el.textContent = parseInt(el.textContent) + 1;
                });
                
                form.reset();
                
            } catch (error) {
                button.textContent = 'Error - Try again';
            }
            
            button.disabled = false;
        });
    }
});
```

## Step 4: Custom Thank You Page (Optional)

Create `thank-you.html` and redirect after signup:

```javascript
// After successful signup
window.location.href = '/thank-you.html';
```

## Tracking Signups

Mailchimp will automatically:
- Add emails to your audience
- Send welcome email (if configured)
- Track signup source
- Show subscriber count in dashboard

## Testing

**Test emails:**
- Use real email addresses
- Check spam folder
- Verify welcome email arrives
- Test unsubscribe link works
