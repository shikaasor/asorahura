---
phase: 08-design-system-rollout
plan: 02
subsystem: ui
tags: [css-modules, design-tokens, tailwind, checkout, assessment, theme-unification]

# Dependency graph
requires:
  - phase: 08-design-system-rollout
    provides: Wave 1 dead-code deletion (08-01) that removed the JSX referencing the now-dead .enterpriseCta/.enterpriseBtn CSS rules
provides:
  - Token-driven checkout.module.css and PaddleCheckout.module.css (zero hardcoded hex)
  - Token-driven assessment.module.css, AssessmentShell.module.css, EmailGate.module.css, ProgressBar.module.css (zero hardcoded hex)
  - /checkout and /assessment heroes rendering on var(--surface-1)/var(--ink-1) instead of dark #0a0a0a (STYLE-04 fix)
  - Token-backed Tailwind arbitrary-value classes in checkout success page + OrderSummary/TierSelector/TrustBadges
affects: [09-automations-page, 10-assessment-repoint, design-system-cleanup]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Dark #0a0a0a CTA/selected fills replaced with var(--accent) (+ var(--accent-hover) on hover), matching the already-converted automate/instagram/success pattern"
    - "Error-state colors (border/text) map directly to var(--error); no light-tint background token exists, so error surfaces fall back to var(--surface-1)"
    - "Tailwind gray/slate utilities converted to arbitrary-value token references (text-[var(--ink-2)] etc.) per STYLE-03"

key-files:
  created: []
  modified:
    - src/app/checkout/checkout.module.css
    - src/components/checkout/PaddleCheckout.module.css
    - src/app/assessment/assessment.module.css
    - src/components/assessment/AssessmentShell.module.css
    - src/components/assessment/EmailGate.module.css
    - src/components/assessment/ProgressBar.module.css
    - src/app/checkout/success/page.tsx
    - src/components/checkout/OrderSummary.tsx
    - src/components/checkout/TierSelector.tsx
    - src/components/checkout/TrustBadges.tsx

key-decisions:
  - "Dark CTA/selected fills (checkout tierCard.selected, AssessmentShell/EmailGate submit buttons, ProgressBar fill) converted to var(--accent)/var(--accent-hover) rather than var(--ink-1), matching the precedent already established in src/app/automate/instagram/success/success.module.css and src/app/automate/[slug]/page.module.css"
  - "Text-on-accent-fill uses var(--surface-1) (light) rather than var(--ink-1), following the same automate/instagram/success.module.css precedent rather than the PATTERNS.md doc's ink-1-on-gold example"
  - "PaddleCheckout .error and EmailGate .formError/.inputError/.fieldError use var(--error) directly for border/text (matching src/components/automate/BuildMapForm.module.css's .inputError/.fieldError precedent); the light pink background (#fef2f2) has no dedicated token and falls back to var(--surface-1)"
  - "ProgressBar .track background (#e5e7eb, a visible divider) mapped to var(--border-2) rather than var(--border-1) for adequate visual contrast against surface-1"
  - "Spacing/type-scale (STYLE-05) pass applied literally per the plan's explicit rem→token examples for checkout.module.css and assessment.module.css/.hero/.shell; compound shorthand paddings and non-listed one-off gap values were left as raw rem per the plan's 'leave one-off layout constants alone' instruction"
  - "PaddleCheckout.module.css, AssessmentShell/EmailGate/ProgressBar received color-only token conversion (no font-size/spacing tokenization) — plan's task action for these files scoped the work to color property-context mapping only"

requirements-completed: [STYLE-02, STYLE-03, STYLE-04, STYLE-05]

# Metrics
duration: 24min
completed: 2026-08-09
---

# Phase 08 Plan 02: Checkout + Assessment Token Conversion Summary

**Converted 6 CSS modules (checkout, PaddleCheckout, assessment, AssessmentShell, EmailGate, ProgressBar) and 4 TSX files from hardcoded hex/Tailwind-gray colors to Phase 6 design tokens, flipping the /checkout and /assessment dark hero sections to the light-first theme.**

## Performance

- **Duration:** 24 min
- **Started:** 2026-08-09T13:06:37+01:00 (Task 1 commit)
- **Completed:** 2026-08-09T13:14:20+01:00 (Task 3 commit) — plus verification/summary time
- **Tasks:** 3
- **Files modified:** 10

## Accomplishments
- `/checkout` and `/assessment` `.hero` sections now render `var(--surface-1)`/`var(--ink-1)` (light), matching the rest of each page — the two routes explicitly named in ROADMAP success criterion 4 as flipping light/dark
- Zero hardcoded hex colors remain in `checkout.module.css`, `PaddleCheckout.module.css`, `assessment.module.css`, `AssessmentShell.module.css`, `EmailGate.module.css`, `ProgressBar.module.css` (verified via `grep -cE "#[0-9a-fA-F]{3,8}"` → all 0)
- Zero raw Tailwind `gray-*`/`slate-*` utility classes remain in the checkout success page or the three shared checkout components (verified via grep → all 0)
- Font-size, font-weight, and select spacing values in `checkout.module.css` and `assessment.module.css` migrated to the Phase 6 type/spacing scale (STYLE-05) per the plan's explicit mapping table

## Task Commits

Each task was committed atomically:

1. **Task 1: Convert checkout.module.css and PaddleCheckout.module.css to tokens; unify hero to light theme** - `ccf735c` (feat)
2. **Task 2: Convert assessment.module.css, AssessmentShell.module.css, EmailGate.module.css, ProgressBar.module.css to tokens; unify hero to light theme** - `c4a3772` (feat)
3. **Task 3: Convert Tailwind gray/slate utilities to token-backed arbitrary values in checkout success page + shared checkout components** - `38d6ed4` (feat)

## Files Created/Modified
- `src/app/checkout/checkout.module.css` - All hex colors → tokens; `.hero` flipped to light; STYLE-05 type/spacing pass; dead `.enterpriseCta`/`.enterpriseBtn` rules confirmed already absent (removed in 08-01)
- `src/components/checkout/PaddleCheckout.module.css` - `.skeleton`/`.error`/`.testNote` colors → tokens (`--surface-3`, `--error`, `--ink-3`)
- `src/app/assessment/assessment.module.css` - All hex colors → tokens; `.hero` flipped to light; STYLE-05 spacing/type pass on hero/shell
- `src/components/assessment/AssessmentShell.module.css` - `.introTitle`/`.introSub` → ink tokens; `.startBtn` dark fill → `--accent`/`--accent-hover`
- `src/components/assessment/EmailGate.module.css` - All hex colors → tokens; `.submit` → `--accent`/`--accent-hover`; error states → `--error`
- `src/components/assessment/ProgressBar.module.css` - `.label`/`.pct` → ink tokens; `.track` → `--border-2`; `.fill` → `--accent`
- `src/app/checkout/success/page.tsx` - Tailwind gray utilities → `text-[var(--ink-N)]`/`border-[var(--border-1)]`
- `src/components/checkout/OrderSummary.tsx` - Tailwind gray utilities → token-backed arbitrary values
- `src/components/checkout/TierSelector.tsx` - Selected/unselected state colors → token-backed arbitrary values
- `src/components/checkout/TrustBadges.tsx` - Border/text colors → token-backed arbitrary values

## Decisions Made
- Dark (`#0a0a0a`) CTA and selected-state fills across all six CSS modules (checkout `.tierCard.selected`, AssessmentShell `.startBtn`, EmailGate `.submit`, ProgressBar `.fill`) were converted to `var(--accent)` with `var(--accent-hover)` on hover, and their on-fill text to `var(--surface-1)`, rather than treating them as neutral `--ink-1` panels. This follows the precedent already set in `src/app/automate/instagram/success/success.module.css` and `src/app/automate/[slug]/page.module.css` (both already token-converted in earlier phase work), which is a stronger signal than the illustrative `ink-1`-on-gold example in `08-PATTERNS.md`.
- Error-state colors (PaddleCheckout `.error`, EmailGate `.formError`/`.inputError`/`.fieldError`) map border/text directly to `var(--error)`, matching the existing `BuildMapForm.module.css` `.inputError`/`.fieldError` precedent. No light-tint error background token exists in `globals.css`, so the light pink (`#fef2f2`) background was simplified to `var(--surface-1)` rather than inventing a new token or a `color-mix()` expression.
- `ProgressBar.module.css` `.track` (a visible divider, `#e5e7eb`) was mapped to `var(--border-2)` instead of `var(--border-1)`, since `--border-1` (8% opacity) would be nearly invisible for a progress-track background.

## Deviations from Plan

None - plan executed exactly as written. The plan's `.enterpriseCta`/`.enterpriseBtn` deletion instruction for `checkout.module.css` (Task 1) was a no-op: those rule blocks were already absent from the file, confirming Plan 08-01 had already removed them along with the JSX.

## Issues Encountered
- `npm run build` fails with the pre-existing, unrelated `pdfkit`/`fs` client-bundle error documented in `.planning/phases/08-design-system-rollout/deferred-items.md` ("Pre-existing build failure: `pdfkit` bundled into a client component"). This plan touches none of the files in that error's import trace (`src/lib/pdf.ts`, `src/lib/email.ts`, `src/app/automate/instagram/success/page.tsx`). Verification was instead performed via `npx tsc --noEmit` (zero errors) plus the plan's specified `grep` checks (all zero hardcoded hex / zero raw Tailwind gray-slate utilities).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All 10 files in this plan's scope are fully token-driven; `/checkout` and `/assessment` heroes are visually consistent with the rest of the light-first theme.
- The pre-existing `pdfkit` build failure (unrelated to this plan) remains open and will continue to block a clean `npm run build` until a future phase/task addresses the `pdf.ts`/`email.ts` server/client boundary issue — already tracked in `deferred-items.md`.

---
*Phase: 08-design-system-rollout*
*Completed: 2026-08-09*

## Self-Check: PASSED

All 10 files confirmed present on disk; all 3 task commits (ccf735c, c4a3772, 38d6ed4) confirmed in `git log`.
