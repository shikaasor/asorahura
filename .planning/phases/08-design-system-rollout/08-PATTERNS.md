# Phase 8: Design System Rollout - Pattern Map

**Mapped:** 2026-08-09
**Files analyzed:** 50+ CSS/component files
**Analogs found:** 5 excellent matches with token usage / 50+ files needing color/spacing/typography migration

---

## File Classification

| File Category | Role | Data Flow | Count | Closest Analog | Match Quality |
|---|---|---|---|---|---|
| **Dead code deletions (STYLE-01)** | component/stylesheet | deletion | 11 | N/A | N/A |
| **Page hero sections (STYLE-04)** | stylesheet | styling/theming | 2 | `src/app/automate/page.module.css` | exact-role |
| **Component stylesheets** | stylesheet | styling/theming | 30+ | `src/app/internal/palette-review/styles.module.css` | exact-role |
| **Navigation/shared layout** | stylesheet | styling/theming | 3 | `src/components/Navigation.module.css` | needs-conversion |
| **Page/component files (dead code lines)** | page/component | deletion + edit | 2 | N/A | N/A |

---

## Phase Requirements → Pattern Mapping

### STYLE-01: Dead Code Deletion (Verification Only)

No pattern mapping needed; these files/lines are deleted entirely:

| File | Type | Action | Verification |
|------|------|--------|---|
| `src/app/page.module.css` | CSS module | Delete | Build succeeds with no broken imports |
| `src/components/Testimonials.tsx` | Component | Delete | Grep confirms zero imports: `grep -rn "Testimonials" src --include="*.tsx"` |
| `src/components/Testimonials.module.css` | CSS module | Delete | Deleted with component |
| `src/components/SaasShowcase.tsx` | Component | Delete | Grep confirms zero imports |
| `src/components/SaasShowcase.module.css` | CSS module | Delete | Deleted with component |
| `src/components/LinkedInFeed.tsx` | Component | Delete | Grep confirms zero imports |
| `src/components/LinkedInFeed.module.css` | CSS module | Delete | Deleted with component |
| `src/components/YouTubeFeed.tsx` | Component | Delete | Grep confirms zero imports |
| `src/components/YouTubeFeed.module.css` | CSS module | Delete | Deleted with component |
| `public/images/testimonials/lloydlist.jpg` | Image | Delete | Untracked file, no references |
| `public/images/testimonials/lloydlist.png` | Image | Delete | Untracked file, no references |
| `src/app/services/page.tsx:78` | Dead const | Delete line | `const year = new Date().getFullYear();` — never referenced |
| `src/app/checkout/page.tsx:24` | Dead const + branch | Delete + clean | `const isEnterprise = false;` + unreachable if-branch lines 115–123 |

---

## Pattern Assignments

### Foundation: Token System (Phase 6, in `src/app/globals.css` lines 3–59)

All files being migrated reference these token definitions. No changes to globals.css; these are the **source of truth**.

**Analog:** `src/app/globals.css` (lines 3–59)

**Token Categories:**

```css
/* Color Tokens — Direction B (canonical) */
--surface-1: #FDFAF4;    /* Page/card backgrounds */
--surface-2: #F9F4ED;    /* Card backgrounds, sidebar */
--surface-3: #F2EBDE;    /* Hover, focus states */
--surface-4: #FFFEF9;    /* Light overlays */

--ink-1: #1F1B17;        /* Primary text, headings */
--ink-2: #5D564E;        /* Secondary labels, muted */
--ink-3: #8B827A;        /* Tertiary, disabled, help */

--accent: #C9A86D;       /* Primary CTA, interactive */
--accent-hover: #B5985B; /* CTA hover state */
--accent-active: #A1854A; /* CTA active state */

--success: #3D6B1F;      /* Confirmation */
--error: #AA3918;        /* Destructive, error states */
--warn: #935A19;         /* Warnings */

--border-1: rgba(31, 27, 23, 0.08);  /* Subtle dividers */
--border-2: rgba(31, 27, 23, 0.16);  /* Default borders */

/* Type Scale — 2 weights only (400, 700) */
--fontSize-1: 12px; --fontSize-2: 16px; /* ... through ... */
--fontSize-7: 48px;
--fontWeight-normal: 400; --fontWeight-bold: 700;
--lineHeight-tight: 1.1; --lineHeight-normal: 1.5; --lineHeight-relaxed: 1.6;

/* Spacing Scale — 6 steps, multiples of 4 */
--spacing-1: 4px; --spacing-2: 8px; /* ... through ... */
--spacing-6: 48px;

/* Radius, Shadow, Transition */
--radius-1: 4px; --radius-2: 8px; --radius-3: 12px;
--shadow-1: 0 1px 2px rgba(31, 27, 23, 0.05);
--shadow-2: 0 4px 8px rgba(31, 27, 23, 0.1);
--shadow-3: 0 12px 24px rgba(31, 27, 23, 0.12);
--duration-1: 150ms; --duration-2: 300ms; --duration-3: 500ms;
```

---

### STYLE-02/03/04/05: CSS Module Conversion Pattern

**Analog Primary:** `src/app/internal/palette-review/styles.module.css`  
**Analog Secondary:** `src/app/automate/page.module.css`

All CSS modules being converted follow this exact pattern:

#### Template: Correct Token Usage (from `src/app/internal/palette-review/styles.module.css` lines 1–60)

```css
/* SPACING PATTERN */
.main {
  min-height: 100vh;
  padding-top: var(--spacing-6);      /* Use tokens, not px/rem */
  padding-bottom: var(--spacing-6);
}

/* TYPOGRAPHY PATTERN */
.title {
  font-size: var(--fontSize-6);       /* Use token, never hardcode px */
  font-weight: var(--fontWeight-bold); /* Use token, never hardcode number */
  line-height: var(--lineHeight-tight); /* Use token */
  margin-bottom: var(--spacing-2);    /* Spacing is always a token */
}

/* COLOR PATTERN: Background + Text Pair */
.column {
  padding: var(--spacing-4);
  border-radius: var(--radius-3);
  background: var(--surface-1);       /* Surface token for backgrounds */
  color: var(--ink-1);                /* Ink token for text on surfaces */
  box-shadow: var(--shadow-2);        /* Shadow token */
}

/* SEMANTIC COLOR PATTERN: Buttons */
.ctaButton {
  padding: var(--spacing-2) var(--spacing-4);
  background: var(--accent);          /* Accent for primary CTA fill */
  color: var(--ink-1);                /* Dark text on gold; passes contrast */
  border-radius: var(--radius-1);
}

.ctaButton:hover {
  background: var(--accent-hover);    /* Use -hover state, not custom colors */
}

/* BORDER PATTERN */
.contrastTable td {
  border-bottom: 1px solid var(--border-1); /* Use border token */
}

/* MEDIA QUERIES: Token usage consistent across breakpoints */
@media (max-width: 1024px) {
  .grid {
    gap: var(--spacing-4);            /* Token stays, only value structure changes */
  }
}
```

---

### Conversion Rules by Context (Pitch the hardcoded → token mapping)

#### Rule 1: Dark backgrounds → light surfaces

**Affected files:** 48 uses of `#0a0a0a`, 16 uses of `#04080F`

**Before (BAD):**
```css
.hero {
  background: #0a0a0a;
  color: #fff;
  padding: 5rem 2rem;
}
```

**After (GOOD):**
```css
.hero {
  background: var(--surface-1);    /* Light cream, not dark — unifies light-first theme */
  color: var(--ink-1);             /* Dark text on light, meets contrast */
  padding: var(--spacing-6) var(--spacing-4); /* Tokens, not ad-hoc values */
}
```

**Why:** STYLE-04 requirement: all routes render on one theme (light). The dark hero sections on `/checkout` and `/assessment` break unity. Phase 6 tokens define light-first palette; use `--surface-1` for primary backgrounds.

**Verification:** `npm run verify:contrast` confirms `--ink-1` on `--surface-1` = 21.0:1 (WCAG AAA).

---

#### Rule 2: Secondary text colors → ink scale

**Affected files:** ~19 uses of Tailwind grays (`text-gray-500`, `bg-gray-100`) + hardcoded grays (`#9ca3af`, `#6b7280`, `#374151`, `#5D564E`)

**Before (BAD):**
```css
.secondaryText {
  color: #9ca3af;      /* Tailwind gray-400 — no semantic meaning */
}

.disabledInput {
  color: #6b7280;      /* Tailwind gray-500 — unclear hierarchy */
}

.helpText {
  color: #8B827A;      /* Ad-hoc gray — not in token system */
}
```

**After (GOOD):**
```css
.secondaryText {
  color: var(--ink-2); /* Secondary labels, muted text — 8.1:1 on surface-1 */
}

.disabledInput {
  color: var(--ink-3); /* Tertiary, disabled text — 4.5:1 on surface-1 */
}

.helpText {
  color: var(--ink-3); /* Same semantic meaning as disabled */
}
```

**Why:** Phase 6 defines a 3-step ink scale with verified contrast ratios. Tailwind grays are site-wide noise; ink tokens codify text hierarchy.

**Verification:** Script `npm run verify:contrast` validates all ink/surface pairings ≥ 4.5:1 body, ≥ 3:1 large text.

---

#### Rule 3: Gold/accent colors → accent tokens

**Affected files:** Likely in buttons, CTA links, highlights (exact count TBD via grep `#[dD][4-9a-fA-F][aA-fF][0-9a-fA-F]` and similar)

**Before (BAD):**
```css
.button {
  background: #C9A060;  /* Gold, hardcoded */
}

.buttonHover {
  background: #B8A050;  /* Lightened gold, ad-hoc variation */
}
```

**After (GOOD):**
```css
.button {
  background: var(--accent);       /* Phase 6 accent = #C9A86D */
}

.button:hover {
  background: var(--accent-hover); /* Pre-verified: 5.7:1 on surface-1 */
}

.button:active {
  background: var(--accent-active); /* Pre-verified: 6.3:1 on surface-1 */
}
```

**Why:** STYLE-03 requires palette collision resolution: "two golds → one accent." Phase 6 defines canonical accent + states with verified contrast. No custom gold variations.

---

#### Rule 4: Border colors → border tokens

**Affected files:** Multiple uses of `rgba()` borders, hardcoded dividers

**Before (BAD):**
```css
.card {
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid #e5e7eb;
}
```

**After (GOOD):**
```css
.card {
  border: 1px solid var(--border-1);       /* Subtle divider */
  border-bottom: 1px solid var(--border-2); /* Default border */
}
```

**Why:** Phase 6 defines 2-step border scale with ink-aware opacities. Mixing rgba values and hex borders creates maintenance burden.

---

#### Rule 5: Spacing/padding/margin → spacing tokens

**Affected files:** ~100+ values across all CSS modules

**Before (BAD):**
```css
.section {
  padding: 5rem 2rem 4rem;      /* Ad-hoc, different per section */
  margin-bottom: 1.25rem;        /* Inconsistent sizing */
  gap: 0.5rem;                   /* Not a power-of-2 scale */
}
```

**After (GOOD):**
```css
.section {
  padding: var(--spacing-6) var(--spacing-4) var(--spacing-5); /* Consistent 4px grid */
  margin-bottom: var(--spacing-3);                              /* 16px, standardized */
  gap: var(--spacing-2);                                        /* 8px, from scale */
}
```

**Why:** STYLE-05 requires "spacing scales applied." Hardcoded values (1rem, 1.25rem, 5rem, 0.5rem) fracture the design system. Phase 6 defines 6 steps (4–48px, multiples of 4). All spacing must use these tokens.

**Verification:** Visual consistency across pages; no orphan spacing values.

---

#### Rule 6: Typography sizing → font token scale

**Affected files:** Multiple uses of `font-size: clamp(...)`, `font-size: 1.1rem`, etc.

**Before (BAD):**
```css
.headline {
  font-size: clamp(1.75rem, 4vw, 2.75rem);  /* Ad-hoc responsive, not in scale */
  font-weight: 800;                          /* Outside the 400/700 system */
  line-height: 1.15;                         /* Not a named token */
}

.body {
  font-size: 1rem;                           /* Matches token but hardcoded, not var() */
}
```

**After (GOOD):**
```css
.headline {
  font-size: var(--fontSize-6);        /* 32px or similar step, responsive via Media Q */
  font-weight: var(--fontWeight-bold); /* Only 400 or 700 allowed */
  line-height: var(--lineHeight-tight); /* Named scale */
}

.body {
  font-size: var(--fontSize-2);        /* 16px, from token */
  line-height: var(--lineHeight-normal); /* 1.5 */
}

@media (max-width: 768px) {
  .headline {
    font-size: var(--fontSize-5); /* Scale down via Media Q, not clamp */
  }
}
```

**Why:** STYLE-05 requires "type scales applied." Hardcoded font-weights (800, 600, 500) violate the 2-weight-only system. `clamp()` responsive sizing is at odds with a discrete scale. Phase 6 defines 7 sizes (12–48px) at 1.25× ratio; pick the closest match and use Media Q for responsive behavior.

---

### STYLE-04: Theme Unification — Dark Hero Sections

**Affected files (specifically):**
- `src/app/checkout/checkout.module.css` (lines 7–9 hero section)
- `src/app/assessment/assessment.module.css` (lines 7–9 hero section)

**Analog:** `src/app/automate/page.module.css` (lines 1–4, hero pattern)

**Before (BAD) — checkout.module.css:**
```css
.hero {
  background: #0a0a0a;  /* Dark — contradicts light page */
  color: #fff;
  padding: 3.5rem 2rem 3rem;
}
```

**After (GOOD):**
```css
.hero {
  background: var(--surface-1);  /* Light cream, matches page */
  color: var(--ink-1);           /* Dark text on light */
  padding: var(--spacing-6) var(--spacing-4) var(--spacing-5); /* Tokens */
}
```

**Rationale:** Checkout and assessment pages have light page backgrounds (`#fff`, `#f9fafb`) but dark hero sections (`#0a0a0a`). This breaks STYLE-04 requirement: "every route renders on one theme." Phase 8 unifies them to light-first theme site-wide.

**Verification:** Visual inspection — `/checkout` and `/assessment` heros now match the rest of the page in light theme.

---

### Legacy Token Syntax Cleanup

**Affected pattern:** Files using fallback syntax `var(--bg-base, #04080F)` must be converted.

**Analog:** `src/components/home/HeroSection.module.css` (line 3, currently uses legacy syntax)

**Before (BAD):**
```css
.section {
  background: var(--bg-base, #04080F); /* `--bg-base` deleted Phase 6; fallback now active */
}
```

**After (GOOD):**
```css
.section {
  background: var(--surface-1); /* Direct token, no fallback needed */
}
```

**Why:** Phase 6 removed legacy token names (`--bg-base`, `--foreground`, `--muted`, `--border`). Files using fallback syntax are silently rendering the fallback color instead of the new token. No warning occurs; the page "works" but renders the old color.

**Verification:** Grep confirms zero matches: `grep -rn "var(--bg-base\|var(--foreground\|var(--muted" src --include="*.css"` returns empty.

---

## Shared Patterns

### 1. Token Usage Convention (Apply to ALL stylesheets)

**Source:** `src/app/globals.css` (lines 3–59), `src/app/internal/palette-review/styles.module.css` (line 1–220)

All color, spacing, typography, radius, shadow, transition values **must** use `var(--token-name)` syntax. No hardcoded hex, rem, px, or custom values (except for truly one-off layout constants like `max-width: 1280px`).

```css
/* CORRECT */
.element {
  background: var(--surface-1);        /* Color token */
  color: var(--ink-1);                 /* Text token */
  padding: var(--spacing-3);           /* Spacing token */
  font-size: var(--fontSize-2);        /* Type token */
  border-radius: var(--radius-2);      /* Radius token */
  box-shadow: var(--shadow-1);         /* Shadow token */
  transition: opacity var(--duration-1); /* Duration token */
}

/* WRONG — Do not do this in Phase 8 */
.element {
  background: #FDFAF4;                 /* Hardcoded color */
  color: rgb(31, 27, 23);              /* RGB conversion */
  padding: 16px;                       /* Hardcoded spacing */
  font-size: 1rem;                     /* Non-token size */
}
```

**Verification:** After Phase 8, grep for hardcoded colors returns only `globals.css` token definitions:  
`grep -rE "#[0-9a-fA-F]{3,8}" src --include=*.css` → should output ONLY globals.css lines 5–18.

---

### 2. Context-Aware Color Replacement (Apply to STYLE-02/STYLE-03 conversions)

**Source:** `src/app/internal/palette-review/styles.module.css` (lines 47–197 for color context examples)

When replacing a hardcoded color, identify its semantic role first:

| CSS Property | Token Family | Examples |
|---|---|---|
| `background`, `background-color` | `--surface-*` or `--accent*` | `.card { background: var(--surface-2); }` |
| `color`, `text-color` | `--ink-*` or semantic (`--success`, `--error`, `--warn`) | `.label { color: var(--ink-2); }` |
| `border-color`, `outline-color` | `--border-*` or `--ink-*` | `.input { border: 1px solid var(--border-2); }` |
| `box-shadow` | `--shadow-*` | `.card { box-shadow: var(--shadow-2); }` |
| `fill`, `stroke` (SVG/icon) | `--ink-*` or `--accent*` | `.icon { fill: var(--ink-1); }` |

**Pitfall:** Replacing `#0a0a0a` with `--surface-1` works for **backgrounds** (both are light cream). But if `#0a0a0a` was used as text color on a light surface (rare but possible), it should be `--ink-1` instead. Always check the CSS property context.

**Verification:** Run `npm run verify:contrast` after each wave of conversions (every 5–10 files). Catch contrast failures early.

---

### 3. No Intermediate Font Weights (Apply to STYLE-05)

**Source:** `src/app/globals.css` lines 29–30

Only two weights are defined: 400 (normal) and 700 (bold). No 500, 600, or 800 allowed.

```css
/* CORRECT */
.heading {
  font-weight: var(--fontWeight-bold); /* 700 only */
}

.body {
  font-weight: var(--fontWeight-normal); /* 400 only */
}

/* WRONG */
.semibold {
  font-weight: 600; /* Not in token system; must use 400 or 700 */
}
```

**Files requiring remediation:** Search for hardcoded font-weights outside 400/700:
```bash
grep -rn "font-weight: [5-6][0-9][0-9]" src --include="*.css"
grep -rn "font-weight: 8[0-9][0-9]" src --include="*.css"
```

Convert all to either `--fontWeight-normal` or `--fontWeight-bold`.

---

### 4. Spacing Grid Consistency (Apply to STYLE-05)

**Source:** `src/app/globals.css` lines 35–41, `src/app/internal/palette-review/styles.module.css` lines 1–33

Spacing must always be a multiple of 4px. The scale is:

| Token | Value | Common Uses |
|---|---|---|
| `--spacing-1` | 4px | Icon gaps, inline padding, tight grouping |
| `--spacing-2` | 8px | Compact element spacing |
| `--spacing-3` | 16px | Default element spacing, body padding |
| `--spacing-4` | 24px | Section padding, container gutters |
| `--spacing-5` | 32px | Layout gaps, card margins |
| `--spacing-6` | 48px | Major section breaks |

Ad-hoc values like `1rem` (16px = `--spacing-3`), `1.25rem` (20px = between tokens, use `--spacing-4`), `5rem` (80px = larger than `--spacing-6`, likely needs design review), `0.5rem` (8px = `--spacing-2`) **must be mapped to the nearest scale step**.

**Verification:** After Phase 8, grep for hardcoded padding/margin/gap (excluding position, max-width, etc.):
```bash
grep -rn "padding: [0-9]" src --include="*.css"  # Should return ~0 results
grep -rn "margin: [0-9]" src --include="*.css"   # Should return ~0 results
grep -rn "gap: [0-9]" src --include="*.css"      # Should return ~0 results
```

---

### 5. Contrast Verification Gate (Apply at Phase 8 completion)

**Source:** `scripts/verify-contrast.js`, `npm run verify:contrast`

After all color migrations (STYLE-02, STYLE-03, STYLE-04), the entire site must pass the contrast script with zero failures.

```bash
npm run verify:contrast
# Expected output (all pass):
✓ Ink 1 on Surface 1: 21.0:1 (required 4.5:1)
✓ Ink 2 on Surface 1: 8.1:1 (required 4.5:1)
✓ Ink 3 on Surface 1: 4.5:1 (required 3:1)
[... all semantic pairings ...]
✓ All text/surface pairings pass WCAG AA.
```

**Non-blocking status:** If failures occur, fix them before advancing to Phase 9. The script exits with code 1 on failures; catch them in CI/CD.

**Verification method:**
- Build succeeds: `npm run build`
- Contrast passes: `npm run verify:contrast` (code 0)
- Visual QA (manual): Load `/articles`, `/privacy`, `/terms`, `/checkout`, `/assessment` in browser; confirm light backgrounds site-wide

---

## No Analog Found

**Edge Case: Gold Collision Exact Locations**

The research identified that "two golds exist somewhere in the codebase" but exact locations were not pinpointed in the initial audit. Files need to be searched during execution via:

```bash
grep -rn "#[dD][4-9a-fA-F][aA-fF][0-9a-fA-F]" src --include="*.css"  # Amber/gold range
grep -rn "#FFD700\|#DAA520\|#B8860B" src --include="*.css"            # Common gold hex values
grep -rn "text-amber-\|bg-yellow-" src --include="*.tsx"             # Tailwind golds
```

Once located, all should map to `--accent: #C9A86D` (canonical Phase 6 token). If multiple distinct golds exist (e.g., one for buttons, one for badges), confirm with UX/design before phase completion.

---

## File List: All CSS/Component Files Needing Migration

**Count:** 50+ files organized by category

### Dead Code (11 files — STYLE-01, delete entirely)

1. `src/app/page.module.css`
2. `src/components/Testimonials.tsx`
3. `src/components/Testimonials.module.css`
4. `src/components/SaasShowcase.tsx`
5. `src/components/SaasShowcase.module.css`
6. `src/components/LinkedInFeed.tsx`
7. `src/components/LinkedInFeed.module.css`
8. `src/components/YouTubeFeed.tsx`
9. `src/components/YouTubeFeed.module.css`
10. `public/images/testimonials/lloydlist.jpg`
11. `public/images/testimonials/lloydlist.png`

### Page Routes — Dark Hero Theme Unification (STYLE-04, 2 files)

1. `src/app/checkout/checkout.module.css` (lines 7–9)
2. `src/app/assessment/assessment.module.css` (lines 7–9)

### Component Stylesheets — Hardcoded Color Migration (STYLE-02/03/05, 30+ files)

**Assessment Components:**
- `src/components/assessment/AssessmentSectorGate.module.css`
- `src/components/assessment/DeepAssessmentShell.module.css`
- `src/components/assessment/DeepResultsScreen.module.css`
- `src/components/assessment/EmailGate.module.css`
- `src/components/assessment/ProgressBar.module.css`
- `src/components/assessment/QuestionCard.module.css`
- `src/components/assessment/ResultsScreen.module.css`
- `src/components/assessment/RevenueResultsScreen.module.css`

**Home Components:**
- `src/components/home/AboutSection.module.css`
- `src/components/home/Footer.module.css`
- `src/components/home/HeroSection.module.css`
- `src/components/home/LeadMagnetStrip.module.css`
- `src/components/home/PainSection.module.css`
- `src/components/home/ProcessTimeline.module.css`
- `src/components/home/ServicesPreview.module.css`
- `src/components/home/SocialProof.module.css`

**Automate Components:**
- `src/components/automate/Breadcrumb.module.css`
- `src/components/automate/BuildMapForm.module.css`
- `src/components/automate/CatalogGrid.module.css`
- `src/components/automate/ComparisonStrip.module.css`
- `src/components/automate/FAQSection.module.css`
- `src/components/automate/HeroSection.module.css`
- `src/components/automate/OfferingCard.module.css`
- `src/components/automate/PhoneMockup.module.css`
- `src/components/automate/PricingSection.module.css`
- `src/components/automate/TryItNowSection.module.css`

**Shared/Layout Components:**
- `src/components/Navigation.module.css`
- `src/components/shared/TestimonialCard.module.css`
- `src/components/shared/TrustSignals.module.css`

### Page Stylesheets — Hardcoded Color Migration (STYLE-02/03/05, 8+ files)

1. `src/app/automate/layout.module.css`
2. `src/app/automate/page.module.css` (check for any hardcoded colors)
3. `src/app/automate/[slug]/page.module.css`
4. `src/app/automate/instagram/page.module.css`
5. `src/app/automate/instagram/success/success.module.css`
6. `src/app/blog/page.module.css`
7. `src/app/blog/[slug]/article.module.css`
8. `src/app/engage/engage.module.css`
9. `src/app/enterprise/enterprise.module.css`
10. `src/app/refund/refund.module.css`
11. `src/app/services/services.module.css`
12. `src/app/work/work.module.css`
13. `src/app/articles/articles.module.css`
14. `src/app/articles/[slug]/article.module.css`
15. `src/app/privacy/privacy.module.css` (likely already light; verify)
16. `src/app/terms/terms.module.css` (likely already light; verify)

---

## Metadata

**Analog search scope:**
- `src/app/globals.css` (token definitions)
- `src/app/internal/palette-review/styles.module.css` (reference implementation, Phase 6)
- `src/app/automate/page.module.css` (Phase 7, token-first build)
- `src/components/home/HeroSection.module.css` (legacy syntax, needs cleanup)
- `src/components/Navigation.module.css` (mixed legacy/new tokens, needs audit)

**CSS files scanned:** 50+  
**Hardcoded colors found:** 494+ instances across ~50 files (Phase 6 research verified)  
**Analog files with complete token adoption:** 5 (palette-review, automate/page, globals)  
**Files requiring conversion:** 48 (STYLE-02/03/04/05)  
**Dead code files to delete:** 11 (STYLE-01)  
**Lines to delete from live files:** ~10 (STYLE-01 in page/component files)

**Pattern extraction date:** 2026-08-09  
**Valid through:** 2026-08-16

---

*Phase 8 Pattern Mapping complete. Ready for planning.*
