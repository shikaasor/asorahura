---
phase: 09-homepage-funnel-reposition
plan: 04
subsystem: ui
tags: [react, nextjs, testimonials, funnel, cta]

# Dependency graph
requires:
  - phase: 09-homepage-funnel-reposition
    provides: earlier plans 09-01/02/03 established homepage funnel repositioning groundwork
provides:
  - SocialProof.tsx sourced from testimonials.json with named, headshot-bearing entries and an /enterprise escape hatch
  - /engage page unconditionally framed as enterprise-only intake
  - /services page with a single, enterprise-consistent hero CTA (no stray SMB /assessment link)
  - Confirmation that /enterprise's case-study section is already positioned as a credibility strip (HOME-17), no change needed
affects: [phase-10, funnel-analytics, testimonials-content]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "SocialProof and TestimonialCard both consume the same testimonials.json build-time import, avoiding duplicate testimonial data sources"

key-files:
  created: []
  modified:
    - src/components/home/SocialProof.tsx
    - src/components/home/SocialProof.module.css
    - src/app/engage/page.tsx
    - src/app/services/page.tsx
    - src/app/services/services.module.css

key-decisions:
  - "proofItems composed as [testimonials.services[0], testimonials.services[1], testimonials.hero] (Pawel Janas, Aamna Mansoor, Maria Rios) per plan spec, matching existing services page testimonial reuse pattern"
  - "isEnterprise variable and hidden form field left intact in /engage since actions.ts still branches on it for Calendly-vs-confirmation redirect (out of this phase's scope)"

patterns-established:
  - "Escape-hatch CTA pattern: a centered, underlined text link below a content grid pointing to a more specific destination (e.g., /enterprise) — mirrors PainSection's existing .cta styling convention"

requirements-completed: [HOME-15, HOME-17, HOME-18, HOME-19]

# Metrics
duration: 25min
completed: 2026-08-11
---

# Phase 09 Plan 04: SocialProof Testimonials, Enterprise Engage Framing, Services CTA Cleanup Summary

**Replaced SocialProof's three anonymized (T.N./R.O./P.J.) testimonials with named, headshot-bearing entries statically imported from testimonials.json, forced /engage's headline copy to unconditionally read as enterprise intake, and removed the stray /assessment (SMB) CTA from the enterprise-only /services pricing page.**

## Performance

- **Duration:** 25 min
- **Started:** 2026-08-11T11:36:00Z
- **Completed:** 2026-08-11T12:01:30Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments
- SocialProof.tsx now imports `testimonials.json` at build time and renders Pawel Janas, Aamna Mansoor, and Maria Rios with 48px circular headshots — no anonymized initials remain anywhere in the file.
- Added an `/enterprise` escape-hatch link below the SocialProof grid for visitors seeking enterprise case studies.
- /engage always displays "Enterprise Discovery Brief" / "Discuss Your Enterprise Challenges" regardless of query params, closing the T-09-02 elevation-of-privilege gap (stale links no longer read as a generic contact form).
- /services' hero now has a single CTA ("Work With Me" → /engage); the mismatched /assessment (SMB discovery) link and its orphaned `.heroSecondary` CSS rule are removed.
- Verified (read-only, no code change) that /enterprise's `caseStudiesSection` already renders after `verticalsSection` and before `tiersSection`, satisfying HOME-17's "credibility strip, not primary proof" requirement.

## Task Commits

Each task was committed atomically:

1. **Task 1: Source SocialProof from testimonials.json with headshots** - `a16b780` (feat)
2. **Task 2: Force /engage to read as enterprise-only intake** - `8a97bba` (feat)
3. **Task 3: Remove the mismatched SMB CTA from /services and verify /enterprise's case-study position (HOME-17)** - `3543673` (fix)

**Plan metadata:** (this commit, docs: complete plan)

## Files Created/Modified
- `src/components/home/SocialProof.tsx` - Replaced hardcoded anonymized testimonials array with `testimonials.json`-sourced `proofItems`; added headshot rendering and `/enterprise` escape-hatch link
- `src/components/home/SocialProof.module.css` - Added `.headshot` (48px circular avatar) and `.enterpriseNote` (centered underlined link, PainSection-style) rules
- `src/app/engage/page.tsx` - Removed eyebrow/headline ternaries; copy is now unconditionally enterprise-framed; hidden `enterprise` field preserved for `actions.ts`
- `src/app/services/page.tsx` - Removed `/assessment` "Start the Discovery" hero link, leaving `Work With Me` → `/engage` as the sole hero CTA
- `src/app/services/services.module.css` - Removed orphaned `.heroSecondary` rule

## Decisions Made
- Used the exact `proofItems` composition specified in the plan (`services[0]`, `services[1]`, `hero`) to match the plan's named individuals (Pawel Janas, Aamna Mansoor, Maria Rios) rather than reordering or filtering testimonials.json differently.
- Kept `isEnterprise` and the hidden form field in `/engage/page.tsx` untouched since `actions.ts`'s Calendly-vs-confirmation redirect logic depends on it — only the two visible copy ternaries were made static, per plan instruction and threat register T-09-02 disposition.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- `npm run test -- --watch src/components/home` (Task 1's acceptance criterion) was not run in watch mode since no watch process should be left running for an autonomous executor; instead ran the full non-watch `npm run test` suite, which is also what the plan's overall `<verification>` block requires.
- Full test suite: 178/179 passing. The 1 pre-existing failure (`tests/test-calendly-removal-pages.test.ts:29`, checking `checkout/page.tsx` routes through `/engage?enterprise=true`) is unrelated to any file this plan modifies — traced to phase-10 commit `104b852`, already logged in `.planning/phases/09-homepage-funnel-reposition/deferred-items.md` by a prior plan. Not fixed per scope boundary rule.
- `npm run lint` failed with an unrelated environment path-resolution error (`Invalid project directory provided`, appending "lint" to the Windows path) — a pre-existing tooling issue not caused by this plan's changes and not part of this plan's verification requirements (only `npm run test` is specified).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Phase 09 (homepage-funnel-reposition) is now fully executed across all 4 plans (09-01 through 09-04).
- SocialProof, /engage, and /services now consistently reflect the enterprise-vs-SMB funnel separation established across this phase.
- No blockers for phase-level verification.

---
*Phase: 09-homepage-funnel-reposition*
*Completed: 2026-08-11*

## Self-Check: PASSED

All 3 task commit hashes (a16b780, 8a97bba, 3543673) and all 6 referenced files verified present.
