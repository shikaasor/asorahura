---
phase: 07-product-1-page-live-payments-revenue
plan: 02
subsystem: analytics
tags: [plausible, analytics, next.js, utm-tracking]

# Dependency graph
requires: []
provides:
  - "src/lib/analytics.ts: trackAnalyticsEvent() typed event helper for the 6-event funnel taxonomy"
  - "src/lib/analytics.ts: useTrackLandEvent() client hook capturing UTM params on mount"
  - "Plausible script tag loaded site-wide via src/app/layout.tsx"
affects: [07-05, 07-06, 07-07, 07-08, 07-09, 07-11]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Plausible loaded via raw <script defer> tag in root layout head, no npm package"
    - "trackAnalyticsEvent no-ops safely when window.plausible is unavailable (typeof window guard)"

key-files:
  created: [src/lib/analytics.ts, tests/test-analytics.test.ts]
  modified: [src/app/layout.tsx]

key-decisions:
  - "Missing utm_medium/utm_content default to empty string (not specified in RESEARCH.md Pattern 5, only utm_source/utm_campaign had documented defaults)"
  - "Whole analytics.ts file marked 'use client' since useTrackLandEvent requires it; trackAnalyticsEvent is still safely importable into client components downstream"

patterns-established:
  - "Analytics event names are a closed TypeScript union (Land, Demo Interaction, Build Map Submit, Checkout Opened, Purchase, Success Page Submit) — downstream plans must use one of these literals"

requirements-completed: [TRACK-01, TRACK-02]

# Metrics
duration: 15min
completed: 2026-08-07
---

# Phase 07 Plan 02: Analytics Foundation Summary

**Plausible analytics wired site-wide via a raw script tag (no SDK dependency) plus a typed trackAnalyticsEvent() helper and useTrackLandEvent() UTM-capture hook for the 6-event funnel taxonomy.**

## Performance

- **Duration:** 15 min
- **Started:** 2026-08-07T12:33:00Z
- **Completed:** 2026-08-07T12:48:38Z
- **Tasks:** 1
- **Files modified:** 3

## Accomplishments
- Plausible script tag added to root layout `<head>`, loading on every route
- `trackAnalyticsEvent()` typed helper exported from `src/lib/analytics.ts`, guarded against missing `window.plausible`
- `useTrackLandEvent()` client hook that reads UTM params from the query string and fires the `Land` event exactly once per mount
- Test coverage for the no-op path (window undefined, plausible undefined) and the event-firing path (exact args)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add Plausible script + analytics helper** - `d1f07ac` (feat)

## Files Created/Modified
- `src/lib/analytics.ts` - `trackAnalyticsEvent()` helper + `useTrackLandEvent()` UTM-capture hook + `Window.plausible` type augmentation
- `src/app/layout.tsx` - Added explicit `<head>` with Plausible `<script defer>` tag before existing `<body>`; no existing metadata/viewport exports touched
- `tests/test-analytics.test.ts` - Vitest coverage for `trackAnalyticsEvent`'s no-op and event-firing paths

## Decisions Made
- Missing `utm_medium`/`utm_content` query params default to `""` (empty string) since RESEARCH.md Pattern 5 only specified defaults for `utm_source` ("direct") and `utm_campaign` ("organic")
- Kept `trackAnalyticsEvent` and `useTrackLandEvent` in a single `"use client"` file per the plan's explicit instruction, rather than splitting into a server-safe helper + client-only hook file

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- `npm run build` fails at the page-data-collection step for the pre-existing `/api/subscribe` route (`Missing API key. Pass it to the constructor new Resend("re_123")`) — this is caused by a missing `RESEND_API_KEY` env var in this local/worktree environment, unrelated to this plan's changes. TypeScript compilation itself succeeded ("Finished TypeScript" with no errors), confirming the `layout.tsx` change type-checks cleanly. Not fixed per CLAUDE.md surgical-changes scope boundary (pre-existing, unrelated to `src/lib/analytics.ts` or `src/app/layout.tsx`).

## User Setup Required

None - no external service configuration required for this plan. (Note: `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` env var is optional — falls back to `"asorahura.com"` if unset.)

## Next Phase Readiness
- `trackAnalyticsEvent` and `useTrackLandEvent` are ready for import by Plans 05, 06, 07, 08, 09, 11 to fire funnel events
- Plausible script now loads on every route including the not-yet-built `/automate` page
- Pre-existing `/api/subscribe` build failure (missing `RESEND_API_KEY`) should be verified as configured in the deployment environment before relying on `npm run build` success as a gate in later plans

---
*Phase: 07-product-1-page-live-payments-revenue*
*Completed: 2026-08-07*
