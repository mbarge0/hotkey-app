# FocusedFasting Payments Live - Content Drafts

**Source:** 2026-02-25-focusedfasting-payments-live.md  
**Score:** 75/100  
**Topic:** First monetized app live, StoreKit vs RevenueCat decision  
**Generated:** 2026-02-25 11:20 CST

---

## TWITTER OPTION 1 (Single Tweet)

Almost added RevenueCat to my fasting app.

Then realized: StoreKit 2 works great, RevenueCat costs 1% after $2.5K, and I'm not making money yet.

Ship more apps > optimize payment infrastructure.

First payment prompt went live today. Subscriptions work. Now it's a business.

---

## TWITTER OPTION 2 (Thread - 6 tweets)

**Tweet 1:**
First real payment prompt in my app just went live. FocusedFasting v2.0 is officially monetized.

$4.99/mo, $29.99/yr. Apple approved all 4 subscription products.

The moment months of building becomes an actual business.

**Tweet 2:**
Almost added RevenueCat for payments.

Everyone talks about it. Analytics, A/B testing, cross-platform support.

Then I looked at what it actually does: It's a tracking layer. Doesn't save you from Apple's 15-30% cut.

**Tweet 3:**
The comparison:

RevenueCat:
• 1% revenue after $2.5K
• Extra dependency
• Code changes required
• Remote paywall control

StoreKit 2:
• Free
• Native
• Already working
• No dependency

**Tweet 4:**
At early stage, shipping more apps beats optimizing payment infrastructure.

RevenueCat is a nice-to-have, not a must-have. It's useful when you're doing $5-10K/month and A/B testing matters.

Right now? Just make $1 first.

**Tweet 5:**
StoreKit 2 handles:
✅ Payment processing
✅ Subscription management
✅ Receipt validation
✅ Refunds/cancellations

That's everything you actually need. The analytics gap isn't worth the complexity cost when you're at $0.

**Tweet 6:**
Pattern is now reusable for all factory apps:
• StoreManager.swift (StoreKit wrapper)
• PaywallView.swift (soft paywall UI)
• Product IDs in Constants
• isPremium state tracking

One template, infinite apps. Ship velocity > payment optimization.

---

## LINKEDIN POST

# We Almost Added RevenueCat. Here's Why We Didn't.

Today FocusedFasting v2.0 went live with real payments. First app from the factory that's actually monetized.

$4.99/month, $29.99/year. Apple approved all 4 subscription products. The payment prompt works. Subscriptions work. It's a business now, not just a project.

**The RevenueCat Question**

Everyone uses RevenueCat. The pitch is compelling:
• Analytics and insights
• A/B testing paywalls
• Cross-platform support (iOS + Android)
• Remote paywall updates without app review

But here's what it actually is: **A tracking layer on top of Apple's payment system.**

It doesn't save you from Apple's 15-30% cut. It adds 1% after you hit $2.5K in revenue. And it requires integrating another dependency.

**The StoreKit 2 Alternative**

Apple's native solution handles everything you actually need:
• Payment processing ✅
• Subscription management ✅
• Receipt validation ✅
• Refunds and cancellations ✅
• Family sharing ✅

The gap is analytics and remote configuration. That matters when you're doing $5-10K/month and A/B testing paywall conversion. But at $0? Just make your first dollar.

**The Early-Stage Trap**

It's easy to over-engineer payments before you have customers.

"We need analytics to optimize" → You need customers first  
"We need A/B testing" → You need traffic to test on  
"We need cross-platform" → Build one thing that works first

Complexity has a cost. Every dependency is:
• Code you didn't write that can break
• Updates to manage
• Another thing to debug
• Mental overhead

StoreKit 2 is free, native, and already working. That's the right choice for an MVP.

**The Decision Framework**

Ask: "What does this unlock?"

RevenueCat unlocks: Better optimization of existing revenue  
Right now we have: Zero revenue

It's the classic case of building infrastructure before proving demand. We can always add it later. The pattern is:

1. Ship with StoreKit 2 (works, free, fast)
2. Make $1 → validate demand
3. Make $1K → understand customer behavior  
4. Make $5-10K/month → NOW add RevenueCat for optimization

**The Pattern**

FocusedFasting's payment implementation is now a reusable template for all factory apps:
• StoreManager.swift - StoreKit 2 wrapper
• PaywallView.swift - Soft paywall UI
• Product IDs in Constants.swift
• AppState tracks isPremium status

Copy/paste to the next app. Ship faster, optimize later.

**The Milestone**

This is the first factory app that can actually generate revenue. Payment prompt went live today. Months of building → real business in one moment.

That's the goal: build once, replicate fast, iterate based on real revenue data.

---

**What's your payment stack? Native or third-party? Curious what worked for early-stage apps.**

---

## INSTAGRAM POST

**Caption:**
First payment prompt in my app went live today. FocusedFasting v2.0 is officially monetized.

$4.99/mo, $29.99/yr. Apple approved all 4 subscription products.

Almost added RevenueCat. Everyone uses it. Analytics, A/B testing, cross-platform support.

Then realized: It's a tracking layer. Doesn't save you from Apple's 15-30% cut. Costs 1% after $2.5K.

StoreKit 2 handles everything you actually need:
✅ Payments
✅ Subscriptions
✅ Receipt validation
✅ Refunds

The gap is analytics. That matters at $5-10K/month when you're A/B testing. At $0? Just make your first dollar.

Complexity has a cost. Every dependency is code you didn't write that can break, updates to manage, another thing to debug.

Ship with native. Add optimization tools AFTER you prove demand.

Now the payment pattern is reusable. One template → all future factory apps.

Months of building → payment prompt → real business. 🚀

---

**Visual Options:**

**Option 1: Screenshot Comparison**
• Side-by-side: RevenueCat dashboard vs StoreKit code
• Label: "Chose simple"

**Option 2: Payment Prompt Screenshot**
• FocusedFasting payment screen in action
• Real pricing visible ($4.99/mo, $29.99/yr)
• Caption: "This moment hits different"

**Option 3: Decision Framework Graphic**
• Flowchart: $0 → StoreKit, $5K+ → Consider RevenueCat
• Visual decision tree

**Option 4: Build vs Buy Table**
• Visual comparison of RevenueCat vs StoreKit
• Pros/cons in clean graphic format

**Recommended:** Option 2 (Payment prompt screenshot) - shows the actual product, proves it's real

**Hashtags:**
#buildinpublic #ios #swiftui #appdev #monetization #saas #indiehacker #startup #productdecisions #mvp

---

## NOTES

**Pillar:** Technical / Product Decisions / Building

**Why This Works:**
- Real milestone (first monetized app)
- Contrarian take (skip RevenueCat when everyone uses it)
- Decision framework (when to use what tool)
- Specific reasoning (cost, complexity, timing)
- Reusable pattern for others

**Target Audience:**
- iOS developers
- Indie hackers
- Early-stage founders
- App builders deciding on payment infrastructure

**Content Type:**
- Decision post-mortem
- Technical insight
- Counter-narrative to common advice

**Approval Options:**
Reply with: `post twitter-1`, `post twitter-2`, `post linkedin`, `post instagram`, or `post all`
