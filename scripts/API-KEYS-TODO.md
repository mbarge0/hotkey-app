# API Keys - Easy Wins TODO

**Goal:** Add 4 more auto-publish platforms (currently at 5, target 9)

---

## ✅ Current Auto-Publish (5)
- Twitter (Publer)
- LinkedIn (Publer)
- Instagram (Publer)
- Facebook (Publer - pending verification)
- GitHub (git push)

---

## 🎯 Easy Wins - Get These API Keys

### 1. Dev.to
**Why:** Developer audience, strong SEO, easy API
**How to get key:**
1. Go to https://dev.to/settings/extensions
2. Generate API key
3. Save to `~/.secrets/content-factory/devto.key`

**API Docs:** https://developers.forem.com/api/v0

**Effort:** 5 minutes

---

### 2. Medium
**Why:** Large audience, good for evergreen content
**How to get key:**
1. Go to https://medium.com/me/settings/security
2. Create "Integration token"
3. Save to `~/.secrets/content-factory/medium.key`

**API Docs:** https://github.com/Medium/medium-api-docs

**Effort:** 5 minutes

---

### 3. Hashnode
**Why:** Developer community, own domain option, GraphQL API
**How to get key:**
1. Go to https://hashnode.com/settings/developer
2. Generate personal access token
3. Save to `~/.secrets/content-factory/hashnode.key`

**API Docs:** https://apidocs.hashnode.com/

**Effort:** 5 minutes

---

### 4. Substack (Newsletter)
**Status:** Need to decide if we want to use Substack
**Alternative:** Use Mailchimp (already have account)

**If using Substack:**
1. Create publication at https://substack.com
2. API is limited - may need to use email publish
3. Or use Mailchimp instead (already set up)

**For now:** Skip Substack, use Mailchimp copy/paste

**Effort:** Skip for now

---

## 📊 Impact

**Current:** 5 auto-publish platforms
**After getting keys:** 8 auto-publish platforms (Dev.to, Medium, Hashnode added)

**Time investment:** 15 minutes total
**Formats unlocked:** 3 major developer/publishing platforms

---

## 🔧 Implementation

Once you get the keys, I'll:
1. Create publisher scripts for each platform
2. Wire into `scheduling-engine.js`
3. Add to review UI as auto-publish options

**Location for keys:**
```
~/.secrets/content-factory/
├── devto.key
├── medium.key
├── hashnode.key
└── publer.key (already exists)
```

---

**Next:** Get these 3 keys when you have 15 minutes
