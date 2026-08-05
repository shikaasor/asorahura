---
phase: 06-palette-decision-token-foundation
fixed_at: 2026-08-05T12:00:00Z
review_path: .planning/phases/06-palette-decision-token-foundation/06-REVIEW.md
iteration: 1
findings_in_scope: 6
fixed: 6
skipped: 0
status: all_fixed
---

# Phase 06: Code Review Fix Report

**Fixed at:** 2026-08-05T12:00:00Z
**Source review:** .planning/phases/06-palette-decision-token-foundation/06-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope: 6 (2 critical, 4 warning; fix_scope: critical_warning, Info findings excluded)
- Fixed: 6
- Skipped: 0

## Fixed Issues

### CR-01: `verify-contrast.js` never checks `--accent`/`--accent-hover`/`--accent-active`, and the real values fail WCAG AA

**Files modified:** `scripts/verify-contrast.js`
**Commit:** 9e14489
**Status:** fixed: requires human verification
**Applied fix:** Added `--accent` prefix to the relevance filter and added an `accents.forEach(...) -> surfaces.forEach(...)` check loop (4.5:1 threshold), matching how `--col-accent` is actually used as foreground text/border color in the palette-review page's outlined CTA button. `node scripts/verify-contrast.js` now correctly reports the real accent-vs-surface contrast failures instead of silently skipping the category.

**Note for human follow-up:** With the script gap fixed, `npm run verify:contrast` will now correctly fail — the real accent hex values (`#C9A86D`/`#B5985B`/`#A1854A`) do not reach 4.5:1 against the surface tokens (recomputed range ~1.9–3.5:1). This is a real design/brand-color decision (darken the accent tokens, or restrict where accent is used as body/border text) that requires a human designer's call — not applied here since it would alter shipped brand colors beyond the scope of a mechanical fix. Flagging as **requires human verification.**

### CR-02: `/internal/palette-review` "Contrast Summary" table shows fabricated numbers that contradict the real computed contrast of the colors it displays

**Files modified:** `src/app/internal/palette-review/page.tsx`
**Commit:** 6eace53
**Status:** fixed: requires human verification
**Applied fix:** Replaced the hand-typed `contrastRows` ratio strings with values computed at render time from each direction's actual hex swatches (`DIRECTION_COLORS`, mirrored from `styles.module.css`'s `.colA`/`.colB`/`.colC` blocks), using the same WCAG relative-luminance/contrast-ratio formulas as `scripts/verify-contrast.js`. Each row now shows the worst-case ratio across that direction's 4 surfaces, so PASS/FAIL always reflects reality instead of a hardcoded guess. `colB`'s `ink3` value used in the computation matches the WR-01 sync fix (`#8B827A`).

**Note for human follow-up:** The table will now honestly report several FAIL rows (e.g. Accent, Accent Hover for some directions) that the old fabricated table hid. The `directions` array's "best contrast" note (line ~152) was left untouched (out of scope for this finding) but now visibly disagrees with the honest data — flagging as **requires human verification** for the overall design-direction decision.

### WR-01: `.colB`'s `--col-ink-3` value drifts from the production `--ink-3` token

**Files modified:** `src/app/internal/palette-review/styles.module.css`
**Commit:** 65e25e9
**Applied fix:** Changed `.colB`'s `--col-ink-3` from `#9A9087` to `#8B827A` to match the value actually shipped in `globals.css`. Did not add a regression test for future divergence (secondary suggestion in the Fix section); primary value-sync applied.

### WR-02: `checkContrast` silently drops tokens whose color value fails to parse

**Files modified:** `scripts/verify-contrast.js`
**Commit:** 535433a
**Applied fix:** Moved `failures` array initialization above the token-collection loop and push a `"{name}: unable to parse color value, skipping contrast check"` entry whenever a relevant token's value fails `parseColor`, so parsing failures now surface as script failures instead of silently reducing check coverage.

### WR-03: Duplicate, conflicting `--font-sans` custom property definition

**Files modified:** `src/app/globals.css`
**Commit:** af10d2c
**Applied fix:** Removed the dead `--font-sans` declaration from `:root` in `globals.css` (it was always overridden by `next/font`'s `inter.variable` class on `<body>`). `next/font` remains the single source of truth; `body { font-family: var(--font-sans); }` still resolves correctly via the variable class next/font applies.

### WR-04: Internal review page inherits full marketing chrome (animated particle background + footer)

**Files modified:** `src/app/layout.tsx`, `src/components/RouteChrome.tsx` (new)
**Commit:** efd9927
**Applied fix:** Added a new `RouteChrome` client component that reuses the same `pathname.startsWith("/internal")` check already used in `Navigation.tsx`, and wrapped `<ParticleWave />` and `<Footer />` in `layout.tsx` with it, so both are suppressed on `/internal/*` routes without touching `ParticleWave`/`Footer` internals.

## Skipped Issues

None — all in-scope findings were fixed.

---

_Fixed: 2026-08-05T12:00:00Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
