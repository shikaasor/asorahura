---
phase: 10-assessment-re-point-enterprise-track
plan: 04
subsystem: routing
tags: [nextjs, server-actions, calendly-removal, enterprise-gating]

# Dependency graph
requires: []
provides:
  - "engage/actions.ts redirect decision driven by enterprise form flag, not lead score"
  - "services and checkout CTAs routed through /engage instead of direct Calendly links"
  - "BOOKING_SLOTS manual scarcity signal fully removed from the codebase"
affects: [10-02 (assessment flow), enterprise-track, engage-intake]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Enterprise-only Calendly retention: hardcoded literal redirect targets selected by a strict boolean flag comparison, never derived from raw form input (no open redirect)"

key-files:
  created:
    - tests/test-engage-enterprise-routing.test.ts
    - tests/test-calendly-removal-pages.test.ts
  modified:
    - src/app/engage/page.tsx
    - src/app/engage/actions.ts
    - src/app/services/page.tsx
    - src/app/checkout/page.tsx

key-decisions:
  - "engage/actions.ts redirect gate switched from score >= 40/70 thresholds to a strict enterprise === 'true' form field check, per UI-SPEC's enterprise-only Calendly retention rule"
  - "scoreRaw is still read and included in the CRM payload for reporting purposes even though it no longer drives the redirect decision"
  - "checkout/page.tsx's isEnterprise remains hardcoded to false (pre-existing, out of this plan's scope) — the enterprise CTA block's href was updated per plan instructions but the block itself is currently unreachable in that file; not touched since it wasn't in scope and touching it would be an unrelated architectural change"

requirements-completed: [ASSESS-15, ASSESS-16]

# Metrics
duration: 6min
completed: 2026-08-09
---

# Phase 10 Plan 04: Calendly Removal from Primary Path Summary

**Enterprise-flag-gated engage redirect replaces score-based Calendly routing; services and checkout CTAs now route through /engage; BOOKING_SLOTS scarcity signal deleted.**

## Performance

- **Duration:** 6 min
- **Started:** 2026-08-09T06:57:00Z
- **Completed:** 2026-08-09T07:01:16Z
- **Tasks:** 3
- **Files modified:** 7 (4 modified, 3 deleted, 2 test files created)

## Accomplishments
- `engage/actions.ts` redirects to Calendly only when the form's `enterprise` field is `"true"`; every other submission (including a spoofed high `score`) lands on `/engage/confirmation`
- `engage/page.tsx` reads the `enterprise` search param, swaps header copy for enterprise visitors, and submits a hidden `enterprise` field
- `services/page.tsx` tier CTAs link to `/engage?tier={id}` instead of `calendly.com`; `checkout/page.tsx`'s enterprise CTA links to `/engage?enterprise=true`
- `BOOKING_SLOTS` scarcity signal (`src/config/booking.ts`, `BookingUrgency.tsx`, `BookingUrgency.module.css`) fully removed — no consumers remained after Task 2

## Task Commits

Each task was committed atomically:

1. **Task 1: Enterprise-gated engage form + redirect** - `69c3849` (feat)
2. **Task 2: Services + checkout CTA de-Calendly** - `104b852` (feat)
3. **Task 3: Retire BOOKING_SLOTS manual scarcity** - `3911471` (chore)

**Plan metadata:** pending (docs: complete plan)

## Files Created/Modified
- `src/app/engage/page.tsx` - reads `enterprise` search param, conditional header copy, hidden `enterprise` field
- `src/app/engage/actions.ts` - redirect decision now gated on `enterprise` form field instead of `score` thresholds
- `src/app/services/page.tsx` - tier CTAs point at `/engage?tier=...`, `BookingUrgency` import/render removed
- `src/app/checkout/page.tsx` - enterprise CTA links to `/engage?enterprise=true`
- `tests/test-engage-enterprise-routing.test.ts` - source-assertion tests for the enterprise-gated redirect
- `tests/test-calendly-removal-pages.test.ts` - source-assertion tests confirming no `calendly` substring remains on services/checkout
- `src/config/booking.ts`, `src/components/services/BookingUrgency.tsx`, `src/components/services/BookingUrgency.module.css` - deleted

## Decisions Made
- Kept `scoreRaw` read in `actions.ts` solely for the CRM payload (`inquiry.score`), since the plan explicitly required preserving that field for reporting even after removing it from the redirect logic
- Did not modify `checkout/page.tsx`'s hardcoded `isEnterprise = false` — pre-existing and out of scope for this plan (the href update was applied per plan instructions on the existing, currently-unreachable enterprise CTA block)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Pre-existing, unrelated `npx tsc --noEmit` error in `src/app/blog/[slug]/page.tsx` (`Cannot find module 'next-mdx-remote/rsc'`) — confirmed via git stash comparison that this error exists independent of this plan's changes; out of scope per CLAUDE.md surgical-changes rule and the deviation-rules scope boundary (unrelated file, pre-existing failure)

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- ASSESS-15 and ASSESS-16 are observably true for `/services`, `/checkout`, and non-enterprise `/engage` submissions
- Enterprise track retains its Calendly booking path via `enterprise=true` engage submissions, per UI-SPEC
- Assessment flow's own Calendly removal is handled separately by 10-02-PLAN.md (not touched here)

---
*Phase: 10-assessment-re-point-enterprise-track*
*Completed: 2026-08-09*

## Self-Check: PASSED

All created/modified files and all three task commit hashes (69c3849, 104b852, 3911471) verified present.
