---
phase: 06-palette-decision-token-foundation
reviewed: 2026-08-01T00:00:00Z
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
  warning: 3
  info: 2
  total: 7
status: issues_found
---

# Phase 06: Code Review Report

**Reviewed:** 2026-08-01T00:00:00Z
**Depth:** standard
**Files Reviewed:** 9
**Status:** issues_found

## Summary

Reviewed the palette-decision/token-foundation phase: the WCAG contrast verification script, the new semantic-scale design tokens in `globals.css`, the internal palette-review comparison page and its styles, `layout.tsx`, `Navigation.tsx`, and the three associated test files.

The token-naming and file-read-error tests are solid and the core luminance/contrast math in `verify-contrast.js` is correct (verified independently against the WCAG formula). However, two significant problems were found by computing real contrast ratios from the actual hex values in `globals.css` and `styles.module.css`:

1. `verify-contrast.js` never checks `--accent`, `--accent-hover`, `--accent-active` against any surface, despite these tokens being color tokens used as button backgrounds paired with light text. When independently computed, these pairings fail WCAG AA badly (as low as **1.90:1**, required 4.5:1).
2. The palette-review page (`page.tsx`) hardcodes a fabricated "Contrast Summary" table (e.g. Accent: "5.1:1 PASS") that does not match the real computed values for the actual token colors (2.17:1–3.48:1, i.e. FAIL). This gives a false sense that Direction B's accent color is accessible when it is not.

There is also a data-drift bug: `styles.module.css`'s `.colB` (documented as "canonical, selected") defines `--col-ink-3: #9A9087`, which does not match the canonical `--ink-3: #8B827A` in `globals.css`, and the drifted value actually fails the 3:1 floor against 3 of 4 surfaces.

## Structural Findings (fallow)

None provided for this review.

## Narrative Findings (AI reviewer)

## Critical Issues

### CR-01: verify-contrast.js never checks `--accent`/`--accent-hover`/`--accent-active` contrast, and the real values fail WCAG AA

**File:** `scripts/verify-contrast.js:60-79`
**Issue:** `checkContrast()` only classifies a token as "relevant" if it starts with `--ink-`, `--surface-`, or is `--success`/`--error`/`--warn` (lines 61-66). The accent tokens (`--accent`, `--accent-hover`, `--accent-active`) are silently excluded from the `colors` map and therefore never appear in `inks`, `surfaces`, or `semantics`, so no `checkPair()` call is ever made for them. These accent tokens are used in `styles.module.css` as button backgrounds paired with light surface-colored text (`.ctaButton { background: var(--col-accent); color: var(--col-surface-1); }` and equivalents for hover/active), i.e. exactly the kind of foreground/background pairing this script exists to validate.

Independently computing the real WCAG contrast ratio for the actual hex values in `globals.css` (`--accent: #C9A86D`, `--accent-hover: #B5985B`, `--accent-active: #A1854A`) against all four surface tokens gives:

```
accent  on surface-1..4: 2.17, 2.06, 1.90, 2.23
hover   on surface-1..4: 2.65, 2.52, 2.33, 2.73
active  on surface-1..4: 3.38, 3.21, 2.97, 3.48
```

All of these are well below the 4.5:1 WCAG AA threshold for normal text (and most are below even the 3:1 large-text threshold). Running `node scripts/verify-contrast.js` currently prints `✓ All text/surface pairings pass WCAG AA`, which is misleading — a real, significant accessibility failure exists in the interactive/CTA color tokens and the tool that is supposed to catch it does not check them at all.

**Fix:** Include accent tokens in the relevance filter and check them against surfaces (and/or against each other, depending on where they're used as text vs. background):
```js
const isRelevant =
  name.startsWith("--ink-") ||
  name.startsWith("--surface-") ||
  name.startsWith("--accent") ||
  name === "--success" ||
  name === "--error" ||
  name === "--warn";
```
Then either fix the actual accent color values so real contrast passes 4.5:1 against the surfaces they're paired with, or restrict accent-as-background usage to large/bold text only (and adjust the required ratio accordingly), or use `--ink-1` instead of `--col-surface-1` as CTA text color if accent is meant to be a light button background.

### CR-02: palette-review page displays fabricated contrast numbers that contradict the real, computed values

**File:** `src/app/internal/palette-review/page.tsx:22-31`
**Issue:** `contrastRows` hardcodes static strings for every token/direction pairing (e.g. `{ label: "Accent", a: "5.1:1", b: "4.9:1", c: "4.8:1", floor: 4.5 }`), which are then rendered through `ratioPasses()` and shown as "PASS" in the UI (lines 117-131). These numbers are not derived from the actual color values defined in `styles.module.css`/`globals.css` — they appear to be placeholder/estimated values.

Independently computing the real contrast ratio for Direction B's actual accent color (`#C9A86D`) against its surfaces yields a maximum of ~3.48:1 (accent-active on surface-4), not the claimed 4.9:1. The page therefore displays "PASS" for a pairing that actually fails WCAG AA by a wide margin, actively misleading whoever uses this page to make the "Direction B (Selected)" accessibility decision. Given the page's own instructions state "Compare contrast... Direction B is auto-selected," this false data directly undermines the page's stated purpose.

**Fix:** Compute the contrast rows from the real token values instead of hardcoding them — e.g. reuse `getRelativeLuminance`/`getContrastRatio` from `scripts/verify-contrast.js` (or a shared util) against the actual `--col-*` hex values defined per-direction in `styles.module.css`, so the displayed ratios always reflect reality:
```ts
import { getContrastRatio, getRelativeLuminance } from "../../../../scripts/verify-contrast";
// derive `a`/`b`/`c` ratio strings from the actual colA/colB/colC hex values
```

## Warnings

### WR-01: `.colB` ink-3 value drifts from the canonical `--ink-3` token and fails the accessibility floor

**File:** `src/app/internal/palette-review/styles.module.css:83`
**Issue:** `.colB` is commented "canonical, selected" (line 75) and its other tokens (`surface-1..4`, `ink-1`, `ink-2`, `accent*`) exactly match `globals.css`'s `:root` values. However `--col-ink-3: #9A9087` does not match `globals.css`'s `--ink-3: #8B827A`. Computing real contrast for each value:

```
globals --ink-3 (#8B827A) vs surfaces: 3.62, 3.44, 3.18, 3.73   (passes 3:1 floor)
colB    --col-ink-3 (#9A9087) vs surfaces: 3.00, 2.86, 2.64, 3.10  (FAILS 3:1 floor on 3 of 4 surfaces)
```

The "selected canonical" direction shown in the internal review tool uses a color that fails the very floor the page is supposed to validate, while the actual shipped token in `globals.css` passes. This is a drift/inconsistency bug between the two files representing the same design decision.

**Fix:** Update `.colB`'s `--col-ink-3` to `#8B827A` to match the canonical `globals.css` value, or vice versa if `#8B827A` was itself a later, unreviewed change.

### WR-02: Unparseable/missing color tokens are silently excluded from contrast checking instead of failing loudly

**File:** `scripts/verify-contrast.js:68-73`
**Issue:** In the `colors` collection loop, if `parseColor(value)` returns `null` or a value without `.values` (e.g. a typo in a hex value, or a color function `parse-css-color` doesn't support), the token is simply skipped (`if (parsed && parsed.values) { ... }`) with no warning or error. Since `inks`/`surfaces`/`semantics` are derived from `Object.keys(colors)` (lines 75-79), a broken/unparseable ink or surface token silently disappears from all contrast checks rather than causing the script to fail. This defeats the purpose of a CI-style gate: a future contributor who introduces a bad token value (e.g. a malformed hex code) would see `✓ All text/surface pairings pass WCAG AA` even though that token was never actually verified.

**Fix:** Track and report tokens that were expected to be checked but failed to parse:
```js
if (parsed && parsed.values) {
  colors[name] = parsed.values.slice(0, 3).map((v) => Math.round(v));
} else {
  failures.push(`${name}: unable to parse color value "${value}"`);
}
```
(Adjust to keep failures array scoped correctly since this happens before `checkContrast`'s `failures` array is created — move the parse step inside `checkContrast` or thread the errors through.)

### WR-03: Duplicate/conflicting `--font-sans` custom property definition

**File:** `src/app/globals.css:59`, `src/app/layout.tsx:8,48`
**Issue:** `globals.css` defines `--font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;` at `:root` (line 59), and `body { font-family: var(--font-sans); }` (line 86) consumes it. Separately, `layout.tsx` configures `next/font`'s `Inter` loader with `variable: "--font-sans"` (line 8) and applies `inter.variable` as the `<body>` className (line 48). Because the `next/font` variable class sets `--font-sans` directly on the `body` element, it takes precedence over the inherited `:root` declaration for every element inside `body` — meaning the `globals.css` fallback stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`) is effectively dead code and never actually used at runtime. There are now two different, disagreeing sources of truth for the same custom property name.

**Fix:** Pick one source. Either remove the `--font-sans` declaration from `globals.css`'s `:root` (since `next/font` always overrides it on `body`), or drop the `variable: "--font-sans"` option from the `next/font` loader and apply `inter.className` instead, keeping `globals.css` as the single source of the font stack.

## Info

### IN-01: `PaletteReviewPage()` test calls the component as a plain function with a weak assertion

**File:** `tests/test-palette-review-route.test.ts:14-17`
**Issue:** The test calls `PaletteReviewPage()` directly (not through a renderer like React Testing Library) and only asserts `expect(element).toBeTruthy()`. This confirms the function doesn't throw and returns a non-falsy React element object, but does not verify any actual DOM structure, that the tokens/hardcoded contrast rows render correctly, or catch the fabricated-data issue described in CR-02.

**Fix:** Consider rendering with `@testing-library/react` and asserting on visible text/roles if stronger coverage is desired; at minimum, note in a comment that this is a smoke test only, not a rendering/content test.

### IN-02: Magic number `88`/`72` for nav-offset padding

**File:** `src/app/globals.css:145,159`
**Issue:** `.nav-offset` hardcodes `padding-top: 88px;` (and `72px` in the mobile media query) as a "Top spacer matching the fixed nav height." These values aren't derived from the new spacing token scale (`--spacing-1` through `--spacing-6`) introduced in this phase, and nothing ties them programmatically to the actual nav height in `Navigation.module.css` (not in review scope), so a future nav height change would silently desync this spacer.

**Fix:** If the token foundation from this phase is meant to be the single source of truth for spacing, consider expressing the nav offset as a CSS custom property computed from the actual nav height (or documenting explicitly why it's an exception to the token system).

---

_Reviewed: 2026-08-01T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
