# Phase 1: Critical Path — Context

**Gathered:** 2026-05-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Build a high-conversion homepage with pain-first copy (time/effort waste focus), launch an 8-question assessment (with downloadable 20-question scorecard PDF), capture emails at results gate, and scaffold a Paddle checkout flow with embedded tier selection (test mode).

</domain>

<decisions>
## Implementation Decisions

### Homepage Copy & Layout
- **Pain-first messaging:** Lead with time/effort waste narrative (admin overhead, manual processes consuming 20+ hours/month)
- **Primary CTA:** "Take the Free AI Readiness Assessment" above fold
- **Secondary CTA:** "Book a Strategy Call" (Calendly link) for those not ready to assess
- **Layout:** Two-column on desktop (pain-first copy on left, Asor photo on right)
- **Mobile layout:** Copy on top, photo below (single column)
- **Trust signals:** Replace generic certifications with client testimonials + specific credentials: "7,826 pages of structured data extracted from 260 years of Lloyd's List maritime records" + "2,000+ resumes reviewed"

### Assessment Questions & Flow
- **Hybrid approach:** Phase 1 shows 8 quick gateway questions; results page offers downloadable full 20-question scorecard PDF for deeper dive
- **Question format:** Claude's discretion (best format per question type)
- **Branching logic:** Role-based. First question captures role (Founder / CTO / Operations Leader); remaining 7 questions adapt based on role selection
- **Scoring:** Maintain 0-100 scale from full scorecard (map 8 questions proportionally)
- **Email capture:** Gated after assessment completion, before results display. Users provide First Name + Email to access score and tier interpretation
- **Progress indicator:** Show progress bar (e.g., "Question 3 of 8")

### Results Page & Email
- **Score presentation:** Number + readiness tier name (e.g., "42/60 — Pre-Deployment Ready")
- **Results content:** 
  - Interpretation of what the score means (drawn from full scorecard guidance)
  - Next steps recommendation based on tier (e.g., "Book a discovery call for a System Architecture Audit")
  - Link to download full 20-question scorecard PDF
- **Secondary CTA:** "Book a Discovery Call" (Calendly)
- **Personalized email:** Auto-send immediately after results display, containing score + tier + interpretation + next steps + PDF download link
- **Results page copy tone:** Professional but approachable (not alarmist for low scores; encouraging for high scores)

### Checkout Experience (Payment & Tier Selection)
- **Payment platform:** Paddle (not Stripe)
- **Checkout integration:** Paddle Checkout embedded inline on checkout page
- **Tier selection:** Integrated into payment form (user selects tier + amount within same form)
- **Tier display:** Show all 4 tiers clearly ($5k, $5-15k, $15-30k, $30k+)
- **Test mode messaging:** Subtle disclaimer below payment form only: "This is a test transaction. No charges will be applied."
- **Confirmation after payment:** Display order confirmation with tier selected + next steps (e.g., "Check your email for next steps" or "We'll contact you within 24 hours")

### Claude's Discretion
- Assessment question format (multiple choice, rating, mix — choose best per question)
- Loading skeleton design and animation
- Exact typography, spacing, and color palette (use Tailwind/Shadcn defaults)
- Results page visual hierarchy and layout
- Paddle form styling and error messaging

</decisions>

<specifics>
## Specific Ideas

- Pain-first copy approach mirrors the problem-first positioning from research: users are drowning in manual work, not inspired by technology
- Assessment should feel lightweight and achievable (8 questions = ~3-5 minutes on mobile), matching roadmap success criteria
- Trust signals emphasize specialized depth (Lloyd's List, resume review) over generic certifications — differentiates from generic AI consultants
- Email gating on results drives quality leads (those who want answers provide contact info voluntarily)
- Paddle checkout handles tax compliance automatically (important for EU/international customers per research)

</specifics>

<deferred>
## Deferred Ideas

- Advanced assessment branching (conditional show/hide per answer) — Keep as future iteration if needed
- Mobile app version of assessment — out of scope
- Assessment retake/history tracking — belongs in analytics phase (Phase 5)
- Personalization by industry/company size in gateway questions — evaluate after Phase 1 data

</deferred>

---

*Phase: 01-critical-path*
*Context gathered: 2026-05-14*
