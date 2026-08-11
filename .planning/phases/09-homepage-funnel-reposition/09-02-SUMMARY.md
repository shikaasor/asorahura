---
phase: 09-homepage-funnel-reposition
plan: 02
subsystem: ui
tags: [metadata, seo, nextjs, footer, positioning]

# Dependency graph
requires:
  - phase: 09-homepage-funnel-reposition (plan 01)
    provides: "HeroSection eyebrow text with the sitewide positioning statement"
provides:
  - "Production metadataBase (https://asorahura.com) replacing the vercel.app preview origin"
  - "layout.tsx title/description/openGraph carrying the positioning statement, byte-identical to the Hero eyebrow and Footer tagline"
  - "Footer nav split into Creator Path / Enterprise / Legal columns so the two funnels read as visibly separate"
affects: [homepage-funnel-reposition, seo, social-preview]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Single positioning-statement string shared verbatim across layout.tsx metadata, HeroSection eyebrow, and Footer tagline"

key-files:
  created: []
  modified:
    - src/app/layout.tsx
    - src/components/home/Footer.tsx
    - src/components/home/Footer.module.css

key-decisions:
  - "Footer.tsx: two separate <nav> blocks (Creator Path, Enterprise) instead of one, matching the funnel-separation intent from the UI spec"
  - "Footer.module.css grid changed from 2fr 1fr 1fr to 2fr 1fr 1fr 1fr to accommodate the new fourth column; mobile breakpoints left untouched per plan instruction since .brand already spans the full row"

patterns-established: []

requirements-completed: [HOME-21]

# Metrics
duration: 20min
completed: 2026-08-11
---

# Phase 09 Plan 02: Metadata & Footer Positioning Alignment Summary

**metadataBase moved to the production domain (asorahura.com) and the sitewide positioning statement now appears verbatim in layout.tsx metadata, the Footer tagline, and the Hero eyebrow; Footer nav split into Creator Path / Enterprise / Legal columns.**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-08-11T09:50:00Z (approx)
- **Completed:** 2026-08-11T10:11:22Z
- **Tasks:** 2/2 completed
- **Files modified:** 3

## Accomplishments
- `metadataBase` in `src/app/layout.tsx` now resolves to `https://asorahura.com` instead of the vercel.app preview origin (closes threat T-09-01, OG-spoofing via wrong origin)
- Title/description/openGraph in `layout.tsx` carry the exact positioning statement, byte-identical to the HeroSection eyebrow (Plan 09-01) and the Footer tagline
- Footer nav reorganized into three visibly distinct columns: Creator Path (Home, Automations, Learn, Discovery), Enterprise (Enterprise Solutions, Intake Form, Case Studies), and the existing Legal column
- Footer grid CSS updated to a 4-column layout (`2fr 1fr 1fr 1fr`) to fit the new column

## Task Commits

Each task was committed atomically:

1. **Task 1: Point metadataBase at production domain and carry the positioning statement into metadata** - `8f71fa7` (feat)
2. **Task 2: Update Footer tagline and reorganize nav into Creator Path / Enterprise / Legal** - `ed6a806` (feat)

**Plan metadata:** committed separately after this SUMMARY (see final commit below)

## Files Created/Modified
- `src/app/layout.tsx` - metadataBase → https://asorahura.com; title/description/openGraph → positioning statement
- `src/components/home/Footer.tsx` - tagline → positioning statement; nav split into Creator Path / Enterprise / Legal
- `src/components/home/Footer.module.css` - `.grid` grid-template-columns → `2fr 1fr 1fr 1fr`

## Decisions Made
- Followed the plan's exact link mapping for Creator Path (Home, Automations→/automate, Learn→/blog, Discovery→/assessment) and Enterprise (Enterprise Solutions→/enterprise, Intake Form→/engage, Case Studies→/work); verified both `/automate` and `/blog` routes exist in `src/app/` before wiring links.
- Left mobile breakpoints in Footer.module.css untouched per plan instruction — `.brand { grid-column: 1 / -1 }` already spans the new column count correctly.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Ran `npm run test` (full vitest suite) as the closest available verification to the plan's `npm run test -- --watch src/components/home` (that filter path matched zero test files since Footer has no dedicated test file). Full suite: 178/179 tests passing. The 1 failure (`tests/test-calendly-removal-pages.test.ts:29`, checkout page enterprise CTA routing) is pre-existing and unrelated to files touched by this plan (traced to phase 08/10 commits on `src/app/checkout/page.tsx`). Logged to `.planning/phases/09-homepage-funnel-reposition/deferred-items.md` per the scope-boundary rule; not fixed.
- During verification I mistakenly ran `git stash -u`, which stashed the uncommitted Task 2 changes. Immediately ran `git stash pop` to restore them and re-verified the file contents matched what was written — no data was lost.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- HOME-21 fully satisfied: positioning statement is byte-identical across layout.tsx description/openGraph, Footer tagline, and Hero eyebrow (Plan 09-01).
- Footer nav now visibly separates the Creator Path and Enterprise funnels, ready for any downstream plans that build on the funnel-separation UX.
- No blockers for subsequent plans in Phase 09.

---
*Phase: 09-homepage-funnel-reposition*
*Completed: 2026-08-11*

## Self-Check: PASSED
All created/modified files exist; both task commits (8f71fa7, ed6a806) verified in git log.
