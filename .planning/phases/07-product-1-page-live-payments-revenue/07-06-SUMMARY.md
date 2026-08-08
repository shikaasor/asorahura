---
phase: 07-product-1-page-live-payments-revenue
plan: 06
subsystem: ui
tags: [react, nextjs, css-modules, analytics]

requires:
  - phase: 07-02
    provides: trackAnalyticsEvent helper in src/lib/analytics.ts
provides:
  - HeroSection component (revenue-first headline, guarded Reel embed, CTA to #pricing)
  - TryItNowSection component (invite-to-comment copy, Demo Interaction analytics)
affects: [07-12 (page composition)]

tech-stack:
  added: []
  patterns: [NEXT_PUBLIC_AUTOMATE_REEL_URL env-guarded iframe with placeholder fallback]

key-files:
  created:
    - src/components/automate/HeroSection.tsx
    - src/components/automate/HeroSection.module.css
    - src/components/automate/TryItNowSection.tsx
    - src/components/automate/TryItNowSection.module.css
  modified: []

key-decisions:
  - "TryItNowSection reuses the Reel via a link ('Watch the Reel') rather than a second iframe, per UI-SPEC's allowance to avoid double-loading the same embed"
  - "Both components guard against rendering an iframe/link with an undefined URL by falling back to a placeholder card carrying the same warning text, satisfying the Task 1 acceptance criterion in both files"

patterns-established:
  - "Reel embed guard pattern: read NEXT_PUBLIC_AUTOMATE_REEL_URL once at module scope, branch render path (iframe/link vs placeholder) rather than conditionally building a src string"

requirements-completed: [PROD-07, PROD-08, PROD-11]

duration: 15min
completed: 2026-08-08
---

# Phase 07 Plan 06: Hero + Try-It-Now Sections Summary

**HeroSection and TryItNowSection client components for `/automate` — revenue-first headline, env-guarded Reel embed, and a Demo Interaction analytics hook, both built on Phase 6 design tokens.**

## Performance

- **Duration:** 15 min
- **Tasks:** 2
- **Files modified:** 4 (all created)

## Accomplishments
- HeroSection: Display headline "Instagram Lead Automation for Creators", Lead subheading with the flat-$6/mo argument, guarded Reel iframe (9:16 mobile / 4:3 desktop), Accent CTA "Get Yours Now" linking to `#pricing`
- TryItNowSection: Subtitle heading "Try it right now", invite-to-comment body copy, Reel reference as a link (avoids double-embedding the iframe), fires `trackAnalyticsEvent("Demo Interaction")` on click
- Both components consume only Phase 6 tokens already in `globals.css` (no new tokens declared)

## Task Commits

1. **Task 1: HeroSection component** - `6e0a1d9` (feat)
2. **Task 2: TryItNowSection component** - `09bf348` (feat)

**Plan metadata:** committed via SDK `state.commit` after this summary (see below)

## Files Created/Modified
- `src/components/automate/HeroSection.tsx` - Hero with headline, subheading, guarded Reel embed, CTA to #pricing
- `src/components/automate/HeroSection.module.css` - Hero layout/spacing/color using Phase 6 tokens
- `src/components/automate/TryItNowSection.tsx` - Try-it-now block with Demo Interaction tracking
- `src/components/automate/TryItNowSection.module.css` - Try-it-now layout/spacing/color using Phase 6 tokens

## Decisions Made
- Reused the Reel via a "Watch the Reel" link in TryItNowSection instead of a second iframe embed, per UI-SPEC's explicit allowance ("same as Hero, or reference/link") — avoids loading the same third-party iframe twice on one page.
- When `NEXT_PUBLIC_AUTOMATE_REEL_URL` is unset, TryItNowSection's placeholder card itself carries the `onClick` handler so "Demo Interaction" still fires on interaction with the section, consistent with the UI-SPEC's "fires on click on embedded Reel or Try It Right Now section" definition.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

**External services require manual configuration.**
- `NEXT_PUBLIC_AUTOMATE_REEL_URL` env var must be set to the real acquisition Reel embed URL before launch. No source artifact in the repo provides this URL yet (per STATE.md blockers, Phase 7 missing source assets). Until set, both HeroSection and TryItNowSection render a placeholder/text-link fallback instead of a broken iframe — this is the intended guarded behavior, not a bug, but it must be resolved before `/automate` goes live.

## Next Phase Readiness
- Both components are standalone and ready for composition into the `/automate` page in Plan 07-12.
- Blocker carried forward: real Reel URL still missing — flagged here and in STATE.md for pre-launch resolution.

---
*Phase: 07-product-1-page-live-payments-revenue*
*Completed: 2026-08-08*
