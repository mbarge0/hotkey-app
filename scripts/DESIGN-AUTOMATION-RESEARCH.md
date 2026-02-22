# Design Automation Research

**Goal:** Find the best tool for programmatically generating quote cards, carousels, and social graphics

---

## 🎯 Criteria for Great Design Pipeline

### Must Have
1. **Programmatic API** - Generate images via code, not manual clicking
2. **Template system** - Pre-built templates we can customize
3. **Text rendering** - Good typography, auto-sizing, line breaks
4. **Brand consistency** - Colors, fonts, logos stay consistent
5. **Multiple formats** - Quote cards (1080x1080), carousels (1080x1080 × N), LinkedIn PDFs
6. **Fast generation** - <5 seconds per image
7. **High quality output** - 1080px+ resolution, no pixelation

### Nice to Have
8. **Cost effective** - Free tier or <$20/mo for volume we need
9. **No design skills required** - Agent can use it without human designer
10. **Batch processing** - Generate multiple images in one call
11. **Dynamic data** - Pass in text/data, auto-layout
12. **Export formats** - PNG, JPG, PDF

### Bonus
13. **AI layout** - Smart text placement, auto-cropping
14. **Stock photos** - Built-in image library
15. **No watermarks** - Clean output on free/cheap tier

---

## 🔍 Options Evaluated

### Option 1: Canva API
**What it is:** Design platform with programmatic API

**Pros:**
- ✅ Professional templates (1M+)
- ✅ Brand kit support (colors, fonts, logos)
- ✅ Multiple export formats (PNG, JPG, PDF)
- ✅ Easy to use (drag-drop editor + API)
- ✅ Stock photos included
- ✅ No watermarks on Pro plan

**Cons:**
- ❌ Requires Canva Pro ($14.99/mo or $120/yr)
- ❌ API access only on Enterprise (expensive) or via Zapier/Make.com
- ⚠️ No direct code API for custom integration

**Scoring:**
- Programmatic API: 5/10 (requires middleware like Zapier)
- Template system: 10/10
- Quality: 10/10
- Cost: 6/10 ($15/mo)
- Ease of use: 8/10

**Total: 39/50**

**Best for:** If we use Zapier/Make.com as middleware, or manual template fills

---

### Option 2: Bannerbear API
**What it is:** Programmatic image/video generation API

**Pros:**
- ✅ True REST API (code-first)
- ✅ Template editor with dynamic fields
- ✅ Auto-text sizing and layout
- ✅ Multiple formats (social posts, carousels, videos)
- ✅ Fast generation (<3 sec)
- ✅ Batch API for multiple images
- ✅ Free tier: 30 images/month
- ✅ Paid tier: $29/mo for 500 images

**Cons:**
- ⚠️ Templates less polished than Canva
- ⚠️ Need to build templates from scratch
- ⚠️ No stock photo library (bring your own)

**Scoring:**
- Programmatic API: 10/10
- Template system: 7/10
- Quality: 8/10
- Cost: 8/10 (free tier works for testing)
- Ease of use: 9/10

**Total: 42/50**

**Best for:** Developers who want full control via API

---

### Option 3: Placid.app
**What it is:** Design automation for social media

**Pros:**
- ✅ REST API + URL-based generation
- ✅ Template editor with layers
- ✅ Dynamic text, images, colors
- ✅ Multiple formats (posts, stories, carousels)
- ✅ Batch processing
- ✅ Free tier: 20 images/month
- ✅ Paid: $39/mo for 500 images

**Cons:**
- ⚠️ Similar to Bannerbear (less known)
- ⚠️ Templates need custom building
- ⚠️ Slightly more expensive than Bannerbear

**Scoring:**
- Programmatic API: 10/10
- Template system: 7/10
- Quality: 8/10
- Cost: 7/10
- Ease of use: 8/10

**Total: 40/50**

**Best for:** Similar to Bannerbear, good alternative

---

### Option 4: Cloudinary + Overlays
**What it is:** Image CDN with programmatic text/image overlays

**Pros:**
- ✅ URL-based generation (very fast)
- ✅ Dynamic text overlays
- ✅ Free tier: 25 credits/month
- ✅ Great for simple quote cards
- ✅ Very cheap ($0-$99/mo depending on volume)

**Cons:**
- ❌ No template editor (code-only)
- ❌ Limited layout options (not great for complex designs)
- ❌ Requires design skills to set up
- ❌ Not built for carousels/multi-page

**Scoring:**
- Programmatic API: 10/10
- Template system: 3/10
- Quality: 7/10
- Cost: 9/10
- Ease of use: 4/10

**Total: 33/50**

**Best for:** Simple quote cards, not complex designs

---

### Option 5: Fabric.js + Node Canvas (Build Your Own)
**What it is:** JavaScript canvas library for server-side rendering

**Pros:**
- ✅ Fully custom, no limits
- ✅ Free (open source)
- ✅ Complete control over every pixel
- ✅ Can integrate any font, image, layout

**Cons:**
- ❌ Requires significant dev work
- ❌ Need to code every template from scratch
- ❌ No pre-built templates
- ❌ Time-intensive to build
- ❌ Need design skills to make it look good

**Scoring:**
- Programmatic API: 10/10
- Template system: 0/10 (build from scratch)
- Quality: 8/10 (depends on your skills)
- Cost: 10/10 (free)
- Ease of use: 2/10

**Total: 30/50**

**Best for:** If you want to build everything custom and have time

---

### Option 6: Abyssale
**What it is:** Automated banner/social image generation

**Pros:**
- ✅ REST API
- ✅ Template editor
- ✅ Dynamic fields
- ✅ Batch generation
- ✅ Multiple formats

**Cons:**
- ⚠️ Pricing starts at $49/mo (no free tier)
- ⚠️ Less known than competitors
- ⚠️ Focused more on banner ads than social posts

**Scoring:**
- Programmatic API: 9/10
- Template system: 7/10
- Quality: 8/10
- Cost: 5/10
- Ease of use: 8/10

**Total: 37/50**

**Best for:** Enterprise marketing teams with budget

---

## 🏆 Recommendation

### Winner: **Bannerbear** (42/50)

**Why:**
1. **True API-first** - Built for programmatic generation
2. **Free tier works** - 30 images/month is enough to test
3. **Fast** - <3 sec per image
4. **Flexible** - Quote cards, carousels, stories all supported
5. **Affordable** - $29/mo for 500 images (we'd use ~100-200/month)

**Implementation:**
```javascript
// ~/clawd/content-factory/lib/design-generator.js

const axios = require('axios');

async function generateQuoteCard(quote, author, pillar) {
  const response = await axios.post('https://api.bannerbear.com/v2/images', {
    template: 'TEMPLATE_UID',
    modifications: [
      { name: 'quote_text', text: quote },
      { name: 'author', text: author },
      { name: 'accent_color', color: getPillarColor(pillar) }
    ]
  }, {
    headers: { 'Authorization': `Bearer ${process.env.BANNERBEAR_KEY}` }
  });
  
  return response.data.image_url;
}
```

**Templates to create:**
1. **Quote card** (1080×1080) - Text + author + brand accent
2. **Stat card** (1080×1080) - Big number + context + brand
3. **Tip card** (1080×1080) - Tip headline + body + CTA
4. **Carousel slide** (1080×1080) - Numbered slides with consistent branding
5. **LinkedIn carousel** (PDF, 1080×1080 × 5-10 pages)

---

### Runner-up: **Placid** (40/50)

Nearly identical to Bannerbear, slightly more expensive. Good backup option.

---

### Budget Option: **Cloudinary** (33/50)

If budget is tight, use Cloudinary for simple quote cards only. Skip complex designs.

---

### Premium Option: **Canva Pro + Zapier** (39/50)

If you want the best-looking templates and willing to use Zapier middleware:
1. Create templates in Canva
2. Use Zapier to trigger fills via webhook
3. Export via Canva's Zapier integration

**Cost:** $15/mo Canva + $20/mo Zapier = $35/mo
**Pro:** Professional templates, no design skills needed
**Con:** More complex setup, not pure API

---

## 🎯 Next Steps

**Recommended Path:**
1. **Sign up for Bannerbear** (free tier)
2. **Create 5 template designs** (quote, stat, tip, carousel, LinkedIn)
3. **Build `design-generator.js`** (API integration)
4. **Wire into multiplication flow** (auto-generate visuals for formats that need them)
5. **Test with App Store story** (generate quote cards, carousel)
6. **Upgrade to paid if we hit 30/month limit**

**Time estimate:**
- Signup + API setup: 15 min
- Template creation: 2-3 hours (one-time)
- Code integration: 1 hour
- Testing: 30 min

**Total:** ~4 hours to full visual automation

---

## 📊 Cost Summary

| Option | Setup Time | Monthly Cost | API Quality | Template Quality |
|--------|-----------|--------------|-------------|------------------|
| **Bannerbear** ⭐ | 4 hours | $0-29 | Excellent | Good |
| Placid | 4 hours | $0-39 | Excellent | Good |
| Canva + Zapier | 3 hours | $35 | Medium | Excellent |
| Cloudinary | 2 hours | $0 | Excellent | Basic |
| Build Custom | 20+ hours | $0 | Perfect | Depends on you |

**Recommendation:** Start with Bannerbear free tier, upgrade to $29/mo if we hit volume.
