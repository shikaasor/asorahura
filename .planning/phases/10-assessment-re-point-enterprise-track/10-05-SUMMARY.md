---
phase: 10-assessment-re-point-enterprise-track
plan: 05
subsystem: email
tags: [resend, react-email, pdfkit, llm-prompts, calendly-removal]

# Dependency graph
requires:
  - phase: 10-assessment-re-point-enterprise-track
    provides: assessment scoring/segment engine (getSegment) and LLM email-sequence drafting (draftEmailSequence, draftNurtureEmailSequence)
provides:
  - Deep-assessment confirmation email CTA routed to /checkout?assessment=deep
  - Primary assessment initial follow-up email CTA routed to /checkout
  - LLM prompt guidance (SEGMENT_CTA, PDF_CTA, segmentAngle, nurtureSegmentAngle) instructing the model to push /checkout instead of Calendly for warm/hot segments
  - PDF report's personalized next-step copy for warm/hot segments pointing at asorahura.com/checkout
  - AssessmentReport.tsx email template's second Button routed to /checkout
affects: [10-02 (live results screens, not yet executed), 10-04 (services/checkout/engage primary path, already executed)]

# Tech tracking
tech-stack:
  added: []
  patterns: [source-assertion test style via readFileSync, matching tests/test-calendly-removal-pages.test.ts]

key-files:
  created:
    - tests/test-calendly-removal-emails.test.ts
  modified:
    - src/app/assessment/deep/actions.ts
    - src/lib/email.ts
    - src/lib/prompts.ts
    - src/lib/pdf.ts
    - src/emails/AssessmentReport.tsx

key-decisions:
  - "CALENDLY_URL export in src/lib/email.ts kept in place — still used by src/app/automate/instagram/success/page.tsx, explicitly out of scope for this phase"
  - "engage/actions.ts enterprise redirect, checkout/success/page.tsx's embedded Calendly iframe (post-purchase DWY scheduling), and ResultsScreen.tsx/DeepResultsScreen.tsx (not-yet-executed 10-02-PLAN.md scope) intentionally left untouched — enterprise track and post-purchase scheduling retain Calendly per PROJECT.md constraints"

patterns-established:
  - "Source-assertion tests (readFileSync + toContain/not.toContain) for verifying literal string removal across non-rendered files (LLM prompt text, template literals)"

requirements-completed: [ASSESS-15]

# Metrics
duration: 15min
completed: 2026-08-09
---

# Phase 10 Plan 05: Assessment Email/PDF/Prompt Calendly Removal Summary

**Re-pointed every remaining assessment-funnel Calendly touchpoint — deep-assessment confirmation email, primary assessment's initial follow-up email, LLM prompt CTA instructions, PDF next-step copy, and the AssessmentReport email template — to /checkout, completing ASSESS-15 outside the live web pages already covered by 10-04.**

## Performance

- **Duration:** ~15 min
- **Tasks:** 3 completed
- **Files modified:** 5 (+1 test file created)

## Accomplishments
- Deep-assessment confirmation email (`src/app/assessment/deep/actions.ts`) now links to `${BASE_URL}/checkout?assessment=deep` labeled "View Your Roadmap"
- `sendAssessmentEmailSequence`'s initial email body now appends "See your purchase options: ${BASE_URL}/checkout" instead of a Calendly booking line
- `SEGMENT_CTA.warm`/`.hot` and `PDF_CTA.warm`/`.hot` in `src/lib/prompts.ts` now point at `https://asorahura.com/checkout`
- `segmentAngle` and `nurtureSegmentAngle` guidance text fed to the LLM no longer instructs the model to push a Calendly/strategy-session CTA — it now instructs a direct-purchase CTA
- `src/lib/pdf.ts`'s warm and hot `nextStep` strings reference `asorahura.com/checkout` instead of booking a call
- `AssessmentReport.tsx`'s second email `Button` now hrefs `${BASE_URL}/checkout` with label "See Your Purchase Options"

## Task Commits

Each task was committed atomically:

1. **Task 1: Deep-assessment email + initial follow-up email CTA** - `b1fafb3` (feat)
2. **Task 2: LLM prompt instructions + PDF next-step copy** - `5ab0481` (feat)
3. **Task 3: AssessmentReport email template CTA** - `3cb7d26` (feat)

_Note: tests/test-calendly-removal-emails.test.ts was written in Task 1 to cover the assertions needed by both Task 1 and Task 3 (per plan's shared verify command); it was committed with Task 1 and re-verified (unmodified) in Task 3._

## Files Created/Modified
- `src/app/assessment/deep/actions.ts` - deep-assessment confirmation email CTA now `/checkout?assessment=deep`, added local `BASE_URL` constant
- `src/lib/email.ts` - `sendAssessmentEmailSequence` initial email body appends `/checkout` link instead of `CALENDLY_URL`
- `src/lib/prompts.ts` - `SEGMENT_CTA`, `PDF_CTA`, `segmentAngle`, `nurtureSegmentAngle` all re-pointed at `/checkout` for warm/hot segments
- `src/lib/pdf.ts` - warm/hot `nextStep` branches reference `asorahura.com/checkout`
- `src/emails/AssessmentReport.tsx` - second `Button` hrefs `${BASE_URL}/checkout`, label changed to "See Your Purchase Options"
- `tests/test-calendly-removal-emails.test.ts` - new source-assertion test file (6 tests) covering all five touched files

## Decisions Made
- Kept `CALENDLY_URL` export and its remaining usage in `src/app/automate/instagram/success/page.tsx` untouched — explicitly out of scope per the plan's `<read_first>` instructions.
- Left the Day-14 "discovery call → fixed-scope build → handoff" 3-step description in `nurtureSequencePrompt` unchanged as instructed — it describes the DFY/DWY engagement process generically, not a literal Calendly link, and `${offerCta}` (now `/checkout`) is the only actual link injected there.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Full verification grep confirms the only remaining `calendly` references in `src/` are: `src/lib/email.ts`'s `CALENDLY_URL` constant (used by `automate/instagram/success/page.tsx`, out of scope), `src/app/engage/actions.ts` (enterprise-track redirect, intentional per PROJECT.md), `src/app/checkout/success/page.tsx` (post-purchase DWY scheduling iframe, intentional), and `src/components/assessment/ResultsScreen.tsx` / `DeepResultsScreen.tsx` (in scope for the not-yet-executed `10-02-PLAN.md`, which replaces these components entirely with `RevenueResultsScreen`).
- `10-02-PLAN.md` remains unexecuted — it consolidates the assessment routes and swaps in `RevenueResultsScreen`, which will retire the two files above.
- ASSESS-15 is now fully true for every email/PDF/prompt artifact this plan was scoped to touch.

---
*Phase: 10-assessment-re-point-enterprise-track*
*Completed: 2026-08-09*

## Self-Check: PASSED

All created/modified files and all 3 task commits (b1fafb3, 5ab0481, 3cb7d26) verified present.
