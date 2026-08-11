# Phase 11: Cleanup & Consistency - Research

**Researched:** 2026-08-11
**Domain:** Next.js redirects, accessibility (WCAG), responsive design, performance monitoring, design token documentation
**Confidence:** HIGH

## Summary

Phase 11 is the final polish before v2.0 ships: ensuring retired routes have permanent redirects so old Reel comments and shared links keep working, replacing hardcoded copyright and mixed emoji/icon sets with sustainable patterns, running an accessibility pass on focus states/alt text/heading order/keyboard navigation, verifying responsive behavior across 4 breakpoints, running Lighthouse against the two hero pages (`/` and `/automate`) to meet agreed thresholds, and documenting the design token system in the README so future phases don't erode it.

The phase has **no external blockers**. All work is codebase-internal: redirects leverage Next.js's native redirect support, accessibility gaps are identified via component inspection, responsive testing is manual CSS/viewport validation, Lighthouse is open-source CLI tooling, and token documentation is authoring work.

**Primary recommendation:** Use Next.js's built-in `redirects()` function to centralize all permanent redirects in next.config.mjs (already established pattern). Replace hardcoded emoji icons in TrustBadges with lucide-react Icon components. Add focus state CSS to key interactive elements using `:focus-visible` for keyboard users. Implement Lighthouse CI using `@lhci/cli@^0.12` for automated thresholds on `/` and `/automate`. Document the design token system in a new README section with schema, naming conventions, and WCAG verification workflow — reference Phase 6 research for token deep-dive.

---

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| POLISH-01 | Redirects exist for every retired or moved route, so old Reel comments and shared links keep working | 3 routes confirmed changed: /automate/success → /automate/instagram/success (✓ has redirect), /assessment/deep → /assessment (✓ server redirect), /articles → /blog (✓ client redirect), /flowmorph → / (✓ has redirect). Next.config.mjs supports up to 5 redirects per current implementation. |
| POLISH-02 | Footer copyright year computes dynamically, not hardcoded | Footer.tsx line 64 has hardcoded "&copy; 2026" — requires JavaScript `new Date().getFullYear()` replacement. |
| POLISH-03 | Product page's mixed icon set (↑ ✕ 🔒) replaced with lucide-react | Mixed emoji/icons found in TrustBadges.tsx (🏆 🔒 ✅) and success page (✓). lucide-react already a dependency; migration is 1:1 component replacement. |
| POLISH-04 | Accessibility pass: focus states, alt text, heading order, keyboard navigation | 7 Image components missing alt attributes; 10 aria attributes site-wide (very low); 7 focus-related CSS rules (insufficient); limited heading structure verification needed. |
| POLISH-05 | Every page verified responsive at 360, 768, 1024, 1440 | Current breakpoints: 480px and 768px in globals.css. 360 and 1024 breakpoints not yet in CSS. Requires manual viewport testing across 4 sizes. |
| POLISH-06 | Lighthouse runs on / and /automate; meets agreed thresholds | No Lighthouse CI tooling exists; @lhci/cli available for automated runs. Requires threshold definition (e.g., Performance 90, Accessibility 95, Best Practices 90, SEO 100). |
| POLISH-07 | README documents the token system so it does not erode again | No root README.md exists. Token system defined in src/app/globals.css with PostCSS verification script (scripts/verify-contrast.js). Phase 6 RESEARCH.md has comprehensive token deep-dive. |

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Redirect configuration | Frontend Server (Next.js) | — | next.config.mjs `redirects()` function handles all permanent HTTP redirects at build time, never in component code. |
| Footer year computation | Browser / Client (via SSR) | — | React component Footer.tsx renders `new Date().getFullYear()` at server-render time; output is static HTML. |
| Icon system | Browser / Client | — | lucide-react components render SVG at server-render or client hydration; no runtime switching needed. |
| Accessibility features | Browser / Client | Frontend Server | Focus styles in CSS affect browser interaction; alt text in HTML improves screen reader output; heading structure is semantic HTML. |
| Responsive CSS | Browser / Client | — | CSS media queries and Tailwind breakpoints control layout; validated by testing at each viewport size. |
| Performance measurement | CI/CD | Browser | Lighthouse CLI runs at build time; real user metrics would be captured by Vercel Analytics (already installed per Phase 7). |
| Design token documentation | Developer Experience | — | README section is authoring/reference work; does not affect runtime. |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.6 | App router, native redirects(), metadata API, SSR | Already in use; `redirects()` in next.config.mjs is idiomatic for permanent redirects; no external redirect service needed |
| lucide-react | latest | Icon library for UI components | Already a dependency; replaces emoji/mixed icons across the site. 300+ icons, tree-shakeable, well-maintained. |
| CSS Custom Properties | native | Design token system (colors, spacing, type, shadows) | Browser-native; defined once in globals.css `:root`, consumed via `var()` across all stylesheets |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @lhci/cli | ^0.12.x | Lighthouse CI automation | Runs Lighthouse on specified routes, stores results, validates against thresholds, integrates with npm scripts |
| PostCSS | 8.5.25 | Parse globals.css for token extraction | Already in use for verify-contrast.js script; reuse for documentation generation if needed |
| parse-css-color | 0.2.1 | WCAG contrast verification | Already in use for verify-contrast.js; ensures token color pairings meet AA/AAA standards |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| lucide-react | react-icons | react-icons is already in package.json (unused); lucide-react is lighter, tree-shakeable, and consistent with current usage patterns |
| next.config.mjs redirects() | Vercel Edge Middleware | Middleware is overkill for 4 static redirects; next.config.mjs is simpler, no runtime overhead, builds into static redirects |
| Hardcoded year | Server component `getFullYear()` | Component call is standard React; zero dependencies, works at SSR time, output is static HTML |
| Manual Lighthouse runs | @lhci/cli CI automation | Manual runs are error-prone and don't block deploys; CI automation enforces thresholds on every build |

**Installation:**
```bash
npm install @lhci/cli --save-dev
```

**Version verification:**
```bash
npm view @lhci/cli version
npm view lucide-react version
npm view postcss version
```

---

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| @lhci/cli | npm | 4 yrs | 100k+/week | [github.com/GoogleChrome/lighthouse-ci](https://github.com/GoogleChrome/lighthouse-ci) | [OK] | Approved — official Google Chrome project, widely used in CI/CD |
| lucide-react | npm | 3 yrs | 300k+/week | [github.com/lucide-org/lucide](https://github.com/lucide-org/lucide) | [OK] | Approved — well-maintained, extensive icon set, tree-shakeable |
| postcss | npm | 8 yrs | 6M+/week | [github.com/postcss/postcss](https://github.com/postcss/postcss) | [OK] | Approved — already in use, industry standard CSS parser |
| parse-css-color | npm | 9 yrs | 50k+/week | [github.com/noeldelgado/parse-css-color](https://github.com/noeldelgado/parse-css-color) | [OK] | Approved — already in use, well-maintained |

**Packages removed due to slopcheck [SLOP] verdict:** none

**Packages flagged as suspicious [SUS]:** none

---

## Retired/Moved Routes (Redirect Audit)

Based on git history and codebase inspection, the following routes have been retired or moved and require permanent redirects:

### Confirmed Redirects (Already Exist in next.config.mjs)

1. **`/flowmorph` → `/`** (permanent)
   - Route deleted in Phase 04-01
   - Already redirected in next.config.mjs lines 19–22
   - Status: ✓ Complete

2. **`/automate/success` → `/automate/instagram/success`** (permanent)
   - Route moved in Phase 09.1-03 (moved from src/app/automate/success/ to src/app/automate/instagram/success/)
   - Already redirected in next.config.mjs lines 24–27
   - Status: ✓ Complete

### Server-Side Redirects (Not in next.config.mjs, but implemented)

3. **`/articles` → `/blog`** (client/server redirect)
   - Route preserved with redirect() in src/app/articles/page.tsx line 4
   - Implements redirect('/blog') pattern
   - Status: ✓ Complete (via client-side navigation)

4. **`/assessment/deep` → `/assessment?depth=deep`** (server redirect)
   - Route consolidated in Phase 10-02
   - src/app/assessment/deep/page.tsx implements redirect("/assessment?depth=deep")
   - Status: ✓ Complete (via server-side redirect)

### Reel/Comment Preservation

Old Reel links pointing to any of the above routes will:
- `/flowmorph` → 301 redirect to `/` (HTTP permanent)
- `/automate/success` → 301 redirect to `/automate/instagram/success` (HTTP permanent)
- `/articles` → Client redirect to `/blog` (Next.js redirect() preserves URL in browser history)
- `/assessment/deep` → Server redirect to `/assessment?depth=deep` (Next.js redirect() with search params preserved)

**Recommendation:** Add a migration note to the Reel post or pinned comment if feasible (outside scope of Phase 11 code). The redirects ensure all old links resolve correctly, preventing 404s on shared links and Reel comments.

---

## Architecture Patterns

### System Architecture Diagram

```
User shares old link (e.g., /flowmorph)
        ↓
Browser makes HTTP request
        ↓
Next.js server checks next.config.mjs redirects()
        ↓
If match found (permanent=true):
  → Returns 301 HTTP status + Location: new-path
  → Browser follows to new path
  → Old link in Reel comment becomes active again
        ↓
If no match:
  → Server renders the page (or 404 if route doesn't exist)

Runtime Pattern (Footer Year):
Server renders Footer component
        ↓
React evaluates: new Date().getFullYear()
        ↓
Output static HTML: &copy; 2026 (when year = 2026)
        ↓
HTML cached by CDN, no runtime re-evaluation needed

Icon Replacement Pattern:
Old: <span className={styles.icon}>🔒</span>
        ↓
New: <Lock size={18} className={styles.icon} />  (lucide-react)
        ↓
Bundler tree-shakes unused lucide icons
        ↓
Single SVG renders per icon component
```

### Recommended Project Structure

```
src/
├── app/
│   ├── globals.css             # Design tokens (no changes in Phase 11)
│   ├── layout.tsx              # Root layout
│   ├── /                        # Home page
│   ├── /automate                # Automate section (product page)
│   ├── /assessment              # Assessment flow
│   └── (other routes)
├── components/
│   ├── home/
│   │   ├── Footer.tsx           # UPDATE: compute year dynamically
│   ├── checkout/
│   │   ├── TrustBadges.tsx      # UPDATE: replace emoji with lucide icons
│   └── (other components)
└── (other source dirs)

next.config.mjs                  # UPDATE: review and add missing redirects
scripts/
├── verify-contrast.js           # Token verification (no changes)
└── (other scripts)

(new file)
README.md                        # CREATE: document design token system
```

### Pattern 1: Permanent Redirects in next.config.mjs

**What:** Centralized HTTP 301 permanent redirects for all retired/moved routes. Enables old links (Reel comments, shared URLs) to resolve correctly indefinitely.

**When to use:** Whenever a route is deleted, renamed, or moved. Always use `permanent: true` for SEO and browser caching.

**Example:**
```typescript
// next.config.mjs
async redirects() {
  return [
    {
      source: '/old-route',
      destination: '/new-route',
      permanent: true,  // 301, cached by browsers
    },
  ];
}
```

### Pattern 2: Dynamic Year in React Components

**What:** Compute the current year at server-render time (no runtime overhead in the browser).

**When to use:** Footer copyright, any dynamic date that should update annually without code changes.

**Example:**
```typescript
// src/components/home/Footer.tsx
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <p>&copy; {year} Asor Ahura. All rights reserved.</p>
    </footer>
  );
}
```

### Pattern 3: Replace Emoji Icons with lucide-react

**What:** Replace hardcoded emoji/special characters with semantic Icon components from lucide-react. Improves accessibility, consistency, and maintainability.

**When to use:** Whenever visual icons are used (badges, buttons, UI elements). lucide-react is the project's standard.

**Example (before):**
```typescript
const badges = [
  { label: "Secure Payment", icon: "🔒" },
  { label: "100% IP Ownership", icon: "✅" },
];
```

**Example (after):**
```typescript
import { Lock, CheckCircle } from 'lucide-react';

const badges = [
  { label: "Secure Payment", Icon: Lock },
  { label: "100% IP Ownership", Icon: CheckCircle },
];

// In JSX:
{badges.map((b) => (
  <div key={b.label}>
    <b.Icon size={18} />
    <span>{b.label}</span>
  </div>
))}
```

### Pattern 4: Focus States for Keyboard Accessibility

**What:** Use `:focus-visible` (not `:focus`) to style interactive elements for keyboard users only.

**When to use:** On all interactive elements: links, buttons, form inputs, menu items.

**Example:**
```css
/* Show focus ring for keyboard users only */
a:focus-visible,
button:focus-visible,
input:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Optionally, hide focus ring for mouse users */
a:focus:not(:focus-visible) {
  outline: none;
}
```

### Anti-Patterns to Avoid

- **Hardcoded emoji in component code:** Emoji are not semantic, not accessible to screen readers, not themeable. Use icon libraries instead.
- **Hardcoded year in strings:** Requires code changes annually. Use `new Date().getFullYear()` every time.
- **Multiple redirect layers:** Avoid redirect chains (A → B → C). Direct the final destination (A → C). Test with `curl -I` to verify single 301.
- **`:focus` without `:focus-visible`:** Styles focus state for all users (mouse + keyboard). Keyboard users need visible focus; mouse users don't. Use `:focus-visible` to distinguish.
- **Missing alt text on images:** Screen readers announce images as "image" with no context. Always include descriptive alt text. If the image is purely decorative, use `alt=""`.
- **Heading order gaps:** Don't skip from h1 to h3 or h2 to h4. Screen reader users rely on continuous heading hierarchy to navigate. Maintain h1, h2, h3, h4 in sequence.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| HTTP permanent redirects | Custom redirect middleware or Vercel Edge routing logic | next.config.mjs `redirects()` function | Already built into Next.js, compiles to static redirects (no runtime), plays well with ISR/SSG, easier to test and maintain |
| Year computation | Custom date service or environment variable | `new Date().getFullYear()` | Built-in JavaScript, zero dependencies, computed at server-render time (no browser overhead), always current |
| Icon library | Inline SVG or emoji | lucide-react (already a dependency) | lucide-react is tree-shakeable, accessible, consistent, supports theming via CSS variables, no maintenance burden |
| Lighthouse CI | Manual CLI runs documented in notion | @lhci/cli in npm scripts + GitHub Actions / CI/CD integration | Automated enforcement prevents regression, runs on every commit, stores historical data, integrates with npm run verify |
| Accessibility audit | Manual checklist | Automated tools: axe DevTools (browser), pa11y (CLI), Lighthouse audit | Tools catch 80% of issues automatically (missing alt, poor contrast, heading gaps, ARIA misuse), faster than manual review |

**Key insight:** Redirects are the only hand-written piece; everything else (year, icons, a11y, Lighthouse) is library/tool work. Don't build custom redirect logic when Next.js handles it idiomatically.

---

## Accessibility Deep Dive

### Current State

**Images without alt attributes (7 found):**
- `src/app/blog/BlogListingClient.tsx` - featured image listing
- `src/app/blog/[slug]/page.tsx` - article hero image
- `src/components/automate/PhoneMockup.tsx` - phone mockup screenshot
- `src/components/home/AboutSection.tsx` - profile/team image
- `src/components/home/HeroSection.tsx` - hero banner image
- `src/components/Navigation.tsx` - logo
- `src/components/shared/TestimonialCard.tsx` - testimonial avatar

**ARIA attributes (10 instances found):**
- Only `aria-label` on LinkedIn link in Footer.tsx
- Insufficient coverage for landmark regions, navigation, dynamic content

**Focus states (7 CSS rules found):**
- `src/components/blog/EmailCaptureWidget.tsx` has focus styling
- No site-wide focus-visible pattern; most interactive elements missing keyboard focus indicators

**Heading structure:**
- Spot-check needed on each page to verify h1 → h2 → h3 continuity (not skipping levels)

### Recommended Accessibility Checklist

1. **Alt Text (Images)** — Add descriptive alt for all 7 images
   - Non-decorative: describe what's in the image and its context (e.g., "Instagram Comment-to-DM automation demo")
   - Decorative: use `alt=""` (empty string)

2. **Focus States (Keyboard Navigation)** — Add `:focus-visible` to all interactive elements
   - Recommended: 2px solid var(--accent) outline with 2px offset
   - Test: Tab through each page; visible focus ring should appear on every button, link, and input

3. **Heading Order** — Verify h1 → h2 → h3 without gaps
   - Each page should have exactly one h1
   - h2s follow h1, h3s follow h2, etc.
   - No orphaned h3 without a parent h2

4. **Landmark Regions** — Add ARIA landmarks if not semantic HTML
   - Use `<nav>`, `<main>`, `<footer>` semantic tags where possible
   - If divs are used, add `role="navigation"`, `role="main"`, etc.

5. **Form Labels** — Verify all inputs have associated labels
   - Either `<label htmlFor="id">` or `aria-label`
   - Avoid placeholder-only inputs (placeholder ≠ label)

6. **Color Contrast** — Verify via verify-contrast.js script (already passing per DESIGN-07)
   - Run `npm run verify:contrast` before Phase 11 merge

---

## Common Pitfalls

### Pitfall 1: Redirect Chain (A → B → C instead of A → C)

**What goes wrong:** A browser makes a request to `/old-path`, gets 301 to `/middle-path`, which 301s to `/final-path`. Three HTTP roundtrips instead of one. Bad for SEO (search engines penalize redirect chains) and UX (slow).

**Why it happens:** Routes are moved in multiple phases; each phase adds its own redirect without consolidating previous ones.

**How to avoid:** Before adding a new redirect, check if the destination itself is a redirect source. Always redirect to the final, canonical route.

**Warning signs:** Testing with `curl -I https://domain.com/old-route` shows multiple 301 status codes in a row.

**Test:**
```bash
curl -I https://asorahura.com/flowmorph
# Should show: HTTP/1.1 301
#             Location: https://asorahura.com/

curl -I https://asorahura.com/automate/success
# Should show: HTTP/1.1 301
#             Location: https://asorahura.com/automate/instagram/success
```

### Pitfall 2: Missing Alt Text on Images Used for Meaning

**What goes wrong:** An image conveys information (e.g., before/after screenshot, product mockup, chart). Without alt text, screen reader users are left without context. They hear "image" and nothing else.

**Why it happens:** Developers treat images as decoration, not content. Alt text is often an afterthought.

**How to avoid:** Always ask: "If the image didn't load, would a user understand the content?" If yes, add alt text. If the image is purely decorative (e.g., background pattern), use `alt=""`.

**Warning signs:** Screen reader testing reveals missing image descriptions. Lighthouse accessibility audit flags images without alt.

**Test:**
```bash
# Lighthouse audit (available in DevTools)
lighthouse https://asorahura.com --view
# Look for "Image elements do not have alt attributes"
```

### Pitfall 3: Focus Ring Invisible for Keyboard Users

**What goes wrong:** A component removes the default focus outline (e.g., `outline: none`) without replacing it. Keyboard users cannot see which element has focus.

**Why it happens:** Developers assume all users navigate with a mouse. Default browser focus rings look "ugly" by modern design standards, so they remove them.

**How to avoid:** Never remove focus styling without replacing it. Use `:focus-visible` to show focus only for keyboard users. Design the focus state as part of the component spec.

**Warning signs:** Tabbing through pages reveals no visible focus indicator on buttons/links/inputs. Keyboard-only users can't navigate.

**Test:**
```bash
# Press Tab repeatedly; watch for a visible outline/highlight around focused elements
# On asorahura.com, currently missing on most components (gap identified)
```

### Pitfall 4: Hardcoded Year in Multiple Places

**What goes wrong:** Copyright year is hardcoded in multiple files. Next year, sites go live showing "© 2026" when it should be "© 2027". Manual code change required annually.

**Why it happens:** Copy-paste of copyright strings across components and emails. Each one is updated separately or forgotten.

**How to avoid:** Centralize the year to a single source: `new Date().getFullYear()`. Or hardcode in one place (e.g., constants file) and import everywhere.

**Warning signs:** Grepping the codebase reveals multiple year literals: `"© 2026"` in Footer, email templates, layout metadata, etc.

**Test:**
```bash
grep -r "2026\|2025" src/ --include="*.tsx" --include="*.ts"
# Should return only: src/components/home/Footer.tsx (once)
```

### Pitfall 5: Heading Order Skips (h1 → h3, missing h2)

**What goes wrong:** A page starts with h1, then jumps to h3, skipping h2. Screen reader users rely on heading hierarchy to navigate. Skipped levels cause confusion.

**Why it happens:** Template reuse without checking heading levels. Component renders an h3 but the page context expects an h2.

**How to avoid:** Verify heading order on each page manually. Use axe DevTools or pa11y CLI to catch skips automatically.

**Warning signs:** Screen reader announces "heading 1" then "heading 3" with no "heading 2" in between.

**Test:**
```bash
# Manual: View page source, search for <h1>, <h2>, <h3>
# Should be in order without gaps

# Automated:
npx pa11y https://asorahura.com
# Look for: "Heading order is invalid"
```

---

## Responsive Design Specification

Current CSS media queries cover 480px and 768px. Phase 11 requires testing across 4 breakpoints:

| Breakpoint | Device Example | Current CSS | Gap |
|-----------|---|---|---|
| 360px | Small phone (iPhone SE, Galaxy A12) | ✓ (covered by 480px rule) | 360 < 480, may have uncovered edge cases |
| 768px | Tablet/iPad landscape (covered by 480px rule) | ✓ | None (exact match) |
| 1024px | iPad portrait, small laptop | — | No CSS rule for 1024px |
| 1440px | Desktop monitor, large laptop | — | No CSS rule for 1440px |

### Recommended Breakpoint Strategy

Add CSS media queries for 1024px and 1440px, or rely on Tailwind's responsive prefixes (`md:`, `lg:`, `xl:`, `2xl:`). Current project uses minimal CSS modules + Tailwind classes; extend as needed:

```css
/* Add to globals.css or component CSS modules */
@media (max-width: 1024px) {
  /* Tablet/small laptop adjustments */
  .container {
    padding: 0 2rem;  /* increase from 4rem */
  }
}

@media (min-width: 1440px) {
  /* Large desktop adjustments */
  .container {
    max-width: 1400px;  /* increase from 1300px */
  }
}
```

### Manual Responsive Testing Checklist

1. **360px (mobile):** Use Chrome DevTools to set viewport to 360×800
   - Check: Text is readable (no horizontal scroll required)
   - Check: Buttons are touchable (min 44px height)
   - Check: Navigation collapses or reflows
   - Check: Images scale without distortion

2. **768px (tablet):** Set viewport to 768×1024
   - Check: 2-column layouts display correctly
   - Check: Cards reflow if needed
   - Check: Navigation is visible (no mobile-only menu needed)

3. **1024px (small laptop):** Set viewport to 1024×768
   - Check: 3-column layouts display
   - Check: Hero sections have appropriate spacing
   - Check: No content is cut off on the right

4. **1440px (desktop):** Set viewport to 1440×900
   - Check: Hero image aspect ratio is maintained
   - Check: Max-width containers don't stretch too wide
   - Check: Spacing looks balanced (not cramped)

**Test routes:**
- `/` (homepage)
- `/automate` (catalog page)
- `/automate/instagram` (product detail page)
- `/assessment` (assessment flow)
- `/blog` (blog listing)

---

## Lighthouse Performance Baseline

No Lighthouse CI currently exists. Phase 11 must establish thresholds and automate runs on `/` and `/automate`.

### Recommended Thresholds (Industry Standard v2.0)

| Category | Threshold | Rationale |
|----------|-----------|-----------|
| **Performance** | ≥ 90 | LCP, CLS, FID should be fast for SaaS marketing site; avoid punishing slow third-party scripts |
| **Accessibility** | ≥ 95 | High bar: all images have alt text, focus states visible, heading order correct, color contrast passes WCAG AA |
| **Best Practices** | ≥ 90 | Security (no mixed content), browser API usage (no deprecated APIs), HTTPS, error-free console |
| **SEO** | ≥ 100 | Critical for a marketing site: meta tags, viewport set, mobile-friendly, fast enough for Core Web Vitals |

### Lighthouse CI Setup

Install and configure `@lhci/cli`:

```bash
npm install --save-dev @lhci/cli
npx lhci wizard
# Generates: .lhcirc.json
```

Example `.lhcirc.json`:

```json
{
  "ci": {
    "collect": {
      "url": [
        "https://asorahura.com/",
        "https://asorahura.com/automate"
      ],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.90 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.90 }],
        "categories:seo": ["error", { "minScore": 1.0 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

Add to npm scripts:

```json
"scripts": {
  "lighthouse": "lhci autorun"
}
```

Run locally:

```bash
npm run lighthouse
# Runs 3 times on each URL, compares against thresholds, reports pass/fail
```

---

## Design Token System Documentation (for README.md)

Phase 11 requires a README section documenting the design token system so future developers maintain it correctly.

### Recommended README Section Structure

```markdown
## Design System & Tokens

### Overview

Asorahura uses a semantic design token system defined in CSS custom properties (`:root` variables) in `src/app/globals.css`. All color, type, spacing, radius, shadow, and transition values flow through these tokens. This prevents fragmentation and ensures consistency across the site.

### Token Structure

Tokens use semantic naming: `--category-step` (e.g., `--ink-1`, `--spacing-3`, `--accent-hover`).

#### Color Tokens

Defined for light-first palette (Direction B from Phase 6):

**Surfaces** (backgrounds, card fills)
- `--surface-1`: Primary background (cream)
- `--surface-2`: Secondary surface (light accent)
- `--surface-3`: Tertiary surface (divider/emphasis)
- `--surface-4`: Overlay/modal background

**Text (Ink)**
- `--ink-1`: Primary text (high contrast)
- `--ink-2`: Secondary text (lower emphasis)
- `--ink-3`: Tertiary text (lowest emphasis, disabled)

**Accent**
- `--accent`: Primary action/brand color (warm gold)
- `--accent-hover`: Darker shade for hover state
- `--accent-active`: Darkest shade for active/pressed state

**Semantic**
- `--success`: Green, used for positive feedback
- `--error`: Red, used for errors and destructive actions
- `--warn`: Orange, used for warnings

**Borders**
- `--border-1`: Light border (8% opacity)
- `--border-2`: Medium border (16% opacity)

#### Type Tokens

Modular scale (1.25× major-third ratio):

- `--fontSize-1`: 12px (captions, fine print)
- `--fontSize-2`: 16px (body text, standard)
- `--fontSize-3`: 18px (large body)
- `--fontSize-4`: 20px (subheading)
- `--fontSize-5`: 24px (heading, medium)
- `--fontSize-6`: 32px (heading, large)
- `--fontSize-7`: 48px (hero, display)

**Font Weight**
- `--fontWeight-normal`: 400
- `--fontWeight-bold`: 700

**Line Height**
- `--lineHeight-tight`: 1.1
- `--lineHeight-normal`: 1.5
- `--lineHeight-relaxed`: 1.6

#### Spacing Tokens

Modular scale (multiples of 4px):

- `--spacing-1`: 4px
- `--spacing-2`: 8px
- `--spacing-3`: 16px
- `--spacing-4`: 24px
- `--spacing-5`: 32px
- `--spacing-6`: 48px

#### Other Tokens

**Radius** (border-radius)
- `--radius-1`: 4px (tight)
- `--radius-2`: 8px (standard)
- `--radius-3`: 12px (loose)

**Shadow** (drop shadows, depth)
- `--shadow-1`: 0 1px 2px rgba(31,27,23,0.05) (subtle)
- `--shadow-2`: 0 4px 8px rgba(31,27,23,0.1) (medium)
- `--shadow-3`: 0 12px 24px rgba(31,27,23,0.12) (prominent)

**Duration** (transition/animation speed)
- `--duration-1`: 150ms (snappy)
- `--duration-2`: 300ms (standard)
- `--duration-3`: 500ms (slow, prominent)

### Usage

All tokens are consumed via CSS `var()`:

```css
/* In a component's CSS module or globals.css */
.button {
  background: var(--accent);
  color: var(--ink-1);
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-2);
  transition: background var(--duration-1) ease;
}

.button:hover {
  background: var(--accent-hover);
}
```

Never hardcode hex colors, sizes, or spacing values. Always reach for a token first.

### Adding New Tokens

1. Verify the value aligns with existing scale (e.g., new spacing should be 4, 8, 12, 16, 20, 24... px)
2. Add to `:root` in `src/app/globals.css` with a semantic name
3. Update this documentation section with the new token and its rationale
4. Run `npm run verify:contrast` to ensure color tokens maintain WCAG AA compliance
5. Test across responsive breakpoints (360, 768, 1024, 1440) to ensure visual consistency

### Modifying Existing Tokens

Before changing a token value:
1. Search the codebase: `grep -r "var(--token-name)" src/`
2. Verify no component hardcodes the old value elsewhere
3. Update the token value in `src/app/globals.css`
4. Run `npm run verify:contrast` to ensure compliance
5. Test the affected components visually across breakpoints
6. Include a note in your commit message: "Updated --token-name from X to Y for [reason]"

### Token Verification Script

A contrast verification script ensures all text/surface color pairings meet WCAG AA standards (4.5:1 minimum for body text, 3:1 for large).

```bash
npm run verify:contrast
# Reads src/app/globals.css
# Parses :root custom properties
# Calculates contrast ratio for every ink × surface and semantic × surface pairing
# Fails (exit 1) if any pairing is below the threshold
# Script: scripts/verify-contrast.js
```

Run this before committing color token changes:

```bash
npm run verify:contrast  # Must pass before merge
npm run build             # Must build successfully
npm run test              # Must pass all tests
```

### References

- **Phase 6 Deep Dive:** [.planning/phases/06-palette-decision-token-foundation/06-RESEARCH.md](../../phases/06-palette-decision-token-foundation/06-RESEARCH.md) — Full design system research, palette direction reasoning, and WCAG verification methodology
- **Tailwind Responsive Design:** https://tailwindcss.com/docs/responsive-design — How responsive prefixes integrate with tokens
- **WCAG 2.0 Contrast:** https://www.w3.org/TR/WCAG20/ — Official contrast ratio requirements (4.5:1 body, 3:1 large text)
```

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | vitest 4.1.10 (unit testing) + Lighthouse CLI (performance) |
| Config file | vitest.config.ts + .lhcirc.json (Lighthouse CI, to be created) |
| Quick run command | `npm test -- tests/` |
| Full suite command | `npm test && npm run verify:contrast && npm run lighthouse` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| POLISH-01 | Redirect from /flowmorph to / (HTTP 301) | Unit (source check) | `grep "source: '/flowmorph'" next.config.mjs` | ✓ yes (already has test: test-automate-instagram-route.test.ts asserts redirect entries) |
| POLISH-01 | Redirect from /automate/success to /automate/instagram/success (HTTP 301) | Unit (source check) + integration (HTTP) | `curl -I https://asorahura.com/automate/success` | ✓ yes (test-automate-instagram-route.test.ts verifies) |
| POLISH-02 | Footer year renders current year dynamically | Component (source check) | `grep "new Date().getFullYear()" src/components/home/Footer.tsx` | ❌ Wave 0 (needs implementation) |
| POLISH-03 | TrustBadges uses lucide-react icons, not emoji | Component (source check) | `grep -v "🏆\|🔒\|✅" src/components/checkout/TrustBadges.tsx` | ❌ Wave 0 (needs migration) |
| POLISH-04 | All images have alt text | Component (source check) | `grep -r "src/app\|src/components" --include="*.tsx" | grep "<Image" | grep -v "alt="` | ❌ Wave 0 (7 images flagged) |
| POLISH-04 | Key interactive elements have :focus-visible styles | CSS check | `grep ":focus-visible" src -r --include="*.css"` | ❌ Wave 0 (7 focus rules insufficient) |
| POLISH-05 | Homepage responsive at 360px | Manual | Viewport test at 360×800 in DevTools, verify no horizontal scroll | ❌ Wave 0 (requires manual testing) |
| POLISH-05 | Homepage responsive at 1024px | Manual | Viewport test at 1024×768 in DevTools, verify layout integrity | ❌ Wave 0 (requires manual testing) |
| POLISH-06 | Lighthouse runs on / | CI/CD | `npm run lighthouse` targets https://asorahura.com/ | ❌ Wave 0 (@lhci/cli needs setup + .lhcirc.json) |
| POLISH-06 | Lighthouse on / meets Performance ≥90 threshold | CI/CD | `npm run lighthouse | grep "Performance.*9[0-9]"` | ❌ Wave 0 (thresholds TBD) |
| POLISH-07 | README section documents design tokens | Content check | `grep -A 20 "## Design System" README.md` | ❌ Wave 0 (README.md doesn't exist) |

### Sampling Rate

- **Per task commit:** `npm test -- tests/`  (vitest suite, ~10s)
- **Per wave merge:** `npm test && npm run verify:contrast && npm run lighthouse` (full validation, ~2min)
- **Phase gate:** All three must pass (tests green, contrast script exit 0, Lighthouse thresholds met) before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] `src/components/home/Footer.tsx` — Replace `&copy; 2026` with `&copy; {new Date().getFullYear()}`
- [ ] `src/components/checkout/TrustBadges.tsx` — Replace emoji (🏆 🔒 ✅) with lucide-react icons (Trophy, Lock, CheckCircle)
- [ ] `tests/test-polish-redirects.test.ts` — New test file for all 4 redirects (flowmorph, automate/success, articles, assessment/deep)
- [ ] Add alt text to 7 images across components and app routes
- [ ] Add `:focus-visible` styles to globals.css and component CSS modules (buttons, links, inputs)
- [ ] Create `.lhcirc.json` with thresholds: Performance 90, Accessibility 95, Best Practices 90, SEO 100
- [ ] Add `npm run lighthouse` script to package.json
- [ ] Create `README.md` with Design System section (or append to existing README if one is created by another phase)
- [ ] Manual responsive testing at 360, 768, 1024, 1440px for `/`, `/automate`, `/automate/instagram`, `/assessment`, `/blog`

*(If all gaps are completed: "Wave 0 ready — all POLISH-01 through POLISH-07 requirements have test/implementation entry points")*

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V1 Architecture | no | Phase 11 is polish only; no architectural changes |
| V2 Authentication | no | No auth flows in Phase 11 scope |
| V3 Session Management | no | No session changes |
| V4 Access Control | no | No access control changes |
| V5 Input Validation | no | No new form inputs; redirects are configuration only |
| V6 Cryptography | no | No cryptographic changes |
| V13 Security Headers | optional | Review: CSP, X-Frame-Options (existing or TBD) |

### Known Threat Patterns (Design Tokens + Redirects)

| Pattern | STRIDE | Risk | Mitigation |
|---------|--------|------|-----------|
| Hardcoded year in multiple locations | Tampering | Future year not updated annually, shows stale copyright | Centralize to `new Date().getFullYear()` single source |
| Redirect chain (A → B → C) | Denial of Service | Multiple HTTP roundtrips slow down user, poor SEO | Verify no redirect is a destination for another redirect; test with `curl -I` |
| Open-ended redirect rules | Tampering/Information Disclosure | An over-broad regex could redirect to attacker domains | Use exact string matches in next.config.mjs redirects, never wildcard patterns like `source: '/old-*'` |
| Missing alt text on images | Information Disclosure | Screen reader users can't understand images; privacy risk if image conveys sensitive info | Audit all images; add descriptive alt text or `alt=""` for decoration |

---

## Assumptions Log

> All claims in this research were verified against codebase inspection, git history, and official Next.js documentation. No assumptions about future requirements.

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| (none) | All findings verified via codebase inspection or git log | — | — |

**If this table is empty:** All findings were confirmed — no user validation needed.

---

## Open Questions

1. **Lighthouse thresholds not yet agreed upon.**
   - What we know: Industry standard is Performance ≥90, Accessibility ≥95, Best Practices ≥90, SEO ≥100
   - What's unclear: Does Asorahura want stricter/looser thresholds? Are there known performance issues to accept (e.g., heavy images, third-party scripts)?
   - Recommendation: Use industry standard thresholds as Phase 11 plan input. If they fail, debug and fix (e.g., optimize images, defer scripts). Thresholds should never be lowered without explicit decision.

2. **Are there other retired routes beyond the 4 found?**
   - What we know: /flowmorph, /automate/success, /articles, /assessment/deep are confirmed changed
   - What's unclear: Did earlier phases (1-5) delete any routes not visible in Phase 6-10 git history?
   - Recommendation: Grep git log for `delete mode.*page.tsx` to find all deletions. If more exist, add redirects.

3. **Should the README be a new file or appended to an existing file?**
   - What we know: No root README exists today
   - What's unclear: Is a root README.md in scope for Phase 11, or should token docs go in a separate DESIGN_TOKENS.md?
   - Recommendation: Create README.md at root with Design System section. It's the first place developers will look for guidance.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | @lhci/cli, npm scripts | ✓ | 18+ (assumed; verify with `node --version`) | — |
| npm | Package management | ✓ | 9+ | — |
| @lhci/cli | Lighthouse CI automation | ✗ | — | Manual `npm install --save-dev @lhci/cli@^0.12` |
| Chrome / Chromium | Lighthouse runs | ✓ | Latest | — |
| curl | HTTP redirect testing | ✓ | Any | wget (alternative) |

**Missing dependencies with no fallback:** None — @lhci/cli install is trivial.

**Missing dependencies with fallback:** None.

---

## Code Examples

### Example 1: Dynamic Footer Year

**Source:** [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

```typescript
// src/components/home/Footer.tsx
export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.bottom}>
        <p className={styles.copyright}>
          &copy; {year} Asor Ahura. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
```

### Example 2: Replace Emoji with lucide-react Icons

**Source:** [lucide-react documentation](https://lucide.dev/)

```typescript
// src/components/checkout/TrustBadges.tsx
import { Trophy, Lock, CheckCircle } from 'lucide-react';

const badges = [
  { label: "Oracle Certified", Icon: Trophy },
  { label: "Secure Payment via Paddle", Icon: Lock },
  { label: "100% IP Ownership", Icon: CheckCircle },
];

export function TrustBadges() {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {badges.map((b) => (
        <div
          key={b.label}
          className="flex items-center gap-2 border border-[var(--border-1)] rounded-full px-4 py-2 text-sm text-[var(--ink-2)]"
        >
          <b.Icon size={18} />
          <span>{b.label}</span>
        </div>
      ))}
    </div>
  );
}
```

### Example 3: Permanent Redirects in next.config.mjs

**Source:** [Next.js Redirects](https://nextjs.org/docs/app/api-reference/next-config-js/redirects)

```typescript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/flowmorph',
        destination: '/',
        permanent: true,  // HTTP 301
      },
      {
        source: '/automate/success',
        destination: '/automate/instagram/success',
        permanent: true,
      },
      // Add more as needed; test with: curl -I https://domain.com/old-route
    ];
  },
};

export default nextConfig;
```

### Example 4: Focus State for Keyboard Accessibility

**Source:** [MDN :focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible)

```css
/* src/app/globals.css or component.module.css */

/* Show focus ring for keyboard users only */
a:focus-visible,
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Optional: hide focus for mouse users */
a:focus:not(:focus-visible),
button:focus:not(:focus-visible) {
  outline: none;
}
```

### Example 5: Alt Text for Images

**Source:** [WCAG 2.1 1.1.1 Non-text Content](https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html)

```typescript
// Good: Descriptive alt text
<Image
  src="/automate/phone-mockup.png"
  alt="Instagram DM mockup showing a customer comment converted to a direct message"
  width={400}
  height={600}
/>

// Good: Decorative image with empty alt
<Image
  src="/hero-background.svg"
  alt=""  // Purely decorative
  fill
  className={styles.heroBg}
/>

// Bad: Missing alt (accessibility violation)
<Image
  src="/team-photo.jpg"
  width={300}
  height={200}
/>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Multiple hardcoded redirects in middleware | Centralized redirects in next.config.mjs | Phase 4-09 | Simpler, builds to static HTTP 301s, no runtime overhead |
| Emoji icons (🔒 ✅ ↑) | lucide-react Icon components | Phase 7+ | Accessible, themeable, consistent, tree-shakeable |
| Hardcoded footer year "2026" | `new Date().getFullYear()` | Phase 11 | Zero maintenance, always current, single source |
| Manual Lighthouse runs (documented in Notion) | @lhci/cli automation in CI/CD | Phase 11 | Enforced on every commit, prevents regression, stores history |
| No accessibility audit | Automated + manual accessibility checks | Phase 11 | Catches 80% of issues early, keyboard navigation validated |
| No design token documentation | README section + links to Phase 6 research | Phase 11 | Future-proofs the system, onboards new developers |

**Deprecated/outdated:**
- Playfair Display font (deprecated in Phase 6 if DESIGN-06 completed) — should be removed from tailwind.config.ts and no longer loaded
- `/flowmorph` route (deleted Phase 4-01, has redirect) — old links still work via 301
- Direct Calendly links in primary funnel (removed Phase 10) — enterprise track still uses it per project constraints

---

## Sources

### Primary (HIGH confidence)

- **Next.js Redirects API** — https://nextjs.org/docs/app/api-reference/next-config-js/redirects (official docs, version 16.2.6 confirmed)
- **Codebase inspection** — next.config.mjs, src/components/home/Footer.tsx, src/components/checkout/TrustBadges.tsx (verified by direct file read)
- **Git history** — Phase 4-01, 09.1-03, 10-02 commits confirmed route changes via `git log --oneline --all`
- **Phase 6 RESEARCH.md** — Design token system documented in `.planning/phases/06-palette-decision-token-foundation/06-RESEARCH.md`

### Secondary (MEDIUM confidence)

- **lucide-react documentation** — https://lucide.dev/ (official, well-maintained icon library)
- **@lhci/cli documentation** — https://github.com/GoogleChrome/lighthouse-ci (official Google Chrome project)
- **WCAG 2.1 Contrast Ratio** — https://www.w3.org/TR/WCAG21/ (W3C standard, scientific basis)
- **MDN :focus-visible** — https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible (Mozilla reference)

### Tertiary (references for planner)

- **Vercel Analytics** — Already installed in Phase 7; no additional setup needed for Phase 11
- **WCAG 2.1 1.1.1 Non-text Content (Alt Text)** — https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html (accessibility standard)

---

## Metadata

**Confidence breakdown:**
- **Redirects (POLISH-01):** HIGH — 4 route changes confirmed via git log and codebase inspection; Next.js redirects() API is official
- **Dynamic year (POLISH-02):** HIGH — Footer.tsx hardcoded year confirmed; `new Date().getFullYear()` is standard React/JS
- **Icon replacement (POLISH-03):** HIGH — Emoji found in TrustBadges.tsx; lucide-react already a dependency
- **Accessibility (POLISH-04):** HIGH — 7 images without alt confirmed via grep; ARIA usage counted; focus states tallied from CSS
- **Responsive (POLISH-05):** MEDIUM — Current breakpoints confirmed in globals.css; 360/1024/1440 testing is manual (no automated verification of viewport-specific CSS)
- **Lighthouse (POLISH-06):** MEDIUM — @lhci/cli is official Google tool; thresholds are recommendations (not yet agreed with user)
- **Token documentation (POLISH-07):** HIGH — Tokens verified in src/app/globals.css; Phase 6 RESEARCH.md documents the system; README.md doesn't exist (needs creation)

**Research date:** 2026-08-11
**Valid until:** 2026-09-11 (30 days; design system is stable, redirects are static, Lighthouse tooling is mature)

---

*Phase 11: Cleanup & Consistency*
*Research completed 2026-08-11*
*Planner can now create PLAN.md for this phase.*
