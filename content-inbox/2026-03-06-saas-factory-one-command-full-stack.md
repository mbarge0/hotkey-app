# One command. Full SaaS scaffold in 30 min.

**Date:** 2026-03-06 14:00
**Pillar:** product
**Score:** 84

## What Happened

Built a production-grade SaaS template (`web-saas-nextjs`) as an extension of the existing Foundry CLI. Running `foundry new web-saas-nextjs my-app` scaffolds 76 files — Supabase auth (email/password + Google OAuth), Stripe billing (Base/Pro/Enterprise plans, webhooks, customer portal), multi-tenant orgs with RBAC and invite flow, 5 Postgres migrations with RLS policies, dashboard shell, transactional email via Resend, Anthropic streaming AI route, and deployment config. Zero TypeScript errors on completion. Also drops STRATEGY.md (GTM framework) and PRD.md templates at scaffold time.

## Why It Matters

The SaaS infrastructure tax — auth, billing, teams, email, deployment — is nearly identical across every product. A factory that handles the horizontal layer eliminates 2-3 weeks of repetitive setup every time. The deliberate decision NOT to build vertical templates or a free tier demonstrates the pattern: build what's genuinely reusable, skip what only feels that way.

## Media

None
