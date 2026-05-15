---
phase: 02-conversion-funnel
plan: "02"
subsystem: ui
tags: [next.js, useSearchParams, Suspense, server-actions, redirect, form]

requires:
  - phase: 02-01
    provides: assessment scoring system, ResultsScreen component, engage page/actions scaffolding, checkout page with Paddle integration

provides:
  - ResultsScreen CTA linking to /engage?score={score} (score passed as URL param)
  - Engage page with "Tell Me About Your Problem" hero, 4-tier budget options, hidden score field, Suspense boundary
  - Engage server action routing: score>=70 → /checkout?tier=strategy, score>=40 → /checkout?tier=discovery, score<40 → /engage/confirmation
  - Cold-lead confirmation page at /engage/confirmation
  - Checkout page reads ?tier= URL param and pre-selects discovery or strategy tier

affects: [phase-03, phase-04, phase-05, email-automation, conversion-tracking]

tech-stack:
  added: []
  patterns:
    - useSearchParams wrapped in Suspense boundary for Next.js 15 dynamic rendering
    - Fire-and-forget CRM logging before redirect in server action (fetch in try/catch, redirect outside)
    - redirect() called outside try/catch — Next.js redirect throws internally and must not be caught

key-files:
  created:
    - src/app/engage/confirmation/page.tsx
  modified:
    - src/components/assessment/ResultsScreen.tsx
    - src/components/assessment/ResultsScreen.module.css
    - src/app/engage/page.tsx
    - src/app/engage/actions.ts
    - src/app/checkout/page.tsx

key-decisions:
  - "handleSubmit in engage/page.tsx keeps the existing client-side result.success check as a fallback — in practice redirect fires server-side so the success state rarely renders"
  - "Score=0 (no score param) treated as cold lead (<40 threshold) — safe fallback to /engage/confirmation"
  - "Confirmation page uses inline styles matching dark theme (#0a0a0a, white, #C9A84C) — no CSS module needed for single-use page"

patterns-established:
  - "Suspense-wrapped useSearchParams: extract component into Inner, wrap export default in <Suspense fallback={null}>"
  - "Score routing in server action: read score from FormData, fire-and-forget fetch, then redirect after try/catch block"

requirements-completed: [ENGAGE-01, ENGAGE-02, ENGAGE-03, ENGAGE-04, ENGAGE-05, ENGAGE-06, CONV-01]

duration: 25min
completed: 2026-05-15
---

# Phase 02 Plan 02: Conversion Funnel Wiring Summary

**Score-based routing wired end-to-end: assessment score flows through engage form URL param, server action reads it and redirects hot/warm/cold leads to strategy checkout, discovery checkout, or confirmation page respectively**

## Performance

- **Duration:** 25 min
- **Started:** 2026-05-15T08:32:10Z
- **Completed:** 2026-05-15T08:57:00Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- ResultsScreen CTA replaced: "Book a Discovery Call" → "Tell Me About Your Problem" linking to `/engage?score={score}` with secondary "Skip to checkout" link
- Engage page overhauled: new hero copy, Suspense boundary for useSearchParams, 4 budget tiers matching checkout, hidden score field, "Submit My Project Brief" button
- Engage server action now routes by score (70+/40-69/<40) after fire-and-forget CRM logging; redirect() correctly placed outside try/catch
- Cold-lead confirmation page created at `/engage/confirmation` with dark theme, case studies CTA, and retake link
- Checkout page extracts inner component with useSearchParams to pre-select tier from `?tier=` URL param

## Task Commits

1. **Task 1: Results screen CTA update and engage form overhaul** - `ad137e8` (feat)
2. **Task 2: Engage action routing and checkout tier pre-selection** - `e5999b2` (feat)

**Plan metadata:** (pending final docs commit)

## Files Created/Modified

- `src/components/assessment/ResultsScreen.tsx` - CTA block replaced; links to /engage?score={score}; dead /assessment/deep link removed
- `src/components/assessment/ResultsScreen.module.css` - Added .ctaSecondary style for "Skip to checkout" link
- `src/app/engage/page.tsx` - Full rewrite: Suspense + useSearchParams, new hero, 4-tier budget, hidden score input, updated button text
- `src/app/engage/actions.ts` - Score-based redirect routing with fire-and-forget CRM logging
- `src/app/engage/confirmation/page.tsx` - New cold-lead page: dark theme, CTA to /work, retake link
- `src/app/checkout/page.tsx` - Extracted CheckoutInner; reads ?tier= and initializes selectedTier state from URL

## Decisions Made

- `handleSubmit` in engage/page.tsx keeps the existing client-side `result.success` check as a fallback — since redirect fires server-side, the client success state rarely renders but is kept as a safety net
- Score=0 (missing score param) treated as cold lead by the <40 threshold — redirects to /engage/confirmation as safe fallback
- Confirmation page uses inline styles for dark theme consistency — single-use page, no CSS module overhead
- `redirect()` placed after the try/catch block for the fetch — Next.js redirect() throws internally and must not be caught by a surrounding catch

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None — TypeScript passed clean on first run, build succeeded with all 18 routes including the new /engage/confirmation.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Full conversion funnel wired: assessment → engage → checkout/confirmation
- Score routing tested at TypeScript level; build confirms all routes generate correctly
- /engage/confirmation requires /work page to exist for case studies CTA (Phase 2 plan 04 or 05 should cover this)
- GOOGLE_SCRIPT_URL env var optional — missing it skips CRM logging without blocking routing

---
*Phase: 02-conversion-funnel*
*Completed: 2026-05-15*
