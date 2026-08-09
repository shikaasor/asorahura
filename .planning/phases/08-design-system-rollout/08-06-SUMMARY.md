---
phase: 08-design-system-rollout
plan: 06
subsystem: ui
tags: [css-modules, design-tokens, theming, next.js]

# Dependency graph
requires:
  - phase: 08-design-system-rollout
    provides: "08-01 dead-code deletion baseline; Phase 6 token definitions in src/app/globals.css"
provides:
  - "services.module.css, work.module.css, engage.module.css, Navigation.module.css, TestimonialCard.module.css, TrustSignals.module.css fully converted to Phase 6 tokens"
  - "Site-wide Navigation component flipped from dark translucent nav to light-first surface tokens"
  - "All var(--gold*, #hex) / var(--bg-base, #hex) / var(--bg-card, #hex) legacy fallback syntax eliminated from these six files"
affects: ["08-07 (contrast verification gate)", "phase-09 homepage rewrite"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Dark-theme hex flip: background/color pairs that were tuned for the retired dark+gold theme are inverted to var(--surface-*)/var(--ink-*) rather than deleted, preserving visual hierarchy on the light-first palette"
    - "Legacy gold rgba() literals (rgb 201,160,96) updated to match the new --accent hex (rgb 201,168,109) wherever a bare var()-less rgba()/data-URI reference couldn't be tokenized directly (box-shadow glows, hover rings, SVG fill)"

key-files:
  created: []
  modified:
    - src/app/services/services.module.css
    - src/app/work/work.module.css
    - src/app/engage/engage.module.css
    - src/components/Navigation.module.css
    - src/components/shared/TestimonialCard.module.css
    - src/components/shared/TrustSignals.module.css

key-decisions:
  - "Font-size/spacing values only tokenized where they exactly match an existing Phase 6 scale step (e.g. 1rem=16px->--fontSize-2, 2rem=32px->--spacing-5); near-miss values (e.g. 1.75rem, 0.85rem) left as literals per plan's 'leave one-off layout constants untouched' allowance, avoiding visual drift from fuzzy nearest-match guessing"
  - "font-weight: any value outside 400/700 mapped to var(--fontWeight-bold) per plan's explicit rule (applies even to 500, not just 600/800)"
  - "TestimonialCard.module.css box-shadow: 0 4px 20px rgba(0,0,0,0.3) mapped to var(--shadow-3) per the plan's box-shadow property-context rule"
  - "Navigation.module.css .navWrapper background rgba(4,8,15,0.88) (dark translucent) flipped to rgba(253,250,244,0.88) — matches --surface-1 in rgb form since a CSS var() cannot carry a custom alpha without color-mix()"

requirements-completed: [STYLE-02, STYLE-03, STYLE-05]

# Metrics
duration: 28min
completed: 2026-08-09
---

# Phase 8 Plan 06: Services/Work/Engage/Navigation/Shared Token Conversion Summary

**Converted the last six hardcoded-hex/legacy-gold-fallback stylesheets — including the site-wide Navigation component — to Phase 6 design tokens, eliminating every `var(--gold*, #hex)` and `var(--bg-base/--bg-card, #hex)` fallback in this plan's scope.**

## Performance

- **Duration:** 28 min
- **Started:** 2026-08-09T11:46:00Z
- **Completed:** 2026-08-09T12:14:47Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- `Navigation.module.css` — the single highest-impact file (renders on every page) — flipped from dark+gold to light-first tokens, including the `!important`-guarded `.active`/`.cta` gold states called out explicitly in the plan
- `services.module.css` (31 hex) and `work.module.css` (legacy `--bg-base`/`--gold`/`--gold-light` fallbacks) fully tokenized
- `engage.module.css` (20 hex + 5 legacy-gold fallback sites + one `--bg-card` fallback) fully tokenized, including the SVG-embedded select-arrow fill and ambient gold glow gradients
- `TestimonialCard.module.css` and `TrustSignals.module.css` (shared components used across multiple pages) fully tokenized
- Stray gold-tinted `rgba()` literals and a percent-encoded SVG `fill` hex (not caught by the hex grep, since no literal `#` character is present) were corrected to the new `--accent` RGB value so decorative shadows/glows/dropdown-arrow icons stay color-accurate rather than rendering the retired gold

## Task Commits

Each task was committed atomically:

1. **Task 1: Convert services.module.css and work.module.css to tokens** - `9823995` (feat)
2. **Task 2: Convert engage.module.css, Navigation.module.css, TestimonialCard.module.css, and TrustSignals.module.css to tokens** - `4f35f0c` (feat)

_This plan executes inside a git worktree; STATE.md/ROADMAP.md are not touched here and no separate plan-metadata commit is made — the orchestrator handles that after merging this worktree._

## Files Created/Modified
- `src/app/services/services.module.css` - Dark-theme (`#0a0a0a`/`#fff`) page flipped to `var(--surface-1)`/`var(--ink-1)`; gold accent `#C9A84C` unified to `var(--accent)`
- `src/app/work/work.module.css` - `var(--bg-base, #04080F)`, `var(--bg-surface, #080E1A)`, `var(--gold, #C9A060)`, `var(--gold-light, #E0B878)` all converted; case-study text grays mapped to `var(--ink-2)`/`var(--ink-3)`
- `src/app/engage/engage.module.css` - `var(--bg-base, #04080F)`, `var(--bg-card, #0D1525)`, five `var(--gold, #C9A060)` sites, one `var(--gold-light, #E0B878)` site converted; form input backgrounds/borders remapped to surface/border tokens
- `src/components/Navigation.module.css` - Site-wide nav: dark translucent bar, `#C9A060` bare-hex `.active` state, `var(--gold*, #hex)` CTA states, hamburger/mobile-menu colors all converted to tokens
- `src/components/shared/TestimonialCard.module.css` - `var(--bg-card, #0D1525)`, `var(--gold, #C9A060)` (border-left + title color) converted; shadow/ring rgba literals updated to new accent RGB
- `src/components/shared/TrustSignals.module.css` - `var(--gold, #C9A060)` badge border/color/dot converted to `var(--accent)`; badge tint rgba updated to new accent RGB

## Decisions Made
- Spacing/type normalization applied only where an exact token match exists (documented in frontmatter `key-decisions`) — avoids introducing subtle sizing regressions from fuzzy "nearest" guessing on 60+ ad-hoc rem values across six files, consistent with the plan's explicit allowance to leave one-off layout constants untouched
- font-weight normalization applied literally per plan rule (any non-400/700 → bold), including 500-weight values
- Non-tokenizable color literals (rgba glows, SVG data-URI fills) that referenced the retired gold RGB were corrected to the new accent RGB for visual consistency, since they are not representable as `var()` with custom alpha but are semantically the same "gold accent" concept

## Deviations from Plan

None — plan executed exactly as written for the required grep verification and color-token conversion. The rgba/data-URI gold-literal corrections and the `.navWrapper` translucent-background flip are Rule 1 (bug fix: stale color reference / dark-on-light contrast bug) auto-fixes within scope of the same six files, not out-of-scope changes.

## Issues Encountered
- `npm run build` was not run directly per the parallel-executor note (known pre-existing `pdfkit`/client-bundle failure unrelated to this plan, logged in `08-design-system-rollout/deferred-items.md`). Used `npx tsc --noEmit` instead, which passed with zero errors — confirms no TypeScript/JSX consumers of these CSS Modules broke.
- `08-PATTERNS.md` referenced in the plan's `<read_first>`/context block does not exist as a tracked file in this worktree (it appears only as an untracked file in the main checkout). Proceeded using `08-RESEARCH.md`'s "Common Pitfalls" and "Code Examples" sections, which cover the same property-context rule table, as the property-classification reference.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All six files in this plan's scope pass `grep -cE "var\(--(gold|bg-base)\b|#[0-9a-fA-F]{3,8}"` with zero matches
- `Navigation.module.css` (site-wide) is now token-driven, unblocking Plan 07's contrast-verification gate for every route it renders on
- No blockers for Plan 07 (contrast verification) from this plan's changes

---
*Phase: 08-design-system-rollout*
*Completed: 2026-08-09*
