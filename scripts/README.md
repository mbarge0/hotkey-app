# Content Factory

**5-Layer Production System for Automated Content Generation**

## Architecture

```
Input → Analysis → Structure → Generation → Output
```

### Layer 1: Input ✅
- Source content (videos, articles, notes)
- User profile (identity, voice, expertise)
- Content pillar (messaging, themes)
- Platform targets

### Layer 2: Analysis ✅
- Extract core message from source
- Identify applicable pillar
- Match to platform criteria
- Determine hook + format strategy

### Layer 3: Structure ✅
**Channel Libraries** (`structures/{platform}/`):
- `hooks.json` - Proven opening templates
- `formats.json` - Content structures that work
- `criteria.json` - What makes content great
- `examples.json` - High-performing posts with breakdowns

**Platforms:** Twitter, LinkedIn, Instagram

### Layer 4: Generation ✅
**Script:** `generate.js`

Combines profile + pillar + platform structures → Claude prompt → Draft

```bash
# Generate from source file
./generate.js --source inbox/video.mov --pillar ai

# Generate from description
./generate.js --prompt "Kelly fixed a bug" --pillar ai --platforms twitter,linkedin
```

### Layer 5: Output ✅
- Publer API integration (upload, schedule)
- Telegram approval workflow
- Draft storage (`drafts/`)
- Post tracking (coming soon)

## User Profile System ✅

**Schema:** `profiles/schema.json` (commercializable - works for any user)

**Matt's Profile:** `profiles/matt-barge.json`
- Identity: Name, title, one-liner
- Expertise: Primary/secondary domains, credibility markers
- Voice: Tone, avoid list, signature phrases, formality level
- Audience: Who they are, pain points, aspirations
- Positioning: What you help with, how you're different, proof points
- Content preferences: Formats, depth, personal stories
- Business context: Projects, achievements, tools, methodologies

## Content Pillars ✅

**Pillar Files:** `pillars/{ai|real-estate|business-systems}.json`

Each pillar defines:
- Focus area
- Key messages to emphasize
- Content angles and topics
- Target audience
- Pain points to address
- Aspirations to tap into
- Platform-specific content types
- Proof points to use
- Hooks that work for this pillar
- Things to avoid

**Matt's Pillars:**
1. **AI** - Self-healing systems, coding agents, automation intelligence
2. **Real Estate** - Commercial properties, hotel conversions, investment strategy
3. **Business Systems** - Automation, efficiency, scaling, factory patterns

## Production Workflow

### Current (Semi-Automated)

**Kelly captures interesting moments:**
1. Kelly uses `/story` hotkey when something cool happens
2. Writes summary to `content-inbox/kelly-story-YYYY-MM-DD-HHMM.md`
3. Includes: what happened, why it matters, pillar, score, media

**Pipeline processes automatically:**
1. Run `./scripts/content-workflow.js` (or cron every 30 min)
2. Processes new Kelly stories
3. Adds to work queue
4. Sends ranked list to Telegram

**You approve from Telegram:**
1. Reply to Telegram notification: `post 1 3`
2. System generates drafts for those items
3. Review drafts in `drafts/`
4. Final approval → publish via Publer

**Or manual generation:**
```bash
./generate.js --source inbox/file.mov --pillar ai
./auto-generate.js --prompt "Quick description" --pillar ai --approve
```

### Full Automation (Future)
1. Auto-detect pillar from content
2. Best-time-to-post intelligence
3. A/B testing framework
4. Performance tracking & optimization

## Files & Directories

```
content-factory/
├── README.md                           # This file
├── KELLY-INSTRUCTIONS.md               # How Kelly uses /story
├── capture-system.md                   # Full capture system design
├── generate.js                         # Manual generation (builds prompt)
├── auto-generate.js                    # Auto generation (calls Claude API)
├── scripts/
│   ├── content-workflow.js            # Full pipeline (check → process → notify)
│   ├── kelly-story-processor.js       # Process Kelly's story files
│   ├── approval-handler.js            # Handle "post 1 3" replies
│   ├── queue-manager.js               # Work queue operations
│   └── story-mine.js                  # Automated story mining (SSH to Kelly)
├── profiles/
│   ├── schema.json                    # Commercializable profile schema
│   └── matt-barge.json                # Matt's profile
├── pillars/
│   ├── ai.json                        # AI pillar definition
│   ├── real-estate.json               # Real estate pillar
│   └── business-systems.json          # Business systems pillar
├── structures/
│   ├── twitter/
│   │   ├── hooks.json                 # 15 proven hooks
│   │   ├── formats.json               # Tweet structures
│   │   ├── criteria.json              # What makes great tweets
│   │   └── examples.json              # High-performing tweets
│   ├── linkedin/
│   │   ├── hooks.json
│   │   ├── formats.json
│   │   ├── criteria.json
│   │   └── examples.json
│   └── instagram/
│       ├── hooks.json
│       ├── formats.json
│       ├── criteria.json
│       └── examples.json
├── content-inbox/                     # iCloud Drive folder
│   ├── QUICK-NOTES.md                 # Context for source files
│   ├── kelly-story-*.md               # Kelly's manual captures
│   └── *.mov, *.mp4, *.png            # Source media
└── drafts/
    ├── story-mining-*.md              # Story mining results
    └── YYYY-MM-DD-*.md                # Generated drafts
```

## Skills Integration

**Required OpenClaw skills:**
- `twitter` - Post tweets, threads
- `linkedin` - Post articles  
- `instagram` - Post reels, carousels
- `message` - Telegram approval workflow

**Environment:**
- `PUBLER_API_KEY` in `~/.secrets/marketing/publer.key`
- Telegram bot configured in OpenClaw

## Status

**✅ Complete:**
- Layer 1: Input infrastructure
- Layer 2: Analysis (manual selection for now)
- Layer 3: Structure libraries (all 3 platforms)
- Layer 4: Generation engine script
- Layer 5: Output (Publer + Telegram)
- User profile system (commercializable)
- Content pillar framework (3 pillars defined)
- First production run (Learning Playbook posts)

**🚧 Next:**
- Auto-pillar detection from source content
- Claude API integration (automated generation)
- Performance tracking system
- A/B testing framework

## Example Usage

### Generate from video
```bash
./generate.js --source content-inbox/LearningPlaybook3.mov --pillar ai
```

### Generate from prompt
```bash
./generate.js \
  --prompt "Kelly declared app done but skipped app icon, launch screen, and marketing. Learning playbook kicked in and updated checklist." \
  --pillar ai \
  --platforms twitter,linkedin,instagram
```

### Twitter-only quick post
```bash
./generate.js --prompt "Shipped 3 apps in 48h using Kelly" --pillar ai --platforms twitter
```

## Philosophy

**Distribution is the bottleneck.**

This factory exists because Matt has:
- Amazing source content (videos, learnings, behind-the-scenes)
- Clear expertise and unique positioning
- Multiple platforms hungry for content
- Limited time to manually adapt content per platform

**The factory solves:** Profile + Pillar + Platform + Source = Ready-to-publish drafts

**Not just automation.** Commercializable system that works for any creator with:
- Defined expertise
- Clear voice
- Content pillars
- Multi-platform presence
