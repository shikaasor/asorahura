# Requirements: asorahura.com — Solo Expert Repositioning

**Defined:** 2026-05-13
**Core Value:** Scale Your Business Without Scaling Your Payroll — Free up team cognitive bandwidth for work only humans can do, without adding headcount.

## v1 Requirements

### Homepage

- [ ] **HOME-01**: Hero section with Asor photo (right), copy on left, eyebrow "AI Automation Consultant"
- [ ] **HOME-02**: Primary CTA "Take the Free AI Readiness Assessment" links to /assessment
- [ ] **HOME-03**: Secondary CTA "Work with me directly" links to /engage
- [ ] **HOME-04**: Trust signal below CTAs (Oracle Certified, 7,200+ hours, 3 continents, client types)
- [ ] **HOME-05**: Pain section with 3-column card grid ("Sound familiar?" section)
- [ ] **HOME-06**: Services preview with 3 cards (RAG, Workflow Automation, Document Intelligence) with pricing anchors
- [ ] **HOME-07**: Social proof section with 3 testimonials (25% time saved, 7,200 hours freed, scaled without hiring)
- [ ] **HOME-08**: Process section (4-step horizontal timeline: Assess → Scope → Build → Deploy & Own)
- [ ] **HOME-09**: About section "Why work with a solo expert?" with informal working photo of Asor
- [ ] **HOME-10**: Lead magnet strip (dark background) "Not sure where AI fits?" + "Take assessment" CTA
- [ ] **HOME-11**: Footer with logo, nav links, social links (LinkedIn, YouTube), legal

### Services Page

- [x] **SERV-01**: Hero "Here's Exactly What I Build" with sub about scoped engagements
- [x] **SERV-02**: Tier 1 card — Starter Automation ($5,000) with features and delivery timeline
- [x] **SERV-03**: Tier 2 card — Operational Automation ($5k–$15k) with features and delivery timeline
- [x] **SERV-04**: Tier 3 card — Systems Integration ($15k–$30k) with features and delivery timeline
- [x] **SERV-05**: Tier 4 card — Enterprise/Complex Build ($30k+) with scoping note and "Book a call" CTA
- [x] **SERV-06**: Sidebar note pointing to assessment for tier matching
- [x] **SERV-07**: Social proof section with 2-3 testimonials (same as homepage)

### Work / Case Studies Page

- [x] **WORK-01**: Header "Real Problems. Real Systems. Real Results." (remove "Intellectual Dominance...")
- [x] **WORK-02**: Case Study 1 — HR Automation (2,000+ resumes, resume screening, AI rubrics, local operation)
- [x] **WORK-03**: Case Study 2 — Chatbot Analytics (Swiss insurance, 16,454 conversations, NLP pipeline)
- [x] **WORK-04**: Case Study 3 — Document Intelligence (7,826 maritime documents → 43,103 records)
- [x] **WORK-05**: Case Study 4 — Healthcare Ops (39 facilities, offline-first, no patient data leaving)
- [x] **WORK-06**: Case study card template: Problem (1 sentence) → Result (metric-first, bolded) → Built (1-2 sentences) → Stack (collapsed)
- [x] **WORK-07**: Bottom CTA "See how I can do this for your business" links to /engage

### Assessment Page (Lead Magnet)

- [x] **ASSESS-01**: Hero "Find Out Exactly Where AI Can Save Your Business Time and Money"
- [x] **ASSESS-02**: Sub "Answer 8 questions about your operations. Get a personalized AI Readiness Report."
- [x] **ASSESS-03**: Micro-trust signals "Free · Takes 4 Minutes · Report Delivered Instantly · No Sales Call Required"
- [x] **ASSESS-04**: Step 0 (email gate): "Where should we send your report?" with First Name + Email fields
- [x] **ASSESS-05**: 8 assessment questions (one per screen with progress bar):
  - Role ("What best describes your role?" — CEO/CTO/COO/Ops Manager/Other)
  - Biggest time drain (Data entry / Document / Communications / Reporting / Scheduling)
  - Current AI use (Not using / Tools only / Patchy automations / Building systems)
  - Volume ("How much per week?" — <5h / 5-20h / 20-50h / 50+h)
  - Systems in play (Multi-select: CRM/ERP/Spreadsheets/Databases/Email/Docs/None)
  - Biggest fear (Integration / Team adoption / Data/security / Don't know what / ROI uncertainty)
  - Urgency (Now / 3 months / Future / Curious)
  - Budget (Under $5k / $5-15k / $15-30k / $30k+ / Not sure)
- [x] **ASSESS-06**: Results screen with personalized AI Readiness Score (X/100 with category breakdown)
- [x] **ASSESS-07**: Results screen shows 2-3 preview bullets of what full report covers
- [x] **ASSESS-08**: Results screen primary CTA "Your Full Report Is On Its Way" with "Check your inbox" message
- [x] **ASSESS-09**: Results screen secondary CTA "Want to discuss results?" links to Calendly for $50/hr strategy call
- [x] **ASSESS-10**: Automated PDF report delivered to email with:
  - Personalized score breakdown
  - Top 2-3 automation opportunities ranked by ROI
  - Which service tier maps to their problem
  - 1-page "what you can realistically build" brief
  - Embedded Calendly link at bottom

### Engage Page (Scoped Inquiry Form)

- [x] **ENGAGE-01**: Hero "Tell Me About Your Problem"
- [x] **ENGAGE-02**: Sub "Describe what's slowing your operations down. I'll tell you what can be built, how long, and what it costs."
- [x] **ENGAGE-03**: 1-2 testimonials repeated at top (social proof at decision point)
- [x] **ENGAGE-04**: Form with 7 fields:
  - Full Name (text)
  - Email (email)
  - Company / Role (text, combined)
  - Describe your problem (large text area)
  - Which service interested in? (dropdown with tier options, pre-fills if from /services)
  - Budget range (dropdown with tier anchors)
  - When do you want to start? (Immediately / 1 month / 1-3 months / Exploring)
- [x] **ENGAGE-05**: Submit button "Submit My Project Brief"
- [x] **ENGAGE-06**: Post-submission routing logic (score-based, supersedes original budget-based spec):
  - Hot lead (score ≥ 70): redirect to /checkout?tier=strategy
  - Warm lead (score 40–69): redirect to /checkout?tier=discovery
  - Cold lead (score < 40 or no score): redirect to /engage/confirmation
  - Note: Score is passed as hidden field from ?score= URL param (set by assessment results CTA). Direct /engage visits with no score param default to cold routing.

### Checkout Page

- [x] **CHECK-01**: Order summary (service name, what's included, timeline, support period)
- [x] **CHECK-02**: Clear pricing per tier
- [x] **CHECK-03**: Payment method (Stripe) with reassurance copy
- [x] **CHECK-04**: Trust badges (Oracle Certified, Secure Payment, 100% Ownership)
- [x] **CHECK-05**: Per-tier checkout links (Stripe payment links)

### Blog Page

- [ ] **BLOG-01**: Header "Operational Intelligence"
- [ ] **BLOG-02**: Sub "Insights on AI automation, systems thinking, and scaling operations without headcount"
- [x] **BLOG-03**: Content hub with LinkedIn reprints, YouTube embeds, original long-form articles
- [ ] **BLOG-04**: Each post ends with sticky CTA block (relevant case study link OR assessment link)
- [ ] **BLOG-05**: Email capture widget (sidebar or inline) with "Get automation insights twice a month" message

### Navigation & Site-Wide

- [ ] **NAV-01**: Primary nav: Services | Work | Assessment | Blog
- [ ] **NAV-02**: Nav CTA button "Get Your AI Audit" links to /assessment (takes priority)
- [ ] **NAV-03**: Secondary CTA "Work With Me" in hero, Services page, Work page, About section
- [ ] **NAV-04**: No Flowmorph branding anywhere on site
- [ ] **NAV-05**: No more than 2 CTAs visible at once on any page
- [ ] **NAV-06**: Every page has a primary CTA routing to next step

### Email Automation

- [x] **EMAIL-01**: Assessment completion triggers immediate PDF delivery (to email captured in Step 0)
- [x] **EMAIL-02**: Email 1 (0 min) — "Your AI Readiness Report is here" with PDF + Calendly link
- [ ] **EMAIL-03**: Email 2 (Day 3) — Educational content per score tier + soft CTA to Services
- [ ] **EMAIL-04**: Email 3 (Day 7) — Relevant case study (matched to their answers) + "Work With Me" CTA
- [ ] **EMAIL-05**: Email 4 (Day 14) — Objection handling ("If you've been sitting on this...") + booking CTA
- [ ] **EMAIL-06**: Email 5 (Day 30) — Single-line question "What's the one thing you most wish ran itself?" (reply-to email)
- [x] **EMAIL-07**: Assessment results are segmented: <40 (cold nurture) / 40-70 (warm engagement) / 70+ (hot sales)

### Conversion & Funnel

- [x] **CONV-01**: Three entry states served: Cold (assessment) → Warm (engage) → Hot (checkout/services)
- [x] **CONV-02**: Assessment as primary lead gen engine (lowest friction, highest email capture)
- [ ] **CONV-03**: Pricing shown transparently (no "contact us" for pricing)
- [ ] **CONV-04**: Urgency signals real and maintained honestly ("Currently booking for [Month]", "X build slots remaining")
- [ ] **CONV-05**: No exit links to social media in conversion flow (only footer)

### Content Migration

- [x] **CONTENT-01**: Remove "Explore Flowmorph" button and all Flowmorph branding
- [x] **CONTENT-02**: Reframe case studies: outcome-first, plain language, metrics highlighted
- [x] **CONTENT-03**: Rename Articles page to Blog and add LinkedIn/YouTube content
- [ ] **CONTENT-04**: Remove EU Horizon grant references from all case studies
- [ ] **CONTENT-05**: Move testimonials from Engage page to Homepage and Services page
- [ ] **CONTENT-06**: Republish all content with new positioning (executive language, not technical)

## v2 Requirements

- **Retainer model option** (monthly project retainers for ongoing optimization)
- **Advanced lead scoring** (behavioral triggers, email engagement tracking)
- **CRM full integration** (HubSpot or Pipedrive native sync)
- **Video testimonials** (upgrade from written quotes)
- **Case study video** (client testimonial videos, 15-30 sec each)
- **Custom integrations** (API connections to client-specific tools)
- **White-label option** (for agencies to resell Asor's services)
- **Mobile app** (native iOS/Android for clients to monitor automations)
- **Webinar/live demo series** (automated systems walkthroughs)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Flowmorph branding/pages | Completely retired; single expert brand only |
| EU Horizon grant references | Removed per direction |
| Real-time chat | High complexity, not core to v1 value |
| Video posts in assessment | Storage/bandwidth costs, defer to v2+ |
| OAuth login | Email/password sufficient for v1 |
| Mobile native app | Web-first, native later |
| Multiple expert profiles | Solo expert positioning only |
| Agency reseller model | Solo focus, v2+ feature |
| Automated webinars | Live/recorded content MVP sufficient |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| HOME-01 | Phase 1 | Pending |
| HOME-02 | Phase 1 | Pending |
| HOME-03 | Phase 1 | Pending |
| HOME-04 | Phase 1 | Pending |
| HOME-05 | Phase 1 | Pending |
| HOME-06 | Phase 1 | Pending |
| HOME-07 | Phase 1 | Pending |
| HOME-08 | Phase 1 | Pending |
| HOME-09 | Phase 1 | Pending |
| HOME-10 | Phase 1 | Pending |
| HOME-11 | Phase 1 | Pending |
| ASSESS-01 | Phase 1 | Complete |
| ASSESS-02 | Phase 1 | Complete |
| ASSESS-03 | Phase 1 | Complete |
| ASSESS-04 | Phase 1 | Complete |
| ASSESS-05 | Phase 1 | Complete |
| ASSESS-06 | Phase 1 | Complete |
| ASSESS-07 | Phase 1 | Complete |
| ASSESS-08 | Phase 1 | Complete |
| ASSESS-09 | Phase 1 | Complete |
| ASSESS-10 | Phase 1 | Complete |
| CHECK-01 | Phase 1 | Complete |
| CHECK-02 | Phase 1 | Complete |
| CHECK-03 | Phase 1 | Complete |
| CHECK-04 | Phase 1 | Complete |
| CHECK-05 | Phase 1 | Complete |
| EMAIL-01 | Phase 2 | Complete |
| EMAIL-02 | Phase 2 | Complete |
| EMAIL-07 | Phase 2 | Complete |
| ENGAGE-01 | Phase 2 | Complete |
| ENGAGE-02 | Phase 2 | Complete |
| ENGAGE-03 | Phase 2 | Complete |
| ENGAGE-04 | Phase 2 | Complete |
| ENGAGE-05 | Phase 2 | Complete |
| ENGAGE-06 | Phase 2 | Complete |
| SERV-01 | Phase 2 | Complete |
| SERV-02 | Phase 2 | Complete |
| SERV-03 | Phase 2 | Complete |
| SERV-04 | Phase 2 | Complete |
| SERV-05 | Phase 2 | Complete |
| SERV-06 | Phase 2 | Complete |
| SERV-07 | Phase 2 | Complete |
| WORK-01 | Phase 2 | Complete |
| WORK-02 | Phase 2 | Complete |
| WORK-03 | Phase 2 | Complete |
| WORK-04 | Phase 2 | Complete |
| WORK-05 | Phase 2 | Complete |
| WORK-06 | Phase 2 | Complete |
| WORK-07 | Phase 2 | Complete |
| CONV-01 | Phase 2 | Complete |
| CONV-02 | Phase 2 | Complete |
| EMAIL-03 | Phase 3 | Pending |
| EMAIL-04 | Phase 3 | Pending |
| EMAIL-05 | Phase 3 | Pending |
| EMAIL-06 | Phase 3 | Pending |
| BLOG-01 | Phase 3 | Pending |
| BLOG-02 | Phase 3 | Pending |
| BLOG-03 | Phase 3 | Complete |
| BLOG-04 | Phase 3 | Pending |
| BLOG-05 | Phase 3 | Pending |
| CONTENT-01 | Phase 3 | Complete |
| CONTENT-02 | Phase 3 | Complete |
| CONTENT-03 | Phase 3 | Complete |
| CONTENT-04 | Phase 3 | Pending |
| NAV-01 | Phase 4 | Pending |
| NAV-02 | Phase 4 | Pending |
| NAV-03 | Phase 4 | Pending |
| NAV-04 | Phase 4 | Pending |
| NAV-05 | Phase 4 | Pending |
| NAV-06 | Phase 4 | Pending |
| CONTENT-05 | Phase 4 | Pending |
| CONTENT-06 | Phase 4 | Pending |
| CONV-03 | Phase 4 | Pending |
| CONV-04 | Phase 4 | Pending |
| CONV-05 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 75 total (HOME 11, ASSESS 10, CHECK 5, ENGAGE 6, SERV 7, WORK 7, BLOG 5, NAV 6, EMAIL 7, CONV 5, CONTENT 6)
- Mapped to phases: 75 (Phase 1: 26, Phase 2: 25, Phase 3: 13, Phase 4: 11)
- Unmapped: 0

---

*Requirements defined: 2026-05-13*
*Last updated: 2026-05-13 with comprehensive roadmap and phase assignments*
