# Phase 11: Cleanup & Consistency - Pattern Map

**Mapped:** 2026-08-11
**Files analyzed:** 8
**Analogs found:** 8 / 8 (all analogs are existing versions of the same files, since this phase is pure modification — no new files except README.md)

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|--------------------|------|-----------|-----------------|----------------|
| `next.config.mjs` | config | request-response (HTTP redirect) | itself (existing `redirects()` array) | exact |
| `tests/test-polish-redirects.test.ts` (new) | test | request-response | `tests/test-automate-instagram-route.test.ts` | exact |
| `src/components/home/Footer.tsx` | component | transform (render-time computation) | itself (existing static string to replace) | exact |
| `src/components/checkout/TrustBadges.tsx` | component | transform | `src/components/home/Footer.tsx` (lucide-react icon usage pattern) | role-match |
| `src/app/automate/instagram/success/success.module.css` + `page.tsx` | component | transform | `src/components/checkout/TrustBadges.tsx` (icon migration) | role-match |
| `src/app/services/page.tsx` (bullet check icon) | component | transform | `src/components/checkout/TrustBadges.tsx` | role-match |
| `src/app/globals.css` (focus-visible rules) | config/style | event-driven (keyboard focus) | `src/components/assessment/EmailGate.module.css` (existing `.input:focus` rule) | partial-match |
| `README.md` (new) | config/docs | — | `.planning/phases/06-palette-decision-token-foundation/06-RESEARCH.md` (token content source) | no-analog (new file type for repo) |

## Pattern Assignments

### `next.config.mjs` (config, request-response)

**Analog:** itself — current `redirects()` array (lines 16-29)

**Current state:**
```javascript
async redirects() {
    return [
        {
            source: '/flowmorph',
            destination: '/',
            permanent: true,
        },
        {
            source: '/automate/success',
            destination: '/automate/instagram/success',
            permanent: true,
        },
    ];
},
```

**Finding:** Only 2 of the 4 retired routes are handled via `next.config.mjs` HTTP 301s. The other two (`/articles` and `/assessment/deep`) are already handled via in-page `redirect()` calls (see below) and do NOT need to move into `next.config.mjs` — both patterns are valid Next.js redirect mechanisms and already satisfy POLISH-01. No new routes were found to be missing redirects; RESEARCH.md's 4-route list is exhaustive per this inspection.

**Action for planner:** No new redirect entries appear necessary unless additional retired routes are discovered via git log. If `git log --oneline --all | grep "delete mode.*page.tsx"` (per RESEARCH.md Open Question 2) turns up more deletions, add them here following the exact object shape above (`source`, `destination`, `permanent: true`). Never use wildcard `source` patterns.

---

### `tests/test-polish-redirects.test.ts` (new file, test)

**Analog:** `tests/test-automate-instagram-route.test.ts` (full file, 71 lines — read completely, no re-read needed)

**Import + assertion pattern to copy** (lines 1-9, 11-49):
```typescript
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import nextConfig from "../next.config.mjs";

async function getRedirects() {
  if (!nextConfig.redirects) throw new Error("next.config.mjs has no redirects() function");
  return nextConfig.redirects();
}

describe("next.config.mjs redirects()", () => {
  it("includes a redirect from /automate/success to /automate/instagram/success", async () => {
    const redirects = await getRedirects();
    expect(redirects).toContainEqual(
      expect.objectContaining({
        source: "/automate/success",
        destination: "/automate/instagram/success",
        permanent: true,
      })
    );
  });
  // ... repeat objectContaining assertion per route
});
```

**IMPORTANT — existing test constraint to respect:** `tests/test-automate-instagram-route.test.ts` line 36-40 asserts `redirects` has **exactly 2 entries**:
```typescript
it("has exactly 2 redirect entries", async () => {
  const redirects = await getRedirects();
  expect(redirects).toHaveLength(2);
});
```
If the phase plan adds any new `next.config.mjs` redirect entries, this existing test will break and must be updated in the same plan/commit. If no new `next.config.mjs` entries are added (per the finding above — `/articles` and `/assessment/deep` already use in-page `redirect()`), this test does not need touching, and the new `test-polish-redirects.test.ts` should instead assert the in-page redirect calls via source-file `readFileSync` + string match, following the "hardcoded reference fixes" pattern below.

**Source-file string-match pattern to copy** (lines 52-70):
```typescript
describe("hardcoded reference fixes", () => {
  it("<file> references <target-path>", () => {
    const contents = readFileSync(
      path.resolve(__dirname, "../src/app/articles/page.tsx"),
      "utf-8"
    );
    expect(contents).toContain("redirect('/blog')");
  });
});
```
Use this same shape to assert `src/app/assessment/deep/page.tsx` contains `redirect("/assessment?depth=deep")`.

---

### `src/components/home/Footer.tsx` (component, request-response render)

**Analog:** itself — file read in full (70 lines)

**Current hardcoded year** (line 63-65):
```tsx
<div className={styles.bottom}>
  <p className={styles.copyright}>
    &copy; 2026 Asor Ahura. All rights reserved.
  </p>
</div>
```

**Target pattern** (component is a server component already — no `"use client"` directive, no hooks — so `new Date().getFullYear()` can be called directly in the function body):
```tsx
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      ...
      <p className={styles.copyright}>
        &copy; {year} Asor Ahura. All rights reserved.
      </p>
    </footer>
  );
}
```
No import changes needed. This is the only hardcoded year literal found in `src/` via grep (RESEARCH.md pitfall 4 test confirmed: only Footer.tsx line 64 matches `"2026"`).

---

### `src/components/checkout/TrustBadges.tsx` (component, transform)

**Analog:** itself — file read in full (22 lines). This is the canonical file RESEARCH.md Example 2 already targets.

**Current state (full file):**
```tsx
const badges = [
  { label: "Oracle Certified", icon: "🏆" },
  { label: "Secure Payment via Paddle", icon: "🔒" },
  { label: "100% IP Ownership", icon: "✅" },
];

export function TrustBadges() {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {badges.map((b) => (
        <div
          key={b.label}
          className="flex items-center gap-2 border border-[var(--border-1)] rounded-full px-4 py-2 text-sm text-[var(--ink-2)]"
        >
          <span>{b.icon}</span>
          <span>{b.label}</span>
        </div>
      ))}
    </div>
  );
}
```

**lucide-react import convention to copy** — from `src/components/home/Footer.tsx` line 2:
```tsx
import { Linkedin } from "lucide-react";
```
And usage — Footer.tsx lines 55-56:
```tsx
<Linkedin size={18} />
<span>LinkedIn</span>
```

**Target for TrustBadges.tsx** (per RESEARCH.md Example 2, confirmed consistent with Footer.tsx's icon-import/size convention):
```tsx
import { Trophy, Lock, CheckCircle } from "lucide-react";

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

---

### Other mixed-icon occurrences (POLISH-03 scope — beyond RESEARCH.md's TrustBadges-only claim)

Grep for `↑|✕|✓|🔒|🏆|✅` across `src/` (verified 2026-08-11) found **9 files**, not just TrustBadges.tsx and the success page:

| File | Line | Match | Notes |
|------|------|-------|-------|
| `src/app/services/page.tsx` | 115 | `<span className={styles.bulletCheck}>✓</span>` | Enterprise services bullet list — CSS class `.bulletCheck` exists, styled as a checkmark; migrate to `<Check size={16} className={styles.bulletCheck} />` from lucide-react |
| `src/app/automate/instagram/success/page.tsx` | 148 | `✓ We'll be in touch soon...` | Inline text checkmark inside a success message string — migrate to `<CheckCircle size={16} />` prefixing the text, or keep as decorative text glyph if not part of "product page" scope |
| `src/components/checkout/TrustBadges.tsx` | 2-4 | 🏆 🔒 ✅ | Primary target, see above |
| `src/components/checkout/OrderSummary.tsx` | (grep hit) | — | Needs inspection; likely a checkmark/lock icon in order line items |
| `src/app/checkout/page.tsx` | (grep hit) | — | Needs inspection |
| `src/components/assessment/RevenueResultsScreen.tsx` | (grep hit) | — | Needs inspection |
| `src/components/automate/BuildMapForm.tsx` | (grep hit) | — | Needs inspection |
| `src/app/unsubscribe/page.tsx` | (grep hit) | — | Needs inspection |
| `src/lib/articles.ts` | (grep hit) | — | Likely a non-UI string constant (e.g. markdown bullet); verify before touching — may be legitimate content, not a UI icon |

**Recommendation for planner:** POLISH-03 explicitly names "Product page's mixed icon set" (singular) — the primary confirmed target is `src/app/automate/instagram/page.tsx` and its dependents (`TrustBadges.tsx` is imported into checkout/product flow). Treat `src/app/services/page.tsx` and the success page as in-scope since they are part of the same purchase funnel and use the same `✓` glyph pattern the requirement calls out. Files outside the `/automate` and `/checkout` funnel (`unsubscribe`, `RevenueResultsScreen`, `articles.ts`) should be spot-checked but are lower priority — confirm each one is actually a UI icon (not legitimate markdown/copy content) before changing.

---

### `src/app/globals.css` — focus-visible pattern (style, event-driven)

**Analog:** `src/components/assessment/EmailGate.module.css` lines 51-53 (existing `:focus` rule, not yet `:focus-visible`):
```css
.input:focus {
  border-color: var(--accent);
}
```

**Existing `:focus-visible` usage found in 4 files** (none in `globals.css` itself — no site-wide rule exists yet):
- `src/app/engage/engage.module.css`
- `src/components/assessment/EmailGate.module.css`
- `src/app/automate/instagram/success/success.module.css`
- `src/components/automate/BuildMapForm.module.css`

**Target pattern to add to `globals.css`** (per RESEARCH.md Pattern 4 / Example 4), placed near existing global resets (after line 70's `* { box-sizing: border-box; ... }` block):
```css
a:focus-visible,
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```
Token to use: `--accent` (`#C9A86D`, defined `globals.css` line 12) — already the project's semantic accent token, do not hardcode a hex value.

**Existing breakpoints in `globals.css`** (verified via grep): `@media (max-width: 768px)` at line 146, `@media (max-width: 480px)` at line 160. No 1024px or 1440px rules exist — confirms RESEARCH.md gap for POLISH-05.

---

### `README.md` (new file, docs)

**No analog exists in this repo** — no root README.md currently. Content source is `.planning/phases/06-palette-decision-token-foundation/06-RESEARCH.md` (token deep-dive) plus the current `src/app/globals.css` `:root` block (lines 3-59, read in full above) as the source of truth for exact token names/values — verified they match RESEARCH.md's documented Design Token System section (surfaces, ink, accent, semantic, spacing, fontSize, radius, shadow, duration all present and matching).

**Verification script reference to include** — confirmed real, from `package.json` line 11:
```json
"verify:contrast": "node scripts/verify-contrast.js"
```
Command for README: `npm run verify:contrast`.

**Structure to use:** Copy verbatim the "Recommended README Section Structure" markdown block from RESEARCH.md lines 609-763 — it was authored against the actual current token values (spot-checked against `globals.css` and confirmed accurate: `--surface-1: #FDFAF4`, `--accent: #C9A86D`, `--spacing-1: 4px` through `--spacing-6: 48px`, `--fontSize-1: 12px` through `--fontSize-7: 48px`, `--radius-1/2/3`, `--shadow-1/2/3`, `--duration-1/2/3` all match exactly).

---

## Shared Patterns

### lucide-react icon import/usage convention
**Source:** `src/components/home/Footer.tsx` line 2, 55-56
**Apply to:** `TrustBadges.tsx`, `services/page.tsx` bullet checks, success page checkmark
```tsx
import { IconName } from "lucide-react";
// ...
<IconName size={18} />
```
Consistent `size` prop values seen in codebase: `16` (small inline/bullet) and `18` (badge/footer standard).

### CSS custom property tokens (design system)
**Source:** `src/app/globals.css` lines 3-59
**Apply to:** Any new CSS (focus-visible rules, responsive breakpoint additions, README documentation)
Never hardcode hex/px values — always reference `var(--token-name)`.

### Vitest source-check test pattern
**Source:** `tests/test-automate-instagram-route.test.ts` (full file)
**Apply to:** `tests/test-polish-redirects.test.ts`
Uses `readFileSync` + `path.resolve(__dirname, "../...")` for string-match assertions on source files, and direct `import nextConfig from "../next.config.mjs"` + `nextConfig.redirects()` invocation for config-based assertions.

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `README.md` | docs | — | No root README exists in repo; must be authored fresh using RESEARCH.md's structure and `globals.css` as source of truth |
| `.lhcirc.json` | config | — | No Lighthouse CI config exists; RESEARCH.md Example provides the full JSON to create verbatim (no existing analog config to pattern-match) |

## Metadata

**Analog search scope:** `src/`, `tests/`, `next.config.mjs`, `package.json`, `src/app/globals.css`
**Files scanned:** ~20 (Footer.tsx, TrustBadges.tsx, next.config.mjs, globals.css, test-automate-instagram-route.test.ts, articles/page.tsx, assessment/deep/page.tsx, 7 Image-containing components/pages, 9 mixed-icon-glyph files, 4 focus-visible CSS files)
**Pattern extraction date:** 2026-08-11

**Correction to RESEARCH.md:** The 7 "images without alt attributes" listed in RESEARCH.md (POLISH-04 accessibility section) were re-verified directly and **all 7 already have `alt` attributes** as of this inspection (`Navigation.tsx` line 28 `alt="Asor Ahura Logo"`, `HeroSection.tsx` line 38 `alt="Asor Ahura"`, `PhoneMockup.tsx` line 18 descriptive alt, `blog/[slug]/page.tsx` line 58 `alt={post.title}`, `BlogListingClient.tsx` line 44 `alt={post.title}`, `AboutSection.tsx` line 13 `alt="Asor Ahura"`, `TestimonialCard.tsx` line 16 `alt={name}`). This gap may have been closed by an earlier phase after RESEARCH.md was written, or the research finding was inaccurate. Planner should re-run the grep test from RESEARCH.md (`grep -r "<Image" ... | grep -v "alt="`) at plan time to confirm current state before scoping POLISH-04 alt-text work — it may already be satisfied, narrowing that requirement to focus-states, heading-order, and landmark-region work only.

**Correction to RESEARCH.md POLISH-03 scope:** RESEARCH.md names only `TrustBadges.tsx` and "success page" as mixed-icon sources. Direct grep found 9 files with icon glyphs; see "Other mixed-icon occurrences" table above for the full list and per-file scope recommendation.
