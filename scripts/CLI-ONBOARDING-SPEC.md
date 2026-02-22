# CLI Onboarding Flow - Specification

**Status:** Documented, not yet built  
**Purpose:** Turn new user into working profile in 5 minutes

---

## Usage

```bash
./onboard.js

# Or with flags
./onboard.js --quick    # Skip optional questions
./onboard.js --import profile-data.json  # Import existing
```

---

## Flow

### Welcome
```
🏭 Content Factory - Profile Setup

This will create your content profile so the factory
can generate content in YOUR voice, for YOUR audience.

Takes about 5 minutes. Ready? (y/n)
```

---

### Step 1: Basic Identity

```
📝 Basic Info

What's your name? 
→ Matt Barge

Professional title?
→ AI-First Engineer & Commercial Real Estate Investor

One-liner (what you do in <10 words):
→ Building AI factories that ship software while I sleep

Location (optional):
→ Austin, TX
```

**Saves to:** `identity` section

---

### Step 2: Voice Calibration

```
🎤 Voice Calibration

I need to learn how you write. Choose one:

1. Paste 3 examples of your writing (tweets, blog posts, etc.)
2. Answer a few questions in your natural voice

Choice (1/2): 2

Great! Answer these in your own voice:

Q1: What frustrates you most about [your field]?
→ [user types answer]

Q2: Tell me about a recent win:
→ [user types answer]

Q3: What advice would you give a beginner?
→ [user types answer]

[AI analyzes: casual tone, technical depth, contrarian style]

Your voice profile:
- Tone: casual, technical, contrarian, storyteller
- Formality: 3/5 (conversational but competent)
- Humor: yes
- Signature phrases detected: "self-healing factory", "compiles ≠ shipped"

Sound right? (y/n/edit)
```

**Saves to:** `voice` section

---

### Step 3: Expertise & Positioning

```
🎯 Expertise

What's your primary domain?
→ AI automation & software factories

Secondary domains (comma-separated, optional):
→ Commercial real estate, iOS development, Business systems

What's your unique angle?
(What makes your approach different?)
→ Builds self-learning AI systems that improve through failures

Key proof points (things you've done that prove expertise):
1. Ships 3 iOS apps in 48 hours using AI agent
2. Built self-healing coding agent with learning playbook
3. Hotel conversion projects maintaining cashflow during reno

Add more? (y/n)
```

**Saves to:** `expertise` and `positioning` sections

---

### Step 4: Content Pillars

```
📚 Content Pillars

Content pillars are the 2-5 topics you consistently talk about.

Pillar #1:
  Name: AI & Automation
  Focus: Self-healing systems, coding agents, automation intelligence
  Target audience: Developers, technical founders

Pillar #2:
  Name: Real Estate
  Focus: Hotel conversions, commercial property investing
  Target audience: Real estate investors, entrepreneurs

Pillar #3:
  Name: Business Systems
  Focus: Automation, efficiency, factory patterns
  Target audience: Founders, entrepreneurs

Add another? (y/n)
```

**Saves to:** `pillars/` directory (separate JSON per pillar)

---

### Step 5: Audience

```
👥 Target Audience

Who are you creating content for?

Describe your ideal reader/follower:
→ Technical founders building AI-powered businesses

Their main pain points (comma-separated):
→ Too much repetitive work, AI making same mistakes, shipping delays

Their aspirations:
→ Build without writing every line, ship faster, multiple income streams

Sophistication level:
1. Beginner
2. Intermediate
3. Advanced
4. Expert

→ 3 (Advanced)
```

**Saves to:** `audience` section

---

### Step 6: Platform Connections

```
🔗 Platform Setup

Which platforms do you actively use?
[x] Twitter/X
[x] LinkedIn
[x] Instagram
[ ] TikTok
[ ] YouTube
[x] GitHub
[x] Blog
[ ] Newsletter

For each selected platform:

Twitter handle: @matthewbarge
LinkedIn profile URL: linkedin.com/in/matt-barge
Instagram handle: @themattbarge
GitHub username: matthewbarge
Blog URL: mattbarge.com

Want to set up auto-publishing? (y/n): n
(You can add API keys later in profiles/[name].json)
```

**Saves to:** Profile with platform handles

---

### Step 7: Goals & Preferences

```
🎯 Goals

What matters most? (select all that apply)
[x] Traffic (grow audience)
[x] Authority (thought leadership)
[ ] Leads (business opportunities)
[x] Engagement (community building)

Content preferences:
Favorite formats:
[x] Behind-the-scenes
[x] Case studies
[x] Technical tutorials
[ ] Opinion pieces
[ ] News/trends

Depth preference:
→ 2 (Medium - balance between quick hits and deep dives)

Include personal stories? (y/n): y
```

**Saves to:** `content_preferences` and goals metadata

---

### Step 8: Brand (Optional)

```
🎨 Brand Assets (optional, skip for now)

Brand colors (hex codes):
→ [skip for now]

Logo URL or file path:
→ [skip]

You can add these later in profiles/[name].json
```

---

### Final Step: Save & Test

```
✅ Profile Complete!

Saved:
- profiles/matt-barge.json
- pillars/ai.json
- pillars/real-estate.json
- pillars/business-systems.json

Want to test it? (y/n): y

Great! Give me a quick story:

Title: App Store Submission Defense System
What happened: After 5 rejections, built 5 scripts that prevent repeat failures
Why it matters: System learns from every rejection

[Generating top 5 formats based on your profile...]

✅ Generated:
1. GitHub README (score: 84)
2. Blog post (score: 78)
3. Twitter thread (score: 68)
4. Dev.to post (score: 77)
5. LinkedIn article (score: 66)

Saved to: drafts/2026-02-21-app-store-defense/

Ready to use! 

Try: ./multiply.js --story [name] --auto-select --max-formats 10
```

---

## Technical Implementation

### Files Created

```
profiles/
  matt-barge.json         # Main profile
  
pillars/
  ai.json                 # Pillar definitions
  real-estate.json
  business-systems.json
  
.onboarding-state.json    # Temp file during onboarding
```

### Voice Analysis (AI Step)

```javascript
async function analyzeVoice(samples) {
  const prompt = `
Analyze these writing samples and extract:
1. Tone (casual, formal, technical, etc.)
2. Formality level (1-5)
3. Signature phrases
4. Things to avoid
5. Humor usage
6. Vulnerability level

Samples:
${samples.join('\n\n---\n\n')}

Return JSON.
  `;
  
  const analysis = await claude.analyze(prompt);
  return analysis;
}
```

### Progressive Enhancement

**v1:** All manual input  
**v2:** AI voice analysis from samples  
**v3:** Auto-detect pillars from past content  
**v4:** Learn and refine over time  

---

## Exit Points

User can exit anytime:
- Ctrl+C saves progress to `.onboarding-state.json`
- Next run: "Resume from Step 4? (y/n)"

---

## Validation

- Name: Required
- At least 1 content pillar: Required
- Voice tone: Can be manually set if AI analysis fails
- All else: Optional (smart defaults)

---

**Status:** Spec complete, ready to implement when needed for productization
