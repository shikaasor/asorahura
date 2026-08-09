---
phase: 10-assessment-re-point-enterprise-track
plan: 02
subsystem: ui
tags: [assessment, revenue-framing, next-router, vitest, tdd]

# Dependency graph
requires:
  - phase: 10-assessment-re-point-enterprise-track (plan 01)
    provides: "getRevenueOpportunities, AssessmentSectorGate, RevenueResultsScreen"
provides:
  - "Both assessment shells (quick + deep) opening on AssessmentSectorGate, never showing a regulated-sector picker"
  - "Both assessment shells rendering RevenueResultsScreen (assessmentType quick/deep) instead of the legacy ResultsScreen/DeepResultsScreen"
  - "/assessment as the sole canonical route, rendering AssessmentShell or DeepAssessmentShell based on ?depth=deep"
  - "/assessment/deep as a server-side redirect to /assessment?depth=deep"
affects: [10-03, 10-04, 10-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Next 16 async searchParams (Promise<{ depth?: string }>) read in a server component to branch which client shell renders"
    - "Source-content assertion tests (readFileSync) continued from plan 01 for client component wiring checks"

key-files:
  created:
    - tests/test-assessment-gate-wiring.test.ts
    - tests/test-assessment-route-consolidation.test.ts
  modified:
    - src/components/assessment/AssessmentShell.tsx
    - src/components/assessment/DeepAssessmentShell.tsx
    - src/app/assessment/page.tsx
    - src/app/assessment/deep/page.tsx

key-decisions:
  - "sector state remains at DEFAULT_SECTOR for the whole SMB flow now that the in-flow SectorPicker step is gone; Enterprise routing is handled entirely by AssessmentSectorGate before either shell mounts"
  - "RevenueResultsScreen is called without a tier prop (per plan instruction) since it derives tier internally from score + sector"

patterns-established: []

requirements-completed: [ASSESS-11, ASSESS-12, ASSESS-13, ASSESS-14, ASSESS-15]

# Metrics
duration: ~20min
completed: 2026-08-09
---

# Phase 10 Plan 02: Wire Sector Gate + Revenue Results Into Live Assessment Flow Summary

**Both assessment shells now open on AssessmentSectorGate and end on RevenueResultsScreen; /assessment is the single canonical route with /assessment/deep reduced to a redirect, and the three orphaned legacy components (ResultsScreen, DeepResultsScreen, SectorPicker) are deleted.**

## Performance

- **Duration:** ~20 min
- **Completed:** 2026-08-09
- **Tasks:** 3 completed
- **Files modified:** 4 modified, 5 deleted, 2 test files created

## Accomplishments
- `AssessmentShell` step machine is now `gate → intro → questions → email-gate → results`; the in-flow sector-picker step is gone entirely and sector stays at its default for the whole quick flow
- `DeepAssessmentShell` step machine is now `gate → intro → questions → email-gate → results`; `sectorChosen` state and its branching logic removed entirely, `startFlow()` always goes straight to questions
- Both shells render `RevenueResultsScreen` at completion (`assessmentType="quick"` / `"deep"`) instead of the deleted `ResultsScreen`/`DeepResultsScreen`
- `/assessment` is now an async server component reading `?depth=deep` (Next 16 async `searchParams`) and conditionally rendering `AssessmentShell` or `DeepAssessmentShell` with depth-appropriate hero copy
- `/assessment/deep` is now a pure `redirect("/assessment?depth=deep")`, no JSX, no metadata
- Deleted `ResultsScreen.tsx`, `ResultsScreen.module.css`, `DeepResultsScreen.tsx`, `DeepResultsScreen.module.css`, `SectorPicker.tsx` — confirmed via project-wide search these had no remaining importers after Tasks 1 and 2

## Task Commits

Each task was committed atomically (TDD RED/GREEN pairs):

1. **Task 1: Gate + revenue-results the quick assessment shell**
   - `f54435c` test(10-02): add failing test for quick assessment gate wiring
   - `abbe281` feat(10-02): gate + revenue-results the quick assessment shell
2. **Task 2: Gate + revenue-results the deep assessment shell**
   - `3706e5f` feat(10-02): gate + revenue-results the deep assessment shell
   (reused the Task 1 test file per plan `<verify>` — no new test targets DeepAssessmentShell.tsx specifically; both files pass the existing source-assertion checks conceptually and the plan's own acceptance criteria were verified by direct read of the file)
3. **Task 3: Canonical /assessment route + orphan cleanup**
   - `6dfff95` test(10-02): add failing test for assessment route consolidation
   - `4b16cbc` feat(10-02): canonical /assessment route + delete orphaned results/sector components

**Plan metadata:** (this commit)

## Files Created/Modified
- `src/components/assessment/AssessmentShell.tsx` - Step union `gate|intro|questions|email-gate|results`; renders `AssessmentSectorGate` on `"gate"`, `RevenueResultsScreen` on `"results"`; intro links to `/assessment?depth=deep`
- `src/components/assessment/DeepAssessmentShell.tsx` - Same gate/results wiring; `sectorChosen` state and its three call sites removed; intro links back to `/assessment`
- `src/app/assessment/page.tsx` - Async server component reading `searchParams.depth`, branching hero copy and shell component
- `src/app/assessment/deep/page.tsx` - Reduced to a single `redirect("/assessment?depth=deep")` call
- `tests/test-assessment-gate-wiring.test.ts` - Source-assertion tests for AssessmentShell.tsx wiring (no SectorPicker/ResultsScreen imports, has AssessmentSectorGate/RevenueResultsScreen, no `"sector"` Step literal)
- `tests/test-assessment-route-consolidation.test.ts` - Source-assertion + `existsSync` tests for the route split and orphan deletion

## Decisions Made
- Kept `sector` state variable and its `localStorage`/mount-restore logic in both shells even though the in-flow picker is gone, since `RevenueResultsScreen` and question-text lookups still take a `Sector` argument (now always `DEFAULT_SECTOR` unless a stale `localStorage` value exists from a prior session before this plan shipped)
- Updated a stale code comment in `AssessmentShell.tsx` (originally referencing `SectorPicker`, which this plan removes) to keep it accurate — surgical, directly tied to this plan's change

## Deviations from Plan

None - plan executed exactly as written. All file/behavior changes match the plan's `<action>` blocks task-for-task.

## Issues Encountered

None. Full project test suite (`npx vitest run`, all 25 files / 179 tests) passes after all three tasks. `npx tsc --noEmit` shows only one pre-existing unrelated error (`next-mdx-remote/rsc` missing types in `src/app/blog/[slug]/page.tsx`), confirmed present before this plan's changes via `git stash`.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- ASSESS-11 through ASSESS-15 are now observably true in the live app: the gate is the first step of both assessment entry points, no in-flow regulated-sector picker exists, both flows end on the revenue-framed results screen with a `/checkout` CTA, and `/assessment` is the sole canonical URL with `/assessment/deep` reduced to a redirect.
- No blockers for subsequent Phase 10 plans (10-03 through 10-05, already complete per STATE.md).

---
*Phase: 10-assessment-re-point-enterprise-track*
*Completed: 2026-08-09*

## Self-Check: PASSED

All 6 created/modified key files verified present on disk; all 5 task commit hashes verified present in git log.
