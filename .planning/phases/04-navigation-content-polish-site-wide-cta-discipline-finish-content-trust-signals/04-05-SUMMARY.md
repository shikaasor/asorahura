---
phase: 04-navigation-content-polish-site-wide-cta-discipline-finish-content-trust-signals
plan: "05"
subsystem: content
tags: [articles, copy, content-audit, mdx, conversion]

# Dependency graph
requires:
  - phase: 03-lead-nurture-blog-launch-extended-email-sequences-segmentation
    provides: MDX blog content in /content/blog/ used as verification target
provides:
  - articles.ts with EU Horizon references fully removed
  - Executive-language copy across all article body sections
  - MDX blog files confirmed clean of grant references and non-executive language
  - CONV-05 audit confirming zero social media exit links on conversion pages
affects:
  - phase 05 (content is final; analytics instrumentation can proceed on clean copy)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Content audit via grep before edit — verify issue exists, then make surgical change"
    - "MDX and articles.ts must stay in sync — same executive language standard applies to both"

key-files:
  created: []
  modified:
    - src/lib/articles.ts

key-decisions:
  - "EU Horizon grant references removed from articles.ts; What's Next reframed to direct client CTA — grant-seeking narrative conflicts with solo expert positioning"
  - "MDX files already compliant at execution time — no patching needed; documented as verified, not deferred"
  - "CONV-05: zero social media links found on any conversion page — LinkedIn only in Footer.tsx which is the correct location"

patterns-established:
  - "Outcome-first framing: architecture sections describe what the design decision delivers for the client, not just what was built"

requirements-completed: [CONTENT-04, CONTENT-06, CONV-05]

# Metrics
duration: 15min
completed: 2026-05-16
---

# Phase 04 Plan 05: Content Audit and Conversion Page CONV-05 Summary

**EU Horizon grant references surgically removed from articles.ts; all 4 MDX blog files verified executive-language compliant; conversion pages confirmed clean of social media exit links**

## Performance

- **Duration:** 15 min
- **Started:** 2026-05-16T00:00:00Z
- **Completed:** 2026-05-16T00:15:00Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments

- Removed EU HORIZON grant references from cervical cancer article (metrics string and body paragraph), eliminating grant-seeking narrative that undermined solo expert positioning
- Reframed "What's Next" section from consortium assembly to a direct client CTA — outcome-first language throughout
- Verified all 4 MDX files in /content/blog/ meet executive language standard; the cervical cancer MDX already had EU Horizon stripped from an earlier pass
- CONV-05 audit confirmed: zero social media links in assessment, engage, checkout, or ResultsScreen — LinkedIn correctly isolated to Footer.tsx only

## Task Commits

1. **Task 1: Remove EU Horizon, verify executive language, confirm MDX files** - `fa6e7b9` (feat)
2. **Task 2: CONV-05 audit** - no commit (audit found zero violations; no files modified)

## Files Created/Modified

- `src/lib/articles.ts` — Removed EU HORIZON from metrics string, deleted EDCTP3 grant paragraph from body, reframed What's Next to direct CTA

## Decisions Made

- EU Horizon grant paragraph deleted in full rather than softened — the positioning conflict is categorical; any reference associates Asor with grant-seeking rather than direct business value delivery
- "What's Next" section rewritten to direct client engagement CTA, keeping outcome-first tone consistent with the rest of the article
- MDX cervical cancer article already had the EU Horizon language removed from a prior pass — the articles.ts and MDX were out of sync on this; articles.ts is now consistent with MDX

## Deviations from Plan

None — plan executed exactly as written. Both tasks completed without auto-fixes. Task 1 edits were targeted and minimal. Task 2 audit found zero violations.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Content is final: EU Horizon references zero, executive language consistent across articles.ts and all MDX files
- Conversion pages confirmed clean — no social media distraction at high-intent moments
- Phase 04 content polish work is complete; Phase 05 analytics instrumentation can proceed on clean copy

---
*Phase: 04-navigation-content-polish-site-wide-cta-discipline-finish-content-trust-signals*
*Completed: 2026-05-16*
