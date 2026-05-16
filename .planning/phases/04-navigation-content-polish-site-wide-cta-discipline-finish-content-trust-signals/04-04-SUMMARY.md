---
phase: 04-navigation-content-polish-site-wide-cta-discipline-finish-content-trust-signals
plan: "04"
subsystem: ui
tags: [cta-discipline, testimonials, work-page, engage-page, assessment, trust-signals]

# Dependency graph
requires:
  - phase: 04-02
    provides: TestimonialCard component (shared/TestimonialCard.tsx) used in ResultsScreen
provides:
  - Work page with 2-CTA discipline (Work With Me primary + assessment secondary, no per-card links)
  - Engage page with Testimonials component fully removed (CONTENT-05)
  - Assessment ResultsScreen with 1 TestimonialCard between opportunities and divider
affects: [phase-05-analytics, any page that references work/engage/assessment results]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Per-card CTA links removed from list renders — only page-level bottom CTA survives"
    - "TestimonialCard placed at highest-intent funnel moment (post-score, pre-CTA)"

key-files:
  created: []
  modified:
    - src/app/work/page.tsx
    - src/app/engage/page.tsx
    - src/components/assessment/ResultsScreen.tsx

key-decisions:
  - "Work page caseCta div removed entirely from caseStudies map — standalone link inside map = page-level CTA per locked definition"
  - "Secondary assessment link uses inline style to avoid adding CSS class to work.module.css (out of task scope)"
  - "RESULTS_TESTIMONIAL constant placed at module scope with placeholder data — Asor replaces before launch"
  - "Engage page marginTop spacing on formWrapper retained after Testimonials removal — still useful for visual breathing room"

patterns-established:
  - "2-CTA discipline: 1 primary button + 1 understated secondary link, no per-card CTAs in mapped lists"
  - "TestimonialCard at assessment results = social proof at peak hesitation moment"

requirements-completed: [NAV-03, NAV-05, NAV-06, CONTENT-05, CONV-05]

# Metrics
duration: 2min
completed: 2026-05-16
---

# Phase 04 Plan 04: CTA Discipline + Testimonial Placement Summary

**Work page stripped to 2 CTAs (Work With Me + assessment secondary), Engage page de-cluttered of Testimonials, and ResultsScreen gains a TestimonialCard trust signal above the CTA block**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-05-16T08:05:25Z
- **Completed:** 2026-05-16T08:07:08Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Removed 4 per-card "See if we're a fit" standalone links from Work page case study map — reducing page CTAs from 5 to 2
- Renamed Work page bottom CTA from "Tell Me About Your Problem" to "Work With Me →" (NAV-03) and added understated assessment secondary link (NAV-06)
- Removed Testimonials component (import + JSX) from Engage page (CONTENT-05) — form submit is now the only CTA
- Added TestimonialCard with placeholder data to ResultsScreen between opportunities block and divider, creating trust at peak intent (CONV-05)

## Task Commits

Each task was committed atomically:

1. **Task 1: Work page CTA surgery** - `ee73bce` (feat)
2. **Task 2: Remove Testimonials from Engage + add TestimonialCard to Results** - `7c00e44` (feat)

**Plan metadata:** (pending final commit)

## Files Created/Modified
- `src/app/work/page.tsx` - Removed caseCta divs from map, renamed bottom CTA, added secondary assessment link
- `src/app/engage/page.tsx` - Removed Testimonials import and JSX element
- `src/components/assessment/ResultsScreen.tsx` - Added TestimonialCard import, RESULTS_TESTIMONIAL constant, and card placement

## Decisions Made
- Work page `caseCta` CSS class left as dead CSS in work.module.css (plan explicitly said not to delete it)
- Secondary assessment link uses inline style rather than adding a new CSS class — keeps change surgical and self-contained
- `RESULTS_TESTIMONIAL` constant defined at module scope with placeholder data — caller (Asor) replaces before launch
- `marginTop: "4rem"` on engage formWrapper retained — still provides useful visual spacing without Testimonials above it

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required. Note: Asor must replace the placeholder testimonial data in `ResultsScreen.tsx` (`RESULTS_TESTIMONIAL` constant) with a real quote, name, title, and headshot image path before launch.

## Next Phase Readiness
- All Phase 4 CTA discipline, content polish, and trust signal requirements are complete
- Phase 5 (Analytics & Launch Readiness) can begin — Clarity heatmaps, GA4 event tracking, Stripe live mode, mobile testing
- Placeholder testimonial in ResultsScreen needs a real quote before go-live

---
*Phase: 04-navigation-content-polish-site-wide-cta-discipline-finish-content-trust-signals*
*Completed: 2026-05-16*
