---
phase: 06-palette-decision-token-foundation
reviewed: 2026-08-05T11:20:00Z
depth: standard
files_reviewed: 9
files_reviewed_list:
  - scripts/verify-contrast.js
  - src/app/globals.css
  - src/app/internal/palette-review/page.tsx
  - src/app/internal/palette-review/styles.module.css
  - src/app/layout.tsx
  - src/components/Navigation.tsx
  - tests/test-contrast-verification.test.js
  - tests/test-palette-review-route.test.ts
  - tests/test-token-naming.test.ts
findings:
  critical: 2
  warning: 4
  info: 3
  total: 9
status: issues_found
---

# Phase 06: Code Review Report

**Reviewed:** 2026-08-05T11:20:00Z
**Depth:** standard
**Files Reviewed:** 9
**Status:** issues_found

## Summary

Re-reviewed the palette-decision/token-foundation phase (WCAG contrast verification script, the new semantic-scale design tokens in `globals.css`, the internal palette-review comparison page and its styles, `layout.tsx`, `Navigation.tsx`, and the three associated test files). Test suites pass (`53/53`) and `node scripts/verify-contrast.js` reports a clean pass, but that pass is misleading: independently recomputing WCAG contrast ratios from the actual hex values in `globals.css` and `styles.module.css` (using the script's own `getRelativeLuminance`/`getContrastRatio` functions) shows that a whole category of color tokens is never checked, and the pairing that category represents actually fails WCAG AA badly across all three compared directions, including the "selected" one. The internal review page's "Contrast Summary" table further compounds this by displaying hand-typed numbers that do not match the real computed values for the colors it renders, giving a false impression that the accessibility question was settled. There is also a value drift between the production `--ink-3` token and the "canonical, selected" swatch used to make that same decision, and a dead/duplicate `--font-sans` definition. None of this was caught by the existing test suite, because none of the tests independently verify computed ratios against the actual shipped/reviewed color values.

## Critical Issues

### CR-01: `verify-contrast.js` never checks `--accent`/`--accent-hover`/`--accent-active`, and the real values fail WCAG AA

**File:** `scripts/verify-contrast.js:61-66`
**Issue:** `checkContrast()`'s relevance filter only admits tokens starting with `--ink-`, `--surface-`, or exactly `--success`/`--error`/`--warn`. The accent tokens (`--accent`, `--accent-hover`, `--accent-active`) are silently excluded from the `colors` map and therefore never enter `inks`/`surfaces`/`semantics`, so `checkPair()` is never called for them. These are color tokens used as button backgrounds paired with light surface-colored text (`.ctaButton { background: var(--col-accent); color: var(--col-surface-1); }` and hover/active equivalents in `styles.module.css:163-191`) — exactly the foreground/background pairing this script exists to validate.

Independently computing the real WCAG contrast ratio for the shipped hex values (`--accent: #C9A86D`, `--accent-hover: #B5985B`, `--accent-active: #A1854A`) against the four surface tokens gives:

```
accent  vs surface-1..4: 2.17, ~2.1, ~1.9-2.1, 2.23
hover   vs surface-1..4: 2.65, ~2.5, ~2.3-2.5, 2.73
active  vs surface-1..4: 3.38, ~3.2, ~3.0-3.2, 3.48
```

All of these are well below the 4.5:1 AA text-contrast threshold, and most are below even the 3:1 large-text threshold. Yet `node scripts/verify-contrast.js` currently prints `✓ All text/surface pairings pass WCAG AA` (verified by running it) — a real, significant accessibility failure exists in the CTA color tokens and the tool that should catch it silently skips the category entirely.

**Fix:** Include accent tokens in the relevance filter and check them against the surfaces (or ink tokens) they're actually composited with:
```js
const isRelevant =
  name.startsWith("--ink-") ||
  name.startsWith("--surface-") ||
  name.startsWith("--accent") ||
  name === "--success" ||
  name === "--error" ||
  name === "--warn";
...
const accents = Object.keys(colors).filter((k) => k.startsWith("--accent"));
accents.forEach((accent) => {
  surfaces.forEach((surface) => checkPair(accent, surface, 4.5));
});
```
Then either adjust the accent colors so the actual foreground/background pairing reaches 4.5:1, or change CTA text color to a darker ink token if accent must stay light.

### CR-02: `/internal/palette-review` "Contrast Summary" table shows fabricated numbers that contradict the real computed contrast of the colors it displays

**File:** `src/app/internal/palette-review/page.tsx:21-31`
**Issue:** `contrastRows` is a hand-typed array of ratio strings (e.g. `Accent: a "5.1:1", b "4.9:1", c "4.8:1"`, `Ink 3: a/b/c "4.5:1"`) rendered through `ratioPasses()` and shown as PASS/FAIL (lines 117-131). These values are not derived from the actual `--col-*` hex values defined in `styles.module.css`. Recomputing the real contrast for the exact colors used in each column:

- `--col-accent` vs its own direction's surfaces: A ≈ 3.05–3.20, B ≈ 2.17–2.23, C ≈ 2.02–2.08 — nowhere near the claimed 4.8–5.1:1 PASS; the actual worst-performing pairing of the three directions (B) is the one the page presents as having "best contrast" (`page.tsx:46`).
- `--col-ink-3` vs its own direction's surfaces: A ≈ 2.19–2.62, B ≈ 3.00–3.73 (using the swatch's own value, see WR-01), C ≈ 2.98–3.55 — none uniformly reach the claimed 4.5:1, and several fall below even the stated 3:1 floor.

Since this page's stated purpose is to justify "Direction B (Selected)... best contrast," and the underlying numbers are fabricated rather than computed, the accessibility conclusion this page is presenting is not supported by the actual token values.

**Fix:** Generate the table from the real token values instead of hardcoding strings — reuse `getRelativeLuminance`/`getContrastRatio` from `scripts/verify-contrast.js` against the actual per-direction hex values in `styles.module.css`, so displayed ratios always reflect reality and can't silently drift from the colors being compared.

## Warnings

### WR-01: `.colB`'s `--col-ink-3` value drifts from the production `--ink-3` token, and the drifted value fails the accessibility floor

**File:** `src/app/globals.css:11`, `src/app/internal/palette-review/styles.module.css:83`
**Issue:** `globals.css` (the file that ships) defines `--ink-3: #8B827A`. `styles.module.css`'s `.colB` block, commented `/* Direction B color overrides (canonical, selected) */`, defines a different value: `--col-ink-3: #9A9087`. Every other token in `.colB` (`surface-1..4`, `ink-1`, `ink-2`, `accent*`) matches `globals.css` exactly — only `ink-3` diverges. Computing real contrast for both:

```
globals --ink-3   (#8B827A) vs surfaces: 3.62, 3.44, 3.18, 3.73   (passes 3:1 floor on all 4)
colB    --col-ink-3 (#9A9087) vs surfaces: 3.00, 2.86, 2.64, 3.10   (FAILS 3:1 floor on 2 of 4)
```

The "canonical, selected" swatch used to make the design decision uses a color that fails the very accessibility floor the review page exists to validate, while the value actually shipped in `globals.css` passes. Whichever is correct, the decision record (comparison UI) and the shipped tokens currently disagree about what "Direction B" is.

**Fix:** Update `.colB`'s `--col-ink-3` to `#8B827A` to match `globals.css`, or vice versa if `#8B827A` was a later, unreviewed change — and add a check (e.g. a test) that fails if the two files' color values for the selected direction ever diverge again.

### WR-02: `checkContrast` silently drops tokens whose color value fails to parse instead of failing loudly

**File:** `scripts/verify-contrast.js:69-73`
**Issue:** In the `colors` collection loop, if `parseColor(value)` returns `null` or a result without `.values` (a typo'd hex, or a color function `parse-css-color` doesn't support), the token is simply skipped: `if (parsed && parsed.values) { ... }` with no warning. Because `inks`/`surfaces`/`semantics` (lines 75-79) are derived from `Object.keys(colors)`, a broken/unparseable ink or surface token disappears from every contrast check rather than causing the script to fail. A future contributor who introduces a malformed token value would still see `✓ All text/surface pairings pass WCAG AA`, because that token was silently never checked.
**Fix:** Report tokens that were expected to be checked but failed to parse, e.g. push a failure/warning for any `isRelevant` token whose `parseColor` result is falsy, so parsing failures are visible instead of silently reducing coverage.

### WR-03: Duplicate, conflicting `--font-sans` custom property definition

**File:** `src/app/globals.css:59`, `src/app/layout.tsx:8,48`
**Issue:** `globals.css` defines `--font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;` at `:root` (line 59), consumed by `body { font-family: var(--font-sans); }` (line 86). Separately, `layout.tsx` configures `next/font`'s `Inter` loader with `variable: "--font-sans"` (line 8) and applies `inter.variable` as the `<body>` className (line 48). The `next/font` variable class sets `--font-sans` directly on `<body>`, overriding the `:root` declaration for everything inside it — so the `globals.css` fallback stack is dead code that never actually applies at runtime, and there are now two disagreeing sources of truth for the same custom property name.
**Fix:** Pick one source: remove the `--font-sans` declaration from `globals.css`'s `:root` (since `next/font` always overrides it on `body`), or drop `variable: "--font-sans"` from the `next/font` loader and use `inter.className` directly, keeping `globals.css` as the single source of the font stack.

### WR-04: Internal review page inherits full marketing chrome (animated particle background + footer) from the root layout

**File:** `src/app/layout.tsx:46-57`, `src/components/Navigation.tsx:17-19`
**Issue:** `RootLayout` unconditionally renders `<ParticleWave />` and `<Footer />` around `{children}` for every route. `Navigation.tsx` already special-cases `/internal` routes to hide the nav (`if (pathname.startsWith("/internal")) return null;`), showing that internal-only chrome suppression is a known concern for this page — but the same treatment wasn't extended to `ParticleWave` or `Footer`. The result is that an internal QA/comparison tool, whose entire purpose is precise side-by-side visual/color comparison, renders on top of the full animated marketing background and marketing footer.
**Fix:** Extend the same route-based suppression already used in `Navigation.tsx` to `ParticleWave` and `Footer` (a shared `isInternalRoute` helper, or move `/internal/*` to its own route group/layout).

## Info

### IN-01: `PaletteReviewPage()` test calls the component as a plain function with only a truthiness assertion

**File:** `tests/test-palette-review-route.test.ts:14-17`
**Issue:** The test calls `PaletteReviewPage()` directly (not via a renderer like React Testing Library) and only asserts `expect(element).toBeTruthy()`. This confirms the function doesn't throw and returns a non-falsy object, but verifies no DOM structure or content, and would not have caught the fabricated contrast data in CR-02.
**Fix:** Consider rendering with `@testing-library/react` and asserting on visible text/roles for stronger coverage; at minimum, comment that this is a smoke test only.

### IN-02: Magic numbers `88`/`72` for `.nav-offset` padding aren't tied to the new spacing token scale

**File:** `src/app/globals.css:145,159`
**Issue:** `.nav-offset` hardcodes `padding-top: 88px;` (`72px` in the mobile media query) as a "Top spacer matching the fixed nav height." These values aren't expressed via the new `--spacing-*` token scale introduced in this phase, and nothing ties them programmatically to the actual nav height in `Navigation.module.css`, so a future nav height change would silently desync this spacer.
**Fix:** If this phase's token foundation is meant to be the single source of truth for spacing, express the nav offset via a CSS custom property computed from the actual nav height, or document explicitly why it's an exception.

### IN-03: `verify-contrast.js` hardcodes the tokens file path relative to `process.cwd()`

**File:** `scripts/verify-contrast.js:10`
**Issue:** `GLOBALS_CSS_PATH = "src/app/globals.css"` is only correct when the script is invoked from the repo root. There's no guard or `path.resolve(__dirname, ...)`, so running it from a different working directory would surface the generic "Unable to read design tokens file" error instead of a clearer misconfiguration message.
**Fix:** Resolve relative to the script's own location, e.g. `path.resolve(__dirname, "..", "src/app/globals.css")`.

---

_Reviewed: 2026-08-05T11:20:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
