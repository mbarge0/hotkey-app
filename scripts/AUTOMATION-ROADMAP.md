# Content Factory - Full Automation Roadmap

**Goal:** Close the loop from story → generated content → designed assets → published content

---

## 🎨 Design Automation

### Option 1: Canva API (Recommended)
**What:** Generate quote cards, carousels, Instagram posts via Canva API

**How:**
```javascript
// Create design from template
const design = await canva.createDesign({
  type: 'Instagram Post',
  template: 'quote-card-template-id',
  elements: {
    mainQuote: story.quote,
    author: profile.name,
    background: profile.brandColors.primary
  }
});

// Export as PNG
const imageUrl = await canva.export(design.id, 'png');
```

**Pros:**
- Professional templates
- Brand consistency
- Supports: Instagram posts, carousels, LinkedIn PDFs, quote cards
- API is straightforward

**Cons:**
- $14/mo for Canva Pro (needed for API)
- Template setup required

**Status:** ✅ Can implement today

---

### Option 2: Figma API
**What:** Design in Figma, export via API

**Pros:**
- More design control
- Version control for designs

**Cons:**
- More complex setup
- Manual template creation

**Status:** ⚠️ Backup option

---

### Option 3: Programmatic Design (Canvas/Sharp)
**What:** Generate images programmatically with Node canvas library

```javascript
const { createCanvas } = require('canvas');

function generateQuoteCard(quote, author) {
  const canvas = createCanvas(1080, 1080);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, 1080, 1080);
  
  // Quote text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 72px Arial';
  ctx.textAlign = 'center';
  wrapText(ctx, quote, 540, 400, 900, 90);
  
  // Author
  ctx.font = '36px Arial';
  ctx.fillText(`— ${author}`, 540, 800);
  
  return canvas.toBuffer('image/png');
}
```

**Pros:**
- Free
- Full control
- No external dependencies

**Cons:**
- Manual design coding
- Harder to make look professional

**Status:** ⚠️ Fallback if no budget for Canva

---

## 🎥 Video Automation

### For YouTube Scripts/Shorts/TikTok

#### Option 1: Slideshow Videos (Quick Win)
**What:** Turn static images + text → video slideshow

```javascript
const ffmpeg = require('fluent-ffmpeg');

async function createSlideshow(slides, audio) {
  // Generate image for each slide
  const images = await Promise.all(
    slides.map(slide => generateSlideImage(slide))
  );
  
  // Combine into video
  await ffmpeg()
    .input('concat:' + images.join('|'))
    .inputFPS(1/3) // 3 seconds per slide
    .videoCodec('libx264')
    .output('video.mp4')
    .run();
}
```

**Pros:**
- Works today (ffmpeg + image generation)
- No AI API costs
- Good for TikTok slideshow format

**Cons:**
- Static, not dynamic video

**Status:** ✅ Can implement now

---

#### Option 2: AI Video Generation APIs

**Runway ML:**
- Text → video
- Image → video with motion
- $12/month for API access

**Pika Labs:**
- Image → video animation
- Better for product demos

**Synthesia (Talking Head):**
- AI avatars read scripts
- Professional looking
- $30/month minimum

**HeyGen (AI Avatar):**
- Similar to Synthesia
- Cheaper ($24/month)

**Recommended:** Start with slideshow (free), add AI video if ROI justifies

---

#### Option 3: Screen Recording Automation
**What:** For tutorial videos, automate screen recording

```javascript
const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');

async function recordDemo(script) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const recorder = new PuppeteerScreenRecorder(page);
  
  await recorder.start('./demo.mp4');
  
  // Execute script steps
  for (const step of script.steps) {
    await page.goto(step.url);
    await page.click(step.selector);
    // ... etc
  }
  
  await recorder.stop();
  await browser.close();
}
```

**Pros:**
- Real demos, not static
- Good for technical content

**Cons:**
- Requires scriptable demos
- More complex

**Status:** ⚠️ Advanced feature

---

### For Instagram Reels

**Option 1: Reels from Images + Audio**
```javascript
// Generate vertical video (9:16)
const images = await generateReelFrames(story);
const audio = await getTrendingAudio(); // or TTS

await ffmpeg()
  .input(images)
  .input(audio)
  .size('1080x1920') // Vertical
  .fps(30)
  .output('reel.mp4')
  .run();
```

**Option 2: Kapwing API**
- Template-based video creation
- Has Reels templates
- $24/month

**Recommended:** Start with ffmpeg-based approach

---

## 👤 Onboarding Flow for Productization

### Phase 1: Profile Builder

**Interactive CLI onboarding:**
```bash
./onboard.js

Welcome to Content Factory! Let's build your profile.

1. Basic Info
   - Name: [input]
   - Professional title: [input]
   - Location: [input]
   - One-liner: [input]

2. Voice Analysis
   Option A: Paste 3 examples of your writing
   Option B: Answer these questions in your natural voice:
   - What frustrates you most about [topic]?
   - Tell me about a recent win:
   - What advice would you give a beginner?
   
   [AI analyzes tone, style, patterns]

3. Expertise
   - Primary domain: [select from list]
   - Secondary domains: [multi-select]
   - Unique angle: [input]

4. Content Pillars
   - Pillar 1: [name] - [focus area]
   - Pillar 2: [name] - [focus area]
   - Pillar 3: [name] - [focus area]

5. Goals
   - What are you optimizing for? [traffic/leads/authority/engagement]
   - Platforms you're active on: [multi-select]

6. Platform Connections
   - Twitter: [OAuth or API key]
   - LinkedIn: [OAuth]
   - Instagram: [OAuth]
   - GitHub: [username]
   - Blog URL: [input]

7. API Keys (optional for automation)
   - Publer: [input]
   - Canva: [input]
   - Video service: [input]

8. Brand Assets
   - Brand colors: [hex codes]
   - Logo: [upload]
   - Fonts: [select]

✅ Profile created: profiles/[username].json
✅ Pillars created: pillars/[pillar-names].json
✅ Ready to multiply content!

Try it: ./multiply.js --story example --auto-select --max-formats 5
```

---

### Phase 2: Web-Based Onboarding (SaaS Version)

**Landing Page → Onboarding Flow:**

```
Step 1: Sign Up
- Email + password
- Or: OAuth (Google, GitHub)

Step 2: Profile Basics
- Name, title, photo
- Social handles (Twitter, LinkedIn, etc.)

Step 3: Voice Calibration
- Paste 3 writing samples
- Or: Answer questions
- AI analyzes and shows: "Your voice is [casual, technical, contrarian]"
- User can adjust sliders

Step 4: Content Pillars
- "What do you want to talk about?"
- Add 2-5 pillars
- For each: name, focus, target audience

Step 5: Platform Setup
- Which platforms do you post on?
- Connect accounts (OAuth)
- Collect API keys (if automating)

Step 6: Goals & Preferences
- What matters most? [checkboxes]
- How often do you want to post?
- Auto-publish or review first?

Step 7: Test Run
- "Let's try it! Tell me about something you built recently:"
- [User inputs story]
- System generates 3-5 formats
- "Here's what we can create from one story. Ready to go?"

✅ Account ready
→ Dashboard with:
  - Story input
  - Generated content queue
  - Publishing calendar
  - Analytics
```

---

### Phase 3: Smart Defaults & Learning

**System learns over time:**
- Track which formats get best engagement
- Auto-adjust format selection
- Learn voice nuances from published content
- A/B test hooks and structures

**Progressive Enhancement:**
```
Week 1: Manual story input → Generated content
Week 2: Auto-detect stories from notes/work
Week 3: Smart scheduling based on engagement patterns
Week 4: Full automation with review workflow
```

---

## 🛠️ Technical Architecture

### Skill Structure
```
content-factory/
├── onboarding/
│   ├── cli-onboard.js          # Interactive terminal onboarding
│   ├── voice-analyzer.js       # Analyze writing samples
│   ├── profile-builder.js      # Construct profile JSON
│   └── connection-tester.js    # Test API connections
├── design/
│   ├── canva-integration.js    # Canva API wrapper
│   ├── quote-card-generator.js
│   ├── carousel-generator.js
│   └── templates/              # Canva template IDs
├── video/
│   ├── slideshow-generator.js  # ffmpeg-based
│   ├── tts-narrator.js         # Text-to-speech
│   ├── caption-generator.js    # Add text overlays
│   └── format-converter.js     # Convert for each platform
├── publishing/
│   ├── publer-client.js        # Existing
│   ├── devto-client.js         # Dev.to API
│   ├── medium-client.js        # Medium API
│   └── github-client.js        # GitHub API
└── web/                        # Future SaaS UI
    ├── dashboard/
    ├── onboarding-flow/
    └── analytics/
```

---

## 📋 Implementation Priority

### Phase 1: Core Automation (THIS WEEK)
1. ✅ Fix broken templates (DONE)
2. ✅ All 29 format generation (DONE)
3. ✅ Smart rubric selection (DONE)
4. ⚠️ CLI onboarding flow (BUILD THIS)
5. ⚠️ Design integration (Canva or programmatic)
6. ⚠️ Basic video (slideshow generator)

### Phase 2: Publishing Expansion (NEXT WEEK)
1. Dev.to API integration
2. Medium API integration
3. GitHub automated publishing
4. Auto-scheduling via Publer

### Phase 3: Advanced Features (MONTH 1)
1. Voice analysis & learning
2. Engagement tracking
3. A/B testing framework
4. AI video generation (if budget allows)

### Phase 4: Productization (MONTH 2)
1. Web-based onboarding
2. Dashboard UI
3. Multi-user support
4. Analytics & reporting

---

## 💰 Cost Analysis

### Minimum Viable Automation
- **Free:** ffmpeg, programmatic design, basic automation
- **$12/mo:** Publer (publishing to 4 platforms)
- **Total:** $12/mo

### Full Automation
- **$12/mo:** Publer
- **$14/mo:** Canva Pro (design)
- **$24/mo:** HeyGen (AI video, optional)
- **Total:** $50/mo (or $26/mo without AI video)

### SaaS Costs (per user)
- Infrastructure: $5-10/user/month
- API costs: Variable based on usage
- **Recommended pricing:** $49-99/user/month

---

## 🎯 Next Steps

**TODAY:**
1. Build CLI onboarding flow
2. Test Canva API integration (or build programmatic design)
3. Build slideshow video generator

**THIS WEEK:**
1. Full end-to-end test: Story → 29 formats → Design → Publish
2. Set up Dev.to + Medium APIs
3. Document the full workflow

**MONTH 1:**
1. Polish automation
2. Build web onboarding UI
3. Test with 2-3 beta users

Want me to start with #1 (CLI onboarding flow)?
