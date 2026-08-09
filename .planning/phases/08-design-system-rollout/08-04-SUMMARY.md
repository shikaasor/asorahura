---
phase: 08-design-system-rollout
plan: 04
subsystem: ui
tags: [css-modules, design-tokens, homepage, css-custom-properties]

# Dependency graph
requires:
  - phase: 08-design-system-rollout
    provides: "08-01 dead-code deletion and the Direction B semantic token scale defined in src/app/globals.css"
provides:
  - "All eight homepage-section CSS modules converted from hardcoded hex / legacy var(--gold, #hex) fallback syntax to Phase 6 semantic tokens (surface-N, ink-N, accent, accent-hover)"
  - "Homepage visually flipped from the old dark hero/section theme to the Direction B light theme, since --gold/--bg-base/--bg-surface/--bg-card no longer exist in globals.css and the hardcoded fallback hex was what was actually rendering pre-conversion"
affects: [08-05, 08-06, 08-07 contrast verification]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Legacy dark-theme fallback removal: var(--token, #hex) -> var(--token) resolves to globals.css; any additional undocumented legacy names encountered (--bg-surface, --bg-card) mapped by analogy to --bg-base's --surface-1 resolution"
    - "Light-theme color flip: near-white text (#EDF2F7) -> var(--ink-1); blue-gray muted text (#5A6B84/#7A8FA8/#8B9BB4/#94A3B8/#E2E8F0) -> var(--ink-2); faintest de-emphasized text (#3D4F66/#2E3D52) -> var(--ink-3); dark backgrounds (#04080F/#020508/#080E1A) -> var(--surface-1)/var(--surface-2) by depth; card-level backgrounds (#0D1525) -> var(--surface-3)"
    - "Component-level spacing/type tokenization: font-size/font-weight and gap/padding/margin <= ~48px rounded to nearest scale step (fontSize-1..7, spacing-1..6); section- and container-level layout paddings/gaps left as literal rem values, matching the un-tokenized `.section-padding`/`.container` precedent already in globals.css"

key-files:
  created: []
  modified:
    - src/components/home/HeroSection.module.css
    - src/components/home/Footer.module.css
    - src/components/home/AboutSection.module.css
    - src/components/home/LeadMagnetStrip.module.css
    - src/components/home/PainSection.module.css
    - src/components/home/ProcessTimeline.module.css
    - src/components/home/ServicesPreview.module.css
    - src/components/home/SocialProof.module.css

key-decisions:
  - "Section-level and .container-level padding/gap values (e.g. `.section { padding: 7rem 0 }`, `.container { padding: 0 1.5rem }`, large grid gaps like 5rem/4.5rem) were left as literal rem values rather than forced onto the 6-step spacing scale (max 48px), because the scale's ceiling is far below these page-rhythm values and forcing them would visibly compress vertical rhythm across the homepage; this mirrors globals.css's own un-tokenized `.section-padding`/`.container` rules"
  - "Decorative rgba() glows, shadows, borders, and oversized quote-mark glyphs (e.g. rgba(201,160,96,0.x), rgba(255,255,255,0.0x), 30rem/4rem quote font-size) were left unchanged — they are not hex literals and fall outside the plan's grep-verified success criteria (hex + named legacy var fallbacks only)"
  - "Discovered two additional legacy fallback patterns not enumerated in the plan's read_first notes: var(--bg-surface, #080E1A) and var(--bg-card, #0D1525) (used in AboutSection, PainSection, ProcessTimeline, ServicesPreview, SocialProof). Resolved by analogy to the --bg-base -> --surface-1 rule: --bg-surface -> --surface-2, --bg-card -> --surface-3, preserving the original three-step depth hierarchy (page bg < section bg < card bg) on the new light palette"

requirements-completed: [STYLE-02, STYLE-03, STYLE-05]

# Metrics
duration: ~35min
completed: 2026-08-09
---

# Phase 08 Plan 04: Homepage CSS Module Token Conversion Summary

**Converted all eight homepage-section CSS modules from hardcoded dark-theme hex colors and legacy `var(--gold*, #hex)` / `var(--bg-base|bg-surface|bg-card*, #hex)` fallbacks to the Direction B light-theme semantic token scale, fixing the "partial migration" pitfall where dead custom-property fallbacks were the colors actually rendering.**

## Performance

- **Duration:** ~35 min
- **Tasks:** 2 completed
- **Files modified:** 8

## Accomplishments
- Zero hardcoded hex colors and zero legacy `--gold`/`--bg-base`/`--bg-surface`/`--bg-card` fallback references remain in any of the eight homepage CSS modules (verified via grep)
- Homepage flipped from the dead dark-theme hex palette to the live Direction B light palette (surface-1..4, ink-1..3, accent/accent-hover)
- Component-level font-size, font-weight, and spacing values normalized to the Phase 6 type/spacing scale where they fit within it

## Task Commits

Each task was committed atomically:

1. **Task 1: Convert HeroSection, Footer, AboutSection, LeadMagnetStrip to tokens** - `a21f2a7` (feat)
2. **Task 2: Convert PainSection, ProcessTimeline, ServicesPreview, SocialProof to tokens** - `7f729bc` (feat)

_No separate plan-metadata commit — SUMMARY.md commit follows immediately after this document._

## Files Created/Modified
- `src/components/home/HeroSection.module.css` - Hero background/CTA/text tokens; headline/subheading/button spacing+type tokenized
- `src/components/home/Footer.module.css` - Footer background/link/label/copyright tokens
- `src/components/home/AboutSection.module.css` - About section background, heading/text, work-with-me link tokens
- `src/components/home/LeadMagnetStrip.module.css` - CTA strip background gradient (surface-3/2/1), heading/subtext/CTA tokens
- `src/components/home/PainSection.module.css` - Timeline badge/connector/step text tokens
- `src/components/home/ProcessTimeline.module.css` - Process card background/icon/title/body tokens
- `src/components/home/ServicesPreview.module.css` - Service card + sector-strip tokens
- `src/components/home/SocialProof.module.css` - Testimonial card/quote/attribution tokens

## Decisions Made
See `key-decisions` in frontmatter: (1) layout-level section/container spacing kept literal, (2) decorative rgba() left unchanged as out of grep-verified scope, (3) undocumented `--bg-surface`/`--bg-card` legacy vars mapped to `--surface-2`/`--surface-3` by analogy to the plan's `--bg-base` → `--surface-1` rule.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Handled undocumented legacy fallback vars not listed in plan's read_first notes**
- **Found during:** Task 1 and Task 2 (reading all 8 files in full before editing, as instructed)
- **Issue:** Plan's `read_first` sections enumerated only `var(--bg-base, #hex)` and `var(--gold*, #hex)` occurrences per file, but AboutSection, PainSection, ProcessTimeline, ServicesPreview, and SocialProof also contain `var(--bg-surface, #080E1A)` and `var(--bg-card, #0D1525)` — additional legacy fallback names outside the plan's named grep pattern (`gold|bg-base|foreground|muted`) but still caught by the grep's hex-literal alternation, so leaving them would have failed the plan's own verification gate
- **Fix:** Resolved `--bg-surface` → `var(--surface-2)` and `--bg-card` → `var(--surface-3)`, preserving the original page/section/card depth hierarchy on the light palette
- **Files modified:** src/components/home/AboutSection.module.css, src/components/home/PainSection.module.css, src/components/home/ProcessTimeline.module.css, src/components/home/ServicesPreview.module.css, src/components/home/SocialProof.module.css
- **Verification:** `grep -cE "var\(--(gold|bg-base|foreground|muted)\b|#[0-9a-fA-F]{3,8}"` returns 0 for all 8 files
- **Committed in:** a21f2a7, 7f729bc (part of task commits)

---

**Total deviations:** 1 auto-fixed (Rule 1 - bug/scope gap in plan's enumerated occurrences)
**Impact on plan:** Necessary to meet the plan's own stated success criteria (zero hex/legacy-fallback references); no scope creep beyond the plan's color-token objective.

## Issues Encountered
- `npm run build` fails with the pre-existing, unrelated `pdfkit`/`fs` Turbopack client-bundle error documented in `.planning/phases/08-design-system-rollout/deferred-items.md`. Per plan-level guidance, verification was done via `npx tsc --noEmit` (passes, exit 0) and the plan's own grep check (0 hex/legacy-token hits across all 8 files) instead of a full `npm run build`.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Homepage is now 100% token-driven for color; ready for Plan 07's `npm run verify:contrast` gate to validate ink/surface/accent pairings on the highest-traffic page (T-08-06 mitigation)
- `npm run build` remains blocked by the pre-existing pdfkit issue tracked separately in deferred-items.md; not introduced or worsened by this plan

## Self-Check: PASSED

---
*Phase: 08-design-system-rollout*
*Completed: 2026-08-09*
