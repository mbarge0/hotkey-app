# HotKey - AI Content Capture System

Unified monorepo for HotKey product.

## Structure

- `apps/landing/` - Marketing landing page
- `apps/review/` - Content review UI
- `scripts/` - Content generation & processing
- `api/` - Backend services (future)

## Deploy

Single Netlify site serves both apps:
- `/` → landing page
- `/review` → review UI

Automatic deploys on push to main.
