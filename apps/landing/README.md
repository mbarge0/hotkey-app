# HotKey Landing Page

**Live Demo:** [gethotkey.com](https://gethotkey.com) (deploy to this domain)

## What This Is

Landing page for HotKey - the Chrome extension that turns ChatGPT wins into 10 platform-specific posts in 30 seconds.

Built following best SaaS landing page principles (see `LANDING-PAGE-CRITERIA.md`).

## Features

✅ **Clear value proposition** - "Turn Every Win Into 10 Posts in 30 Seconds"  
✅ **Problem-solution structure** - Relatable pain points → HotKey fixes them  
✅ **3-step how it works** - Visual, simple, actionable  
✅ **Social proof** - Signup counter (starts at 127)  
✅ **Multiple CTAs** - 3 signup forms strategically placed  
✅ **Transparent pricing** - $29/month, no hidden costs  
✅ **FAQ section** - Kills objections before they form  
✅ **Mobile responsive** - Looks great on all devices  
✅ **Fast loading** - Single HTML file, Tailwind CDN  

## Setup

### 1. Configure Mailchimp

See `MAILCHIMP-SETUP.md` for detailed instructions.

**Quick version:**
1. Get your Mailchimp form action URL
2. Edit `index.html` line ~600
3. Replace `PASTE_YOUR_MAILCHIMP_FORM_ACTION_HERE` with your URL

### 2. Deploy to Netlify

**Option A: Drag & Drop**
1. Go to [app.netlify.com](https://app.netlify.com)
2. Drag the `hotkey-landing` folder
3. Done! Get your netlify.app URL

**Option B: Git Deploy** (Recommended)
```bash
cd ~/clawd/hotkey-landing
git init
git add .
git commit -m "Initial HotKey landing page"
git remote add origin https://github.com/mbarge0/hotkey-landing.git
git push -u origin main
```

Then connect in Netlify dashboard.

### 3. Custom Domain

1. Buy `gethotkey.com` (or similar)
2. In Netlify: **Domain settings** → **Add custom domain**
3. Update DNS records:
   ```
   A Record: @ → 75.2.60.5
   CNAME: www → your-site.netlify.app
   ```
4. Enable HTTPS (automatic in Netlify)

## Customization

### Update Signup Counter

Edit all instances of `127` to your actual signup count:
```javascript
<span id="signup-count">127</span>
```

### Change Launch Timeline

Current: "Launching in 4 weeks"

Update in 3 places:
1. Hero section
2. Pricing section
3. Final CTA

### Modify Pricing

Current: $29/month or $290/year

Edit in pricing section (~line 400).

### Add Screenshots

Replace placeholder with real screenshot:
```html
<div class="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-8 text-center">
    <img src="/screenshot.png" alt="HotKey Review UI" class="rounded-lg shadow-lg">
</div>
```

## Testing

### Before Going Live

- [ ] Test all 3 signup forms
- [ ] Verify Mailchimp integration
- [ ] Check mobile responsive (iPhone, iPad)
- [ ] Test on different browsers (Chrome, Safari, Firefox)
- [ ] Proofread all copy
- [ ] Check links work
- [ ] Test page speed (should be <2s)

### After Launch

- [ ] Share on Twitter
- [ ] Post in indie maker communities
- [ ] Track conversion rate (aim for 20%+)
- [ ] A/B test headlines if conversion is low

## Files

```
hotkey-landing/
├── index.html              # Main landing page
├── netlify.toml            # Deployment config
├── README.md               # This file
├── LANDING-PAGE-CRITERIA.md  # Design principles
├── MAILCHIMP-SETUP.md      # Integration guide
└── package.json            # NPM metadata
```

## Analytics (Optional)

Add Google Analytics or Plausible:

```html
<!-- Add before </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Conversion Optimization

### If Conversion Rate is Low (<10%)

Try:
1. **Shorter headline** - Test variations
2. **Add demo video** - Show product in action
3. **Social proof** - Add testimonials (once you have beta users)
4. **Urgency** - "Only 50 early access spots left"
5. **Free trial** - Consider 7-day trial instead of immediate payment

### If Conversion Rate is Good (20%+)

Keep it! Don't mess with what works.

## Support

Built by Matt Barge  
Twitter: [@matthewbarge](https://twitter.com/matthewbarge)  
Email: matt@gethotkey.com

## License

Proprietary - HotKey Landing Page
