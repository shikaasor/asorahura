---
phase: 09-homepage-funnel-reposition
plan: 01
subsystem: ui
tags: [nextjs, react, css-modules, homepage, navigation, copywriting]

# Dependency graph
requires: []
provides:
  - Income-framed HeroSection.tsx with exact positioning-statement eyebrow (reused verbatim by Plan 09-02's Footer and layout.tsx)
  - Single-CTA hero (href /automate, label "See Automations")
  - Navigation.tsx with one .cta link sitewide (desktop + mobile) pointing to /automate
  - Services nav link relabeled "Pricing" (desktop + mobile), href unchanged
affects: [09-02, 09-03, 09-04]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Single-CTA-per-surface: exactly one primary conversion link (href /automate) per component, enforced via grep count in acceptance criteria"

key-files:
  created: []
  modified:
    - src/components/home/HeroSection.tsx
    - src/components/home/HeroSection.module.css
    - src/components/Navigation.tsx

key-decisions:
  - "Positioning statement 'Automations that work like your best hire — reliable, consistent, and yours to keep.' placed verbatim in Hero eyebrow; must be reused verbatim (not paraphrased) in Plan 09-02 Footer tagline and layout.tsx description"
  - "Removed .secondaryBtn CSS entirely rather than leaving orphaned dead rules, per HeroSection.module.css cleanup instructions"

patterns-established:
  - "Nav CTA and Hero CTA both resolve to the same href (/automate) and label (See Automations) — single entry point sitewide per HOME-16"

requirements-completed: [HOME-12, HOME-16, HOME-20, HOME-21]

# Metrics
duration: 12min
completed: 2026-08-11
---

# Phase 09 Plan 01: Homepage Hero & Nav Repositioning Summary

**Rewrote HeroSection copy to lead with income framing and a single /automate CTA, and consolidated Navigation to one sitewide CTA plus a Pricing-labeled nav link.**

## Performance

- **Duration:** 12 min
- **Started:** 2026-08-11T09:47:00Z
- **Completed:** 2026-08-11T09:59:28Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- HeroSection eyebrow, headline, and subheading now lead with income/money language (no "hours" wording), eyebrow carries the exact sitewide positioning statement
- Hero reduced from two competing CTAs (/assessment, /engage) to exactly one (/automate, "See Automations"); orphaned `.secondaryBtn` CSS removed including both responsive selector groups
- Navigation.tsx desktop and mobile CTAs now point to /automate with label "See Automations" (was /assessment, "Start AI Opportunity Discovery")
- Navigation.tsx /services link relabeled "Pricing" in both desktop and mobile menus; href and active-state logic untouched

## Task Commits

1. **Task 1: Rewrite HeroSection for income framing and single CTA** - `3e8711f` (feat)
2. **Task 2: Consolidate Navigation CTA and rename Services link to Pricing** - `882c1c1` (feat)

**Plan metadata:** pending (this commit)

## Files Created/Modified
- `src/components/home/HeroSection.tsx` - Income-framed eyebrow/headline/subheading, single CTA Link to /automate
- `src/components/home/HeroSection.module.css` - Removed orphaned `.secondaryBtn` rules and responsive selector references
- `src/components/Navigation.tsx` - Desktop/mobile CTA now /automate + "See Automations"; /services label changed to "Pricing"

## Decisions Made
- Positioning statement is a duplicated literal across 3 files by design (per plan's threat model T-09-06, accepted risk, no shared constant introduced per CLAUDE.md simplicity-first rule)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. Note: `npm run test -- --run` shows one pre-existing failing test (`tests/test-calendly-removal-pages.test.ts`, checking `/engage?enterprise=true` string in an unrelated checkout page) that predates this plan and is out of scope per CLAUDE.md surgical-changes rule — not touched.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Positioning statement string is now finalized and must be copied verbatim into Footer.tsx and layout.tsx metadata description in Plan 09-02
- HOME-21 fully satisfied only once Plan 09-02 lands the same string in Footer/layout.tsx
- No blockers for 09-02, 09-03, or 09-04

---
*Phase: 09-homepage-funnel-reposition*
*Completed: 2026-08-11*

## Self-Check: PASSED
