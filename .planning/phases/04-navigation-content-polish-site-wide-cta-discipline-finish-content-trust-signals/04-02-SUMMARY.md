---
phase: 04-navigation-content-polish-site-wide-cta-discipline-finish-content-trust-signals
plan: "02"
subsystem: ui
tags: [next.js, react, css-modules, server-component, testimonials, booking]

requires:
  - phase: 04-01
    provides: Navigation component established; shared component pattern in place

provides:
  - TestimonialCard reusable server component with dark card aesthetics
  - BookingUrgency server component rendering month-aware slot availability
  - BOOKING_SLOTS config constant — single edit point for slot count
  - public/images/testimonials/placeholder.jpg — prevents Next.js Image 404

affects:
  - 04-03 (services page plan — imports BookingUrgency and TestimonialCard)
  - 04-04 (homepage polish — imports TestimonialCard for hero/results sections)

tech-stack:
  added: []
  patterns:
    - Config-driven urgency signal — BOOKING_SLOTS in src/config/booking.ts controls visibility with a single edit
    - Server Component by default — no "use client" unless interactivity required
    - CSS Modules for component-scoped styles matching BlogCTABlock dark aesthetic

key-files:
  created:
    - src/config/booking.ts
    - src/components/services/BookingUrgency.tsx
    - src/components/services/BookingUrgency.module.css
    - src/components/shared/TestimonialCard.tsx
    - src/components/shared/TestimonialCard.module.css
    - public/images/testimonials/placeholder.jpg
  modified: []

key-decisions:
  - "BOOKING_SLOTS typed as number (not literal 2) to prevent TS2367 unintentional comparison error in BookingUrgency"
  - "Placeholder image is headshot.png renamed to .jpg — valid image file, no 404, no extra dependencies"
  - "Both components are pure server components — no 'use client' directive"

patterns-established:
  - "Config-in-src/config: single constant controls component behavior — no component edits needed for content changes"
  - "Dark card aesthetic: #111111 bg, #1f1f1f border, 12px radius matches BlogCTABlock"

requirements-completed:
  - CONV-04

duration: 12min
completed: 2026-05-16
---

# Phase 04 Plan 02: Shared Components (TestimonialCard + BookingUrgency) Summary

**TestimonialCard dark card component and BookingUrgency server component with BOOKING_SLOTS config — dependency-free, zero TS errors**

## Performance

- **Duration:** 12 min
- **Started:** 2026-05-16T00:00:00Z
- **Completed:** 2026-05-16T00:12:00Z
- **Tasks:** 2
- **Files created:** 6

## Accomplishments

- BookingUrgency server component renders "Currently booking for [Month] — N slots remaining" from BOOKING_SLOTS constant; returns null at 0
- TestimonialCard server component renders dark card (#111111 bg, #1f1f1f border, 12px radius) with circular 48px headshot, white italic quote, and muted attribution
- public/images/testimonials/placeholder.jpg in place — Next.js Image will not 404 during development

## Task Commits

Each task was committed atomically:

1. **Task 1: Create booking.ts config and BookingUrgency server component** - `1876f1c` (feat)
2. **Task 2: Create TestimonialCard component and placeholder headshot** - `8d258e1` (feat)

## Files Created/Modified

- `src/config/booking.ts` - Exports BOOKING_SLOTS: number = 2; single edit point for slot availability
- `src/components/services/BookingUrgency.tsx` - Server component; reads BOOKING_SLOTS, renders urgency string with current month
- `src/components/services/BookingUrgency.module.css` - Muted italic small-text styles
- `src/components/shared/TestimonialCard.tsx` - Reusable dark card; props: { quote, name, title, headshot }
- `src/components/shared/TestimonialCard.module.css` - Dark card styles matching BlogCTABlock aesthetic
- `public/images/testimonials/placeholder.jpg` - Copied from public/images/headshot.png

## Decisions Made

- BOOKING_SLOTS typed as `number` not inferred literal `2` — TypeScript TS2367 fires when comparing literal `2 !== 1` in BookingUrgency; widening to `number` resolves it with no behavior change
- Placeholder image is headshot.png copied to .jpg extension — valid image bytes, no extra tooling required
- Both components are pure server components — no interactivity needed at this layer

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Widened BOOKING_SLOTS type to prevent TS2367**
- **Found during:** Task 1 (TypeScript verification)
- **Issue:** `export const BOOKING_SLOTS = 2` infers literal type `2`; TypeScript flags `BOOKING_SLOTS !== 1` as unintentional comparison since types `2` and `1` have no overlap
- **Fix:** Changed declaration to `export const BOOKING_SLOTS: number = 2`
- **Files modified:** src/config/booking.ts
- **Verification:** `npx tsc --noEmit` passes with zero errors
- **Committed in:** 1876f1c (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 type bug)
**Impact on plan:** Necessary for TypeScript correctness. No scope creep.

## Issues Encountered

None beyond the TS2367 type fix documented above.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- TestimonialCard and BookingUrgency are ready for import in Plans 03 and 04
- Placeholder headshot at /images/testimonials/placeholder.jpg prevents dev-time 404s
- Replace placeholder with real client headshots when Asor provides them (swap files in public/images/testimonials/)
- BOOKING_SLOTS = 2 is live; edit src/config/booking.ts to update slot count without touching components

---
*Phase: 04-navigation-content-polish-site-wide-cta-discipline-finish-content-trust-signals*
*Completed: 2026-05-16*
