# asorahura.com — Automation Products for Small Business Owners

## What This Is

asorahura.com is Asor Ahura's product site. Its singular job: a creator or coach who sees an Instagram Reel lands on the site, understands the automation being sold, believes it works, and buys it — without a call, a form, or a conversation.

v1.0 rebuilt the site as a solo-expert consultancy for regulated verticals (law, finance, real estate, construction) with a $5,000 entry price and a call-first funnel. That shipped. v2.0 repositions it: the buyer is now a small business owner at $10k–$100k MRR, the entry price is free-to-$800, and the purchase is self-serve. The enterprise work becomes a secondary track rather than the primary path.

## Current Milestone: v2.0 Reposition to Small Business Owners

**Goal:** Turn the site from an enterprise consultancy pitch into a self-serve product funnel for creators and coaches, with Instagram Lead Automation as the first purchasable rung.

**Target features:**
- Light-first design token system replacing dark+gold, applied once rather than 66 times
- `/automate` — Product #1 page with self-serve Paddle checkout, email-gated Build Map, live-demo proof, post-purchase onboarding, and funnel instrumentation
- Design system rollout across all 36 stylesheets; ~900 lines of dead CSS deleted first
- Homepage and funnel repositioned to the new ICP — income promise, visible ladder, one price story, one primary CTA
- Assessment re-pointed to the new segments with revenue-framed output that links to purchase
- Enterprise track page preserving the four regulated verticals, case studies, and `/engage` intake
- Cleanup: redirects, accessibility, responsive, Lighthouse, token documentation

**Source documents:** [IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md) (the plan this milestone executes) and [WEBSITE_AUDIT.md](../WEBSITE_AUDIT.md) (the diagnosis behind it, with §-referenced findings).

## Core Value

**Grow your income through small automations** — start with one automation that visibly makes money, then ascend to automating everything automatable. You own the system; the bill doesn't climb as you succeed.

## Requirements

### Validated

**From v1.0 (shipped, phases 1–5):**
- ✓ Homepage, services, work, blog, assessment, engage, checkout all built and live
- ✓ Paddle inline checkout integrated (`displayMode: inline`)
- ✓ Resend email infrastructure — `src/lib/email.ts`, `/api/subscribe`, contacts + Google Sheets mirror
- ✓ Segmented email nurture sequences with LLM drafting
- ✓ Assessment with sector routing and scored results
- ✓ Enterprise case studies (HR automation, Swiss insurance NLP, Lloyd's List, healthcare ops)
- ✓ Named testimonials with headshots in `src/content/testimonials.json`

**Carried into v2.0 as assets to re-point, not rebuild:** Paddle, Resend, the assessment engine, the case studies, `/engage`.

### Active

See `.planning/REQUIREMENTS.md` for the scoped v2.0 requirement set with REQ-IDs.

### Out of Scope

- Flowmorph branding — retired in v1.0
- Segment launches beyond creators/coaches — local services, agencies, and e-commerce wait for products and proof of their own
- Mobile app — web-first only
- Real-time chat
- New enterprise marketing — the enterprise track is preserved, not grown

## Context

**Why the reposition:** The site is a coherent artifact for a business no longer being run. The cheapest thing on it is $5,000 — half a month's revenue for a $10k-MRR business. Every proof asset is enterprise-coded (ABA Rule 1.6, SR 11-7, 500+ employees, 100,000+ documents). A salon owner or 4-person agency self-disqualifies in under ten seconds. Nothing is broken; almost everything is aimed at the wrong buyer.

**The wedge:** Creators, coaches, and info-product sellers running Instagram lead gen. Chosen because it is the only segment where proof can be produced immediately — `@ai_learnt` runs the automation live, and the acquisition Reel demonstrates the product on the account that posts it.

**Product #1 — Instagram Lead Automation:**

| Rung | Price | What it is |
|---|---|---|
| The Build Map (DIY) | Free (email-gated) | 4 n8n workflow files, env template, deployment guide; buyer self-hosts (~$6/mo) |
| Done For You | $500 one-time | Provisioned server, Meta app + IG connection, messaging in their voice, live in 3–5 days |
| Done With You | $800 one-time | Built alongside them, screen-to-screen, so they can maintain it |
| Care Plan | $9.99/mo | Token renewals, uptime, small copy changes |

Underlying system is built and live-tested: 4 n8n workflows, PostgreSQL, Instagram Platform API with a real `is_user_follow_business` check.

**The core argument:** ManyChat's contacts accumulate and never reset, so the subscription only ratchets upward ($17 → $39 → $99 → $199) while an owned system stays flat at $6/mo. The argument is the ceiling, not the payback period — "your bill goes up every month you succeed; ours never does." Fully managed at $15.99/mo all-in is cheaper than ManyChat's cheapest 250-contact tier.

**Visual state:** 66 hardcoded hex values across 36 stylesheets, four competing palettes, two different golds, pages flipping light/dark with no rationale, one body-text pairing measurably failing WCAG AA (3.4:1). Tokens exist but are referenced ~100 times against those 66 hexes — a token-level palette swap will not work. This is a refactor, not a swap.

**Tone:** Direct, operator-to-operator. Specific numbers, short sentences. Revenue framing, not time-saved framing.

## Constraints

- **Brand:** Asor Ahura owns everything. `@ai_learnt` is the acquisition channel and live demo surface, not a competing brand.
- **No call in the primary path.** Self-serve via Paddle. Scheduling exists only post-purchase for DWY, and on the enterprise track.
- **Light-first visual direction.** Moving off dark+gold. Creative director selects from proposed directions.
- **Contrast floor:** 4.5:1 body text, 3:1 large text, verified by script rather than by eye. The §B4 failure does not recur.
- **`/automate` ships self-contained** — minimal header, own footer, no site nav — until the homepage catches up in Phase 3. A $500 buyer will look around before paying, and today every other page contradicts this one.
- **Enterprise track is preserved,** not deleted: four verticals, case studies, `/services` tiers, `/engage` intake, Calendly — all move behind a secondary entry.
- **One price story** for the entry offer across every surface.
- **Sequencing:** revenue first (Phases 0→1), then foundation, then the rest of the site.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| ICP → small business owners, $10k–$100k MRR | v1.0's $5k floor and enterprise proof exclude the market being pursued | ✓ Decided 2026-07-30 |
| Wedge = creators/coaches/info-products via IG | Only segment with an immediately producible proof asset (`@ai_learnt` runs live) | ✓ Decided 2026-07-30 |
| Self-serve, no call in path | Unit economics of a $500 ticket cannot support a sales call per sale | ✓ Decided 2026-07-30 |
| Old verticals kept as secondary enterprise track | Existing high-ticket deals worth a path; nothing thrown away, routing changes | ✓ Decided 2026-07-30 |
| Light-first palette, creative director selects | Dark+gold is the luxury/authority register; new ICP responds to clarity and approachability | ✓ Decided 2026-07-30 |
| Palette decision before the product page | Building `/automate` in a retired palette is double work; the page pilots the token system | ✓ Decided 2026-07-30 |
| Keep all four ManyChat tiers, presented as a ratchet | The tiers are the rungs the buyer is standing on; the ceiling is the argument, not the payback | ✓ Corrected 2026-07-30 after founder review |
| Care Plan is $9.99/mo | Landing page prints $99/mo — a 10× typo that inverts the offer's core claim | ✓ Must ship corrected |
| `/automate` self-contained until Phase 3 | Prevents a mid-purchase buyer wandering into $5,000 enterprise pricing | ✓ Decided 2026-07-30 |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---

*Last updated: 2026-07-31 — milestone v2.0 started from IMPLEMENTATION_PLAN.md*
