---
phase: 06-palette-decision-token-foundation
plan: 02
subsystem: ui
tags: [css, design-tokens, wcag, next-fonts, contrast]

# Dependency graph
requires:
  - phase: 06-palette-decision-token-foundation (plan 01)
    provides: Vitest harness, verify-contrast.js, tests/test-token-naming.test.ts (RED scaffold)
provides:
  - Direction B semantic-scale token system in src/app/globals.css (color, type, spacing, radius, shadow, transition)
  - layout.tsx loading only Inter (Playfair Display fully removed)
  - tests/test-token-naming.test.ts now GREEN (46/46)
  - npm run verify:contrast exits 0 against the new tokens
affects: [06-03-palette-review-route, phase-07-automate-page, phase-08-design-system-rollout]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Numbered token scales (--fontSize-1..7, --spacing-1..6) per D-08, not role-based names"
    - "Contrast-floor-driven token tuning: adjust value/luminance of a semantic color while preserving its hue when the WCAG script fails, rather than picking arbitrary replacement colors"

key-files:
  created: []
  modified:
    - src/app/globals.css
    - src/app/layout.tsx

key-decisions:
  - "Darkened --ink-3 (#9A9087 -> #8B827A) and --warn (#9B5F1A -> #935A19) from the plan's literal spec values because they failed the mandated WCAG contrast floor (2.64:1 and 4.38:1 respectively against --surface-3, both below their required minimums) — hue preserved, only luminance reduced"

patterns-established:
  - "When a spec'd token value fails npm run verify:contrast, darken/lighten within the same hue rather than swapping to an unrelated color, and re-verify with a safety margin"

requirements-completed: [DESIGN-03, DESIGN-04, DESIGN-05, DESIGN-06]

# Metrics
duration: 20min
completed: 2026-08-02
---

# Phase 6 Plan 2: Direction B Token Migration + Playfair Removal Summary

**Replaced the dark-luxury `:root` token block in globals.css with the full Direction B light-first semantic-scale system and removed Playfair Display font loading from layout.tsx, turning the Wave 0 RED test-naming scaffold GREEN and passing WCAG contrast verification**

## Performance

- **Duration:** ~20 min
- **Tasks:** 2
- **Files modified:** 2 (src/app/globals.css, src/app/layout.tsx)

## Accomplishments
- Replaced the entire dark-palette `:root` block (bg-base/gold/text-*/legacy aliases) with the Direction B semantic-scale token set: 15 color tokens (surface-1..4, ink-1..3, accent + hover/active, success/error/warn, border-1/2), numbered fontSize-1..7, role-named fontWeight/lineHeight, numbered spacing-1..6, radius-1..3, shadow-1..3, duration-1..3
- Deleted the redundant `font-family: var(--font-sans)` override on `h1-h4` (kept weight 700 / letter-spacing -0.02em unchanged per D-13) and the unused `.serif` class
- Removed `Playfair_Display` import, the `playfair` font const, and its variable from `layout.tsx`'s `body` className — layout now loads only Inter
- `tests/test-token-naming.test.ts` went from RED (45/46 failing) to GREEN (46/46 passing)
- `npm run verify:contrast` exits 0 against the full new token set

## Task Commits

Each task was committed atomically:

1. **Task 1: Replace the :root token block in globals.css with Direction B semantic-scale tokens** - `2add31e` (feat)
2. **Task 2: Remove Playfair Display font loading from layout.tsx** - `a48a0e9` (feat)
3. **Deviation fix (Rule 1): darken ink-3/warn to pass contrast floor** - `4b8f1b1` (fix)

## Files Created/Modified
- `src/app/globals.css` - New Direction B `:root` token block (44 custom properties), updated `body`/`::selection` to use new tokens, h1-h4 font-family override removed, `.serif` class deleted
- `src/app/layout.tsx` - `Inter`-only font import; `playfair` const and variable removed from `body` className

## Decisions Made
- Darkened `--ink-3` and `--warn` from the plan's literal hex values (see Deviations below) — same hue, lower luminance, to satisfy the project's contrast-floor constraint (4.5:1 body / 3:1 large text, verified by script per PROJECT.md constraints).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Darkened --ink-3 and --warn tokens to pass WCAG contrast floor**
- **Found during:** Task 2 verification (`npm run verify:contrast`)
- **Issue:** The plan's literal spec values `--ink-3: #9A9087` and `--warn: #9B5F1A` failed the contrast script: `--ink-3` on `--surface-2` (2.86:1) and `--surface-3` (2.64:1) both below the required 3:1 large-text floor; `--warn` on `--surface-3` (4.38:1) below the required 4.5:1 floor. This violates the project's non-negotiable contrast constraint ("The §B4 failure does not recur") and the plan's own acceptance criteria ("`npm run verify:contrast` exits 0 against the new Direction B tokens").
- **Fix:** Darkened both tokens by ~7-10% while preserving hue: `--ink-3` → `#8B827A` (worst-case ratio now 3.18:1, safety margin above 3:1), `--warn` → `#935A19` (worst-case ratio now 4.77:1, safety margin above 4.5:1). No other tokens changed.
- **Files modified:** src/app/globals.css
- **Verification:** `npm run verify:contrast` exits 0 with "✓ All text/surface pairings pass WCAG AA"; `npx vitest run tests/test-token-naming.test.ts` still 46/46 passing (token names unaffected, only values changed).
- **Committed in:** `4b8f1b1`

---

**Total deviations:** 1 auto-fixed (1 bug fix — Rule 1)
**Impact on plan:** Necessary for correctness against the project's mandatory contrast floor. No scope creep — only the two failing token color values were adjusted; all token names, other values, and structure match the plan exactly.

## Issues Encountered
The `font-serif` CSS variable is still referenced in 17 other stylesheets outside this plan's `files_modified` scope (engage, work, AboutSection, HeroSection, LeadMagnetStrip, PainSection, ProcessTimeline, ServicesPreview, SocialProof, LinkedInFeed, YouTubeFeed module CSS files). This is the accepted D-07/T-06-03 breakage documented in the plan's own threat_model ("Removing legacy token names breaks var() references across the other 35 stylesheets until Phase 8; this is intentional and no compatibility shim is added"). Task 2's acceptance criteria scoped the repo-wide grep specifically to "Playfair" (which returns clean), not "font-serif" — the broader `<verification>` section's item 3 grep for `font-serif` is an end-state check that only applies once Phase 8 completes the site-wide rollout, and is not achievable within this plan's declared `files_modified` (globals.css, layout.tsx only).

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Direction B token system is live in globals.css and ready for Phase 7's `/automate` page and Phase 8's site-wide rollout
- Playfair Display fully removed from the font pipeline; only Inter loads
- `npm run verify:contrast` and `npx vitest run tests/test-token-naming.test.ts` both green — safe baseline for future token additions
- 35 other stylesheets still reference removed legacy token names (`--bg-base`, `--gold`, `--text-*`, `--font-serif`) and will render broken until Phase 8 — this is the accepted, documented state per D-07, not a regression introduced here
- No blockers for 06-03 (palette review route)

---
*Phase: 06-palette-decision-token-foundation*
*Completed: 2026-08-02*

## Self-Check: PASSED

Verified `src/app/globals.css` and `src/app/layout.tsx` exist and contain expected changes. Verified commit hashes `2add31e`, `a48a0e9`, `4b8f1b1` are present in `git log --oneline`.
