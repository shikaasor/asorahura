# asorahura.com Roadmap

**Core Value:** Grow your income through small automations — start with one automation that visibly makes money, then ascend to automating everything automatable.

## Milestones

- ✅ **v1.0 Solo Expert Repositioning** — Phases 1–5 (shipped)
- 📋 **v2.0 Reposition to Small Business Owners** — Phases 6–11 (planned)

---

## Phases

**Phase Numbering:**
- Integer phases: planned milestone work, continuous across milestones (never restarts)
- Decimal phases (e.g. 7.1): urgent insertions between integers

<details>
<summary>✅ v1.0 Solo Expert Repositioning (Phases 1–5) — SHIPPED</summary>

- [x] **Phase 1: Critical Path** - Homepage + assessment core + checkout foundation
- [x] **Phase 2: Conversion Funnel** - Email automation + engage form + services/work pages
- [x] **Phase 3: Lead Nurture** - Blog launch + extended email sequences + segmentation
- [x] **Phase 4: Navigation & Content Polish** - Site-wide CTA discipline + finished content + trust signals
- [x] **Phase 5: Optimization & Launch Readiness** - Analytics + conversion instrumentation + final testing

Full detail for Phases 1–5 lives in `.planning/phases/01-*` … `05-*` and is preserved as originally written below.

</details>

### 📋 v2.0 Reposition to Small Business Owners (Phases 6–11)

- [ ] **Phase 6: Palette Decision + Token Foundation** - Committed light-first design system exists as tokens
- [ ] **Phase 7: Product #1 Live + Payments (REVENUE)** - A visitor from the Reel can buy DFY/DWY or get the free Build Map, self-serve
- [ ] **Phase 8: Design System Rollout** - One visual system across every page; dead code removed; no hardcoded colors
- [ ] **Phase 9: Homepage & Funnel Reposition** - Cold visitor understands the offer and can buy without a call
- [ ] **Phase 10: Assessment Re-point + Enterprise Track** - Assessment serves the new ICP and feeds the ladder; enterprise work keeps a home
- [ ] **Phase 11: Cleanup & Consistency** - Redirects, accessibility, responsive, Lighthouse, token documentation

---

## Phase Details

<details>
<summary>v1.0 Phase Details (Phases 1–5, shipped — collapsed for length)</summary>

### Phase 1: Critical Path — Homepage + Assessment Core + Checkout Foundation
**Goal**: Launch a pain-first homepage with the assessment lead magnet and checkout payment flow scaffolding.
**Depends on**: Nothing (first phase)
**Requirements**: HOME-01..11, ASSESS-01..10, CHECK-01..05 (26 total)
**Success Criteria**:
  1. Homepage renders in <2s with pain-first copy and two visible CTAs
  2. Assessment completes end-to-end with 8 questions, email capture, and personalized score
  3. Checkout page displays with Paddle inline checkout per tier
**Plans**: 4 plans — see `.planning/phases/01-critical-path/`
**Status**: Complete

### Phase 2: Conversion Funnel — Email Automation + Engage Form + Services & Work Pages
**Goal**: Complete the conversion funnel with automated email delivery, engagement form routing, and services/case-studies pages.
**Depends on**: Phase 1
**Requirements**: EMAIL-01/02/07, ENGAGE-01..06, SERV-01..07, WORK-01..07, CONV-01/02 (25 total)
**Success Criteria**:
  1. Assessment-to-email automation delivers a PDF report within 5 minutes
  2. Engage form routes submissions by score segment
  3. Services and Work pages live with pricing anchors and outcome-first case studies
**Plans**: 5 plans — see `.planning/phases/02-conversion-funnel-email-automation-engage-form-services-work-pages/`
**Status**: Complete

### Phase 3: Lead Nurture — Blog Launch + Extended Email Sequences + Segmentation
**Goal**: Build a content-driven nurture engine and extended email sequences.
**Depends on**: Phase 2
**Requirements**: EMAIL-03..06, BLOG-01..05, CONTENT-01..03 (13 total)
**Success Criteria**:
  1. Blog page live with initial articles, each ending in a CTA
  2. Segmented Day 3/7/14/30 email sequences trigger automatically
  3. Case study content migration complete (Flowmorph/EU Horizon references purged)
**Plans**: 4 plans — see `.planning/phases/03-lead-nurture-blog-launch-extended-email-sequences-segmentation/`
**Status**: Complete

### Phase 4: Navigation & Content Polish — Site-Wide CTA Discipline
**Goal**: Coherent navigation, CTA discipline, finished content, and trust signal placement.
**Depends on**: Phase 3
**Requirements**: NAV-01..06, CONTENT-04..06, CONV-03..05 (11 total)
**Success Criteria**:
  1. Primary nav built with a single clear CTA
  2. No more than 2 CTAs visible on any page
  3. Zero Flowmorph references; no dead-end pages
**Plans**: 5 plans — see `.planning/phases/04-navigation-content-polish-site-wide-cta-discipline-finish-content-trust-signals/`
**Status**: Complete

### Phase 5: Optimization, Tracking & Launch Readiness
**Goal**: Instrument the site with analytics, verify email/payments, and produce a go/no-go launch decision.
**Depends on**: Phase 4
**Requirements**: Cross-cutting (GA4, Clarity, performance, testing, go/no-go doc)
**Success Criteria**:
  1. Funnel events fire at all conversion touchpoints
  2. Email deliverability and Paddle sandbox transactions verified
  3. Go/no-go decision documented with sign-off
**Plans**: 4 plans — see `.planning/phases/05-optimization-tracking-launch-readiness-analytics-conversion-instrumentation-final-testing/`
**Status**: Complete

</details>

### Phase 6: Palette Decision + Token Foundation
**Goal**: A committed light-first design system exists as tokens, ready to build against.
**Depends on**: Phase 5 (v1.0 complete)
**Requirements**: DESIGN-01, DESIGN-02, DESIGN-03, DESIGN-04, DESIGN-05, DESIGN-06, DESIGN-07
**Success Criteria** (what must be TRUE):
  1. The creative director can compare 2–3 light-first palette directions side-by-side on identical hero, pricing-card, and CTA components
  2. Each direction ships pre-computed contrast ratios for every text/background pairing, with none below 4.5:1 body / 3:1 large text
  3. The selected direction exists in `globals.css` as color (surface, text, accent, semantic, border), type (~7 steps), spacing (~6 steps), radius/shadow/transition tokens — replacing the dark token block
  4. Playfair Display is resolved — either committed to display headings with the `h1–h4 → sans` override fixed, or dropped entirely and no longer downloaded
  5. A repeatable script checks contrast for every text/surface token pairing and reports failures
**Plans**: 3 plans — see `.planning/phases/06-palette-decision-token-foundation/`
Plans:
- [ ] 06-01-PLAN.md — Wave 0 test infra (Vitest + legitimacy checkpoint), WCAG contrast-verification script, contrast-math + token-naming test scaffolds
- [ ] 06-02-PLAN.md — Direction B semantic-scale token replacement in globals.css; Playfair Display removal from layout.tsx
- [ ] 06-03-PLAN.md — /internal/palette-review 3-direction comparison board (noindex, no site nav); route smoke test + full suite gate
**UI hint**: yes

**Note**: The palette selection (task 0.2) is a review cycle the team does not control — flag as a schedule risk. Phase 7 may proceed on a provisional accent token if this slips; the palette decision must not block revenue.

### Phase 7: Product #1 Page Live + Payments (REVENUE)
**Goal**: A visitor from the Reel can buy DFY or DWY, or download the Build Map against an email, without talking to anyone.
**Depends on**: Phase 6 (the product page is built directly in the new token system — it is the pilot for the design system)
**Requirements**: PROD-01, PROD-02, PROD-03, PROD-04, PROD-05, PROD-06, PROD-07, PROD-08, PROD-09, PROD-10, PROD-11, PROD-12, PROD-13, LEAD-01, LEAD-02, LEAD-03, LEAD-04, PAY-01, PAY-02, PAY-03, PAY-04, PAY-05, PAY-06, PAY-07, PAY-08, PAY-09, TRACK-01, TRACK-02, TRACK-03
**Success Criteria** (what must be TRUE):
  1. Paddle live status is verified and `NEXT_PUBLIC_PADDLE_PRICE_ID_*` are confirmed set in production — done first, before any other checkout work (largest launch risk, cheapest to check)
  2. The Care Plan price reads $9.99/mo everywhere on `/automate`, and $15.99/mo all-in is stated as a headline fact against ManyChat's cheapest tier (fixed before any other page work — §H4-R 10× typo)
  3. End-to-end on a real device: Reel → `/automate` → comment the keyword → receive the DM → return → purchase (DFY or DWY) completes → buyer confirmation email arrives → owner notification email arrives
  4. A visitor can submit their email inline to get the Build Map: the address lands in Resend contacts + Google Sheets mirror, the download link arrives from `hello@asorahura.com`, and the downloader is tagged for the DFY upsell
  5. The success page collects DFY/DWY onboarding (IG handle, keyword, lead magnet link, voice/tone notes), offers a scheduling link for DWY, and names the next rung in copy with an `automate-buyer` segmentation tag — with no link into the assessment yet (Phase 10 not shipped)
  6. All five analytics events (land w/ UTM, demo interaction, Build Map submit, checkout opened, purchase) fire and are visible in the dashboard
**Plans**: TBD
**UI hint**: yes

**Note**: `/automate` ships self-contained — logo-only header, own footer, no site nav — until Phase 9 lands. This is the critical path to revenue; Phases 8–11 can flex in priority once this ships.

### Phase 8: Design System Rollout
**Goal**: One visual system across every page; no hardcoded colors.
**Depends on**: Phase 7
**Requirements**: STYLE-01, STYLE-02, STYLE-03, STYLE-04, STYLE-05, STYLE-06
**Success Criteria** (what must be TRUE):
  1. Dead code is deleted before any style conversion — `page.module.css`, `Testimonials.tsx`, `SaasShowcase.tsx`, `LinkedInFeed.tsx`, `YouTubeFeed.tsx` + CSS modules, `lloydlist.{jpg,png}`, dead `const year`/`const isEnterprise` — roughly 900 lines removed first
  2. `grep -rE "#[0-9a-fA-F]{3,8}" src --include=*.css` returns only the token definitions in `globals.css`
  3. Palette collisions are resolved: two golds → one accent, `#0a0a0a` vs `#04080F` → one surface, raw Tailwind grays → the text scale
  4. Every route renders on one theme — `/articles`, `/privacy`, `/terms`, `/checkout`, `/assessment` no longer flip light/dark
  5. The Phase 6 contrast script passes on every text/surface pairing site-wide
**Plans**: TBD
**UI hint**: yes

**Note**: Does not block revenue (Phase 7 already shipped) but blocks Phase 9 — the homepage rewrite happens on top of the rolled-out system, not before it.

### Phase 9: Homepage & Funnel Reposition
**Goal**: A creator/coach landing cold understands the offer, believes it, and can buy — without a call.
**Depends on**: Phase 8 (rollout before homepage rewrite)
**Requirements**: HOME-12, HOME-13, HOME-14, HOME-15, HOME-16, HOME-17, HOME-18, HOME-19, HOME-20, HOME-21
**Success Criteria** (what must be TRUE):
  1. A cold reader reaches a purchase in ≤2 clicks from the homepage
  2. The hero leads with income growth, not hours saved; `PainSection` speaks the new ICP's language and the four regulated-vertical cards move to the enterprise track
  3. `ServicesPreview` reads as a ladder with Product #1 as the visible entry rung at its real price
  4. One entry price story appears everywhere (`/services` tiers become enterprise pricing) and the homepage shows one primary CTA
  5. Enterprise case studies appear only as a credibility strip; named testimonials with headshots replace the anonymized set; `/engage` is reframed as enterprise intake; pricing appears in the nav; one positioning statement runs across metadata/hero/footer with `metadataBase` on the production domain
**Plans**: TBD
**UI hint**: yes

**Note**: This phase removes the need for `/automate`'s self-contained shell (PROD-02) — `/automate` can adopt the full site nav once this ships.

### Phase 10: Assessment Re-point + Enterprise Track
**Goal**: The assessment serves the new ICP and feeds the ladder; enterprise work keeps a home.
**Depends on**: Phase 9
**Requirements**: ASSESS-11, ASSESS-12, ASSESS-13, ASSESS-14, ASSESS-15, ASSESS-16, ENT-01, ENT-02
**Success Criteria** (what must be TRUE):
  1. Sector routing serves the new ICP by default; a creator no longer lands in `Other / Cross-Industry`; the four regulated verticals sit behind an enterprise entry
  2. The assessment output is revenue-framed ("here are three automations worth ~$X/month to you") and the results screen routes straight to purchase instead of a 10-field form
  3. `/assessment` and `/assessment/deep` are resolved to one canonical route
  4. Calendly is removed from the primary path (all five hardcoded occurrences) and `BOOKING_SLOTS` manual scarcity is retired or automated
  5. An enterprise track page carries the case studies, the four regulated verticals, the `/engage` intake, and the `/services` tiers, reachable only from the footer and a secondary nav slot
**Plans**: TBD
**UI hint**: yes

**Note**: Once this phase lands, `/automate`'s closing section (PROD-12) can link directly into the assessment instead of relying on the `automate-buyer` tag alone.

### Phase 11: Cleanup & Consistency
**Goal**: The site is consistent, accessible, and documented so the reposition doesn't erode.
**Depends on**: Phase 10
**Requirements**: POLISH-01, POLISH-02, POLISH-03, POLISH-04, POLISH-05, POLISH-06, POLISH-07
**Success Criteria** (what must be TRUE):
  1. Redirects exist for every retired or moved route — old Reel comments and shared links keep working
  2. The footer copyright year computes dynamically, and the product page's mixed icon set is replaced with lucide-react
  3. An accessibility pass covers focus states, alt text, heading order, and keyboard navigation across the site
  4. Every page is verified responsive at 360, 768, 1024, and 1440
  5. Lighthouse runs on `/` and `/automate` and meets agreed thresholds; the README documents the token system
**Plans**: TBD
**UI hint**: yes

---

## Progress

**Execution Order (v2.0):** 6 → 7 → 8 → 9 → 10 → 11

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|-----------------|--------|-----------|
| 1. Critical Path | v1.0 | 4/4 | Complete | ✓ |
| 2. Conversion Funnel | v1.0 | 5/5 | Complete | ✓ |
| 3. Lead Nurture | v1.0 | 4/4 | Complete | ✓ |
| 4. Navigation & Content Polish | v1.0 | 5/5 | Complete | ✓ |
| 5. Optimization & Launch Readiness | v1.0 | 4/4 | Complete | ✓ |
| 6. Palette Decision + Token Foundation | v2.0 | 0/3 | Planned | - |
| 7. Product #1 Live + Payments | v2.0 | 0/TBD | Not started | - |
| 8. Design System Rollout | v2.0 | 0/TBD | Not started | - |
| 9. Homepage & Funnel Reposition | v2.0 | 0/TBD | Not started | - |
| 10. Assessment Re-point + Enterprise Track | v2.0 | 0/TBD | Not started | - |
| 11. Cleanup & Consistency | v2.0 | 0/TBD | Not started | - |

## Requirement Coverage Summary (v2.0)

**Total v2.0 Requirements:** 67
**Total Mapped:** 67
**Unmapped:** 0

**Distribution by Phase:**
- Phase 6: 7 requirements (DESIGN-01..07)
- Phase 7: 29 requirements (PROD-01..13, LEAD-01..04, PAY-01..09, TRACK-01..03)
- Phase 8: 6 requirements (STYLE-01..06)
- Phase 9: 10 requirements (HOME-12..21)
- Phase 10: 8 requirements (ASSESS-11..16, ENT-01..02)
- Phase 11: 7 requirements (POLISH-01..07)

7 + 29 + 6 + 10 + 8 + 7 = 67 ✓

## Risk Register (carried from IMPLEMENTATION_PLAN.md)

| Risk | Mitigation | Affects |
|---|---|---|
| Paddle isn't live | Verify in Phase 7 immediately, not at the end (PAY-01 is the first task) | Phase 7 |
| Care Plan typo ships | Fixed before any other page work (PROD-03) | Phase 7 |
| Palette decision slips — a review cycle the team doesn't control | Product page can ship on a provisional accent token; don't let this block revenue | Phase 6 → 7 |
| Buyer wanders off `/automate` into the un-repositioned site | Ship self-contained until Phase 9 | Phase 7 → 9 |
| Funnel converts poorly and nobody knows why | Instrument before launch (TRACK-01..03), not after | Phase 7 |
| DFY sale arrives and delivery stalls | Webhook + success-page intake ship with checkout, not as a follow-up (PAY-06/07) | Phase 7 |
| Design system erodes again | Phase 8 verify is a grep that must return zero; documented in README (POLISH-07) | Phase 8, 11 |

---

*Roadmap v1.0 created: 2026-05-13*
*Roadmap v2.0 (Phases 6–11) created: 2026-07-31 from IMPLEMENTATION_PLAN.md and WEBSITE_AUDIT.md*
*Next action: `/gsd-plan-phase 6`*
