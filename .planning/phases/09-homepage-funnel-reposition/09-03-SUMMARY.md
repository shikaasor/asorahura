---
phase: 09-homepage-funnel-reposition
plan: 03
subsystem: ui
tags: [nextjs, react, css-modules, lucide-react, homepage]

# Dependency graph
requires:
  - phase: 09-homepage-funnel-reposition (plan 01)
    provides: hero + nav creator-language repositioning
provides:
  - Creator/coach pain section (PainSection) with /enterprise escape hatch
  - Two-rung automation ladder (ServicesPreview) with real Product #1 pricing
affects: [09-homepage-funnel-reposition plan 04]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Escape-hatch link pattern: --ink-2 underline, --accent only on hover, never as default color"
    - "Ladder tier badge + featured/coming card modifier classes for pricing-status differentiation"

key-files:
  created: []
  modified:
    - src/components/home/PainSection.tsx
    - src/components/home/PainSection.module.css
    - src/components/home/ServicesPreview.tsx
    - src/components/home/ServicesPreview.module.css
    - src/components/home/ProcessTimeline.module.css

key-decisions:
  - "Fixed a pre-existing CSS-module content swap between PainSection.module.css and ProcessTimeline.module.css (introduced in 08-04) before starting Task 1, since the plan's PainSection edits assumed .grid/.card classes that were misplaced in ProcessTimeline.module.css"
  - "Used plain JS-string apostrophes (matching existing codebase convention for data-array body text) instead of the literal &apos; HTML entity specified in the plan's action text, since &apos; is not decoded when rendered via a JSX expression from a string literal"
  - "Changed ServicesPreview .grid from 3 to 2 columns to match the reduced 2-rung ladder (plan didn't specify but 3-column grid with 2 cards would leave unbalanced empty space)"

patterns-established: []

requirements-completed: [HOME-13, HOME-14, HOME-15]

# Metrics
duration: 20min
completed: 2026-08-11
---

# Phase 9 Plan 3: PainSection + ServicesPreview Reposition Summary

**Rewrote PainSection to speak entirely to creators/coaches with an /enterprise escape hatch, and rewrote ServicesPreview into a 2-rung automation ladder (Instagram Lead Automation real-priced/featured, "The Next Four" waitlist) replacing all $5k-$30k+ enterprise pricing and sector-track chips.**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-08-11T10:00:00Z
- **Completed:** 2026-08-11T10:27:24Z
- **Tasks:** 2 completed (+ 1 pre-task deviation fix)
- **Files modified:** 5

## Accomplishments
- PainSection now shows 4 creator/coach pain cards (income, time, integration, ROI) with no regulated-vertical or regulation-name copy, plus an `/enterprise` escape-hatch link
- ServicesPreview now shows a 2-rung ladder: Rung 1 "Instagram Lead Automation" (Free DIY / $500 DFY, accent-bordered featured card, links to `/automate/instagram`) and Rung 2 "The Next Four" (waitlist framing, links to `/automate`)
- Removed all sector-track chips and the `/assessment` sector-picker link from the homepage
- Fixed a pre-existing bug where PainSection.module.css and ProcessTimeline.module.css had their contents swapped (from 08-04), which was silently breaking both components' styling in production

## Task Commits

Each task was committed atomically:

1. **Pre-task fix: un-swap PainSection/ProcessTimeline CSS modules** - `3904b8f` (fix)
2. **Task 1: Rewrite PainSection for creator/coach pain points** - `2ebce0e` (feat)
3. **Task 2: Rewrite ServicesPreview as 2-rung automation ladder** - `f8adca3` (feat)

**Plan metadata:** (pending — see below)

## Files Created/Modified
- `src/components/home/PainSection.tsx` - 4 creator/coach pain cards + `/enterprise` escape hatch
- `src/components/home/PainSection.module.css` - Restored `.grid`/`.card`/`.icon`/`.cardTitle`/`.cardBody`, added `.subheading` and `.cta`
- `src/components/home/ServicesPreview.tsx` - 2-rung `ladder` array replacing 3-tier `services` array; sector strip removed
- `src/components/home/ServicesPreview.module.css` - Added `.subheading`, `.tier`, `.featured`, `.coming`; removed `.sectorStrip`/`.sectorLabel`/`.sectorChips`/`.sectorChip`/`.sectorLink`; grid now 2 columns
- `src/components/home/ProcessTimeline.module.css` - Restored `.timeline`/`.step`/`.badge`/`.connector`/`.stepName`/`.stepDesc` (was accidentally holding PainSection's card styles)

## Decisions Made
- Fixed the swapped CSS modules before Task 1 rather than working around it, since the plan's instructions explicitly assumed `.grid`/`.card` already existed in `PainSection.module.css` — this was a genuine pre-existing bug (introduced by 08-04's design-token conversion) blocking correct completion of the task.
- Used plain apostrophes in pain-card body strings instead of the plan's literal `&apos;` text, matching the existing codebase convention (data-array strings rendered via `{expr}` are not HTML-entity-decoded; `&apos;` would have rendered literally on the page). Existing sibling files (`EmailGate.tsx`, `BuildMapForm.tsx`) confirm `&apos;` is reserved for JSX text-node children, not JS string literals.
- Reduced `ServicesPreview`'s `.grid` from 3 to 2 columns to match the ladder's 2 cards (plan's CSS action didn't mention this, but leaving a 3-column grid with 2 cards would leave an unbalanced empty third column).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Un-swapped PainSection/ProcessTimeline CSS module content**
- **Found during:** Task 1 read-first (reading PainSection.module.css before edits)
- **Issue:** Commit `7f729bc` (08-04, design-token conversion) swapped the contents of `PainSection.module.css` and `ProcessTimeline.module.css`. PainSection.tsx referenced `.grid`/`.card`/`.icon`/`.cardTitle`/`.cardBody`, none of which existed in its own module.css (which instead held `.timeline`/`.step`/`.badge` — ProcessTimeline's classes), and vice versa. This meant both components were rendering unstyled on production.
- **Fix:** Restored each file's correct content by content-matching against each component's actual class usage.
- **Files modified:** src/components/home/PainSection.module.css, src/components/home/ProcessTimeline.module.css
- **Verification:** Confirmed PainSection.tsx's classes (`.grid`, `.card`, `.icon`, `.cardTitle`, `.cardBody`) now exist in PainSection.module.css; confirmed ProcessTimeline.tsx's classes (`.timeline`, `.step`, `.badge`, `.connector`, `.stepName`, `.stepDesc`) now exist in ProcessTimeline.module.css.
- **Committed in:** `3904b8f` (separate pre-Task-1 commit)

**2. [Rule 1 - Bug] Used plain apostrophes instead of `&apos;` HTML entity in data-array strings**
- **Found during:** Task 1 (writing creatorPains array)
- **Issue:** Plan action text specified body copy using literal `&apos;` (e.g., "You&apos;ve mastered..."). Since these strings are JS string literals rendered via `{pain.body}` JSX expressions (not JSX text-node children), `&apos;` is not entity-decoded and would render as literal text "&apos;" on the page.
- **Fix:** Used plain apostrophes (`'`) matching the codebase's existing convention for data-array body text (see original `sectorCards` array which used plain apostrophes, e.g. "can't").
- **Files modified:** src/components/home/PainSection.tsx
- **Verification:** Visual/text inspection of the string literals; matches convention in sibling data-driven components.
- **Committed in:** `2ebce0e` (Task 1 commit)

**3. [Rule 1 - Bug] Reduced ServicesPreview grid from 3 to 2 columns**
- **Found during:** Task 2 (rewriting ladder array from 3 to 2 items)
- **Issue:** `.grid` was `grid-template-columns: repeat(3, 1fr)`, sized for the original 3-tier services array. With only 2 ladder rungs, this would leave an unbalanced empty third column on desktop.
- **Fix:** Changed `.grid` to `repeat(2, 1fr)`.
- **Files modified:** src/components/home/ServicesPreview.module.css
- **Verification:** Visual layout review of the grid rule; matches the 2-item `ladder` array.
- **Committed in:** `f8adca3` (Task 2 commit)

---

**Total deviations:** 3 auto-fixed (2 Rule 1 bugs found during read-first/pre-task, 1 Rule 1 bug found mid-task)
**Impact on plan:** All auto-fixes were necessary for correctness (broken CSS-module wiring, incorrect text rendering, unbalanced layout). No scope creep beyond what the plan's own files_modified list implied, except the ProcessTimeline.module.css fix, which was the direct root cause blocking PainSection.module.css from having the classes the plan's Task 1 action assumed already existed.

## Issues Encountered
- The plan's `<verify>` grep patterns for Task 2 (`grep -c "href=\"/automate/instagram\"" ...` and the `/automate` equivalent) expect a literal `href="..."` string in the source. Because `ServicesPreview.tsx` uses a data-driven `ladder` array (`href: "/automate/instagram",`) with `<Link href={service.href}>`, matching the codebase's existing convention (the original `services` array used the same `href: "..."` style), these literal-string greps return 0 even though the functional link destinations are correct and verified by direct inspection (`grep -n "/automate" ServicesPreview.tsx` shows both hrefs present). This is a plan-authoring grep-pattern mismatch, not a functional defect — the rendered `<a href="/automate/instagram">` and `<a href="/automate">` are correct at runtime.
- One pre-existing, unrelated test failure (`tests/test-calendly-removal-pages.test.ts`, checking `checkout/page.tsx` for `/engage?enterprise=true`) fails both before and after this plan's changes (confirmed via `git stash`); it is unrelated to PainSection/ServicesPreview and out of this plan's scope, so it was left untouched per the deviation-rules scope boundary.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- PainSection and ServicesPreview now consistently speak creator/coach language with a single real entry price ($0/$500), matching HOME-13/14/15.
- Plan 09-04 (final plan in this phase) can proceed; no blockers introduced by this plan.
- Pre-existing unrelated test failure in `tests/test-calendly-removal-pages.test.ts` remains open — not addressed by this plan (out of scope), flagged here for visibility.

---
*Phase: 09-homepage-funnel-reposition*
*Completed: 2026-08-11*

## Self-Check: PASSED

- FOUND: src/components/home/PainSection.tsx
- FOUND: src/components/home/ServicesPreview.tsx
- FOUND: .planning/phases/09-homepage-funnel-reposition/09-03-SUMMARY.md
- FOUND: commit 3904b8f
- FOUND: commit 2ebce0e
- FOUND: commit f8adca3
