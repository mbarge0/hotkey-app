# HotKey Hook Optimization & Content Pipeline

## Current Problem

**What's happening now:**
- `generate-review-data.js` uses hardcoded text manipulation (not AI generation)
- Posts are just the raw story description split up
- No hooks, no platform optimization, all platforms get similar content
- The sophisticated format templates we built aren't being used

**Example (Multi-Agent Pipeline story):**
- Twitter: "Designed a multi-agent pipeline for iOS factory..."
- LinkedIn: "Designed a multi-agent pipeline for iOS factory... (longer)"
- Instagram: "Designed a multi-agent pipeline for iOS factory... (with hashtags)"

All boring. No hook. Same content.

---

## Hook Research: What Actually Works

### Twitter Hooks (Proven Patterns)

**Pattern 1: Contrast/Surprise**
- "Everyone thinks X. Here's why they're wrong:"
- "I spent $10k learning this. You can learn it in 2 minutes:"
- "Most people do X. I did Y. Here's what happened:"

**Pattern 2: Specific Numbers/Results**
- "I built 3 iOS apps in 48 hours. Here's the system:"
- "From 5 rejections to auto-approval in 2 weeks. The fix:"
- "350 API calls → 30 seconds. How we did it:"

**Pattern 3: Problem → Solution Tease**
- "My AI agent kept making the same mistakes. Then I built this:"
- "Context windows killed our multi-phase builds. The solution:"
- "5 App Store rejections taught me one thing:"

**Pattern 4: Vulnerable/Contrarian**
- "I was wrong about AI coding agents. Here's why:"
- "The 'best practice' everyone teaches? It failed spectacularly."
- "Building in public backfired. What I learned:"

**Pattern 5: Framework/List**
- "The 3-step system that cut dev time 10x:"
- "5 mistakes every AI builder makes (I made all of them):"
- "Here's my checklist before every iOS submission:"

### LinkedIn Hooks

**Pattern 1: Relatable Problem**
- "I've submitted 47 apps to the App Store. 12 got rejected. Here's what I learned:"
- "Context windows are the hidden bottleneck in AI coding. Most people don't see it until it's too late."

**Pattern 2: Counter-Intuitive Insight**
- "Error-free systems fail. Self-healing systems win. Here's why:"
- "The best AI agent isn't the one that never fails. It's the one that learns from failure."

**Pattern 3: Case Study Lead**
- "We went from 5 consecutive App Store rejections to auto-approval. The system:"
- "Our AI agent builds 3 production apps in 48 hours. Not a demo. Production. Here's how:"

### Instagram Hooks

**Pattern 1: Visual + Insight**
- "This screenshot shows the difference between amateur and factory."
- "Behind the scenes: 3 apps, 48 hours, one AI agent."

**Pattern 2: Aspirational**
- "Building while you sleep isn't a dream. It's a system."
- "This is what 10x productivity actually looks like."

---

## Optimal Content Generation Flow

### Current (Broken) Flow:
```
Story → generate-review-data.js → Text manipulation → Same boring content for all platforms
```

### Optimal Flow:
```
Story (raw capture) 
  ↓
Platform Selection (which channels fit this story?)
  ↓
For each platform:
  ↓
  System Prompt (platform-specific)
  +
  User DNA Prompt (Matt's voice/focus)
  +
  Hook Examples (platform-specific)
  +
  Story (raw material)
  ↓
  Claude API
  ↓
  Platform-optimized post with strong hook
```

### Architecture Details

**1. System Prompt Per Platform**

Each platform gets a system prompt that defines:
- Platform constraints (280 chars for Twitter, 2200 for LinkedIn, etc.)
- What works on that platform (threads vs long-form vs visual)
- Hook patterns that perform well
- Formatting rules (line breaks, hashtags, etc.)

**Example Twitter System Prompt:**
```
You are a Twitter ghostwriter for technical founders building in public.

Your job: Turn raw work stories into viral-worthy threads.

Rules:
- First tweet MUST hook in <100 chars
- Use proven patterns: numbers, contrast, specific results
- Technical depth but accessible
- No fluff, no humble-brags, no "check out my link"
- Thread structure: Hook → Context → Insight → Takeaway
- Max 280 chars per tweet
- Line breaks for readability

Hook patterns that work:
- "I spent X learning Y. Here's the shortcut:"
- "Everyone does X. We did Y. Results:"
- "Built X in Y time. The system:"
```

**2. User DNA Prompt**

Injected into every generation:
```
Author: Matt Barge
Focus: AI automation, real estate, building in public
Voice: Casual, technical, contrarian, no corporate speak
Expertise: Self-healing AI systems, iOS factories, hotel conversions
Audience: Technical founders, indie hackers, AI-first builders
Avoid: Buzzwords without substance, humble-bragging, generic advice
```

**3. Hook Generation First**

Before generating the full post:
1. Extract the core insight from the story
2. Generate 3-5 hook options using proven patterns
3. Score hooks (specificity, surprise, clarity)
4. Pick the strongest hook
5. Build the rest of the post around it

**4. Platform-Specific Templates (Skills)**

Each platform should have a SKILL that defines:
- System prompt
- Hook patterns
- Structure template
- Examples of great posts
- Common mistakes to avoid

**Example structure:**
```
content-factory/skills/
  twitter-thread/
    SKILL.md (system prompt, hooks, examples)
    templates/ (thread structures)
  linkedin-article/
    SKILL.md
    templates/
  instagram-post/
    SKILL.md
    templates/
```

---

## Implementation Plan

### Phase 1: Fix Current Generation (Immediate)

**Replace hardcoded text manipulation with Claude API:**

```javascript
// OLD (current):
function buildTwitterPost(story, sentences) {
  let post = sentences[0];
  // ... text manipulation ...
  return post;
}

// NEW:
async function buildTwitterPost(story, profile, pillar) {
  const systemPrompt = loadSkill('twitter-thread/system-prompt.txt');
  const hookExamples = loadSkill('twitter-thread/hook-examples.txt');
  
  const prompt = `${systemPrompt}

**User DNA:**
${JSON.stringify(profile.identity)}
${JSON.stringify(profile.voice)}

**Hook Examples:**
${hookExamples}

**Story (raw):**
${story.description}

**Instructions:**
1. Generate 3 hook options
2. Pick the strongest
3. Build a 3-5 tweet thread
4. Each tweet max 280 chars
5. Use Matt's voice (casual, technical, no fluff)

Generate now:`;

  const content = await callClaude(prompt);
  return content;
}
```

### Phase 2: Create Platform Skills

**Create a skill for each major platform:**

1. **Twitter Thread Skill**
   - System prompt: "You write viral Twitter threads..."
   - Hook patterns: 10 proven formulas
   - Examples: 5 great threads in Matt's voice
   - Structure: Hook → Context → Details → Takeaway

2. **LinkedIn Article Skill**
   - System prompt: "You write thought leadership articles..."
   - Hook patterns: Problem-first, case study, counter-intuitive
   - Examples: 3 long-form posts
   - Structure: Relatable problem → Approach → Results → Lessons

3. **Instagram Post Skill**
   - System prompt: "You write visual-first content..."
   - Hook patterns: Behind-the-scenes, aspirational, specific wins
   - Examples: Posts with strong visual hooks
   - Structure: Visual hook → Short insight → Hashtags

### Phase 3: Hook-First Generation

**Add a hook generation step:**

```javascript
async function generateContent(story, platform, profile) {
  // Step 1: Generate hooks
  const hooks = await generateHooks(story, platform, profile);
  
  // Step 2: Score hooks
  const scoredHooks = scoreHooks(hooks, platform);
  
  // Step 3: Pick best hook
  const bestHook = scoredHooks[0];
  
  // Step 4: Generate full post using that hook
  const post = await generateFullPost(bestHook, story, platform, profile);
  
  return post;
}
```

### Phase 4: A/B Test & Learn

**Track which hooks perform:**
- Store hook pattern used
- Track engagement (likes, comments, shares)
- Build a database of what works
- Auto-optimize over time

---

## Example: Multi-Agent Pipeline Story

**Raw Story:**
```
Designed a multi-agent pipeline for iOS app factory to solve context 
window limitations. Instead of one agent trying to run the full flow 
(discovery → design → code → assets → submit) and running out of context 
mid-build, split into 5 specialized phase agents.
```

**Current Output (Boring):**
> Designed a multi-agent pipeline for iOS factory to solve context window 
> limitations. [continues with same text]

**Hook-Optimized Output (Twitter):**

**Option A - Numbers Hook:**
> 1 AI agent couldn't finish an iOS app without running out of context.
> 
> 5 specialized agents working together? 3 production apps in 48 hours.
> 
> Here's the system:

**Option B - Problem Hook:**
> Context windows kill autonomous AI coding.
> 
> Your agent starts strong, then forgets halfway through. Sound familiar?
> 
> We fixed it. Thread:

**Option C - Specific Hook:**
> Our AI agent built apps until line 147 of SwiftUI. Then: context full, lost track, failed.
> 
> The fix wasn't bigger context. It was smarter handoffs.
> 
> How it works:

**Hook-Optimized Output (LinkedIn):**
> I've watched AI coding agents fail the same way 12 times.
> 
> They start building, compile the code, then completely forget what they're supposed to do next. App icons? Skipped. Screenshots? Forgotten. Submission? Never happens.
> 
> The problem isn't the agent. It's context windows.
> 
> Here's what we built to fix it:

**Hook-Optimized Output (Instagram):**
> Behind the scenes: How we got AI to ship 3 production iOS apps in 48 hours 🧵
> 
> [Video: Multi-agent pipeline design]
> 
> The secret? Don't ask one agent to remember everything.
> 
> Use 5 specialized agents with memory handoffs.
> 
> Discovery agent → Design agent → Code agent → Assets agent → Submit agent
> 
> Each one: reads state, does its job, updates checklist, spawns next.
> 
> #AIAutomation #iOSDev #BuildInPublic #Productivity

---

## Questions Answered

### Q: Are we using system prompts per platform?
**A:** Not currently. The review UI uses text manipulation. We SHOULD use system prompts.

### Q: Draft first or story-to-platform direct?
**A:** Story-to-platform direct is better. Why:
- Creating a "generic draft" first loses platform nuance
- Each platform has different constraints and opportunities
- Story is raw material → each platform interprets it differently

**Flow should be:**
```
Story (raw) → Twitter Skill → Twitter-optimized thread
Story (raw) → LinkedIn Skill → LinkedIn-optimized article
Story (raw) → Instagram Skill → Instagram-optimized post
```

Not:
```
Story → Generic Draft → Shorten/lengthen for platforms
```

### Q: Where does user DNA fit?
**A:** Injected into EVERY platform generation as part of the prompt:

```
System: "You write Twitter threads..."
User DNA: "Author is Matt Barge, focus on AI + real estate..."
Hook Examples: "I spent X learning Y..."
Story: "Designed a multi-agent pipeline..."
```

### Q: Should there be skills for each channel?
**A:** YES. Each major platform should be a skill:

```
content-factory/skills/
  twitter-thread/SKILL.md
  linkedin-article/SKILL.md  
  instagram-post/SKILL.md
  dev-to-article/SKILL.md
  medium-article/SKILL.md
```

Each skill defines:
- System prompt
- Hook patterns
- Structure templates
- Great examples
- What to avoid

---

## Next Steps

1. **Immediate:** Replace `generate-review-data.js` text manipulation with Claude API calls
2. **Create** twitter-thread skill with system prompt and hook patterns
3. **Test** on the multi-agent pipeline story - verify hooks are way better
4. **Iterate** on other platforms (LinkedIn, Instagram)
5. **Track** which hooks perform best → build a database
6. **Automate** hook scoring and selection over time

The goal: Every HotKey capture → 10 platform-specific posts with strong hooks that actually get attention.
