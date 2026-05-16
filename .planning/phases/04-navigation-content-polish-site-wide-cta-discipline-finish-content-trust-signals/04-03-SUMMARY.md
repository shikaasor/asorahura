---
phase: 04-navigation-content-polish-site-wide-cta-discipline-finish-content-trust-signals
plan: "03"
subsystem: ui
tags: [next.js, react, cta, testimonials, booking-urgency, services, hero]

# Dependency graph
requires:
  - phase: 04-02
    provides: TestimonialCard and BookingUrgency components built and ready
provides:
  - Homepage secondary CTA changed from "Book a Discovery Call" (→/checkout) to "Work With Me" (→/engage)
  - 1 TestimonialCard placeholder in HeroSection below TrustSignals
  - Services page with Work With Me primary CTA + Take the Assessment secondary link in hero
  - BookingUrgency rendered after tiersGrid on Services page
  - 2 dark TestimonialCard components replacing old white Testimonials on Services page
  - Assessment callout block removed from Services page
  - AboutSection with "Work With Me" underlined link → /engage at bottom of copy
affects: [phase-05, analytics, conversion-tracking]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Placeholder constants at file top (HERO_TESTIMONIAL, SERVICE_TESTIMONIALS) — data separated from JSX
    - CSS module class per new interactive element (workWithMe, heroActions, workWithMeBtn, heroSecondary)
    - TestimonialCard used in both hero and services — same component, two contexts

key-files:
  created: []
  modified:
    - src/components/home/HeroSection.tsx
    - src/components/home/AboutSection.tsx
    - src/components/home/AboutSection.module.css
    - src/app/services/page.tsx
    - src/app/services/services.module.css

key-decisions:
  - "AboutSection is light-background (#f8fafc) — Work With Me link uses dark text (#0f172a) not white; underlined link style matches pattern intent without invisible contrast"
  - "Services page hero CTAs: Work With Me (white filled button) is primary, Take the Assessment (underlined link) is secondary — matches CTA hierarchy per plan"
  - "Dead CSS classes (.assessmentCallout, .calloutText, .calloutLink) removed from services.module.css alongside block removal to prevent dead code"

patterns-established:
  - "Placeholder pattern: define data constant at top of file with comment 'Asor replaces before launch' — decouples data from component structure"
  - "CTA hierarchy: filled button = primary action, underlined text link = secondary action — consistent across hero, services, about"

requirements-completed: [NAV-03, NAV-05, NAV-06, CONV-03, CONV-04, CONTENT-05]

# Metrics
duration: 20min
completed: 2026-05-16
---

# Phase 04 Plan 03: CTA Discipline, TestimonialCard Placement, and AboutSection CTA Summary

**Homepage secondary CTA corrected to "Work With Me" → /engage, Services page overhauled with Work With Me CTA + BookingUrgency + 2 dark TestimonialCards, AboutSection gains underlined "Work With Me" link at bottom**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-05-16T00:00:00Z
- **Completed:** 2026-05-16T00:20:00Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments
- Homepage: secondary CTA corrected from "Book a Discovery Call" (→/checkout) to "Work With Me" (→/engage); 1 TestimonialCard with placeholder data added below TrustSignals in hero
- Services page: assessment callout block removed, Work With Me primary button + Take the Assessment secondary link added in hero, BookingUrgency rendered after tier grid, 2 dark TestimonialCards replace old white Testimonials, old Testimonials import removed, dead CSS cleaned up
- AboutSection: "Work With Me" underlined link → /engage added at bottom of .copy div; CSS class added to module for proper light-background contrast

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix Homepage CTA pair — replace "Book a Discovery Call" with "Work With Me" + add TestimonialCard** - `1c9a1e4` (feat)
2. **Task 2: Overhaul Services page — Work With Me CTA, BookingUrgency, dark testimonials, remove assessment callout** - `b35ba92` (feat)
3. **Task 3: Add "Work With Me" CTA to AboutSection** - `dca05fa` (feat)

## Files Created/Modified
- `src/components/home/HeroSection.tsx` - Secondary CTA changed to Work With Me → /engage; TestimonialCard imported and rendered with placeholder data below TrustSignals
- `src/app/services/page.tsx` - Old Testimonials removed; TestimonialCard + BookingUrgency imported; heroActions CTA block added; assessment callout removed; BookingUrgency placed after tiersGrid; 2 TestimonialCards in testimonialsSection
- `src/app/services/services.module.css` - Added heroActions, workWithMeBtn, heroSecondary, testimonialsSection, testimonialsInner classes; removed dead assessmentCallout/calloutText/calloutLink classes
- `src/components/home/AboutSection.tsx` - Link from next/link imported; Work With Me link added at bottom of .copy div
- `src/components/home/AboutSection.module.css` - Added .workWithMe class for underlined link with dark text (appropriate for light background)

## Decisions Made
- AboutSection background is #f8fafc (near white), so white text link would be invisible. Used dark text (#0f172a) for the underlined Work With Me link while maintaining the underlined link style pattern.
- For Services page hero, Work With Me is the filled white button (primary action) and Take the Assessment is the underlined text link (secondary action) — matches conversion hierarchy.
- Dead CSS classes (.assessmentCallout, .calloutText, .calloutLink) removed alongside the HTML block removal — prevents accumulated dead code.

## Deviations from Plan

None - plan executed exactly as written. The one deviation noted (dark text in AboutSection instead of white) was explicitly guided by the plan itself ("use whichever approach is simpler given the file's existing patterns").

## Issues Encountered
None — build passed cleanly, zero TypeScript errors across all 3 tasks.

## User Setup Required
None - no external service configuration required. Placeholder testimonial data (HERO_TESTIMONIAL, SERVICE_TESTIMONIALS) must be replaced with real client quotes, names, titles, and headshot images before launch.

## Next Phase Readiness
- All Phase 4 CTA discipline requirements satisfied: homepage and services page have max 2 CTAs each, all "Work With Me" links point to /engage
- BookingUrgency is live on Services page — BOOKING_SLOTS value in config/booking.ts controls the display
- TestimonialCard placeholders are in place on both homepage hero and services page — Asor needs to supply real quotes and headshots before launch
- Phase 5 (Analytics & Launch Readiness) can proceed

---
*Phase: 04-navigation-content-polish-site-wide-cta-discipline-finish-content-trust-signals*
*Completed: 2026-05-16*
