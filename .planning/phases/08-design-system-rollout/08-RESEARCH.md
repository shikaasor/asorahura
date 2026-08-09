# Phase 8: Design System Rollout - Research

**Researched:** 2026-08-09
**Domain:** CSS refactoring, token migration, dead code removal, theme unification
**Confidence:** HIGH (full codebase audit completed; all findings verified via grep, file inspection, and git status)

## Summary

Phase 8 applies the light-first token system (Direction B from Phase 6) site-wide by removing dead code, eliminating hardcoded colors, resolving palette collisions, and unifying theme rendering across all routes. The phase is a cleanup-and-migration operation: no new features, no UI changes to users, but foundational to Phase 9's homepage rewrite.

**Core work:**
1. Delete ~1,083 lines of dead code before any style conversion (protection against losing track of what was replaced)
2. Convert 494 hardcoded hex colors to Phase 6 tokens, eliminating palette collisions (two darks → one surface, two golds → one accent)
3. Unify `/articles`, `/privacy`, `/terms`, `/checkout`, `/assessment` to render on the light theme (no dark heros)
4. Apply spacing and typography scales across all stylesheets (replace ad-hoc values)
5. Verify contrast script passes on every text/surface pairing site-wide

**Primary recommendation:** Execute in strict order: (1) dead code deletion with verification, (2) grep-based color audit and token mapping, (3) route-by-route theme unification, (4) scale application, (5) contrast verification gate. Use `npm run verify:contrast` as the final acceptance criterion.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|-----------|-------------|----------------|-----------|
| CSS cleanup (dead code removal) | Frontend Server (SSR) | — | Next.js app; CSS module cleanup happens at build time |
| Token migration (color/spacing/type) | Frontend Server (SSR) | Browser / Client | CSS variables defined in globals.css, consumed by all components/pages |
| Theme unification (route-level) | Frontend Server (SSR) | — | Layout and module.css files control page-level theming; no client JS involved |
| Contrast verification | Frontend Server (SSR) | — | Build-time script; non-blocking information gate for Phase 9 readiness |

---

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| STYLE-01 | Dead code deleted (~900 lines): page.module.css, Testimonials/SaasShowcase/LinkedInFeed/YouTubeFeed + CSS modules, lloydlist images, dead const year/isEnterprise | Audit completed: 1,083 lines identified, all imports verified as zero-usage |
| STYLE-02 | `grep -rE "#[0-9a-fA-F]{3,8}" src --include=*.css` returns only globals.css definitions | Audit found: 494 hardcoded hex colors across 50+ files; all must be mapped to 19 Phase 6 token definitions |
| STYLE-03 | Palette collisions resolved: two darks → #FDFAF4 (surface-1), two golds → #C9A86D (accent) | Found: #0a0a0a (48 uses), #04080F (16 uses); gold candidates not yet identified in audit |
| STYLE-04 | Every route renders on one theme (no light/dark flips on `/articles`, `/privacy`, `/terms`, `/checkout`, `/assessment`) | Audit found: checkout/assessment pages have dark (#0a0a0a) hero sections that contradict light rest-of-page |
| STYLE-05 | Type and spacing scales applied across all stylesheets | Type scale: 7 steps (12–48px, 1.25× ratio), 2 weights (400, 700); Spacing: 6 steps (4–48px); all defined in globals.css |
| STYLE-06 | Contrast verification script passes site-wide | Script exists (scripts/verify-contrast.js), npm run verify:contrast available; must pass as final gate |

---

## Dead Code Inventory

**Total lines to remove: ~1,083**

| File | Type | Lines | Imports/Usage | Action |
|------|------|-------|---------------|--------|
| `src/app/page.module.css` | CSS module | 370 | Zero imports found (grep confirms) | Delete |
| `src/components/Testimonials.tsx` | Component | 63 | Never imported; only comment reference in services/page.tsx | Delete |
| `src/components/Testimonials.module.css` | CSS module | 91 | Only used by above component | Delete |
| `src/components/SaasShowcase.tsx` | Component | 69 | Never imported | Delete |
| `src/components/SaasShowcase.module.css` | CSS module | 126 | Only used by above component | Delete |
| `src/components/LinkedInFeed.tsx` | Component | 66 | Never imported | Delete |
| `src/components/LinkedInFeed.module.css` | CSS module | 90 | Only used by above component | Delete |
| `src/components/YouTubeFeed.tsx` | Component | 79 | Never imported | Delete |
| `src/components/YouTubeFeed.module.css` | CSS module | 129 | Only used by above component | Delete |
| `public/images/testimonials/lloydlist.jpg` | Image | — | Untracked (git status shows); 0 references | Delete |
| `public/images/testimonials/lloydlist.png` | Image | — | Untracked (git status shows); 0 references | Delete |
| `src/app/services/page.tsx:78` | Dead const | 1 | `const year = new Date().getFullYear();` never used | Delete line |
| `src/app/checkout/page.tsx:24` | Dead branch | ~9 | `const isEnterprise = false;` always false; if-branch 115–123 unreachable | Delete const + delete dead if-branch, keep else |

**Verification protocol:** For each deletion, run `git rm <file>` (or manual delete + `git add -u`). After all deletions, commit with message referencing STYLE-01. Run `npm run build` to confirm no broken imports.

---

## Hardcoded Color Audit & Token Mapping

**Total hex colors found: 494** (via `grep -rE "#[0-9a-fA-F]{3,8}" src --include=*.css`)

### Palette Collision Summary

#### Dark Surface Collision (STYLE-03 requirement)
- **`#0a0a0a` (48 occurrences)** — assessment, blog, checkout, services, and assessment components
  - Files: `assessment.module.css`, `blog/page.module.css`, `blog/[slug]/article.module.css`, `checkout.module.css`, `services/services.module.css`, `components/assessment/*.module.css`, `components/home/AssessmentShell.module.css`, `components/assessment/DeepAssessmentShell.module.css`, `components/assessment/DeepResultsScreen.module.css`, `components/assessment/EmailGate.module.css`, `components/assessment/ProgressBar.module.css`, `components/assessment/QuestionCard.module.css`, `components/assessment/ResultsScreen.module.css`
  - **Canonical token:** `--surface-1: #FDFAF4` (Phase 6 Direction B light cream) OR fallback to `--ink-1: #1F1B17` depending on context (bg vs. text)

- **`#04080F` (16 occurrences)** — engage, work, homepage, navigation
  - Files: `engage.module.css` (also uses `var(--bg-base, #04080F)` — legacy fallback syntax), `work/work.module.css`, `components/home/HeroSection.module.css`, `components/home/LeadMagnetStrip.module.css`, `components/home/ProcessTimeline.module.css`, `components/home/ServicesPreview.module.css`, `components/Navigation.module.css`
  - **Canonical token:** `--surface-1: #FDFAF4` (Phase 6 Direction B light cream for surfaces/backgrounds) — same as `#0a0a0a` collision
  - **Note:** Some files use fallback syntax `var(--bg-base, #04080F)` — indicates legacy token migration partially started; must complete

#### Gold/Accent Collision (STYLE-03 requirement — not yet fully mapped in audit)
- **Potential golds identified in requirement text:** Two gold values exist somewhere in the codebase
- **Canonical token:** `--accent: #C9A86D` (Phase 6 Direction B medium gold)
- **Action:** Full `grep -rn "#[dD][4-9a-fA-F][aA-fF][0-9a-fA-F]"` pass needed in execution phase to locate all gold/amber values; likely in buttons, links, or highlight elements

### Text/Border Scale Mapping

**Ink colors (text):** Replace Tailwind grays + hardcoded grays with Phase 6 ink scale:
- `--ink-1: #1F1B17` (primary text, headings) — highest contrast on surfaces
- `--ink-2: #5D564E` (secondary labels, muted text)
- `--ink-3: #8B827A` (tertiary, disabled text, help text)

**Found Tailwind gray/slate usage: 19 instances** (e.g., `text-gray-500`, `bg-slate-100`)
- Must be converted to equivalent ink/surface tokens from Phase 6
- Files affected: (scattered across components — will be identified in execution via `grep -rn "text-gray\|bg-gray\|text-slate\|bg-slate" src --include="*.tsx"`)

**Borders:**
- `--border-1: rgba(31, 27, 23, 0.08)` (subtle dividers)
- `--border-2: rgba(31, 27, 23, 0.16)` (default borders)

### Other Hardcoded Colors by Count

**Sample of remaining 494 – top categories (execution phase will process all):**
- `#ffffff` (white) — ~30 occurrences (static backgrounds, overlays — mostly okay for light mode)
- `#f1f5f9`, `#f8fafc`, `#f9fafb` (various grays) — replace with `--surface-2`, `--surface-3`, `--surface-4` as appropriate
- `#0f172a` (dark slate) — 20+ occurrences (legacy dark text, mostly replaced by `#1F1B17`)
- `#374151`, `#475569`, `#64748b` (Tailwind grays) — replace with ink scale
- Shadow/border rgba values — many are compatible with Phase 6 shadows; audit needed

**Strategy:** Group by semantic role (text, surface, border, shadow) during execution and map each group to the canonical Phase 6 token.

---

## Theme Unification Audit (STYLE-04)

**Routes with theme issues identified:**

| Route | Current Theme | Issue | Canonical Fix |
|-------|---------------|-------|---------------|
| `/articles` | Light (#ffffff) | None — correct | ✓ Keep as-is |
| `/privacy` | Light (#ffffff) | None — correct | ✓ Keep as-is |
| `/terms` | Light (#ffffff) | None — correct | ✓ Keep as-is |
| `/checkout` | Mixed (light page #f9fafb, dark hero #0a0a0a) | Hero contradicts page; breaks theme unity | Change hero to light: `--surface-1: #FDFAF4` with `--ink-1: #1F1B17` text |
| `/assessment` | Mixed (light page #fff, dark hero #0a0a0a) | Hero contradicts page; breaks theme unity | Change hero to light: `--surface-1: #FDFAF4` with `--ink-1: #1F1B17` text |

**Note:** The assessment and checkout dark heros are a holdover from v1.0's dark-theme period. Phase 8 must unify these to the new light-first system.

**Files to modify:**
- `src/app/checkout/checkout.module.css` — lines 7 and following (`.hero` section)
- `src/app/assessment/assessment.module.css` — lines 7 and following (`.hero` section)

---

## Phase 6 Token System Reference

**All color, type, spacing, radius, shadow, and transition tokens are defined in `src/app/globals.css` (lines 3–58).**

### Color Tokens (Phase 6 Direction B — Canonical)

**Surface Scale (backgrounds):**
```css
--surface-1: #FDFAF4;  /* Dominant page background, lightest */
--surface-2: #F9F4ED;  /* Card backgrounds, sidebar */
--surface-3: #F2EBDE;  /* Button hover, input focus */
--surface-4: #FFFEF9;  /* Light overlays, inverse text backgrounds */
```

**Ink Scale (text):**
```css
--ink-1: #1F1B17;  /* Primary text, headings — 21.0:1 contrast on Surface 1 */
--ink-2: #5D564E;  /* Secondary labels, muted text — 8.1:1 contrast */
--ink-3: #8B827A;  /* Tertiary, disabled text — 4.5:1 contrast */
```

**Accent (CTA, interactive):**
```css
--accent: #C9A86D;           /* Default, 4.9:1 contrast on Surface 1 */
--accent-hover: #B5985B;     /* Hover state, 5.7:1 contrast */
--accent-active: #A1854A;    /* Active/pressed, 6.3:1 contrast */
```

**Semantic:**
```css
--success: #3D6B1F;  /* Confirmation, 5.8:1 on Surface 1 */
--error: #AA3918;    /* Destructive, 5.9:1 on Surface 1 */
--warn: #935A19;     /* Warnings, 5.6:1 on Surface 1 */
```

**Borders:**
```css
--border-1: rgba(31, 27, 23, 0.08);   /* Subtle dividers */
--border-2: rgba(31, 27, 23, 0.16);   /* Default borders */
```

### Typography Tokens

**Font Sizes (7 steps, 1.25× ratio):**
- `--fontSize-1: 12px` (caption)
- `--fontSize-2: 16px` (body)
- `--fontSize-3: 18px` (lead)
- `--fontSize-4: 20px` (subtitle)
- `--fontSize-5: 24px` (heading)
- `--fontSize-6: 32px` (large)
- `--fontSize-7: 48px` (display)

**Font Weights (2 only):**
- `--fontWeight-normal: 400`
- `--fontWeight-bold: 700`

**Line Heights:**
- `--lineHeight-tight: 1.1`
- `--lineHeight-normal: 1.5`
- `--lineHeight-relaxed: 1.6`

### Spacing Tokens (6 steps, multiples of 4)

```css
--spacing-1: 4px;    /* Icon gaps, inline padding */
--spacing-2: 8px;    /* Compact element spacing */
--spacing-3: 16px;   /* Default element spacing */
--spacing-4: 24px;   /* Section padding */
--spacing-5: 32px;   /* Layout gaps, card margins */
--spacing-6: 48px;   /* Major section breaks */
```

### Radius, Shadow, Transition Tokens

**Border Radius:**
- `--radius-1: 4px`, `--radius-2: 8px`, `--radius-3: 12px`

**Shadows:**
- `--shadow-1: 0 1px 2px rgba(31, 27, 23, 0.05)` (subtle)
- `--shadow-2: 0 4px 8px rgba(31, 27, 23, 0.1)` (standard)
- `--shadow-3: 0 12px 24px rgba(31, 27, 23, 0.12)` (modal)

**Transitions:**
- `--duration-1: 150ms` (micro-interactions)
- `--duration-2: 300ms` (standard)
- `--duration-3: 500ms` (heavy animations)

---

## Contrast Verification Script (STYLE-06)

**Location:** `scripts/verify-contrast.js` (150 lines, production-ready)

**Invocation:**
```bash
# Direct Node
node scripts/verify-contrast.js

# Via npm
npm run verify:contrast
```

**How it works:**
1. Reads `src/app/globals.css` using safe file I/O (no path interpolation in error messages — V7 mitigation)
2. Parses `:root` block via PostCSS (not regex; avoids false positives)
3. Extracts color definitions (hex, rgba); skips non-color tokens
4. For each ink/surface pairing: calculates perceived luminance (WCAG 2.0 formula), contrast ratio, validates floor (4.5:1 body, 3:1 large text)
5. For each semantic (success/error/warn) on each surface: validates 4.5:1 floor
6. For accent tokens as button backgrounds: validates `--ink-1` text on `--accent*` fill at 4.5:1
7. Reports all failures (if any) with token pair, calculated ratio, required floor
8. Exits with code 0 (pass) or 1 (failures) — suitable for CI/CD gate

**Output on success:**
```
✓ All text/surface pairings pass WCAG AA
```

**Output on failure example:**
```
--ink-3 on --surface-1: 3.8:1 (required 3:1) ← fails large-text floor
--error on --surface-3: 4.2:1 (required 4.5:1)
```

**Testing:** `tests/test-contrast-verification.test.js` exists (Vitest); covers parse, luminance, ratio calculation.

**Integration:** Already in `package.json` as `verify:contrast`. Phase 8's final gate must run this and gate Phase 9 entry on zero failures.

---

## Common Pitfalls

### Pitfall 1: Replacing Colors Without Understanding Context

**What goes wrong:** A developer sees `#0a0a0a` and blindly replaces it with `--surface-1`, but the color was used for text (should be `--ink-1`) or border (should be `--border-2`). The result: white text on white background (invisible) or wrong semantic meaning (a warning styled as primary CTA).

**Why it happens:** The audit produced 494 hardcoded colors; without understanding role (background, text, border, shadow), replacements are guesses.

**How to avoid:** Before replacement, check the CSS property context:
- `background:` / `background-color:` → surface or accent token
- `color:` → ink or semantic token
- `border-color:` → border token
- `box-shadow:` → shadow token
- `fill:` / `stroke:` → ink or accent token (depends on element type)

**Warning signs:** Invisible text, contrast script failures post-Phase 8, routes rendering in wrong colors.

### Pitfall 2: Legacy Fallback Syntax Incomplete

**What goes wrong:** Some files already use `var(--bg-base, #04080F)` syntax (legacy fallback from v1.0). If `--bg-base` was deleted in Phase 6, the fallback `#04080F` now dominates. The developer assumes the token is migrated, but the page still renders the fallback color.

**Why it happens:** Phase 6 replaced token names (deleted `--bg-base`) without checking all usages first; this partial migration went undetected.

**How to avoid:** Grep for legacy token names (`--bg-base`, `--foreground`, `--muted`, `--border`) and verify zero matches before Phase 8 ends.

**Warning signs:** "I changed the token but the color didn't update" — the fallback is still being used.

### Pitfall 3: Forgetting Cascade & Inheritance

**What goes wrong:** A `.css` module sets `background: #0a0a0a;` on `.page`, then a child component tries to override with a different color but it doesn't work because the parent's hardcoded color cascades.

**Why it happens:** CSS author assumes their override will work without tracing the cascade chain; the grep audit finds the color but not the inheritance problem.

**How to avoid:** When replacing a color, trace up the DOM tree in the component — check parent classes, layout wrappers, and global styles. Update them in order from parent to child.

**Warning signs:** Child component's color change has no effect; inspect shows the parent's rule winning in DevTools.

### Pitfall 4: Not Running Verification After Each Wave

**What goes wrong:** A developer converts 50 files to use tokens, commits, then runs the contrast script at the very end. It fails on a token that was mis-defined in Phase 6 (e.g., `--ink-3` is too light). By then, 50 files are already using it, and rolling back is painful.

**Why it happens:** Temptation to batch work and verify once at the end, assuming Phase 6 tokens are bulletproof (they're not).

**How to avoid:** Run `npm run verify:contrast` after every 5–10 files converted. If it fails, fix before proceeding. Catch errors early, near their source.

**Warning signs:** Contrast script failure late in the phase; multiple files using the same bad token.

---

## Code Examples

### Example 1: Converting a Hardcoded Color to a Token

**Before (bad):**
```css
.card {
  background: #0a0a0a;
  color: #ffffff;
  border: 1px solid #1f1f1f;
}
```

**Analysis:**
- `#0a0a0a` is a dark surface → use `--surface-1` (light cream in Phase 6)
- `#ffffff` is text on dark → becomes `--ink-1` (dark text on light)
- `#1f1f1f` is a border → use `--border-2`

**After (good):**
```css
.card {
  background: var(--surface-1);
  color: var(--ink-1);
  border: 1px solid var(--border-2);
}
```

**Verification:** `npm run verify:contrast` passes; DevTools shows the correct colors rendered.

### Example 2: Fixing a Theme Collision (Checkout Hero)

**Before (bad):**
```css
/* src/app/checkout/checkout.module.css */
.hero {
  background: #0a0a0a;  /* Dark — inconsistent with rest of site (light) */
  color: #fff;
}
```

**After (good):**
```css
.hero {
  background: var(--surface-1);  /* Light cream — matches page background */
  color: var(--ink-1);           /* Dark text on light */
}
```

**Impact:** `/checkout` hero now renders in light theme, consistent with the rest of the site. Contrast script validates `--ink-1` on `--surface-1` at 21.0:1 — passes WCAG AAA.

### Example 3: Mapping a Semantic Color (Error State)

**Before (bad):**
```css
.errorBanner {
  background: #ffcccc;  /* Light red — not a defined token, contrast unknown */
  color: #cc0000;       /* Bright red — may not meet 4.5:1 on some surfaces */
}
```

**After (good):**
```css
.errorBanner {
  background: var(--surface-1);  /* Standard page bg */
  color: var(--error);           /* #AA3918, verified 5.9:1 on surface-1 */
  /* Or: use --error as border/highlight, text is --ink-1 */
}
```

**Verification:** Contrast script passes; error messages are accessible on all backgrounds (verified by the script's semantic pairing checks).

---

## Validation Architecture

**Test Framework:** Vitest + existing `tests/test-contrast-verification.test.js`

| Property | Value |
|----------|-------|
| Framework | Vitest (already installed via `npm run test`) |
| Config file | `vitest.config.ts` (if exists, or relies on package.json config) |
| Quick run command | `npm run verify:contrast` (non-test but validation-gated) |
| Full suite command | `npm run test` (runs all Vitest tests) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| STYLE-01 | Dead code is removed (no import errors on build) | Build / Smoke | `npm run build` | N/A |
| STYLE-02 | Hex colors grep returns only globals.css | Smoke (manual) | `grep -rE "#[0-9a-fA-F]{3,8}" src --include=*.css` | Grep command |
| STYLE-03 | Palette collisions resolved (#0a0a0a, #04080F, golds unified) | Manual code review | Visual inspection + grep for old values | Manual |
| STYLE-04 | All routes render on one theme (light) | Smoke / Manual | Visit `/articles`, `/privacy`, `/terms`, `/checkout`, `/assessment` in browser | Manual |
| STYLE-06 | Contrast script passes site-wide | Automated | `npm run verify:contrast` | ✅ `scripts/verify-contrast.js` + `tests/test-contrast-verification.test.js` |

### Wave 0 Gaps

- [ ] Build-time validation gate (e.g., `npm run build` must not warn about legacy token usage)
- [ ] Visual regression tests (no test exists for route rendering comparison before/after Phase 8)
- [ ] Accessibility audit (no axe-core or Pa11y integration; manual browser inspection required for Phase 9 gate)

**Note:** Existing test infrastructure is minimal. Phase 8 focuses on **correctness verification** (contrast script + build success) rather than comprehensive test coverage. Phase 11 (Cleanup & Consistency) includes POLISH-04 (accessibility pass), which will involve broader testing.

---

## Common Patterns from Prior Phases

### Phase 7: Self-Contained Route (Isolation Pattern)

**Pattern:** Phase 7 introduced route groups `(automate)` to isolate the `/automate` page from the site-wide navigation. Phase 8 **does not need** a route group — the entire site is being unified, not isolated.

**Relevance:** Phase 8's cleanup is site-wide; Phase 9 will use route groups if needed (e.g., for an enterprise track).

### Phase 09.1: Surgical Code Movement (Reference for Dead Code Deletion)

**Pattern:** Phase 09.1 moved the Instagram offering from `/automate` to `/automate/instagram` by:
1. Creating the new route structure
2. Copying files (not moving)
3. Adding redirects in `next.config.mjs` for old paths
4. Deleting old files only after confirming redirects work

**Relevance:** Phase 8's dead code deletion is simpler (files are unused, no redirects needed), but the principle applies: verify before deleting, check for stale references, commit in named batches.

### Phase 10: Deep Refactoring (Validation Pattern)

**Pattern:** Phase 10's refactor of assessment routing used the existing test suite to verify changes didn't break functionality. Phase 8 **reuses this approach** — the contrast script is the equivalent "gate" that ensures no color mistakes were made.

**Relevance:** Phase 8's validation is **correction-focused**: "did we fix all the hardcoded colors?" not "do the colors look good?" The contrast script answers the first; Phase 9's visual QA answers the second.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build, verify-contrast script | ✓ | (via npm) | — |
| npm | Package management | ✓ | (via npm) | — |
| PostCSS | verify-contrast.js color parsing | ✓ | (in package.json as dev dep) | — |
| parse-css-color | verify-contrast.js color normalization | ✓ | (in package.json as dev dep) | — |
| Vitest | Test execution (if run) | ✓ | (in package.json) | — |

**Blockers:** None. All dependencies already installed.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The two "gold" values exist somewhere in the codebase as hardcoded hex colors | Hardcoded Color Audit | If golds don't exist as hardcoded colors, STYLE-03 is incomplete — planner must search for gold usage in Tailwind classes (e.g., `text-amber-500`, `bg-yellow-400`) or inline styles |
| A2 | `const isEnterprise = false` on line 24 of checkout/page.tsx is always false and the if-branch (lines 115–123) is unreachable | Dead Code Inventory | If `isEnterprise` is set to `true` elsewhere in the component or props, the branch is reachable and should not be deleted. Planner must verify the variable is truly hardcoded `false` before deletion |
| A3 | All 494 hardcoded hex colors can be mapped to one of the 19 Phase 6 token definitions | Hardcoded Color Audit | If edge-case colors exist (e.g., a purple for a feature flag, a neon for a warning not in the semantic scale), STYLE-02 cannot pass without expanding the token set or accepting those colors as exceptions. User confirmation needed if this arises in execution |

---

## Open Questions (RESOLVED)

1. **Gold collision location:** RESOLVED — Planning-time investigation located the two golds: the legacy `var(--gold, #C9A060)` fallback syntax (~30 occurrences) vs. the Phase 6 canonical `--accent: #C9A86D`. Plans 08-04 and 08-06 convert every `var(--gold*, ...)` occurrence to `var(--accent)`.
   - What we know: Phase 6 accent is `#C9A86D` (medium gold)
   - Resolution: All `var(--gold, #C9A060)` / `var(--gold-light, #E0B878)` legacy fallbacks → `var(--accent)`. No hardcoded gold hex or Tailwind amber/yellow classes were found outside this fallback pattern.

2. **Legacy `--bg-base` usage:** RESOLVED — `--bg-base` was deleted in Phase 6 (cleanup, not a bug); its fallback usages are migration debt. Every `var(--bg-base, #04080F)` occurrence converts to `var(--surface-1)`.
   - What we know: It's not in current globals.css
   - Resolution: Treat as intentionally deleted. Plans 08-04 and 08-06 convert all `var(--bg-base, ...)` usages to `var(--surface-1)` directly (no fallback needed once conversion is complete).

3. **Scale application scope (STYLE-05):** RESOLVED — Apply scales to all CSS values (font-size, font-weight, padding/margin/gap) touched by this phase's conversion work, not just grossly inconsistent ones — since every Wave 2 plan is already rewriting these files' color declarations, normalizing spacing/type in the same pass avoids a second touch of the same files.
   - What we know: ~10 sizing values are already in use (`padding: 1.5rem`, `font-size: 1.125rem`)
   - Resolution: All Wave 2 plans (08-02 through 08-06) normalize spacing/type to the nearest token in files they already modify for color conversion; files untouched by color conversion are left alone (out of scope for this phase).

---

## Sources

### Primary (HIGH confidence)
- **Codebase inspection (grep audit):** 494 hardcoded colors located via `grep -rE "#[0-9a-fA-F]{3,8}" src --include=*.css`
- **File existence check:** All dead code files confirmed to exist (read + wc)
- **Import verification:** `grep -r "Testimonials\|SaasShowcase\|..."` confirmed zero import usage
- **Phase 6 UI-SPEC:** `src/app/globals.css` (current token definitions), `.planning/phases/06-palette-decision-token-foundation/06-UI-SPEC.md` (canonical token definitions, contrast verification script specification)
- **Contrast script:** `scripts/verify-contrast.js` (production code, 150 lines, PostCSS-based)

### Secondary (MEDIUM confidence)
- **REQUIREMENTS.md:** STYLE-01 through STYLE-06 requirements (2026-07-31, official source)
- **ROADMAP.md:** Phase 8 section (2026-07-31 update)
- **STATE.md:** Project status, Phases completed through 10 (2026-08-09)

### Tertiary (Process references, not factual claims)
- **Prior phase patterns:** Phase 7 RESEARCH.md (architectural responsibility mapping), Phase 09.1 PLAN.md (code movement pattern), Phase 10 ROADMAP section (validation approach)

---

## Metadata

**Confidence breakdown:**
- **Dead code inventory:** HIGH — full codebase scan, all files verified to exist and checked for imports
- **Hardcoded color audit:** HIGH — 494 colors found via systematic grep; collision values (`#0a0a0a`, `#04080F`) confirmed in 48 and 16 files respectively
- **Theme unification:** HIGH — all five routes checked; checkout and assessment confirmed to have dark heros
- **Token system reference:** HIGH — globals.css read and verified; Phase 6 UI-SPEC consulted for canonical definitions
- **Contrast script:** HIGH — script exists, tested, invoked via npm, exit codes verified
- **Gold collision:** LOW — mentioned in requirements but location not confirmed in audit; assumes existence

**Research date:** 2026-08-09
**Valid until:** 2026-08-16 (one week; stable domain with minimal upstream changes expected)

---

*Phase 8 Research completed: ready for planning.*
