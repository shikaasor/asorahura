# Phase 2: Conversion Funnel — Email Automation + Engage Form + Services & Work Pages - Context

**Gathered:** 2026-05-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Complete the conversion funnel: automate personalized email delivery post-assessment using an LLM, launch the engage form with score-based routing to checkout or confirmation, and publish the services pricing page and outcome-first case studies. Phase 1's assessment and checkout infrastructure must exist. Phase 3's blog and extended nurture sequences are out of scope.

</domain>

<decisions>
## Implementation Decisions

### PDF Report Content & Format
- PDF contains: score (0-100) + breakdown by category/question + personalized next step based on segment
- Breakdown granularity: Claude's discretion (optimize for what's most useful given the 8 assessment questions)
- Visual style: Branded — Asor's colors, logo, professional design (feels like a real consulting deliverable)

### Email Delivery — LLM-Personalized
- **LLM integration via LiteLLM** — provides provider flexibility
- Default model: `gemini-3.1-pro-preview` (configurable via LiteLLM)
- Trigger: At assessment completion — one LLM call per user, all emails drafted and queued at once
- LLM context input: full assessment report + score (0-100) + segment (cold/warm/hot)
- Output: personalized initial email + all follow-up emails (Day 3, 7, 14, 30)
- Delivery: Resend API with scheduled delays (not Loops for follow-ups)

### Email Tone & Initial Email
- Initial delivery email: Personal, from Asor — short note with PDF attached
  - Tone: 1-on-1 conversation, not formal notification
  - Example frame: "Hey [Name], here's your AI Readiness Report. Based on your score of X, here's what I'd suggest..."

### Cold/Warm/Hot Email Differentiation
- **Highly differentiated** — not the same template with different emphasis
  - **Cold (<40)**: Education angle — "What businesses like yours are saving/earning with AI" (opportunity cost framing)
  - **Warm (40-70)**: Case study angle — proof of what others with similar profiles achieved
  - **Hot (70+)**: Urgency angle — primary CTA is direct to checkout (Strategy Session)
- Hot lead follow-up CTA: **go to checkout** (not Calendly)

### Engage Form — Fields
Existing form fields (keep + update budget ranges):
1. Full Name (required)
2. Email (required)
3. Company / Organization (required)
4. Your Role (required)
5. Company Size (required)
6. Monthly Operational Volume (required)
7. Primary Operational Challenge (textarea, required)
8. Engagement Timeline (required)
9. **Budget Alignment** — update ranges to match checkout tiers exactly:
   - Under $5k
   - $5k–$15k
   - $15k–$30k
   - $30k+
10. Additional Context (optional)

### Engage Form — Score-Based Routing
- Routing trigger: assessment score passed as URL param (`/engage?score=82`)
- Assessment results page links to engage form with score in URL
- On submit, server reads score param and routes:
  - **Hot (70+)** → Checkout page (Strategy Session)
  - **Warm (40–70)** → Checkout page (Discovery Call)
  - **Cold (<40)** → Confirmation page: "Thanks for reaching out. We'll be in touch with resources."

### Services Page — Tier Display
- Layout: **4 pricing cards** (one per tier, presented in columns)
- Each card contains: price range + 3-4 bullet scope items + CTA button
- CTAs per card:
  - Top tier ($30k+): "Book Strategy Session" → checkout
  - All other tiers: "Take the Assessment" → assessment (fresh start, no tier pre-selection)
- Assessment links are standalone — score determines tier, not which card was clicked

### Case Study Structure — Template
Every case study follows this 5-section template:
1. **Headline**: Metric result up front — e.g. "40% reduction in manual processing time for a $50M logistics company"
2. **Client context**: Who they are, their scale, their situation
3. **What we built**: The solution Asor designed and delivered
4. **Business impact**: Outcome-first, measured results
5. **CTA block**: "See if we're a fit" → Engage form (no assessment CTA on case studies)

### Case Study Attribution
- All past work attributed to **Asor Ahura / asorahura.com** directly
- All Flowmorph references replaced — zero mentions anywhere (per CONTENT-04)
- EU Horizon grant references purged

### Claude's Discretion
- Exact PDF breakdown structure (categories vs per-question — choose what's clearest given the 8 assessment questions)
- LLM prompt design for email drafting (Claude designs the system prompt to maximize conversion)
- Services page scope bullet content per tier (Claude writes the 3-4 bullets based on Asor's positioning)
- Case study body copy (Claude writes or rewrites in outcome-first language per the template)
- Cold lead confirmation page copy

</decisions>

<specifics>
## Specific Ideas

- "Project payments only happen after an initial call. The checkout on the website is for call scheduling payment only (Discovery Call or Strategy Session)."
- LiteLLM chosen for provider optionality — not locked to one model vendor
- Hot leads who score 70+ on assessment should bypass free calls entirely and go straight to paid Strategy Session checkout
- Warm leads (40-70) routed to paid Discovery Call checkout — they pay but at the lower tier

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within Phase 2 scope

</deferred>

---

*Phase: 02-conversion-funnel-email-automation-engage-form-services-work-pages*
*Context gathered: 2026-05-15*
