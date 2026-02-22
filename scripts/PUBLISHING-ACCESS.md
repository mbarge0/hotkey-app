# Publishing Access Inventory

**Last Updated:** 2026-02-21

This document tracks which platforms we have working API/publishing access to.

---

## ✅ Direct API Access (Working)

### Social Platforms
- **Twitter/X** ✅ (via Publer API + credentials)
  - Account: @matthewbarge
  - Access: Publer Business Plan
  - Can publish: Single tweets, threads (via Publer)
  
- **LinkedIn** ✅ (via Publer API)
  - Account: Matt Barge
  - Access: Publer Business Plan
  - Can publish: Posts, articles (via Publer)
  
- **Instagram** ✅ (via Publer API)
  - Account: @themattbarge
  - Access: Publer Business Plan
  - Can publish: Posts, carousels (via Publer)
  - Note: Reels/Stories need mobile/design work
  
- **Facebook** ⚠️ (Connected to Publer but pending verification)
  - Status: Needs final verification
  - Access: Publer Business Plan

### Publer API
- **Status:** ✅ Working
- **Plan:** Business ($12/mo)
- **Trial Expires:** March 6, 2026
- **API Key:** In `~/.secrets/marketing/publer.key`
- **Workspace ID:** 6998e5be023eb1ecd3514fe1
- **Connected accounts:** Twitter, LinkedIn, Instagram, Facebook (pending)

---

## ✅ Manual Publishing (No API, But We Have Accounts)

### Developer Platforms
- **GitHub** ✅
  - Can create repos, push READMEs
  - No "publish" API needed (just git push)
  
- **Dev.to** ✅
  - Account exists (assumed)
  - Has API for publishing articles
  - Status: Need to check API key
  
- **Hashnode** ⚠️
  - Need to check if account exists
  - Has GraphQL API for publishing
  
- **Product Hunt** ⚠️
  - Manual launch process
  - No auto-publish API

- **Hacker News** ❌
  - Manual posts only
  - No API for submissions
  
- **Reddit** ❌ (manual only, very anti-bot)
  - Has API but risky for automated posting
  - Better as manual copy/paste from generated content

- **Indie Hackers** ⚠️
  - Manual posting
  - No official API

### Publishing Platforms
- **Medium** ⚠️
  - Has API for publishing
  - Need to check if account exists + API key
  
- **Substack** ⚠️
  - Has API
  - Need to check if account/newsletter exists
  
- **Own Blog** ✅
  - Can publish directly (if blog exists)
  - Or generate markdown files for any platform

### Email
- **Newsletter** ⚠️
  - Need email platform (Substack, Mailchimp, ConvertKit, etc.)
  - Status: Unknown what's set up

- **Cold Email** ✅
  - Can send via any email client
  - Just need SMTP or email service

---

## ❌ Need Video/Design Work (No Direct Publishing)

### Video Platforms
- **YouTube** ❌
  - Can upload via API
  - But need actual VIDEO files (not just scripts)
  - Status: Scripts generate, but no video production pipeline
  
- **TikTok** ❌
  - Need video files
  - Has API but requires approved developer account
  
- **Instagram Reels** ❌
  - Need vertical video files
  - Publer can schedule but needs media

### Visual Content
- **Instagram Stories** ❌
  - Need designed frames (9:16 images/video)
  - Publer can schedule but needs assets
  
- **LinkedIn Carousel** ❌
  - Need PDF or designed slides
  - Publer can upload if we generate the PDFs
  
- **Quote Cards** ❌
  - Need designed graphics (1080x1080)
  - Can schedule via Publer once designed

---

## ❌ Event-Based (No API Publishing)

- **Conference Talks** ❌ (proposal + acceptance required)
- **Workshops** ❌ (booking required)
- **Podcast** ❌ (recording + hosting required)

---

## 🎯 Publishing Readiness by Format

| Format | Generate ✅ | Publish 🚀 | Notes |
|--------|-----------|-----------|-------|
| **Twitter Single** | ✅ | ✅ | Via Publer API |
| **Twitter Thread** | ✅ | ✅ | Via Publer API |
| **LinkedIn Article** | ✅ | ✅ | Via Publer API |
| **LinkedIn Carousel** | ✅ | ⚠️ | Need PDF generation |
| **Instagram Carousel** | ✅ | ⚠️ | Need image design |
| **Instagram Story** | ✅ | ⚠️ | Need frame design |
| **Instagram Reel** | ✅ | ❌ | Need video |
| **Facebook Post** | ✅ | ⚠️ | Publer pending |
| **TikTok Slideshow** | ✅ | ❌ | Need video |
| **YouTube Script** | ✅ | ❌ | Need video |
| **YouTube Short** | ✅ | ❌ | Need video |
| **Blog Post** | ✅ | ✅ | Manual publish |
| **Newsletter** | ✅ | ⚠️ | Need platform |
| **Reddit** | ✅ | ⚠️ | Manual (anti-bot) |
| **Medium** | ✅ | ⚠️ | Need API key |
| **Substack** | ✅ | ⚠️ | Need account |
| **Dev.to** | ✅ | ⚠️ | Need API key |
| **Hashnode** | ✅ | ⚠️ | Need account |
| **GitHub README** | ✅ | ✅ | Git push |
| **Product Hunt** | ✅ | ❌ | Manual launch |
| **Hacker News** | ✅ | ❌ | Manual only |
| **Indie Hackers** | ✅ | ❌ | Manual only |
| **Landing Page** | ✅ | ✅ | Manual deploy |
| **Cold Email** | ✅ | ✅ | SMTP/service |
| **Press Release** | ✅ | ⚠️ | Manual distribution |
| **Case Study** | ✅ | ✅ | Manual publish |
| **Conference Talk** | ✅ | ❌ | Event-based |
| **Workshop** | ✅ | ❌ | Event-based |
| **Podcast** | ✅ | ❌ | Recording needed |
| **Quote Cards** | ✅ | ⚠️ | Need design |

---

## 🔧 What We Need to Set Up

### Immediate (Easy Wins)
1. **Dev.to API key** - Get API key from Dev.to settings
2. **Medium API key** - Get integration token from Medium settings
3. **Blog platform** - Confirm if Matt has a blog (or create one)

### Medium Priority
1. **Design pipeline** - Canva API or similar for:
   - Quote cards (1080x1080)
   - Instagram carousels
   - LinkedIn carousel PDFs
   
2. **Newsletter platform** - Choose one:
   - Substack (easiest)
   - ConvertKit
   - Mailchimp
   
3. **Facebook verification** - Complete Publer Facebook connection

### Long-term
1. **Video production pipeline** - For:
   - YouTube videos/shorts
   - TikTok
   - Instagram Reels
   
2. **Podcast setup** - If desired:
   - Recording
   - Editing
   - Hosting (Anchor, etc.)

---

## 📊 Current Publishing Coverage

**Immediate publish (via API/automation):** 5 formats
- Twitter (single + thread)
- LinkedIn article
- Instagram post
- GitHub

**Manual publish (copy/paste from generated):** 15+ formats
- Blog, Reddit, Medium, Dev.to, Hashnode
- Hacker News, Product Hunt, Indie Hackers
- Substack, Newsletter
- Landing page, Case study, Press release
- Cold email, Conference/workshop proposals

**Need design work:** 5 formats
- LinkedIn carousel
- Instagram carousel/story
- Quote cards

**Need video:** 5 formats
- YouTube (script + short)
- TikTok
- Instagram Reels

**Event-based:** 3 formats
- Conference talk
- Workshop
- Podcast

---

## 🎯 Recommended Action

**Phase 1: Use what works** (TODAY)
- Generate content for 5 formats we can publish immediately
- Use Twitter, LinkedIn, Instagram via Publer
- Manual publish: Blog, GitHub, Dev.to, Reddit, HN

**Phase 2: Enable text platforms** (THIS WEEK)
- Get Dev.to API key
- Get Medium API key
- Set up Substack for newsletter

**Phase 3: Add design** (LATER)
- Design pipeline for visual content
- Canva API or manual design

**Phase 4: Add video** (FUTURE)
- Video production for YouTube/TikTok/Reels
- Only if showing major ROI from other channels

---

**Bottom Line:** 
- ✅ We can GENERATE 29 formats
- ✅ We can AUTO-PUBLISH 5 formats (Twitter, LinkedIn, Instagram, GitHub)
- ✅ We can MANUAL-PUBLISH 15+ formats (copy/paste)
- ⚠️ We need DESIGN for 5 formats
- ❌ We need VIDEO for 5 formats
