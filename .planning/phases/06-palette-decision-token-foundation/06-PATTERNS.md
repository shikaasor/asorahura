# Phase 6: Palette Decision + Token Foundation - Pattern Map

**Mapped:** 2026-07-31  
**Files analyzed:** 5 (2 modified, 3 created)  
**Analogs found:** 5 / 5

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/app/globals.css` | config | static | `src/app/globals.css` (existing) | exact (self-analog, replacement) |
| `src/app/layout.tsx` | config | static | `src/app/layout.tsx` (existing) | exact (self-analog, modification) |
| `src/app/internal/palette-review/page.tsx` | component | request-response | `src/app/privacy/page.tsx` or `src/app/assessment/page.tsx` | exact (page route pattern) |
| `scripts/verify-contrast.js` | utility | batch/transform | none (new pattern) | N/A (no existing analog) |
| `package.json` | config | static | `package.json` (existing) | exact (self-analog, script addition) |

---

## Pattern Assignments

### `src/app/globals.css` (config, static)

**Analog:** `src/app/globals.css` (existing dark token block — being replaced entirely)

**Existing CSS Custom Properties Pattern** (lines 3–38 in current file):
```css
:root {
  /* Dark premium palette */
  --bg-base: #04080F;
  --bg-surface: #080E1A;
  --bg-card: #0D1525;
  --bg-elevated: #111D30;

  /* Gold accent system */
  --gold: #C9A060;
  --gold-light: #E0B878;
  --gold-dim: #9A7845;
  --gold-glow: rgba(201, 160, 96, 0.18);
  --gold-border: rgba(201, 160, 96, 0.28);

  /* Text */
  --text-primary: #EDF2F7;
  --text-secondary: #8B9BB4;
  --text-muted: #5A6B84;

  /* Borders */
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-default: rgba(255, 255, 255, 0.10);

  /* Fonts */
  --font-serif: "Playfair Display", Georgia, serif;
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
```

**Consumption Pattern** (lines 56–62):
```css
body {
  background: var(--bg-base);
  color: var(--text-primary);
  font-family: var(--font-sans);
}
```

**For Phase 6 Replacement:**
- Replace the entire `:root` block (lines 3–38) with the new light-first token set using semantic-scale naming: `--surface-1` through `--surface-4`, `--ink-1` through `--ink-3`, `--accent` + state variants, `--success`, `--error`, `--warn`, `--border-1`, `--border-2`, plus type/spacing/radius/shadow/transition scales as defined in 06-UI-SPEC.md
- Remove legacy aliases (`--background`, `--foreground`, `--accent` [old], `--muted`, `--border`) — lines 26–31 can be deleted
- Remove h1-h4 font-family override (lines 69–76) — keep font-weight and letter-spacing, delete `font-family: var(--font-sans)` line
- Remove `.serif` utility class entirely (lines 78–80) — confirmed unused by CONTEXT.md

---

### `src/app/layout.tsx` (config, static)

**Analog:** `src/app/layout.tsx` (existing font loading pattern)

**Current Font Loading Pattern** (lines 1–15):
```typescript
import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import ParticleWave from "@/components/ParticleWave";
import Footer from "@/components/home/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-serif",
    weight: ["400", "500", "600", "700"],
    style: ["normal", "italic"],
    display: "swap",
});
```

**Body className usage** (line 55):
```typescript
<body className={`${inter.variable} ${playfair.variable}`}>
```

**For Phase 6 Removal:**
- Delete line 2: `import { Inter, Playfair_Display }` → replace with `import { Inter }`
- Delete lines 9–15: entire `playfair` const declaration
- Update line 55 body className: `className={`${inter.variable} ${playfair.variable}`}` → `className={inter.variable}`
- Keep all other metadata, Navigation, ParticleWave, Footer patterns unchanged

---

### `src/app/internal/palette-review/page.tsx` (component, request-response)

**Analog:** `src/app/privacy/page.tsx` (metadata + page component pattern) and `src/app/assessment/page.tsx` (metadata with robots config)

**Metadata Pattern with robots** (from privacy/page.tsx + RESEARCH.md recommendations):
```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Asor Ahura",
  description: "How Asor Ahura collects, uses, and protects your information.",
};
```

**Recommended enhancement for internal route** (combining Next.js best practice):
```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Palette Direction Review — Internal",
  description: "Design system palette comparison board",
  robots: {
    index: false,      // Equivalent to <meta name="robots" content="noindex">
    follow: true,      // Allow crawl of links on this page
  },
};
```

**Page Component Structure** (from privacy/page.tsx pattern, lines 1–15):
```typescript
import type { Metadata } from "next";
import styles from "./privacy.module.css";

export const metadata: Metadata = {
  // ... metadata here ...
};

export default function PrivacyPage() {
  return (
    <main className={styles.main}>
      <div className="container">
        <header className={styles.header}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.meta}>Last updated: May 16, 2026</p>
        </header>
        
        <div className={styles.body}>
          {/* Content sections here */}
        </div>
      </div>
    </main>
  );
}
```

**For Phase 6 Implementation:**
- Create `src/app/internal/palette-review/page.tsx` following the pattern above
- Use metadata API with `robots: { index: false }` to prevent search engine indexing (as required by DESIGN-09 and D-09)
- Create `src/app/internal/palette-review/styles.module.css` for component-scoped styles (similar to privacy.module.css pattern)
- Layout: Three-column grid showing Direction A, B, C with hero/pricing-card/CTA components (details in 06-UI-SPEC.md, §Comparison Board Specification)
- No site navigation link to this route (internal only)
- Contrast ratios displayed via inline text or table (CSS-only, no runtime calculation needed — values from verify-contrast.js pre-computed)

---

### `scripts/verify-contrast.js` (utility, batch/transform)

**Analog:** None in existing codebase (new pattern). Reference implementation from RESEARCH.md with concrete structure.

**Core Algorithm & Code Skeleton** (from RESEARCH.md §Code Examples, verified against WCAG 2.0 spec):

```javascript
// scripts/verify-contrast.js
// WCAG contrast verification for globals.css tokens
// Usage: node scripts/verify-contrast.js
// Exit code 0: all pass, 1: failures found

const fs = require('fs');
const postcss = require('postcss');
const parseColor = require('parse-css-color');

// WCAG 2.0 Relative Luminance Formula (with sRGB gamma correction)
function getRelativeLuminance(r, g, b) {
  const toLinear = (c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const rL = toLinear(r);
  const gL = toLinear(g);
  const bL = toLinear(b);
  return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
}

// Contrast Ratio Formula
function getContrastRatio(L1, L2) {
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}

// Parse globals.css and extract color tokens from :root
const css = fs.readFileSync('src/app/globals.css', 'utf8');
const root = postcss.parse(css);

const tokens = {};
root.walkRules(':root', (rule) => {
  rule.walkDecls((decl) => {
    if (decl.prop.startsWith('--')) {
      tokens[decl.prop] = decl.value.trim();
    }
  });
});

// Convert color values to RGB using parse-css-color
const colors = {};
Object.entries(tokens).forEach(([name, value]) => {
  const parsed = parseColor(value);
  if (parsed && parsed.values) {
    colors[name] = parsed.values.slice(0, 3).map(v => Math.round(v));
  }
});

// Extract token categories
const surfaces = Object.keys(colors).filter(k => k.includes('surface'));
const inks = Object.keys(colors).filter(k => k.includes('ink'));
const semantics = Object.keys(colors).filter(k => 
  k.includes('success') || k.includes('error') || k.includes('warn')
);

// Validate ink on surface pairings
let failures = [];
inks.forEach((ink) => {
  const inkLum = getRelativeLuminance(...colors[ink]);
  const isLargeText = ink === '--ink-3';  // Ink 3 is tertiary/large text
  const minRatio = isLargeText ? 3 : 4.5;

  surfaces.forEach((surface) => {
    const surfLum = getRelativeLuminance(...colors[surface]);
    const ratio = getContrastRatio(inkLum, surfLum);

    if (ratio < minRatio) {
      failures.push(
        `✗ ${ink} on ${surface}: ${ratio.toFixed(2)}:1 (required ${minRatio}:1)`
      );
    }
  });
});

// Validate semantic colors on surfaces
semantics.forEach((semantic) => {
  const semLum = getRelativeLuminance(...colors[semantic]);
  surfaces.forEach((surface) => {
    const surfLum = getRelativeLuminance(...colors[surface]);
    const ratio = getContrastRatio(semLum, surfLum);
    if (ratio < 4.5) {
      failures.push(
        `✗ ${semantic} on ${surface}: ${ratio.toFixed(2)}:1 (required 4.5:1)`
      );
    }
  });
});

// Report results
if (failures.length > 0) {
  console.error('Contrast failures:\n' + failures.join('\n'));
  process.exit(1);
} else {
  console.log('✓ All text/surface pairings pass WCAG AA');
  process.exit(0);
}
```

**Dependencies** (to be added to package.json):
```bash
npm install postcss parse-css-color --save-dev
```

**For Phase 6 Integration:**
- Create `scripts/verify-contrast.js` with the skeleton above, substituting actual contrast threshold logic and error reporting as needed
- Add `"verify:contrast": "node scripts/verify-contrast.js"` to package.json scripts (see next section)
- No pre-commit hook required for Phase 6 (optional for Phase 8+), but script should integrate to CI/CD pipeline before deploy
- Script reads `src/app/globals.css`, parses `:root` definitions, calculates ratios using WCAG 2.0 formula, exits with status 1 on failures
- All token formats (hex, rgba, named colors) must be handled by parse-css-color library

---

### `package.json` (config, static)

**Analog:** `package.json` (existing script configuration pattern)

**Current scripts block** (lines 5–9):
```json
"scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
},
```

**For Phase 6 Addition:**
- Add `"verify:contrast": "node scripts/verify-contrast.js"` to the scripts object
- Add `postcss` and `parse-css-color` to `devDependencies`

**Updated scripts block (after Phase 6)**:
```json
"scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "verify:contrast": "node scripts/verify-contrast.js"
},
```

**Updated devDependencies (after Phase 6)**:
```json
"devDependencies": {
    "@types/mdx": "latest",
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "eslint": "latest",
    "eslint-config-next": "latest",
    "typescript": "latest",
    "postcss": "^8.5.25",
    "parse-css-color": "^0.2.1"
}
```

---

## Shared Patterns

### CSS Custom Properties (Design Tokens) — All CSS Files

**Source:** `src/app/globals.css` (`:root` block)

**Apply to:** All component CSS and the new `/internal/palette-review` route

**Pattern:** Define tokens once in globals.css `:root`, consume via `var(--token-name)` across all stylesheets. No token definitions in component CSS files; consumption only.

**Example consumption** (applicable to new palette-review route and any future component):
```css
/* src/app/internal/palette-review/styles.module.css */
.hero {
  background: var(--surface-1);
  color: var(--ink-1);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  transition: background var(--duration-normal) ease;
}

.button {
  background: var(--accent);
  color: var(--surface-1);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
}

.button:hover {
  background: var(--accent-hover);
}

.button:active {
  background: var(--accent-active);
}
```

**Constraint:** Do NOT define `--surface-*`, `--ink-*`, `--accent`, etc. in component files. All color/type/spacing tokens are single-source-of-truth in globals.css `:root`.

---

### Next.js Metadata API for Internal Routes

**Source:** `src/app/privacy/page.tsx` + RESEARCH.md best practice

**Apply to:** `src/app/internal/palette-review/page.tsx`

**Pattern:** Export a `metadata` const with Metadata type to control page title, description, and SEO.

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Title | Asor Ahura",
  description: "Brief description for preview",
  robots: {
    index: false,  // Prevent search engine indexing
    follow: true,  // Allow crawl of links on the page
  },
};

export default function PageComponent() {
  return (
    <main className={styles.main}>
      {/* Page content */}
    </main>
  );
}
```

**For internal routes like `/internal/palette-review`:**
- Always set `robots: { index: false }` to prevent search indexing
- Use `robots: { follow: true }` to allow search engines to crawl links (optional but recommended)
- Route is not listed in Navigation/Footer; users access via direct URL or internal link only

---

### Font Loading Removal Pattern

**Source:** `src/app/layout.tsx` (existing Playfair_Display pattern)

**Apply to:** `src/app/layout.tsx` modification

**Pattern for removing a Google Font:**

1. **Remove import:** Change `import { Inter, Playfair_Display } from "next/font/google"` to `import { Inter } from "next/font/google"`
2. **Remove const declaration:** Delete the entire `playfair` const
3. **Update className:** Change `className={`${inter.variable} ${playfair.variable}`}` to `className={inter.variable}`
4. **Remove CSS variable:** Delete `--font-serif` from globals.css `:root`
5. **Remove CSS utility:** Delete `.serif` class from globals.css
6. **Remove font-family override:** Delete or modify any rules that reference `var(--font-serif)`

**Why this pattern is safe:**
- Next.js only loads fonts declared in layout.tsx
- Removing the declaration stops the download automatically
- No explicit font deletion or cache clearing needed (Next.js handles it)
- `.serif` class confirmed unused by grep (safe to delete)

---

## No Analog Found

Files with no existing analog and using patterns from RESEARCH.md:

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `scripts/verify-contrast.js` | utility | batch/transform | No contrast verification scripts exist yet in the codebase. Skeleton provided by RESEARCH.md §Code Examples; follows Node.js conventions (fs, postcss, npm packages). |

---

## Implementation Notes

### Token Naming Convention (Phase 6 requirement)

All new tokens follow **semantic-scale naming**, not role-based or descriptive names:

**Color tokens:**
- `--surface-1`, `--surface-2`, `--surface-3`, `--surface-4` (backgrounds)
- `--ink-1`, `--ink-2`, `--ink-3` (text scales)
- `--accent`, `--accent-hover`, `--accent-active` (CTA states)
- `--success`, `--error`, `--warn` (semantic states)
- `--border-1`, `--border-2` (border scales)

**Type tokens:**
- `--fontSize-xs`, `--fontSize-sm`, `--fontSize-base`, `--fontSize-lg`, `--fontSize-xl`, `--fontSize-2xl`, `--fontSize-3xl`
- `--fontWeight-normal` (400), `--fontWeight-bold` (700)
- `--lineHeight-*` (tight, normal, relaxed)

**Spacing tokens:**
- `--spacing-xs` (4px), `--spacing-sm` (8px), `--spacing-md` (16px), `--spacing-lg` (24px), `--spacing-xl` (32px), `--spacing-2xl` (48px)

**Other scales:**
- `--radius-sm`, `--radius-md`, `--radius-lg`
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`
- `--duration-fast`, `--duration-normal`, `--duration-slow`

### WCAG Contrast Verification

All token values must pass WCAG AA contrast thresholds:

- **Body text** (Ink 1–2 on any Surface): ≥ 4.5:1
- **Large text** (Ink 3 on any Surface): ≥ 3:1
- **Semantic colors** (Success/Error/Warn on any Surface): ≥ 4.5:1

The verify-contrast.js script enforces these thresholds using the WCAG 2.0 luminance formula with sRGB gamma correction.

### Direction Selection (D-10)

Per CONTEXT.md D-10, Claude auto-selects Direction B (Lighter Cream + Medium Gold) without external creative-director review. This direction is baked into the `/internal/palette-review` comparison board as pre-computed token values (from 06-UI-SPEC.md, lines 113–133).

### Legacy Token Breakage (D-07)

Removing old token names (`--bg-*`, `--gold-*`, `--text-*`) and their aliases means ~100 `var()` references across 35 existing stylesheets will break between Phase 6 ship and Phase 8 rollout. **This breakage is intentional and accepted.** Do NOT add a compatibility shim (e.g., `--background: var(--surface-1)`). Phase 8 will update all 35 stylesheets in one pass.

---

## Metadata

**Confidence:** HIGH — All patterns extracted from existing codebase analogs or verified against RESEARCH.md code examples and WCAG 2.0 specification.

**Files scanned:** 
- `src/app/globals.css` (138 lines)
- `src/app/layout.tsx` (65 lines)
- `src/app/privacy/page.tsx` (103 lines)
- `src/app/assessment/page.tsx` (37 lines, first 50)
- `src/app/page.tsx` (22 lines)
- `src/app/page.module.css` (30 lines, first)
- `package.json` (45 lines)

**Analog search scope:** src/app, scripts/, package.json

**Pattern extraction date:** 2026-07-31

---

*Phase 6 Pattern Mapping completed: 2026-07-31*
*Ready for planning.*
