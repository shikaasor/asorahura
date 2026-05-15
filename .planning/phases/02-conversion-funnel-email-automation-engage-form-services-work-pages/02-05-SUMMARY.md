---
phase: 02-conversion-funnel-email-automation-engage-form-services-work-pages
plan: 05
subsystem: email-automation, engage-form, requirements
tags: [email, calendly, engage-form, routing, requirements]
dependency_graph:
  requires: []
  provides: [EMAIL-02, ENGAGE-04, ENGAGE-06]
  affects: [src/lib/email.ts, src/app/engage/page.tsx, src/app/engage/actions.ts, .planning/REQUIREMENTS.md]
tech_stack:
  added: []
  patterns: [module-level constant for external URLs, URL param pre-fill with defaultValue]
key_files:
  created: []
  modified:
    - src/lib/email.ts
    - src/app/engage/page.tsx
    - src/app/engage/actions.ts
    - .planning/REQUIREMENTS.md
decisions:
  - CALENDLY_URL declared as module-level constant for easy update; appended to initialBody only (not day 3/7/14/30 sends)
  - serviceInterest field is optional (no required attr) — Not sure yet is valid fallback
  - ENGAGE-06 spec rewritten to match implemented score-based routing; old budget/Calendly spec removed
metrics:
  duration: ~10min
  completed: 2026-05-15
  tasks_completed: 3
  files_modified: 4
---

# Phase 02 Plan 05: Verification Gap Closure (EMAIL-02, ENGAGE-04, ENGAGE-06) Summary

**One-liner:** Appended Calendly booking URL to initial assessment email, added service-interest dropdown with tier pre-fill to engage form, and aligned REQUIREMENTS.md ENGAGE-06 with the implemented score-based routing.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Append Calendly link to initial email body | 0c0c0a7 | src/lib/email.ts |
| 2 | Add serviceInterest dropdown to engage form | 780bfa8 | src/app/engage/page.tsx, src/app/engage/actions.ts |
| 3 | Update REQUIREMENTS.md ENGAGE-06 | 2a57d26 | .planning/REQUIREMENTS.md |

## What Was Built

### Task 1 — EMAIL-02: Calendly link in initial email
- Added `CALENDLY_URL = "https://calendly.com/asorahura"` as a module-level constant after `FROM`.
- Built `initialBody` variable: LLM body (or fallback) + `\n\nBook a call: ${CALENDLY_URL}`.
- Used `text: initialBody` in the initial `resend.emails.send` call.
- Day 3, 7, 14, 30 sends are untouched — Calendly link is initial-only per EMAIL-02 spec.

### Task 2 — ENGAGE-04: Service interest dropdown
- Read `tierParam` from `useSearchParams().get("tier")` in `EngageFormInner`.
- Inserted `serviceInterest` select after the Company/Role row, before `companySize`.
- Five options: Not sure yet, Starter (~$5k), Operational ($5k–$15k), Integration ($15k–$30k), Enterprise ($30k+).
- `defaultValue={tierParam ?? ""}` pre-selects the matching option when `?tier=` param is present.
- `serviceInterest` captured in `inquiry` object in `actions.ts` for CRM logging.

### Task 3 — ENGAGE-06: REQUIREMENTS.md update
- Replaced budget/Calendly routing spec (Route A/B/C) with the implemented score-based routing description.
- Documents hot (≥70), warm (40–69), cold (<40/no score) thresholds and `/engage` direct visit fallback.
- Documentation-only — no code files changed.

## Verification

All checks passed:
- `npx tsc --noEmit` exits 0
- `grep "calendly.com/asorahura" src/lib/email.ts` — 1 match (module constant) + usage in initialBody
- `grep "serviceInterest" src/app/engage/page.tsx` — label, select id, name, defaultValue present
- `grep "serviceInterest" src/app/engage/actions.ts` — 1 match in inquiry object
- `grep "score-based" .planning/REQUIREMENTS.md` — 1 match in ENGAGE-06 entry
- `grep "Calendly booking" .planning/REQUIREMENTS.md` — 0 matches (old spec removed)

## Deviations from Plan

None - plan executed exactly as written.

## Self-Check: PASSED

- src/lib/email.ts — exists and contains CALENDLY_URL constant
- src/app/engage/page.tsx — exists and contains serviceInterest select
- src/app/engage/actions.ts — exists and contains serviceInterest in inquiry
- .planning/REQUIREMENTS.md — exists and contains score-based routing spec
- Commits 0c0c0a7, 780bfa8, 2a57d26 — all present in git log
