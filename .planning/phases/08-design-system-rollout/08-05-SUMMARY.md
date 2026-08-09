---
phase: 08-design-system-rollout
plan: 05
subsystem: ui
tags: [css-modules, design-tokens, css-custom-properties, theming]

# Dependency graph
requires:
  - phase: 08-design-system-rollout (plan 01)
    provides: dead-code deletion pass and phase pattern map (08-PATTERNS.md) that this plan's token substitutions follow
provides:
  - Seven legal/blog/article CSS modules converted to 100% token-driven color/spacing/type values
  - Removal of last remaining references to Phase 6's deleted legacy aliases (var(--foreground), var(--muted), var(--border))
  - Blog pages (blog/page.module.css, blog/[slug]/article.module.css) flipped from dark theme to light theme, consistent with site-wide STYLE-04 unification
affects: [08-design-system-rollout (remaining waves), phase 9]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Legacy alias replacement: var(--foreground) -> var(--ink-1), var(--muted) -> var(--ink-2), var(--border) as divider -> var(--border-1), var(--border) as full outline/fill -> var(--border-2)"
    - "Dark CTA/box background on an otherwise light page maps to var(--ink-1) (darkest token) rather than var(--surface-1), preserving intentional visual contrast without hardcoded hex"

key-files:
  created: []
  modified:
    - src/app/privacy/privacy.module.css
    - src/app/terms/terms.module.css
    - src/app/refund/refund.module.css
    - src/app/articles/articles.module.css
    - src/app/articles/[slug]/article.module.css
    - src/app/blog/page.module.css
    - src/app/blog/[slug]/article.module.css

key-decisions:
  - "Out-of-scale layout paddings (e.g. padding-top/bottom: 6rem/10rem on page shells, 5rem section padding) left as literal rem values rather than forced into the 4-48px spacing scale, since the nearest token (--spacing-6 = 48px) would materially shrink page-level vertical rhythm; matches PATTERNS.md guidance that >48px values 'likely need design review'"
  - "articles/[slug]/article.module.css .cta dark box (#0f172a background, white text) converted to var(--ink-1)/var(--surface-1) instead of flattening to the light page background, preserving the intentional CTA-emphasis contrast; blog pages' full-page dark theme was flipped entirely to light per STYLE-04 since the whole route (not just one section) was dark"
  - "blog/page.module.css and blog/[slug]/article.module.css flipped from dark (#0a0a0a) to light theme as an additional theme-unification fix beyond the five explicitly named STYLE-04 routes, per plan Task 2's instruction to apply the same principle site-wide"
  - "clamp()-based responsive font-size (blog headline/title) replaced with a fixed token plus a max-width:768px breakpoint override, matching the discrete type-scale approach used elsewhere in Phase 8"

patterns-established:
  - "Border-color semantic split: var(--border-1) for hairline dividers (border-top/border-bottom single rule), var(--border-2) for full box outlines and background-fill dividers"

requirements-completed: [STYLE-02, STYLE-05]

# Metrics
duration: 25min
completed: 2026-08-09
---

# Phase 8 Plan 05: Legal/Blog/Article CSS Token Conversion Summary

**Converted all seven legal-page, articles, and blog CSS modules from Phase 6's now-broken legacy token aliases and raw hex colors to the canonical semantic-scale design tokens, including a full dark-to-light theme flip for the two blog page stylesheets.**

## Performance

- **Duration:** 25 min
- **Tasks:** 2 completed
- **Files modified:** 7

## Accomplishments
- Eliminated all `var(--foreground)`, `var(--muted)`, `var(--border)` legacy alias references (previously resolving to nothing since Phase 6 deleted those custom properties) across privacy, terms, refund, articles, and articles/[slug] CSS modules
- Eliminated all remaining hardcoded hex colors in the same five files, plus in blog/page.module.css and blog/[slug]/article.module.css
- Flipped both blog pages from a dark (`#0a0a0a`) theme to the site's light-first token theme, extending STYLE-04's theme-unification principle beyond the five explicitly named routes
- Normalized spacing and type values in all seven files to the STYLE-05 token scale where the nearest scale step was unambiguous

## Task Commits

Each task was committed atomically:

1. **Task 1: Convert privacy, terms, refund, articles, articles/[slug] CSS modules to tokens** - `1472aa9` (feat)
2. **Task 2: Convert blog/page.module.css and blog/[slug]/article.module.css to tokens** - `bfe7744` (feat)

_No plan-metadata commit created in this worktree — orchestrator handles STATE.md/ROADMAP.md updates after merge._

## Files Created/Modified
- `src/app/privacy/privacy.module.css` - Legacy alias + hex removal, token-only spacing/type
- `src/app/terms/terms.module.css` - Identical structural conversion to privacy
- `src/app/refund/refund.module.css` - Identical structural conversion to privacy
- `src/app/articles/articles.module.css` - Legacy alias + hex removal (metrics badge, tag chip backgrounds), token spacing/type
- `src/app/articles/[slug]/article.module.css` - Legacy alias + hex removal, including dark CTA box mapped to ink/surface tokens
- `src/app/blog/page.module.css` - Full dark-to-light theme flip, card/tag/border tokens
- `src/app/blog/[slug]/article.module.css` - Full dark-to-light theme flip, clamp() replaced with token + breakpoint

## Decisions Made
- Legacy alias mapping followed the plan's exact deterministic rules: `var(--foreground)` → `var(--ink-1)`, `var(--muted)` → `var(--ink-2)`, `var(--border)` as hairline divider → `var(--border-1)`, `var(--border)` as full outline or background-fill divider → `var(--border-2)`.
- For spacing/type values with no exact token match, chose the numerically nearest token; on exact ties (equal distance to two tokens) rounded up to the larger token, consistent with the PATTERNS.md worked example (`1.25rem` → `--spacing-4`, not `--spacing-3`).
- Left out-of-scale layout paddings (page-shell `padding-top/bottom: 6rem/10rem`, `5rem` section paddings) as literal rem values — no token exists above `--spacing-6` (48px) and forcing these down to 48px would be a real visual regression, not a token-syntax cleanup. Treated as one-off layout constants per the plan's own carve-out for `max-width`.
- `articles/[slug]/article.module.css`'s `.cta` block (dark navy box with white text, used as an in-page callout) was converted to `var(--ink-1)`/`var(--surface-1)` rather than flattened to match the light page background — this preserves the deliberate visual contrast of an emphasized CTA, whereas the blog pages' *entire* route being dark was the STYLE-04 violation that needed full correction.
- Both blog pages were fully flipped from dark to light theme (not just a single hero section) since the whole page carried the v1.0 dark-hero legacy; this was flagged by Task 2's instructions as an in-scope theme-unification fix beyond the five explicitly named STYLE-04 routes.
- `clamp()`-based responsive headline/title sizing (blog pages) was replaced with a fixed `--fontSize-7` base plus a `max-width: 768px` media query override to `--fontSize-6`, matching the discrete type-scale pattern used elsewhere in Phase 8 rather than reintroducing fluid sizing.

## Deviations from Plan

None beyond what the plan itself anticipated (Task 2 explicitly called out the possibility of a broader dark-hero-section fix on the blog pages, which is documented above as a key decision, not an unplanned deviation).

## Issues Encountered
- `npm run build` fails on the pre-existing, unrelated `pdfkit`/`fs` module-not-found error in `src/lib/pdf.ts` → `src/lib/email.ts` → `automate/instagram/success/page.tsx`, documented in `.planning/phases/08-design-system-rollout/deferred-items.md`. Per plan instructions, used `npx tsc --noEmit` (zero errors) as the verification substitute for the CSS/type-safety portion of this plan; the pdfkit failure is orthogonal to CSS module changes and was not touched.

## Next Phase Readiness
- All seven target files are grep-clean for both legacy aliases and hardcoded hex (`grep -cE "var\(--(foreground|muted|border)\)|#[0-9a-fA-F]{3,8}"` returns 0 for all seven).
- `npx tsc --noEmit` passes with no output (no type errors introduced).
- Full `npm run build` verification deferred to whichever plan resolves the pre-existing pdfkit bundling issue; not a blocker introduced by this plan.

---
*Phase: 08-design-system-rollout*
*Completed: 2026-08-09*
