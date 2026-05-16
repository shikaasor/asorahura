# Phase 5: Optimization, Tracking & Launch Readiness - Context

**Gathered:** 2026-05-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Instrument the site with conversion tracking and analytics, run final QA/testing across critical flows and devices, benchmark performance, and produce a documented go/no-go decision before flipping Paddle to live mode. This phase does not add new features — it verifies, measures, and signs off on what Phases 1-4 built.

</domain>

<decisions>
## Implementation Decisions

### Analytics event tracking
- GA4 is the primary event tracking tool; Microsoft Clarity is for heatmaps
- Top-of-funnel is the priority signal: homepage-to-assessment CTA click is the most important event to track precisely
- Scroll depth tracking on homepage: 25%, 50%, 75%, 100% milestones — needed to identify where visitors drop before clicking
- Microsoft Clarity installed on 4 critical pages only: homepage, assessment, results page, checkout — not site-wide
- GA4 funnel visualization via GA4 exploration views only — no Looker Studio dashboard needed

### Performance thresholds
- Roadmap targets (<2s homepage, <1.5s results, <2s checkout) are soft targets — launch is not blocked if missed; fix in week 2 post-launch
- Measure Core Web Vitals (LCP, CLS, INP) plus overall load time — not just raw Lighthouse score
- Performance audit runs on Vercel preview deploy — real network/CDN conditions, not local
- Results documented in a launch-readiness checklist file (persistent record with pass/fail per page)

### Testing scope & devices
- Mobile testing: real device (Asor's own phone) for the critical flows
- Browser requirement: Chrome only (desktop + mobile) must pass before launch
- Email deliverability: Gmail inbox only — PDF must render correctly; no Outlook or mobile inbox required
- Paddle checkout: 4 test transactions, one per pricing tier, in sandbox mode before live mode activation

### Launch criteria & go/no-go
- Go/no-go gate: one complete end-to-end funnel journey with a real email address — visit → assessment → email received → results → Paddle checkout — all working
- No launch deadline; checklist-driven — launch when the criteria are met
- Rollback policy: any broken critical-path flow is a hard blocker; fix before launching, no exceptions
- Go/no-go decision documented in a written `LAUNCH.md` in the repo with checklist, pass/fail, and explicit sign-off

### Claude's Discretion
- Exact GA4 event naming convention (snake_case naming, parameter structure)
- Clarity session recording settings and privacy masking configuration
- Structure and format of the launch-readiness checklist file
- Which specific Lighthouse categories to report (Performance, Accessibility, SEO, Best Practices)

</decisions>

<specifics>
## Specific Ideas

- Checkout is Paddle inline (displayMode: inline), not Stripe — any test transaction instructions must reference Paddle sandbox, not Stripe test mode
- Performance audit must use Vercel preview URL, not localhost — numbers must reflect CDN reality
- The `LAUNCH.md` file should include a confidence level field (e.g., Low / Medium / High) and a date of sign-off

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 05-optimization-tracking-launch-readiness-analytics-conversion-instrumentation-final-testing*
*Context gathered: 2026-05-16*
