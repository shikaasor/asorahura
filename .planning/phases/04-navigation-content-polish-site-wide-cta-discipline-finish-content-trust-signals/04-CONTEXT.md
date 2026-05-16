# Phase 4: Navigation & Content Polish - Context

**Gathered:** 2026-05-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the global navigation bar, enforce max-2-CTA discipline across all pages, reposition testimonials to homepage/services/assessment results, add pricing urgency signals to the services page, and complete all content migrations (Flowmorph scrub, executive-language rewrite, EU Horizon references). This phase polishes the site for launch — no new features.

</domain>

<decisions>
## Implementation Decisions

### Navigation design
- Sticky/fixed header — always visible as the user scrolls
- Mobile: hamburger icon that reveals a dropdown below the nav bar (no slide-in drawer)
- "Get Your AI Audit" CTA in nav: filled white button (white background, dark text) — high contrast against the dark nav
- Text links: Services | Work | Assessment | Blog
- Active state: yes — current page link gets a subtle underline or brighter white text to indicate location

### CTA pairs per page
- **Definition:** Buttons + prominent text links (underlined, bold, or standalone — not inline prose links). Nav links and footer links are exempt.
- **Homepage:** Primary → "Take the Assessment" | Secondary → "Work With Me"
- **Services page:** Primary → "Work With Me" | Secondary → "Take the Assessment" (buyer intent page — direct CTA first)
- **Blog listing (/blog):** Email Capture Widget only — no additional CTA button. Discovery page, not a conversion page.
- **Blog articles:** BlogCTABlock (existing) + EmailCaptureWidget (existing) — already enforced, no change needed
- **All other pages:** Claude's discretion — enforce the 2-CTA rule, route to natural next step

### Testimonials
- Real content: Asor will supply actual quotes, names, titles, and headshot images before execution
- Count and placement: 4 total — 1 on Homepage hero, 2 on Services page, 1 on Assessment Results page
- Visual treatment: dark card — circular headshot, quote text in white, name + title in muted grey (#a3a3a3), dark box background (#111111) with subtle border (#1f1f1f)
- Implementation: plan with realistic placeholder data. Asor swaps in real testimonials (quotes + headshots) before running /gsd:execute-phase 04
- Existing testimonials on Engage page should be removed/moved — do not leave duplicates

### Urgency signals
- Message format: "Currently booking for [Month] — [N] slots remaining" — factual and calm, no manufactured pressure
- Month: auto-computed from current date (JavaScript `new Date().toLocaleString('en-US', { month: 'long' })`)
- Slot count: config variable — lives in a single config file (e.g., `src/config/site.ts` or `src/config/booking.ts`) that Asor can edit without touching component code
- Placement: Services page only
- Visual: inline text near pricing tiers, not a banner or alert box

### Claude's Discretion
- Exact active state implementation (underline thickness, color value, transition)
- Mobile hamburger dropdown styling and animation (open/close transition)
- CTA pair audit for pages not explicitly specified above (Work page, Engage page, Checkout)
- Config file name and structure for slot count
- Typography and spacing within testimonial cards
- Exact position of testimonial on assessment results page (below score, before CTA?)

</decisions>

<specifics>
## Specific Ideas

- The filled white nav CTA should match the style of the existing `EmailCaptureWidget` submit button and `BlogCTABlock` "Work With Me" button — consistent button shape, weight, and sizing
- Slot count config should be a simple exported constant (e.g., `export const BOOKING_SLOTS = 2`) — not a JSON file or env var. Easy to grep and edit.
- Testimonial cards should feel consistent with `BlogCTABlock` — same border radius, same border color, same dark background

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-navigation-content-polish-site-wide-cta-discipline-finish-content-trust-signals*
*Context gathered: 2026-05-16*
