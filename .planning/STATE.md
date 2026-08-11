---
gsd_state_version: 1.0
milestone: v2.0
milestone_name: Reposition to Small Business Owners
status: executing
stopped_at: Completed 09-03-PLAN.md
last_updated: "2026-08-11T10:34:33.464Z"
last_activity: 2026-08-11
progress:
  total_phases: 12
  completed_phases: 8
  total_plans: 55
  completed_plans: 52
  percent: 67
---

# Project State

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-07-31)

**Core value:** Grow your income through small automations — start with one automation that visibly makes money, then ascend.
**Current focus:** Phase 09 — homepage-funnel-reposition

## Current Position

Phase: 09 — homepage-funnel-reposition
Plan: 4 of 4
Status: Ready to execute
Last activity: 2026-08-11

Progress: [██████████] 95%

## Performance Metrics

**Velocity (v1.0, Phases 1-5):**

- Total plans completed: 32
- v1.0 shipped in full; see `.planning/archive/` for detail

**v2.0:** No plans executed yet.

## Accumulated Context

### Roadmap Evolution

- Phase 09.1 inserted after Phase 9: Automations Page — catalog of automations with detail pages per offering; scoped from user feedback after Phase 7 shipped a single-product /automate page (URGENT)

### Decisions

Full decision log in `.planning/PROJECT.md` Key Decisions table. Recent decisions affecting current work:

- ICP repositioned to small business owners ($10k-$100k MRR); wedge = creators/coaches/info-product sellers via Instagram (2026-07-30)
- Self-serve, no call in the primary path; Paddle remains the checkout engine (2026-07-30)
- Palette decision precedes the product page — `/automate` is the pilot for the new token system (2026-07-30)
- Care Plan corrected to $9.99/mo (site currently shows $99/mo, a 10x error) — must ship fixed in Phase 7 before any other page work
- `/automate` ships self-contained (no site nav) until Phase 9 lands
- [Phase 10]: getRevenueOpportunities always takes tierLevel derived from deepScoreToTierLevel/quickScoreToTierLevel, never the raw score
- [Phase 10]: Enterprise gate uses hardcoded router.push('/enterprise') literal to close open-redirect threat T-10-02
- [Phase 10]: Enterprise page transcribes case-study/service-tier data locally rather than importing unexported consts from work/services pages
- [Phase 10]: engage/actions.ts redirect gate switched from score >= 40/70 thresholds to a strict enterprise === 'true' form field check, closing the open-redirect/spoofed-score risk (T-10-08)
- [Phase 10]: CALENDLY_URL export kept in email.ts (still used by automate/instagram/success page, out of scope for Phase 10)
- [Phase 10]: Enterprise track (engage/actions.ts) and post-purchase DWY scheduling (checkout/success/page.tsx) intentionally retain Calendly per PROJECT.md constraints
- [Phase 10]: sector state remains at DEFAULT_SECTOR for the whole SMB flow now that the in-flow SectorPicker step is gone; Enterprise routing handled entirely by AssessmentSectorGate before either shell mounts
- [Phase 10]: RevenueResultsScreen is called without a tier prop since it derives tier internally from score + sector
- [Phase 09]: Positioning statement duplicated verbatim across Hero/Footer/layout.tsx by design (T-09-06 accepted risk, no shared constant per CLAUDE.md simplicity rule)
- [Phase 09]: Footer.tsx uses two separate nav blocks (Creator Path, Enterprise) to visibly separate the two funnels
- [Phase 09]: Fixed pre-existing swapped CSS modules (PainSection/ProcessTimeline) from 08-04 before proceeding with Task 1
- [Phase 09]: Used plain apostrophes instead of literal &apos; in JS string data (not JSX text nodes)

### Pending Todos

None yet.

### Blockers/Concerns

- Paddle live status and price ID configuration in production is unverified — first task of Phase 7 (PAY-01)
- `SocialProof.tsx` testimonials (T.N., R.O.) — real and anonymized, or placeholder? Blocks Phase 9 homepage rewrite (HOME-18)
- **Phase 7 missing source assets**: `ai_learnt/assets/automate-landing-page.html` (PROD-01's copy/structure source) and the Build Map deliverable (4 n8n workflow files + env template + deploy guide, per PROJECT.md) do not exist anywhere in the repo. Planner/researcher will need to work from PROJECT.md + REQUIREMENTS.md content alone, or the user needs to supply the real files before launch.
- Phase 7 has no CONTEXT.md — discuss-phase-7 was started (codebase scouted, gray areas identified: missing assets, new Paddle products for DFY/DWY/Care Plan, purchase notification mechanism, lead capture/analytics choices) but the user chose to skip straight to planning.

## Deferred Items

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| Segment Expansion | SEG-01..04 — local services, agencies, e-commerce segment pages | Deferred to future milestone | v2.0 requirements definition |
| Proof | PROOF-01/02 — before/after results, revenue-impact testimonials | Deferred (no proof exists yet) | v2.0 requirements definition |
| Ladder | LADDER-01/02 — Product #2 and post-purchase upsell sequence | Deferred to future milestone | v2.0 requirements definition |
| Phase 10 P01 | 25min | 3 tasks | 8 files |
| Phase 10 P03 | 12min | 2 tasks | 6 files |
| Phase 10 P04 | 6min | 3 tasks | 7 files |
| Phase 10 P05 | 15min | 3 tasks | 6 files |
| Phase 10 P02 | 20min | 3 tasks | 6 files |
| Phase 09 P02 | 20min | 2 tasks | 3 files |
| Phase 09 P03 | 20min | 2 tasks | 5 files |

## Session Continuity

Last session: 2026-08-11T10:34:33.464Z
Stopped at: Completed 09-03-PLAN.md
Resume file: None

Next action: Execute `.planning/phases/09-homepage-funnel-reposition/09-04-PLAN.md`
