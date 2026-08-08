---
phase: 07-product-1-page-live-payments-revenue
plan: 07
subsystem: automate-page-components
tags: [react, css-modules, accordion, lucide-react, trust-building]

# Dependency graph
requires: []
provides:
  - "src/components/automate/PhoneMockup.tsx: Labelled phone mockup section (PROD-09)"
  - "src/components/automate/FAQSection.tsx: FAQ accordion with id=\"faq\" anchor and refund policy (PROD-13)"
affects: [07-12]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Accordion built with plain useState<number | null> — no external accordion library, matches PATTERNS.md precedent of no such dependency in the codebase"
    - "lucide-react ChevronDown rotated 180deg via CSS class toggle instead of swapping icon glyphs"
    - "All new component CSS uses Phase 6 token names directly (--surface-1, --spacing-3, --fontSize-4, etc.) — zero hardcoded hex, matching src/app/(automate)/layout.module.css precedent from Plan 03"

key-files:
  created:
    - src/components/automate/PhoneMockup.tsx
    - src/components/automate/PhoneMockup.module.css
    - src/components/automate/FAQSection.tsx
    - src/components/automate/FAQSection.module.css
  modified: []

key-decisions:
  - "PhoneMockup renders a styled placeholder div (phone frame + 'Screenshot pending' text) instead of an <Image>, per the plan's explicit instruction — no real DM screenshot asset exists in the repo"
  - "Label copy 'Real screenshot. Live account. Working now.' ships as specified even though it is only literally true once the placeholder is swapped for the real screenshot — flagged below as a pre-launch blocker"

requirements-completed: [PROD-09, PROD-13]

# Metrics
duration: 20min
completed: 2026-08-08
---

# Phase 07 Plan 07: Phone Mockup + FAQ Section Summary

**Two standalone trust-building components: a labelled phone-mockup section (placeholder-backed, ready for a real screenshot swap) and a 4-item FAQ accordion covering the refund policy, both self-contained and ready for composition into the `/automate` page in Plan 12.**

## Performance

- **Duration:** 20 min
- **Tasks:** 2
- **Files created:** 4

## Accomplishments

- `PhoneMockup` component: right-aligned-on-desktop / stacked-on-mobile layout, placeholder phone-frame graphic sized to the real screenshot's final constraints (max-width 300px desktop, full width mobile), exact label copy "Real screenshot. Live account. Working now."
- `FAQSection` component: client-side accordion (`useState<number | null>`), root `id="faq"` for the existing `/automate#faq` footer link (added in Plan 03) to resolve against, 4 Q&As verbatim from UI-SPEC including the refund policy answer, `ChevronDown` from `lucide-react` rotated via CSS on expand
- Both components use Phase 6 CSS custom properties exclusively (`--surface-*`, `--ink-*`, `--spacing-*`, `--fontSize-*`, `--border-*`, `--radius-*`, `--duration-*`) — no hardcoded hex values

## Task Commits

1. **Task 1: PhoneMockup component** - `8cbc802` (feat)
2. **Task 2: FAQSection component (accordion, includes refund policy)** - `224ee05` (feat)

## Files Created/Modified

- `src/components/automate/PhoneMockup.tsx` - Phone mockup section with lead copy, placeholder phone-frame, and label
- `src/components/automate/PhoneMockup.module.css` - Layout (row on desktop, column on mobile), tokens only
- `src/components/automate/FAQSection.tsx` - Accordion with 4 Q&As, `id="faq"`, ChevronDown icon
- `src/components/automate/FAQSection.module.css` - Card styling, chevron rotation, tokens only

## Decisions Made

- Followed the plan's explicit instruction to render a styled placeholder `<div>` (phone frame + "Screenshot pending" text) in place of `next/image`, since no real DM screenshot asset exists anywhere in the repo. The placeholder occupies the exact final layout position/sizing so a future swap to a real `<Image>` requires no layout changes.
- Matched CSS token naming to the already-shipped `src/app/(automate)/layout.module.css` (Plan 03) rather than the UI-SPEC's semantic aliases (`--spacing-md` etc.), since `globals.css` defines the numbered scale (`--spacing-3`, `--fontSize-4`, etc.) as the actual token names.

## Deviations from Plan

None — plan executed exactly as written.

## Known Placeholder / Pre-Launch Follow-up

**PhoneMockup's real-screenshot claim is not yet true.** The component ships the required label copy "Real screenshot. Live account. Working now." per the plan's instruction, but the image itself is currently a styled placeholder div ("Screenshot pending"), not a real screenshot of `@ai_learnt`'s live account. Before this page goes live, the founder must supply a real DM-conversation screenshot to replace the placeholder `<div>` (swap for `next/image` with `src="/images/automate/dm-screenshot-placeholder.png"` or an equivalent real asset) — otherwise PROD-09's labelling claim is false advertising. This must be resolved before Plan 12 composes the final page for production, or before launch, whichever comes first.

## Issues Encountered

None. `npx tsc --noEmit` shows one pre-existing, unrelated error (`next-mdx-remote/rsc` module resolution in `src/app/blog/[slug]/page.tsx`) not touched by this plan.

## User Setup Required

None for this plan. Pre-launch: founder must supply a real Instagram DM screenshot to replace the PhoneMockup placeholder (see above).

## Next Phase Readiness

- `PhoneMockup` and `FAQSection` are ready for import and composition into the `/automate` page in Plan 12
- `FAQSection`'s `id="faq"` anchor now exists to satisfy the `/automate#faq` link already present in the Plan 03 footer

---
*Phase: 07-product-1-page-live-payments-revenue*
*Completed: 2026-08-08*

## Self-Check: PASSED

- FOUND: src/components/automate/PhoneMockup.tsx
- FOUND: src/components/automate/PhoneMockup.module.css
- FOUND: src/components/automate/FAQSection.tsx
- FOUND: src/components/automate/FAQSection.module.css
- FOUND: commit 8cbc802
- FOUND: commit 224ee05
