# asorahura.com Roadmap

**Total Phases:** 5
**Sequential Execution:** One phase per week
**Total Timeline:** 5 weeks
**Core Value:** Scale Your Business Without Scaling Your Payroll

---

## Phase 1: Critical Path — Homepage + Assessment Core + Checkout Foundation

**Goal:** Launch a pain-first homepage with the assessment lead magnet and checkout payment flow scaffolding. Establish the primary funnel engine and prove value capture.

**Requirements Mapped:**
- HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06, HOME-07, HOME-08, HOME-09, HOME-10, HOME-11 (11 total)
- ASSESS-01, ASSESS-02, ASSESS-03, ASSESS-04, ASSESS-05, ASSESS-06, ASSESS-07, ASSESS-08, ASSESS-09, ASSESS-10 (10 total)
- CHECK-01, CHECK-02, CHECK-03, CHECK-04, CHECK-05 (5 total)
**Total Phase 1: 26 requirements** (Note: Total adjusted from initial estimate)

**Success Criteria:**
1. **Homepage renders in <2s** with Asor's photo on right, pain-first copy on left, and two visible CTAs
2. **Assessment entry point visible** with "Take the Free AI Readiness Assessment" primary CTA above fold on homepage
3. **Assessment completes end-to-end** with 8 questions, progress bar, email capture in Step 0, and personalized score on results page
4. **Email can be captured** from assessment completion with no friction (First Name + Email only)
5. **Checkout page displays** with Stripe payment ready per tier ($5k, $5-15k, $15-30k, $30k+) without taking payment yet (test mode)
6. **Mobile responsive** across all three journeys (homepage → assessment → checkout)
7. **Trust signal visible** below homepage CTAs (Oracle Certified, 7,200+ hours, 3 continents)

**Plans:** 4 plans across 2 waves

Plans:
- [ ] 01-1a-homepage.md — Build all 11 homepage sections (hero, pain, services, social proof, timeline, about, lead magnet strip, footer)
- [ ] 01-1b-assessment.md — Build 8-question role-branching assessment with email gate, scoring, results screen, PDF generation, and Resend delivery
- [ ] 01-1c-checkout.md — Build Paddle inline checkout with 4-tier pricing, order summary, and trust badges
- [ ] 01-2-integration.md — Integration pass: fix layout/config, cross-page consistency audit, full end-to-end verification

**Estimated:** 1.5 weeks
**Dependencies:** None (phase 1 is foundation)

---

## Phase 2: Conversion Funnel — Email Automation + Engage Form + Services & Work Pages

**Goal:** Complete the conversion funnel by automating email delivery, launching the engagement form with routing logic, and publishing services/case studies pages to establish authority and provide tier matching guidance.

**Requirements Mapped:**
- EMAIL-01, EMAIL-02, EMAIL-07
- ENGAGE-01, ENGAGE-02, ENGAGE-03, ENGAGE-04, ENGAGE-05, ENGAGE-06
- SERV-01, SERV-02, SERV-03, SERV-04, SERV-05, SERV-06, SERV-07
- WORK-01, WORK-02, WORK-03, WORK-04, WORK-05, WORK-06, WORK-07
- CONV-01, CONV-02

**Success Criteria:**
1. **Assessment-to-email automation works** with PDF report delivered to email within 5 minutes of assessment completion
2. **Personalized score segmentation active** (cold <40, warm 40-70, hot 70+) routing distinct email paths per segment
3. **Engage form collects submissions** with routing logic functional (Hot→checkout Strategy Session, Warm→checkout Discovery Call, Cold→confirmation)
4. **Services page ranks tiers clearly** with pricing anchors ($5k, $5-15k, $15-30k, $30k+) and assessment linkage for tier matching
5. **Case studies reframed** to outcome-first language (metric-first results, problem/solution/stack visible)
6. **Assessment results page has CTA** linking to engage form with score in URL

**Plans:** 5/5 plans complete

Plans:
- [ ] 02-01-PLAN.md — Email automation backend: LLM client (Gemini via OpenAI SDK), branded PDF generator, segmentation helper, Resend sequence with scheduling
- [ ] 02-02-PLAN.md — Frontend funnel wiring: ResultsScreen → /engage?score=, engage form overhaul + score routing + confirmation page, checkout tier pre-selection
- [ ] 02-03-PLAN.md — Services page: 4 pricing tier cards, assessment sidebar note, testimonials
- [ ] 02-04-PLAN.md — Work/case studies page rewrite: outcome-first headlines, 5-section template, remove Flowmorph/EU Horizon, /engage CTA

**Estimated:** 1.5 weeks
**Dependencies:** Phase 1 (assessment core must exist; email platform configured before assessment launch)

---

## Phase 3: Lead Nurture — Blog Launch + Extended Email Sequences + Segmentation

**Goal:** Build content-driven nurture engine and extended email sequences that convert cold/warm leads into warm/hot prospects. Blog becomes second funnel driver pulling readers to assessment.

**Requirements Mapped:**
- EMAIL-03, EMAIL-04, EMAIL-05, EMAIL-06
- BLOG-01, BLOG-02, BLOG-03, BLOG-04, BLOG-05
- CONTENT-01, CONTENT-02, CONTENT-03

**Success Criteria:**
1. **Blog page live** with 3-5 initial articles (mix of LinkedIn reprints, YouTube embeds, original long-form)
2. **Each blog post ends with CTA** (sticky block linking to assessment or relevant case study)
3. **Email sequences fully segmented** with distinct 5-email nurture per temperature tier (cold, warm, hot)
4. **Day 3, 7, 14, 30 emails send** automatically per trigger with educational/case study/objection handling content
5. **Blog-to-assessment conversion** visible (readers click assessment CTA in post footer)
6. **Content migration complete** for case studies (Flowmorph references removed, EU Horizon grant references purged, outcome language applied)

**Plans:** 1/3 plans executed

Plans:
- [ ] 03-01-PLAN.md — Blog infrastructure: install MDX deps, migrate 4 case studies to /content/blog/ MDX files, build src/lib/blog.ts, add /articles redirects
- [ ] 03-02-PLAN.md — Blog UI: listing page card grid, category filter, /blog/[slug] article page, BlogCTABlock component
- [ ] 03-03-PLAN.md — Email nurture sequences: draftNurtureEmailSequence (Day 3/7/14/30) in llm.ts, wire into email.ts

**Estimated:** 1 week
**Dependencies:** Phase 2 (email platform must be configured and handling Phase 1-2 sequences)

---

## Phase 4: Navigation & Content Polish — Site-Wide CTA Discipline + Finish Content + Trust Signals

**Goal:** Polish site experience with coherent navigation, CTA discipline (max 2 per page), complete all content migrations, and finalize trust signal placement across all pages.

**Requirements Mapped:**
- NAV-01, NAV-02, NAV-03, NAV-04, NAV-05, NAV-06
- CONTENT-04, CONTENT-05, CONTENT-06
- CONV-03, CONV-04, CONV-05

**Success Criteria:**
1. **Primary nav built** (Services | Work | Assessment | Blog) with "Get Your AI Audit" CTA button in header
2. **No more than 2 CTAs visible** on any page simultaneously (primary + secondary; enforced via design review)
3. **Testimonials repositioned** (1-2 on hero, 3 on services, 1 on assessment results) with specific metrics + name/title
4. **Flowmorph references scrubbed entirely** (zero mentions on any page)
5. **Pricing urgency signals active** with "Currently booking for [Month]" and X build slots messaging
6. **No dead-end pages** — every page has primary CTA routing to next step (assessment, engage, checkout, or strategy call)

**Estimated:** 0.5 weeks
**Dependencies:** Phase 3 (all content finalized before CTA polish)

---

## Phase 5: Optimization, Tracking & Launch Readiness — Analytics + Conversion Instrumentation + Final Testing

**Goal:** Instrument site with conversion tracking, add analytics for measurement, run final QA/testing, and prepare for live launch with monitoring dashboards.

**Requirements Mapped:**
- All CTA tracking + funnel instrumentation
- GA4/Clarity analytics setup
- Email deliverability verification
- Stripe live mode activation

**Success Criteria:**
1. **Microsoft Clarity heatmaps installed** tracking user behavior on homepage, assessment, results, and checkout pages
2. **GA4 event tracking active** for all CTAs (assessment click, assessment start, assessment completion, engagement form submission, checkout initiation, email opens)
3. **Funnel visualization dashboard built** showing conversions at each stage (visitor → assessment → email → engage → checkout)
4. **Email deliverability tested** (test emails to Gmail, Outlook, corporate domains with PDF rendering verified)
5. **Stripe production mode activated** with 3 test transactions completed end-to-end
6. **Mobile testing passed** (iOS Safari, Chrome mobile, Android Chrome for all flows)
7. **Page speed benchmarked** (<2s homepage, <1.5s assessment results, <2s checkout) via Lighthouse
8. **Go/no-go decision documented** with confidence level for launch

**Estimated:** 1 week
**Dependencies:** Phase 4 (all content and CTAs finalized)

---

## Requirement Coverage Summary

**Total v1 Requirements:** 75
**Total Mapped:** 75
**Unmapped:** 0

**Distribution by Phase:**
- Phase 1: 26 requirements (Homepage 11, Assessment 10, Checkout 5)
- Phase 2: 25 requirements (Email automation 3, Engagement 6, Services 7, Work 7, Conversion 2)
- Phase 3: 13 requirements (Email automation 4, Blog 5, Content 4)
- Phase 4: 11 requirements (Navigation 6, Content 2, Conversion 3)

**Coverage Verification:**
✓ All 75 v1 requirements mapped to exactly one phase (26+25+13+11=75)
✓ Zero unmapped requirements
✓ All dependencies respected (Assessment before Checkout, Email before Assessment, Services before Engage routing)
✓ All success criteria are observable user behaviors or measurable signals, not task completion
✓ Phase count (4) covers all functional scope; Phase 5 is instrumentation/analytics/optimization only

---

## Timeline & Velocity

| Phase | Weeks | Start | End | Deliverable |
|-------|-------|-------|-----|-------------|
| Phase 1 | 1.5 | Week 1 | Week 2.5 | Homepage + Assessment + Checkout (test mode) |
| Phase 2 | 1.5 | Week 2.5 | Week 4 | Email automation + Engage + Services/Work pages |
| Phase 3 | 1 | Week 4 | Week 5 | Blog + Extended email sequences |
| Phase 4 | 0.5 | Week 5 | Week 5.5 | Navigation + CTA polish + Content finalization |
| Phase 5 | 1 | Week 5.5 | Week 6.5 | Analytics + Testing + Launch readiness |

**Total Project Duration:** 6.5 weeks (18.2 weeks compressed to working weeks)

---

## Critical Path Dependencies

```
Phase 1 (Homepage + Assessment + Checkout scaffolding)
    ↓
Phase 2 (Email automation + Engage + Services/Work)
    ↓
Phase 3 (Blog + Extended email nurture)
    ↓
Phase 4 (Navigation + CTA discipline + Content polish)
    ↓
Phase 5 (Analytics + Testing + Launch)
```

**Key Blockers to Prevent:**
- Assessment must be live before email automation (otherwise no subscribers)
- Email platform must be configured before Phase 1 ships (results delivery email must work)
- Services/Work pages must exist before Engage form launch (routing logic references tier options)
- Blog content must exist before email sequences reference it (Email 3 & 4 link to case studies)

---

## Success Definition for Entire Project

**Day 1 (Live Launch Readiness):**
- Homepage visible in <2 seconds with clear Asor photo, pain-first copy, 2 CTAs
- Assessment link clickable and fully functional through score display and results page
- Email delivery verified (test email received with PDF)
- Stripe payment flow testable (not yet live, but endpoints working)

**Week 1 (First 100 Visitors):**
- 10-15% of homepage visitors click Assessment CTA
- 80%+ of assessment starters complete all 8 questions
- 80%+ of completers provide email (name + email fields)
- Results page visible and Secondary CTA (Calendly) clickable
- Zero 404s or broken links on critical path

**Week 2-3 (Funnel Stability):**
- Email automation working (PDF delivered <5 min)
- Engage form accepts submissions with routing functional
- Services and Work pages visible with outcome-first language
- Case study links from Engage form working correctly

**Week 4-6 (Nurture Engine):**
- Blog posts published with CTA blocks active
- Email sequences triggered correctly per segment
- Analytics dashboard showing conversion funnel
- Mobile experience parity with desktop

---

*Roadmap created: 2026-05-13*
*Next action: /gsd:execute-phase 02*
