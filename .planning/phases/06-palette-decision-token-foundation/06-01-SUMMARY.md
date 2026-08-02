---
phase: 06-palette-decision-token-foundation
plan: 01
subsystem: testing
tags: [vitest, postcss, parse-css-color, wcag, contrast, design-tokens]

# Dependency graph
requires: []
provides:
  - Vitest test framework installed and configured (node environment, single-run)
  - scripts/verify-contrast.js — WCAG 2.0 contrast verification CLI + testable module (DESIGN-07)
  - tests/test-contrast-verification.test.js — GREEN unit tests for luminance/contrast math
  - tests/test-token-naming.test.ts — RED scaffold documenting the target semantic-scale token set
affects: [06-02-token-migration, 06-03-palette-review-route]

# Tech tracking
tech-stack:
  added: [vitest@4.1.10, postcss@8.5.25, parse-css-color@0.2.1]
  patterns:
    - "WCAG contrast verification via PostCSS AST parsing (not regex) + parse-css-color normalization"
    - "Generic error messages on file-read failure (no path/content interpolation) — V7 mitigation"

key-files:
  created:
    - scripts/verify-contrast.js
    - vitest.config.ts
    - tests/test-contrast-verification.test.js
    - tests/test-token-naming.test.ts
  modified:
    - package.json
    - package-lock.json

key-decisions:
  - "Corrected the plan/RESEARCH.md's mid-gray #888888-on-white contrast reference value from ~6.3:1 to the mathematically correct ~3.54:1 (WCAG formula per W3C spec, verified against WebAIM's contrast checker convention)"

patterns-established:
  - "Design token contrast checks live in scripts/verify-contrast.js, exporting pure functions (getRelativeLuminance, getContrastRatio, parseTokens, checkContrast, readTokensFile) plus a CLI entry guarded by require.main === module"

requirements-completed: [DESIGN-07]

# Metrics
duration: 25min
completed: 2026-08-02
---

# Phase 6 Plan 1: Test Infrastructure + Contrast Verification Foundation Summary

**WCAG 2.0 contrast-verification CLI/module (PostCSS + parse-css-color) with Vitest test harness and Wave 0 scaffolds for the upcoming token migration**

## Performance

- **Duration:** ~25 min
- **Tasks:** 3 (Task 0 checkpoint approved by user prior to this continuation; Tasks 1–2 executed here)
- **Files modified:** 6 (package.json, package-lock.json, vitest.config.ts, scripts/verify-contrast.js, tests/test-contrast-verification.test.js, tests/test-token-naming.test.ts)

## Accomplishments
- Installed and configured Vitest (node environment, single-run `vitest run`, no watch mode) plus `postcss` and `parse-css-color` as devDependencies, gated behind the user-approved Task 0 legitimacy checkpoint
- Built `scripts/verify-contrast.js`: a CommonJS module exporting `getRelativeLuminance`, `getContrastRatio`, `parseTokens` (PostCSS AST-based, not regex), `checkContrast`, and `readTokensFile`, plus a CLI entry point (`npm run verify:contrast`) that exits non-zero on any failing token pairing
- File-read failures throw a generic `"Unable to read design tokens file"` error with no path or CSS content interpolated, satisfying the V7 information-disclosure mitigation (T-06-01, T-06-02)
- Added Wave 0 test scaffolds: a GREEN unit-test suite for the contrast math (5 tests, all passing) and a RED scaffold (`tests/test-token-naming.test.ts`, 45 failing assertions) that documents the target semantic-scale token set and asserts absence of legacy dark-palette tokens — expected to turn GREEN once Plan 06-02 replaces `globals.css`'s token block

## Task Commits

Each task was committed atomically:

1. **Task 1: Install test framework and contrast-script dependencies** - `0a3f333` (chore)
2. **Task 2: Build the contrast verification script and Wave 0 test scaffolds** - `dab80db` (feat, tdd)

(Task 0 was a blocking human-verify checkpoint, approved by the user prior to this continuation agent's start — no code change, no commit.)

## Files Created/Modified
- `scripts/verify-contrast.js` - WCAG contrast verification module + CLI entry point
- `vitest.config.ts` - Vitest config: node environment, `tests/**/*.test.{js,ts}` include glob
- `tests/test-contrast-verification.test.js` - Unit tests for luminance/contrast math (5 tests, GREEN)
- `tests/test-token-naming.test.ts` - Scaffold test for semantic-scale token naming (45 assertions, expected RED until Plan 06-02)
- `package.json` - Added `test` and `verify:contrast` npm scripts; added vitest/postcss/parse-css-color devDependencies
- `package-lock.json` - Lockfile update from `npm install`

## Decisions Made
- Corrected the mid-gray `#888888`-on-white contrast test expectation from the plan's cited `~6.3:1` to the mathematically correct `~3.54:1`. The WCAG 2.0 relative-luminance formula (applied exactly per W3C spec, matching WebAIM's contrast checker) yields 3.54:1 for this pairing; 6.3:1 is a commonly repeated but incorrect reference value that also appears verbatim in 06-RESEARCH.md's Pitfall 1 section. The formula implementation itself was kept faithful to the W3C spec (RESEARCH.md explicitly states ratios are "deterministic and non-negotiable") — only the test's expected value was corrected.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Corrected mid-gray contrast reference value in test assertion**
- **Found during:** Task 2 (writing `tests/test-contrast-verification.test.js`)
- **Issue:** Both 06-01-PLAN.md's Test 2 spec and 06-RESEARCH.md's Pitfall 1 section cite "#888888 on white ≈ 6.3:1" as the expected contrast ratio. Implementing the WCAG 2.0 formula exactly as specified (sRGB gamma-corrected luminance, `(L1+0.05)/(L2+0.05)`) produces ~3.54:1 for this pairing, not 6.3:1. Asserting against the plan's literal value would either force an incorrect formula or make the test permanently fail.
- **Fix:** Kept the WCAG formula implementation correct (matches White/Black = 21:1 reference exactly, per plan Test 1) and corrected the test's expected range to 3.4–3.7 (centered on the mathematically accurate ~3.54:1), with an inline comment explaining the discrepancy for future readers.
- **Files modified:** tests/test-contrast-verification.test.js
- **Verification:** `npx vitest run tests/test-contrast-verification.test.js` — all 5 tests pass; White/Black 21:1 reference test also passes, confirming the luminance formula is correctly implemented (not adjusted to fit a wrong target).
- **Committed in:** dab80db (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug fix — Rule 1)
**Impact on plan:** Necessary for correctness; the WCAG formula must remain faithful to the W3C spec since it gates future contrast verification. No scope creep — only the erroneous reference value in a single test assertion was corrected, with the discrepancy documented inline and here.

## Issues Encountered
None beyond the deviation documented above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- `npm test` and `npm run verify:contrast` are available for Plan 06-02 (token migration) to verify contrast compliance once the new semantic-scale tokens replace the dark palette in `globals.css`
- `tests/test-token-naming.test.ts` currently fails (45/46 assertions) against the still-dark `globals.css` — this is expected and documents exactly which tokens Plan 06-02 must add/remove to turn the suite GREEN
- No blockers for Plan 06-02 or 06-03

---
*Phase: 06-palette-decision-token-foundation*
*Completed: 2026-08-02*
