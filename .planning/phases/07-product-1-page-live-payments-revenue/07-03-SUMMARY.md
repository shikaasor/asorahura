---
phase: 07-product-1-page-live-payments-revenue
plan: 03
subsystem: ui
tags: [nextjs, route-groups, css-modules, layout]

# Dependency graph
requires:
  - phase: 06-design-token-foundation
    provides: Light-first Direction B token system in src/app/globals.css (--surface-*, --border-*, --spacing-*, --ink-*)
provides:
  - "(automate) route group layout with logo-only header and self-contained footer"
  - "Site-wide Navigation/RouteChrome suppression on /automate paths"
affects: [07-10-success-page, 07-12-automate-page]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Route-group self-containment via pathname suppression in Navigation.tsx/RouteChrome.tsx (mirrors pre-existing /internal exclusion)"

key-files:
  created:
    - "src/app/(automate)/layout.tsx"
    - "src/app/(automate)/layout.module.css"
    - "src/components/NavOffset.tsx"
  modified:
    - "src/app/layout.tsx"
    - "src/components/Navigation.tsx"
    - "src/components/RouteChrome.tsx"

key-decisions:
  - "Extended the existing /internal pathname-exclusion pattern to /automate rather than introducing a new mechanism, for consistency with the codebase"
  - "Refund Policy footer link points to /automate#faq (no standalone /refund route exists; PROD-13 requires refund policy as page text within the FAQ)"

patterns-established:
  - "Self-contained route groups suppress sitewide chrome (Navigation, ParticleWave, Footer, nav-offset padding) via pathname.startsWith() checks in the shared client components, not via layout-level overrides"

requirements-completed: [PROD-02]

# Metrics
duration: 25min
completed: 2026-08-07
---

# Phase 07 Plan 03: (automate) Route Group Layout Summary

**Self-contained `(automate)/layout.tsx` with logo-only header and dynamic-year footer, plus sitewide chrome suppression on `/automate` extending the existing `/internal` pathname pattern**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-08-07T12:25:00Z
- **Completed:** 2026-08-07T12:50:40Z
- **Tasks:** 1 completed
- **Files modified:** 6 (3 created, 3 modified)

## Accomplishments
- Built `src/app/(automate)/layout.tsx`: logo-only header (Link to `/`, 44px min height, sticky), `<main>{children}</main>`, and a footer with a dynamically computed copyright year and Privacy/Terms/Refund (FAQ anchor) links
- `layout.module.css` uses only Phase 6 tokens (`--surface-1`, `--border-1`, `--spacing-3/4`, `--ink-1/2`, `--fontSize-*`, `--fontWeight-bold`) — no hardcoded hex or px-with-token-equivalent values
- Extended the pre-existing `/internal` pathname suppression in `Navigation.tsx` and `RouteChrome.tsx` to also match `/automate`, so the site-wide nav, `ParticleWave`, and site `Footer` never render on `/automate` routes
- Added `NavOffset` client wrapper so the `nav-offset` top-padding (compensating for the fixed site nav) is also suppressed on `/automate`, preventing a dead gap above the new header

## Task Commits

1. **Task 1: Build the (automate) route group layout** - `d97471d` (feat)

**Plan metadata:** (this commit, appended below)

## Files Created/Modified
- `src/app/(automate)/layout.tsx` - Route group layout: logo-only header, main, self-contained footer
- `src/app/(automate)/layout.module.css` - CSS module using Phase 6 surface/border/spacing/ink tokens
- `src/components/NavOffset.tsx` - New client wrapper conditionally applying `nav-offset` padding based on pathname
- `src/app/layout.tsx` - Swapped the static `<div className="nav-offset">` for `<NavOffset>`
- `src/components/Navigation.tsx` - Extended pathname guard to also hide on `/automate`
- `src/components/RouteChrome.tsx` - Extended pathname guard to also suppress `ParticleWave`/`Footer` on `/automate`

## Decisions Made
- Reused the existing `/internal` route-suppression pattern (pathname `.startsWith()` checks in client components) instead of inventing a new chrome-control mechanism, matching the codebase's established convention and keeping the change minimal.
- Refund Policy footer link routes to `/automate#faq` per the plan's explicit instruction (no standalone `/refund` route; PROD-13 requires the refund policy as visible page text in the FAQ).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical Functionality] Extended Navigation/RouteChrome suppression to /automate**
- **Found during:** Task 1
- **Issue:** The plan's must-have truth requires "Visiting any route under /automate renders a logo-only header and a self-contained footer, never the site-wide Navigation or ParticleWave components." However, `src/app/layout.tsx` (RootLayout) unconditionally renders `<Navigation />` and wraps `<ParticleWave />`/`<Footer />` in `<RouteChrome>`, which only suppressed chrome on `/internal` paths. Building `(automate)/layout.tsx` alone — as the task's literal file scope specified — would nest a second header/footer inside the still-rendered sitewide nav and footer, directly violating the plan's stated truth.
- **Fix:** Extended the existing pathname check in `Navigation.tsx` and `RouteChrome.tsx` from `pathname.startsWith("/internal")` to also match `pathname.startsWith("/automate")`.
- **Files modified:** `src/components/Navigation.tsx`, `src/components/RouteChrome.tsx`
- **Verification:** Source inspection confirms both guards now include `/automate`; `npm run build` produces no errors referencing the automate route.
- **Committed in:** `d97471d` (Task 1 commit)

**2. [Rule 2 - Missing Critical Functionality] Added NavOffset wrapper to suppress dead top-gap on /automate**
- **Found during:** Task 1
- **Issue:** RootLayout wraps `{children}` in `<div className="nav-offset">`, which adds `padding-top: 88px` (72px on mobile) to compensate for the fixed sitewide `Navigation`. Once Navigation is suppressed on `/automate` (fix #1 above), this padding becomes a dead gap above the new logo-only header, undermining the "self-contained" visual intent of the route group.
- **Fix:** Created `src/components/NavOffset.tsx`, a small client component mirroring `RouteChrome`'s pathname pattern, that conditionally applies the `nav-offset` class only outside `/internal` and `/automate`. Swapped the static div in `src/app/layout.tsx` for this component.
- **Files modified:** `src/components/NavOffset.tsx` (new), `src/app/layout.tsx`
- **Verification:** Source inspection; `npm run build` passes with no automate-related errors.
- **Committed in:** `d97471d` (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (both Rule 2 — missing critical functionality)
**Impact on plan:** Both fixes are required for the plan's own stated must-have truth to hold at all — without them, `(automate)/layout.tsx` would exist but be visually and structurally nested inside the sitewide nav/footer it was built to replace. No scope creep beyond what the plan's truth demands.

## Issues Encountered
- `npm run build` fails on `/api/subscribe` with "Missing API key. Pass it to the constructor `new Resend("re_123")`" — pre-existing, unrelated to this task (missing `RESEND_API_KEY` env var during static page-data collection). Confirmed out of scope: the plan's own verify command (`npm run build 2>&1 | grep -i "automate" || echo "no build errors referencing automate route"`) passes cleanly with no automate-related errors.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- `(automate)/layout.tsx` is ready for Plan 12 (`/automate` page) and Plan 10 (`/automate/success` page) to render inside without further layout work.
- Sitewide chrome suppression is now handled at the shared-component level, so any future route added under `/automate` inherits self-containment automatically.
- The pre-existing `RESEND_API_KEY`-missing build error is unrelated to this plan and remains for a later plan/phase to address if it blocks CI builds.

---
*Phase: 07-product-1-page-live-payments-revenue*
*Completed: 2026-08-07*
