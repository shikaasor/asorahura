# External Integrations

**Analysis Date:** 2026-05-13

## APIs & External Services

**LinkedIn:**
- Service: LinkedIn feed display
- What it's used for: Displaying recent LinkedIn posts from user profile (aahura) as static links
- Implementation: No API integration - hardcoded post links in `src/components/LinkedInFeed.tsx`
- Links: Profile URL `https://www.linkedin.com/in/aahura`

**YouTube:**
- Service: YouTube video feed display
- What it's used for: Displaying video thumbnails and links from YouTube channel
- Implementation: No API integration - hardcoded video URLs with thumbnail generation
- Thumbnail source: YouTube's public thumbnail API (`https://img.youtube.com/vi/{videoId}/hqdefault.jpg`)
- Location: `src/components/YouTubeFeed.tsx`
- Channel: `https://www.youtube.com/channel/UCua5vXRbyWhuZnOAKQgFmhQ`

**Google Apps Script (Webhook):**
- Service: Google Apps Script for form submission handling
- What it's used for: Processing contact/inquiry form submissions from the engage page
- Implementation: Server action in `src/app/engage/actions.ts`
- Auth: Webhook URL in `GOOGLE_SCRIPT_URL` environment variable
- Endpoint: Configured in `.env.local`
- Method: POST with JSON payload containing:
  - name, email, company, role, companySize, operationalVolume
  - challenge (primary operational challenge), timeline, budget, context

## Data Storage

**Databases:**
- Not detected - Application is static content with Google Apps Script backend

**File Storage:**
- Local filesystem only - No cloud storage detected
- Images served from: `/public` directory

**Caching:**
- Next.js built-in caching via HTTP headers
- Static generation for pages (`src/app/articles/` pages)

## Authentication & Identity

**Auth Provider:**
- Custom / None - No authentication system detected
- The application is public-facing with no user accounts

## Monitoring & Observability

**Error Tracking:**
- Not detected

**Logs:**
- Server action errors logged via try-catch in `src/app/engage/actions.ts`
- No dedicated logging service detected

## CI/CD & Deployment

**Hosting:**
- Vercel - Inferred from `metadataBase: new URL("https://asorahura.vercel.app")` in `src/app/layout.tsx`
- Vercel provides automatic deployment from git repository

**CI Pipeline:**
- Not explicitly configured - Vercel auto-deploys on git push

## Environment Configuration

**Required env vars:**
- `GOOGLE_SCRIPT_URL` - Google Apps Script webhook URL for form submission

**Secrets location:**
- `.env.local` file (not committed to git per `.gitignore`)

## Webhooks & Callbacks

**Incoming:**
- `GOOGLE_SCRIPT_URL` webhook endpoint receives POST requests from `submitInquiry()` form submissions
  - Content-Type: application/json
  - Body: Form data object with inquiry details

**Outgoing:**
- Not detected

## Image Integration

**Remote Image Patterns (Allowed):**
- `https://img.youtube.com` - YouTube thumbnail images (configured in `next.config.mjs`)
- Next.js Image optimization enabled for remote images matching this pattern

---

*Integration audit: 2026-05-13*
