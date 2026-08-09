---
phase: 10-assessment-re-point-enterprise-track
plan: 01
subsystem: ui
tags: [assessment, revenue-framing, next-router, vitest, tdd]

# Dependency graph
requires: []
provides:
  - "getRevenueOpportunities(sector, tier) pure function + AutomationOpportunity/RevenueOpportunitiesResult types in src/lib/revenueCalculation.ts"
  - "AssessmentSectorGate component routing Enterprise choice to /enterprise, Small Business choice via onContinue callback"
  - "RevenueResultsScreen unified results component for quick (0-100) and deep (0-72) assessment scales"
affects: [10-02-assessment-shell-rewire]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Tier-multiplier revenue model: base USD/mo ranges per sector x TierLevel multiplier, rounded to nearest 10"
    - "Source-content assertion tests (readFileSync) for client components, matching vitest environment: node (no jsdom/render available in this repo)"

key-files:
  created:
    - src/lib/revenueCalculation.ts
    - src/components/assessment/AssessmentSectorGate.tsx
    - src/components/assessment/AssessmentSectorGate.module.css
    - src/components/assessment/RevenueResultsScreen.tsx
    - src/components/assessment/RevenueResultsScreen.module.css
    - tests/test-revenue-calculation.test.ts
    - tests/test-assessment-sector-gate.test.ts
    - tests/test-revenue-results-screen.test.ts
  modified: []

key-decisions:
  - "getRevenueOpportunities always takes tierLevel derived from deepScoreToTierLevel/quickScoreToTierLevel, never the raw score, since quick (0-100) and deep (0-72) scales differ"
  - "RevenueResultsScreen keeps getTierName/getTierDescription (quick) and getDeepTier (deep) for tier name/description, replacing only the opportunities list and CTA with the new revenue framing"
  - "Enterprise gate uses a hardcoded router.push('/enterprise') literal — no dynamic redirect target, closing the open-redirect threat (T-10-02)"

patterns-established:
  - "New Phase 10 UI components use design tokens (--surface-*, --ink-*, --accent, --fontSize-*, --spacing-*, --radius-*) exclusively, not the legacy hardcoded hex values used elsewhere in src/components/assessment/"

requirements-completed: [ASSESS-11, ASSESS-12]

# Metrics
duration: ~25min
completed: 2026-08-09
---

# Phase 10 Plan 01: Revenue Calculation, Sector Gate & Unified Results Screen Summary

**Pure revenue-calculation utility (5 sectors x 4 tiers), an SMB/Enterprise entry gate routing regulated verticals to /enterprise, and a single RevenueResultsScreen replacing both ResultsScreen and DeepResultsScreen with revenue-framed /checkout CTAs.**

## Performance

- **Duration:** ~25 min
- **Completed:** 2026-08-09
- **Tasks:** 3 completed
- **Files modified:** 8 created (0 modified — net-new files only, per plan's success criteria)

## Accomplishments
- `getRevenueOpportunities(sector, tier)` returns 3 named automations with a tier-scaled dollar range for every one of the 5 sectors and 4 tier levels, all rounded to the nearest 10
- `AssessmentSectorGate` offers Small Business (continues via callback) vs Enterprise (hardcoded `router.push("/enterprise")`) paths
- `RevenueResultsScreen` renders revenue-framed output for both quick (0-100) and deep (0-72) assessment scales, with `/checkout` and `/checkout?assessment=deep` CTAs and zero Calendly/`/engage` references

## Task Commits

Each task was committed atomically (TDD RED/GREEN pairs):

1. **Task 1: Revenue calculation utility**
   - `3979c88` test(10-01): add tests for revenue opportunities calculation
   - `8198a28` feat(10-01): add getRevenueOpportunities pure calculation utility
2. **Task 2: Assessment sector gate component**
   - `b0d97f0` test(10-01): add source-content tests for AssessmentSectorGate
   - `97d0395` feat(10-01): add AssessmentSectorGate SMB/Enterprise entry gate
3. **Task 3: Unified revenue-framed results screen**
   - `d2bb887` test(10-01): add source-content tests for RevenueResultsScreen
   - `ac7a829` feat(10-01): add unified revenue-framed RevenueResultsScreen for quick+deep assessments

**Plan metadata:** (this commit)

## Files Created/Modified
- `src/lib/revenueCalculation.ts` - `getRevenueOpportunities(sector, tier)`, `AutomationOpportunity`, `RevenueOpportunitiesResult`; tier multiplier 0.6/0.85/1.15/1.5, per-sector base opportunity tables, round-to-nearest-10
- `src/components/assessment/AssessmentSectorGate.tsx` + `.module.css` - "use client" SMB/Enterprise choice gate, Enterprise hardcoded to `/enterprise`
- `src/components/assessment/RevenueResultsScreen.tsx` + `.module.css` - unified quick/deep results screen consuming `getRevenueOpportunities`, dimension breakdown for deep mode, `/checkout` CTAs
- `tests/test-revenue-calculation.test.ts` - behavior + all-sectors-x-tiers coverage
- `tests/test-assessment-sector-gate.test.ts` - source-content assertions (readFileSync pattern; vitest environment is `node`, no DOM renderer available)
- `tests/test-revenue-results-screen.test.ts` - source-content assertions including a dedicated deep-mode/byDimension assertion

## Decisions Made
- Component tests use the readFileSync source-content assertion pattern established in `tests/test-automate-catalog-page.test.ts` rather than React Testing Library, because `vitest.config.ts` sets `environment: "node"` (no jsdom) — this matches the plan's `<action>` instructions exactly.
- `getRevenueOpportunities` is called with `(sector, tierLevel)` only, never the raw score, enforced by both the implementation and a dedicated test assertion (acceptance criterion from the plan).

## Deviations from Plan

None - plan executed exactly as written. All three deliverables are net-new files; no existing file was modified.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `src/lib/revenueCalculation.ts`, `src/components/assessment/AssessmentSectorGate.tsx`, and `src/components/assessment/RevenueResultsScreen.tsx` are finished, tested, and ready for Plan 02 to wire into `AssessmentShell`/`DeepAssessmentShell`, replacing `ResultsScreen`/`DeepResultsScreen` and inserting the sector gate ahead of the quick assessment flow.
- No blockers.

---
*Phase: 10-assessment-re-point-enterprise-track*
*Completed: 2026-08-09*

## Self-Check: PASSED

All 8 created files verified present on disk; all 6 task commit hashes verified present in git log.
