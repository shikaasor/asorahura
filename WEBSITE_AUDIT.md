# Website Audit — Repositioning to Small Business Owners

**Date:** 2026-07-30
**Repo:** `asorahura` (Next.js 16, App Router, CSS Modules)
**Trigger:** ICP change from law/finance/real-estate/construction firms → small business owners at $10k–$100k MRR. Offer changes from large scoped builds to small automations that grow income, with an upsell ladder to full operational automation.
**Scope of this document:** diagnosis only. Implementation plan is the next deliverable.

> Note: the two Claude chat links provided return HTTP 403 to automated fetch (auth-gated). This audit is derived entirely from the codebase. Anything in those chats that contradicts what follows should override it — see Open Questions.

---

## Executive summary

The site is a well-built, coherent artifact **for a business you are no longer running.** Almost nothing is broken; almost everything is aimed at the wrong buyer.

Three findings dominate, in order of revenue impact:

1. **The entry price is unbuyable by the new ICP.** The cheapest thing on the site is $5,000. A business at $10k MRR would spend half a month's revenue to start. There is no self-serve purchase anywhere — every path terminates in a form or a call.
2. **Every proof asset, qualifier, and word of copy is enterprise-coded.** Sector cards cite ABA Rule 1.6 and EU AI Act Annex III. The engage form asks about "100,000+ documents/transactions" and "500+ employees." Case studies are Northwestern, a Swiss insurer, and 18th-century maritime archives. A salon owner or a 4-person agency self-disqualifies in under ten seconds.
3. **The visual system is nominal, not enforced** — and that is the direct cause of the "dull / hard to read" complaint. 66 hardcoded hex values across 36 stylesheets, four competing palettes, two different golds, and pages that flip between light and dark with no design rationale. One body-text pairing measurably fails WCAG AA.

There is also a **positioning contradiction already live on the site**: the first step costs *free* (`/assessment`), *$50/hr* (`/checkout`), and *$5,000* (`/services`) depending on which page the visitor lands on.

---

## A. Positioning — CRITICAL

### A1. The pain section speaks to the old ICP exclusively
`src/components/home/PainSection.tsx` — four cards, all vertical-specific:

| Card | Language used |
|---|---|
| Law firms | "ABA Rule 1.6 risk", "Harvey on contract review", "privilege architecture" |
| Finance & RIAs | "SR 11-7", "EU AI Act Annex III", "44% of RIAs… no formal validation" |
| Real estate | "protected class", "bias-impact review", "AVMs" |
| Construction | "Procore", "ACC", "paper RFIs" |

This is the second thing a visitor reads. For the new ICP it is not merely irrelevant — it actively signals *"this is not for you, this is for regulated firms with compliance departments."*

### A2. The assessment routes the new ICP into the worst path
`src/lib/assessment.ts` hardcodes five sectors: Law, Finance, Real Estate & Property, Construction, **Other / Cross-Industry**. Q2–Q8 have rich, specific `sectorSpecific` overrides for the four old verticals. The new ICP lands in `Other / Cross-Industry` — the generic fallback with the blandest questions and the least personalized output.

The single most valuable personalization asset on the site is tuned for the customers you're leaving and generic for the customers you're chasing. This is backwards and is a substantial sunk asset to re-point.

### A3. Pricing excludes the target market
| Surface | Entry price |
|---|---|
| `/services` — Starter Automation | $5,000 fixed |
| `ServicesPreview` (home) — AI Opportunity Discovery | $5,000 |
| `/checkout` — Discovery Call | $50/hr |
| `/checkout` — Strategy Session | $75/hr |
| `/assessment` | Free |

Two problems. First, **$5,000 is the floor** for anything built. At $10k MRR that is a half-month-revenue decision requiring multiple conversations — the exact opposite of a slippery slope. Second, these five numbers are **mutually inconsistent**, and which one a prospect sees is determined by which page they land on.

### A4. Qualifier fields tell small businesses to leave
`src/app/engage/page.tsx` requires:
- **Company Size** — options run 1-10 … 500+
- **Monthly Operational Volume** — "Under 1,000 documents/transactions" … "100,000+"
- **Budget Alignment** — starts at "Under $5k", then $5k–15k, $15k–30k, $30k+

A 3-person business reading "Monthly Operational Volume: under 1,000 documents/transactions" concludes they are below the floor. The *lowest* budget bracket being "Under $5k" frames $5k as the norm.

### A5. Every case study proves the wrong capability
`/work` (`src/app/work/page.tsx`) — four case studies: 2,000 resumes across 3 HR departments; 16,454 chatbot conversations for a Swiss insurer; 43,103 records from 18th-century Lloyd's List for Northwestern/Kellogg; offline diagnostics across 39 Nigerian health facilities.

These are genuinely impressive and prove *"I can do hard, large-scale, technically deep AI."* They do not prove *"I can add $4k/month to your 6-person business with three small automations."* Right now there is **zero proof for the new promise.**

Same problem in `TrustSignals` (`Oracle Certified`, `43,103 Maritime Records Processed`) — credentials that reassure a procurement committee, not an owner-operator.

### A6. The core new promise appears nowhere
The new offer is **income growth** — double or triple revenue via small automations. The entire site sells **time savings**:

- Hero: *"You're spending more time managing your business than growing it."*
- Sub: *"eliminate the repetitive work keeping you stuck in operations"*
- Assessment: *"Save Your Business 10+ Hours a Week"*
- About: *"saved clients 7,200+ hours"*
- Footer: *"Scale your business without scaling your payroll"*

Time-saving is a **cost** story. Owner-operators at $10k–$100k MRR buy **revenue** stories. Every headline on the site is arguing the weaker case.

### A7. There is no visible ladder
The model is now: land a small automation → prove value → ascend to broader automation → eventually automate everything automatable. The site presents four **parallel** tiers differentiated by build size, with no ascension narrative, no "start here," and no indication that the small purchase is step one of a path. The business model changed; the information architecture didn't.

### A8. Three positioning statements are live simultaneously
| Location | Statement |
|---|---|
| `layout.tsx` metadata (what Google shows) | "AI Automation Authority — Transforming Work into Flow" |
| Hero eyebrow | "AI Systems Consultant" |
| Footer tagline | "Scale your business without scaling your payroll" |

Also: `metadataBase` still points at `asorahura.vercel.app`.

---

## B. Visual system — HIGH (the creative director's complaint, quantified)

### B1. The design system exists but is not used
`globals.css` defines a clean token set. Usage across 5,558 lines of CSS in 36 stylesheets:

| Token | Times referenced |
|---|---|
| `var(--muted)` | 22 |
| `var(--border)` | 22 |
| `var(--foreground)` | 15 |
| `var(--text-primary)` | 3 |
| `var(--bg-base)` | 2 |
| `var(--gold)` | **1** |
| `var(--text-secondary)` | **1** |
| `var(--border-default)` | 1 |

Against **66 distinct hardcoded hex values** and **43 distinct `rgba()` values**. The tokens are decorative. Any palette change made in `globals.css` today would visibly alter almost nothing — which is why the palette feels un-fixable.

### B2. Four competing palettes coexist
| Palette | Representative values | Where |
|---|---|---|
| Brand dark-navy (intended) | `#04080F`, `#080E1A`, `#0D1525` | globals, engage, nav |
| Near-black (**most used**, 60 occurrences) | `#0a0a0a`, `#111`, `#1a1a1a`, `#1f1f1f` | services, blog, assessment, checkout |
| Slate | `#0f172a`, `#f8fafc`, `#f1f5f9`, `#e2e8f0` | page.module.css, testimonials |
| Raw Tailwind grays | `#6b7280`, `#9ca3af`, `#e5e7eb`, `#374151`, `#f9fafb` | assessment, checkout, feeds |

The brand background (`#04080F`) appears 14 times. The unofficial one (`#0a0a0a`) appears 60. **The site's actual dominant background is not the brand background.**

**Two golds ship simultaneously:** `#C9A060` (34 uses) and `#C9A84C` (9 uses). Nobody specified two.

### B3. Light/dark flips page-to-page with no rationale
| Page | Theme |
|---|---|
| `/` home | Dark |
| `/services` | Dark |
| `/work` | Dark |
| `/blog`, `/blog/[slug]` | Dark |
| `/engage` | Dark |
| `/assessment` | Dark hero → **white** cards |
| `/checkout` | Dark hero → **white** body |
| `/articles`, `/articles/[slug]` | **White** |
| `/privacy`, `/terms` | **White** |

A visitor moving Home → Services → Checkout → Privacy is flash-banged twice. This is the single most visible "unfinished" signal on the site, and it is *worse* on the conversion pages (`/assessment`, `/checkout`) than the marketing pages.

### B4. One measurable legibility failure
`--text-muted: #5A6B84` on card background `#0D1525` → **contrast 3.4:1**. WCAG AA requires 4.5:1 for body text.

Used for body copy in `/work` case studies (4 occurrences), `/engage`, and `AboutSection`. This is literal, measurable "hard to read," not a matter of taste.

For the record, the other pairings pass: `#9ca3af` on `#0a0a0a` = 7.8:1, `#8B9BB4` on `#04080F` = 7.1:1, `#6b7280` on `#fff` = 4.8:1 (marginal).

### B5. Why it reads as "dull" even where contrast passes
Passing contrast and having visual energy are different things. The palette is:
- Desaturated throughout — gray-blues (`#8B9BB4`, `#5A6B84`, `#9ca3af`) with near-zero chroma.
- Accented with a **low-chroma tan** (`#C9A060`), not a bright accent. It reads as muted brass, not gold.
- Almost everything sits in the same 30–45% luminance band on near-black.

Result: no focal hierarchy. Nothing optically pulls the eye toward a CTA. The page is legible but flat — exactly the "dull, hard to get information out of" symptom.

There's also an audience mismatch: **dark + gold is the luxury/enterprise/authority register.** It suited law firms and RIAs. The new ICP responds to bright, high-clarity, friendly, energetic — the register of a tool that makes money, not a consultancy that commands respect.

### B6. No typographic scale
20+ distinct `font-size` values in use: `1rem`, `0.875`, `0.75`, `0.9`, `0.8`, `0.9375`, `0.7`, `0.95`, `0.85`, `0.8125`, `0.975`, `1.0625`, `1.1`, `1.125`, `1.25`, `1.5`, `1.75`, `2`, `2.25`, `2.5`… Values like `0.9rem` and `0.875rem` and `0.9375rem` all coexist, differing by ~1px, with no system behind the choice.

Also: **Playfair Display is loaded and mostly unused.** `globals.css` sets `h1–h4` to `--font-sans`; `--font-serif` appears 19 times, largely via a `.serif` utility class that is rarely applied. Two font families are downloaded, one is used.

---

## C. Funnel friction — HIGH

The stated goal is a slippery slope from prospect to paying customer. Current state:

### C1. Nothing on the site can be bought without a conversation
Every terminal CTA leads to `/engage` (10-field form), Calendly, or `/checkout` (which also books a call). For a high-ticket consultancy this is correct. For a **small-ticket, higher-volume** model it is fatal — the unit economics cannot support a sales call per sale, and the buyer doesn't want one.

### C2. Competing and duplicated entry CTAs
Homepage hero alone offers two: "Start Your Free AI Opportunity Discovery" and "Work With Me." The nav offers a third button, "Start AI Opportunity Discovery," alongside a nav link labelled "Discovery" pointing at the same page. One product, three button labels, two destinations.

### C3. Three contradictory first-step price stories
Already covered in A3, but it's a funnel defect as much as a positioning one. A prospect who sees the free assessment, then finds `/services` quoting $5,000 for "AI Opportunity Discovery" — the *same product name* — experiences a bait-and-switch. `/checkout` then prices discovery at $50/hr. All three are live.

### C4. The assessment's exit is a wall
`ResultsScreen` shows the score, then CTAs: **"Tell Me About Your Problem →"** (`/engage`) and "Book a discovery call" (Calendly). `/engage` is a 10-field form — 4 text inputs, 6 required selects, 2 textareas.

A visitor who has just spent 4 minutes answering questions and is at peak intent is handed a longer form. There is no "buy the thing" button anywhere in the flow. Peak intent is where the purchase should be, and it's the only place on the site with no purchase option.

### C5. Calendly bypasses the paid flow entirely
`https://calendly.com/asorahura` is hardcoded in five places (four service tiers + results screen), routing around `/checkout` completely. Combined with commit `12ae358 removed paywall for discovery call`, the paid-checkout path and the free-call path now contradict each other and both ship.

### C6. Manual urgency will go stale
`src/config/booking.ts` — `BOOKING_SLOTS = 2`, edited by hand. It will eventually be wrong, and wrong scarcity is worse than none.

### C7. No pricing in the navigation
Nav is Services / Work / Discovery / Blog + CTA. For an owner-operator, price is the first question. Pricing lives on `/services`, below the fold, labelled "Here's Exactly What I Build."

---

## D. Code health — MEDIUM (matters because it slows the reposition)

### D1. Dead code
| Item | Status |
|---|---|
| `src/app/page.module.css` (~400 lines) | **Imported by nothing.** Contains an entire alternate light-theme homepage. |
| `src/components/Testimonials.tsx` + `.module.css` | No importers |
| `src/components/SaasShowcase.tsx` + `.module.css` | No importers |
| `src/components/LinkedInFeed.tsx` + `.module.css` | No importers |
| `src/components/YouTubeFeed.tsx` + `.module.css` | No importers |
| `public/images/testimonials/lloydlist.{jpg,png}` | Untracked, unreferenced |

Roughly 900 lines of dead styling that pollutes any global find-and-replace during a palette change.

### D2. Two testimonial systems, and the homepage uses the weaker one
- `SocialProof.tsx` hardcodes three testimonials: **"P.J., Assistant Professor, Kellogg"**, **"T.N., Founder, Professional Services"**, **"R.O., COO, B2B SaaS"**.
- `src/content/testimonials.json` holds four **named** testimonials with headshots (Maria Rios, Itohan Okpataku, Pawel Janas, Aamna Mansoor).

The homepage — highest-traffic page — renders the anonymized initials. The named, headshot-backed, far more credible ones appear only on `/services` and the results screen.

**Flagging directly:** "T.N., Founder, Professional Services" and "R.O., COO, B2B SaaS" read as fabricated to a skeptical reader — anonymous initials, generic industry labels, and conveniently round numbers ("40% more clients", "over 40 hours per month"). Note that "P.J., Assistant Professor, Kellogg" is the same person as the named "Pawel Janas, Kellogg" testimonial in the JSON, anonymized. If T.N. and R.O. are real, they should be named or at least attributed as specifically as the others. If they aren't, they're a liability and should come down. This needs your confirmation either way.

### D3. Duplicate assessments
`/assessment` (7 questions, free) and `/assessment/deep` (separate shell, separate results, separate actions) both exist, plus `AI_readiness_assessment.md` at repo root. Unclear which is canonical and which is linked from where — nothing in the nav points at `/assessment/deep`.

### D4. Minor
- `Footer.tsx` hardcodes `© 2026`.
- `services/page.tsx` computes `const year = new Date().getFullYear()` and never uses it.
- `checkout/page.tsx` has `const isEnterprise = false` — a dead constant.

---

## E. What I'd recommend, at a high level

Not the implementation plan — the shape it should take.

**1. Fix the offer before the pixels.** The palette is a real problem, but a beautiful site selling a $5,000 entry product to $10k-MRR businesses converts at zero. Sequence: offer & price ladder → copy & proof → funnel mechanics → visual system. The visual work is cheaper and safer once the page inventory is settled (some pages may not survive).

**2. Introduce a self-serve rung.** The model needs a purchasable first step with no call — priced so it's an impulse decision for the ICP, delivering one automation with a visible outcome. `/checkout` + Paddle infrastructure already exists; it's pointed at the wrong product.

**3. Re-point the assessment.** It's the strongest asset on the site. Replace the four regulated verticals with segments from the new ICP, and change the output from an "AI readiness score" to something closer to **"here are three automations worth ~$X/month to you"** — a revenue-framed result that names a price and links straight to purchase.

**4. Rewrite proof for the new promise.** The enterprise case studies should move to a credibility page ("who I've built for"), not the primary proof. Primary proof needs small-business before/after with revenue impact. If none exist yet, the interim substitute is demonstrations — a live automation the visitor can watch work.

**5. Collapse the paths.** One primary CTA, one price story, one route. Kill `/engage` as the post-assessment destination, or cut it to 3 fields.

**6. Rebuild the visual system properly, once.** Given that tokens are used ~100 times against 66 hardcoded hexes, a token-level palette swap will not work. This is a real refactor: define the scale (color, type, spacing), commit to one theme direction site-wide, then convert all 36 stylesheets. Delete the ~900 lines of dead CSS first so it isn't carried along.

**7. On theme direction — a recommendation.** I'd move light-first with a strong saturated accent, not dark-and-gold. Dark+gold signals premium authority; it earned trust from law firms. The new ICP needs *clarity and approachability*, and pricing that feels accessible. A bright, high-contrast, energetic palette does more work for this buyer than a luxury one. This is the creative director's call — flagging that the theme decision is downstream of the ICP decision, not independent of it.

---

## F. Open questions — blocking the implementation plan

**Offer & pricing (blocks everything)**
1. What is the entry offer and its price? A specific number changes the entire architecture.
2. Self-serve purchase, or still call-first? At small ticket, calls don't scale — but if you want them, the site design differs substantially.
3. What are the actual rungs of the ladder — offer names, prices, what each includes, and what triggers the ascension?
4. Does the "double or triple your income" claim go on the site as-is? It's a strong revenue claim; we should decide how it's substantiated and hedged before it's a headline.

**Market definition**
5. "Small business owners at $10k–$100k MRR" is a qualifier, not a market. Which segments do we speak to first? The copy, the assessment branches, and the proof all need at least 3–5 starting verticals. (Noting: the `ai_learnt` repo is all Instagram comment/DM automation and lead-magnet delivery — which points at creators, coaches, and info-product sellers. Is that the wedge?)
6. Do we retire the four old verticals entirely, or keep them as a secondary "enterprise" track? Existing high-ticket deals may be worth preserving a path for.

**Proof**
7. Do you have *any* results from the new ICP yet — even informal? If not, what's the interim proof (live demos, a free tool, a public build)?
8. The T.N. and R.O. testimonials in `SocialProof.tsx` — real and anonymized, or placeholder? Needs an answer before the homepage is rewritten.

**Design**
9. Is the creative director prescribing a specific palette, or should we propose options? And light-first or dark-first — see E7.
10. Is there a brand kit / logo constraint I should design within? Current logo is `logomain.png`.

**Scope**
11. Reposition in place, or rebuild the funnel pages from scratch? Given the CSS state, a rebuild of `/`, `/services`, `/engage`, `/checkout` may be faster than retrofitting.
12. Is the Paddle checkout live and tested? Are `NEXT_PUBLIC_PADDLE_PRICE_ID_*` configured in production?
13. `/assessment` vs `/assessment/deep` — which one is canonical? Does the other get deleted?

---

## G. Decisions taken (2026-07-30)

Answers to the gating questions above. These constrain the implementation plan.

| # | Decision |
|---|---|
| **Entry offer** | **Low-ticket, self-serve.** Instant purchase, no call in the path. One automation, visible outcome, then upsell. Makes `/checkout` + Paddle the primary conversion surface and demotes `/engage` and Calendly out of the main funnel. |
| **Segments** | **All four:** creators/coaches/info-products, local service businesses, agencies & freelancers, e-commerce/DTC. Broad — see risk note below. |
| **Old verticals** | **Keep as a secondary enterprise track.** New ICP owns the homepage and the funnel; law/finance/real-estate/construction move to a separate page. Existing case studies and sector-specific assessment branches are preserved, not deleted. |
| **Visual direction** | **Propose light-first options.** Move off dark+gold to a bright, high-contrast, saturated system. 2–3 directions to be presented to the creative director. |

### Consequences for the implementation plan

**Self-serve changes the funnel shape.** `/engage` (10 fields) leaves the primary path entirely — it becomes the enterprise-track intake form, which is what it was actually designed for. Calendly comes out of the four service tiers and the results screen. `/checkout` gets rebuilt around the new entry product rather than the $50/$75-per-hour call.

**Four segments is broad for a first pass.** Each one needs its own headline, its own proof, and its own assessment branch — that's 4× the copy and 4× the branching, against zero existing proof in any of them. Recommendation for the plan: build the *system* to hold four, but launch with **creators/coaches** carrying the primary homepage narrative, since `ai_learnt` already contains working Instagram DM/comment automation and lead-magnet delivery — the only segment where proof can be produced immediately. The other three get segment landing pages as proof arrives. Flagging this rather than deciding it.

**Keeping the enterprise track is cheap and correct.** The assessment's sector branches for the four old verticals stay intact behind an "enterprise / regulated" entry point. Nothing gets thrown away; the routing changes so the new ICP is no longer dumped into `Other / Cross-Industry`.

**Light-first makes the CSS refactor larger, not smaller.** Every one of the 36 stylesheets currently assumes a dark background. This is a full rewrite of the visual layer, not a token swap. Two things should happen before any color work: delete the ~900 lines of dead CSS (D1), and establish the token system + type scale so the palette is applied once rather than 66 times.

### Still blocking

1. ~~**The actual price point.**~~ → Answered in §H.
2. ~~**What the entry product delivers.**~~ → Answered in §H.
3. **Proof.** No results exist for any of the four segments yet. What's the interim substitute — live demos, a free tool, a public build?
4. **The `SocialProof.tsx` testimonials** (T.N., R.O.) — real and anonymized, or placeholder? Blocks the homepage rewrite.
5. **Paddle status** — live and tested? Price IDs configured in production?
6. **`/assessment` vs `/assessment/deep`** — which is canonical?

---

## H. Product #1 review — Instagram Lead Automation

**Source:** `ai_learnt/assets/automate-landing-page.html` (600 lines, standalone preview)
**Underlying system:** built and live-tested — 4 n8n workflows (`IG Webhook Receiver`, `IG Comment Handler`, `IG Follow Check & Deliver`, `IG Token Refresh`), PostgreSQL, Instagram Platform API with a **real** `is_user_follow_business` check, not self-report.

### H1. The offer as it stands

| Rung | Price | What it is |
|---|---|---|
| **The Build Map** (DIY) | **Free** | All 4 workflow files, env template, deployment guide. Buyer self-hosts (~$6–12/mo). |
| **Done For You** (DFY) | **$500** one-time | Provisioned server, Meta app + IG connection, messaging in their voice, live in 3–5 days. |
| — Care Plan add-on | **from $99/mo** | Token renewals, uptime, small copy changes. |
| **Done With You** (DWY) | **$800** one-time | DFY built alongside them, screen-to-screen, so they can maintain it. |

**Positioning:** anti-ManyChat. *"Two Ways to Stop Renting Your Leads."* Anchored against a subscription ladder shown on-page at $17 / $39 / $99 / $199 per month.

**This is good work.** The offer ladder is real, the mechanism is genuinely built and tested, the three-phone walkthrough explains the product in about four seconds, and "stop renting your leads" is a sharp, ownable angle. Most of what follows is calibration, not redesign.

### H2. This resolves the segment question decisively

Product #1 is Instagram comment-to-DM lead capture. That is **creators, coaches, and info-product sellers running paid or organic IG lead gen** — exactly the wedge I recommended in §G. It is not a fit for local services, agencies, or e-commerce without meaningful adaptation. Treat the four segments as sequential, with this one first, and let the other three wait for products of their own.

It also revises my §G assumption: this is **self-serve but not low-ticket.** $500–$800 is mid-ticket, bought without a call. That's a harder sell than the $100–700 impulse band I sketched, and it raises the bar on what the page must do — see H5.

> **§H3–H7 CORRECTED 2026-07-30** after founder review. My payback model was wrong — I treated ManyChat's tiers as static states a buyer sits in, when they are a **ratchet** driven by contacts that accumulate and never reset. Nobody in this ICP stays at $17/mo. The arithmetic was right for a premise that doesn't exist. Corrected analysis in §H3-R; the original is kept below it for the record. The Care Plan is **$9.99/mo**, not the $99/mo printed on the landing page — see §H4-R.

### H3-R. Corrected payback — the offer is strong, and the page undersells it

Contacts **accumulate**. A lead captured in month 1 still counts in month 24. So for any growing account the subscription bill only ever ratchets upward, while the owned system stays flat at $6/mo (DigitalOcean droplet). Modelling that properly, with the tier thresholds the page already displays (250 / 2,500 / 7,500 / 25,000 contacts):

| New leads/month | Tier path over 24 months | **DFY $500 pays back in** |
|---|---|---|
| 200 | Essential → Pro (m2) → Business (m13) | **~14 months** |
| 500 | Pro (m1) → Business (m5) → Advanced (m15) | **~8 months** |
| 1,000 | Pro (m1) → Business (m3) → Advanced (m8) | **~7 months** |

And the gap doesn't close — it widens without bound. An account at 25,000 contacts pays **$199/mo forever ($2,388/yr)** against **$6/mo ($72/yr)**. In year three that's a ~33× cost difference on identical functionality.

**So the strongest argument isn't payback at all — it's the ceiling.** "Break-even in 8 months" invites arithmetic. "Your bill goes up every month you succeed; ours never does" is the actual product, and it's unanswerable. The `.replaces-note` on the page already says this — it's the best sentence on the page, set in the smallest, lowest-contrast type.

**Revised recommendation, reversing what I said below:** *keep all four tiers.* Don't cut Essential and Pro — they're the first two rungs of the ladder the buyer is standing on. But present them as a **path with arrows, not four options**, lead with the contact counts rather than the prices (the contact count is the ratchet mechanism), and put the trajectory sentence in large type as the section heading. The visual should read *"$17 → $39 → $99 → $199, and you don't get to choose"* against a single flat line at $6.

<details>
<summary>Original §H3 (superseded — retained for the record)</summary>

### H3. The payback math undercuts the core argument — HIGH

The page's whole persuasive weight rests on comparing a one-time price to a monthly subscription. Running that comparison honestly, including the ~$9/mo hosting the page discloses:

| They're currently on | Net monthly saving | **DFY $500 pays back in** | **DWY $800 pays back in** |
|---|---|---|---|
| Essential $17/mo | $8 | **62 months** | 100 months |
| Pro $39/mo | $30 | **17 months** | 27 months |
| Business $99/mo | $90 | **5.6 months** | 8.9 months |
| Advanced $199/mo | $190 | **2.6 months** | 4.2 months |

The offer is compelling for people on **Business and Advanced** — 7,500 to 25,000 contacts. It is a *bad financial decision* for anyone on Essential or Pro, and the page displays those two tiers first, at the left, where they're read first.

Two consequences:

1. **The page is arguing against itself for most viewers.** Showing the $17 tier invites a comparison the offer loses badly. I'd cut Essential and Pro from the strip, or reframe the strip as a *trajectory* — "you start at $17 and you end up at $199, because the better your ads perform the more you pay" — which is already the argument in the `.replaces-note` and is much stronger than a static price comparison. The note is currently doing the heavy lifting in the smallest, lowest-contrast text on the page.
2. **The real buyer is bigger than "small business owner."** Someone paying ManyChat $99–199/mo has real volume. That's consistent with the $10k–$100k MRR band, but it means the messaging should target **operators already at scale and feeling the ceiling**, not beginners.

</details>

### H4-R. The Care Plan price on the landing page is wrong by 10× — CRITICAL

The actual Care Plan price is **$9.99/mo**. The landing page (line 562) prints **"from $99/mo"**.

That single typo is what created the contradiction analysed below. At the real price the offer is not merely fine — it's the strongest fact on the page:

| | Upfront | Ongoing |
|---|---|---|
| ManyChat Essential (250 contacts) | $0 | **$17/mo** |
| Owned + Care Plan (**no contact limit**) | $500 | **$15.99/mo** ($6 droplet + $9.99 care) |

Fully managed, unlimited contacts, **cheaper per month than the cheapest ManyChat tier** — and that gap grows to 12× at their top tier. This belongs on the page in large type. Right now the page states the opposite of the truth and hands a sharp prospect a fatal objection.

**Highest-priority fix on the page.** Nothing else on this list matters as much.

<details>
<summary>Original §H4 (superseded — based on the $99 typo)</summary>

### H4. The Care Plan breaks the promise — HIGH

DFY + Care Plan = **$500 upfront, then $99/mo + ~$9/mo hosting = $108/mo ongoing.**

The thing it replaces — ManyChat Business — is **$99/mo with nothing upfront.**

A buyer who takes the Care Plan pays *more per month than the subscription they were told they'd escape*, plus $500. "Stop renting your leads" collapses entirely, and a sharp prospect will notice. Given that the Care Plan is presented directly beneath the DFY price, this is the first objection a careful reader will form.

Options: price the Care Plan well under the tier it displaces (~$29–49 reads as maintenance, not rent); or fold basic upkeep into the one-time price and reserve a paid plan for genuine ongoing work (new campaigns, new keywords, copy iteration) framed as *growth*, not *maintenance*. Either way the current number contradicts the headline.

</details>

### H5-R. Proof — resolved at the mechanism level

The acquisition Reel runs **on the account that posts it**, and the Reel itself shows the automation working. A prospect who comments the keyword experiences the product before they've read a word of the page. That is the "product as its own demo" advantage I recommended below, and it already exists.

The page must **make that testable explicitly** — a visible invitation to go comment the keyword and watch it fire. Currently the page doesn't mention that the demo is live and reachable.

One residual gap, not a launch blocker: this proves *the mechanism works*, not *what it did for a buyer's business*. First DFY customer, ask for a before/after on leads captured and follower growth. That's the proof that unlocks the revenue framing in §H6.

<details>
<summary>Original §H5 (largely superseded)</summary>

### H5. Zero proof, zero risk reversal, on a $500–800 no-call purchase — HIGH

The page has no testimonial, no case study, no result, no screenshot of it running, no guarantee, no refund policy, no FAQ, no founder credibility, no "who this is for."

For a self-serve purchase at this price with no human in the loop, the page has to overcome every objection alone. Right now it makes claims and asks for $500. This is the single biggest conversion gap in the product, and it's the same §F-3 blocker: **there is still no proof for the new ICP.**

The cheapest fix available: the automation is *live on `@ai_learnt` right now*. A 20-second screen recording of a real comment producing a real DM, embedded on the page, is worth more than any testimonial and costs an afternoon. Second cheapest: a public "watch it work" — invite visitors to comment the keyword on a live post and experience the product themselves before buying. That converts the product into its own demo, which is a rare advantage worth exploiting.

### H6. Still a savings story, not a revenue story

Every pain point on the page is about cost and loss — the bill climbs, leads slip, you don't own it. That's tighter than the main site's "save time" framing, but it's still the weaker of the two available arguments.

The revenue version is right there and unused: **the follow-gate grows the account while it captures the lead.** Every lead is forced through a real follow check, so the buyer's follower count and lead list grow together, automatically, from ad spend they're already making. That's a growth mechanism, not a cost saving — and it's the one thing ManyChat's price tiers can't be compared against. It also connects directly to the "double or triple your income" promise, which currently appears nowhere in the business's public materials.

</details>

### H7-R. Brand — resolved

**Asor Ahura owns everything.** `@ai_learnt` is Asor's Instagram lead-generation account, not a competing brand — it's the **acquisition channel and the demonstration surface**, and it stays.

So the architecture is settled: the product page lives in this repo on asorahura.com and inherits the (new, light-first) design system. `@ai_learnt` drives traffic to it via the Reel and serves as the live demo. The `"Follow @ai_learnt"` copy in the phone mockup is therefore **correct as written** — it's a real screenshot of the real demo account, not a placeholder to swap. Worth labelling it as such on the page ("this is live right now — try it"), turning what looks like a mockup into proof.

<details>
<summary>Original §H7 (superseded)</summary>

### H7. Brand collision — needs a decision

The DM copy on the page reads *"Follow @ai_learnt."* The product is built on the **AI Learnt** brand and Instagram account. The website being audited is **Asor Ahura**, positioned as an AI systems consultancy.

These are two different brands with two different registers, and it isn't clear which one sells this. It matters structurally:

- **If Asor Ahura sells it:** it becomes a product page in this repo, inherits the site's design system, and feeds the assessment funnel and the upsell ladder. Requires the demo DM copy to be re-shot with the buyer's handle, not `@ai_learnt`.
- **If AI Learnt sells it:** it's a separate funnel on a separate domain, and Asor Ahura remains the consultancy — in which case this reposition is much smaller than we've been scoping, and the two brands need a defined relationship.

I'd recommend Asor Ahura sells it, with AI Learnt as the demonstration account — "here's it running on my own account" is proof, and it solves H5. But this is your call and it changes the shape of the implementation plan.

</details>

### H8. The ladder stops here

The page ends at $800. Nothing on it points toward the broader automation work the business model depends on. The entire upsell thesis — land a small automation, then automate progressively larger chunks — has no expression on the page that is supposed to be the first rung.

Minimum: a closing section that names what comes next, plus a post-purchase path. The natural bridge is the assessment — a buyer who just watched one automation work is the most qualified possible candidate for "what else in your business looks like this?"

### H9. Design and integration notes

**The skin is now obsolete.** The page is built in the dark + gold palette and written to inherit `globals.css` on port. With the §G decision to go light-first, the *structure and copy survive; the styling doesn't.* Not wasted work — the layout is the valuable part — but don't port it as-is.

**A real integration bug in the porting instructions.** The header comment says deleting the `:root` block will make it "pick up the site's existing fonts/palette automatically." True for color. **Not true for type:** this page sets `h1 { font-family: var(--font-serif) }` (Playfair), but `globals.css` sets `h1, h2, h3, h4 { font-family: var(--font-sans) }`. On port, every heading silently flips from Playfair to Inter and the page's typographic character is lost. The serif needs re-declaring explicitly in the module.

**It reproduces the audit's contrast failure.** `--text-muted` (#5A6B84) on `--bg-card` (#0D1525) = **3.4:1**, failing AA — and here it's applied to `.tier-contacts`, `.card-addon`, `.replaces-note`, and `.fine-print`. That is the contact limits, the Care Plan price, the trajectory argument, and the cost disclosures — i.e. **every piece of small text that does persuasion or sets expectations.** The most objection-sensitive copy on the page is the hardest to read.

**Minor:** `.pain-icon` uses `↑ ✕ 🔒` — a mixed set of arrow, glyph, and emoji that renders inconsistently across platforms. The lucide-react icons already in the project would be consistent.

### H10. The free tier is an ungated lead magnet

The Build Map links to `[DIY_DOWNLOAD_LINK]` — a raw Google Drive link, no email capture. This gives away all four workflows and collects nothing.

Gate it behind an email. That list is the audience for the DFY upsell, the Care Plan, the assessment, and every product after this one. There's already a working email infrastructure in this repo (Resend, `src/lib/email.ts`, `/api/subscribe`) — this is a small wire-up, not a build.

Worth noting the strategy is sound regardless: giving away the *how* and selling the *done* is well-proven. But it means the paid tiers sell **speed and certainty**, not access — and DFY's bullets currently restate things the free tier also provides. That copy should lean much harder on "an afternoon of technical setup you don't do, and it's right the first time."

### H11. Blockers — final status (2026-07-30)

**All strategic questions resolved.** Remaining items are execution details, not decisions.

| Resolved | Detail |
|---|---|
| Entry price and ladder | Free Build Map → DFY $500 / DWY $800 → Care Plan $9.99/mo |
| What the product delivers | Fully specified (§H1) |
| Lead segment | Creators / coaches / info-product sellers via IG |
| Self-serve | Confirmed — Paddle, no call in path |
| Proof | Reel + live demo account (§H5-R) |
| Brand ownership | Asor Ahura owns everything; `@ai_learnt` is the channel |
| Care Plan pricing | $9.99/mo — page must be corrected from $99 |
| Email capture | Wire Build Map to Resend — approved |

| Still open (execution) | Impact |
|---|---|
| Paddle live status + price IDs in production | Blocks purchase, not design |
| `SocialProof.tsx` — are T.N. / R.O. real? | Blocks homepage rewrite only |
| `/assessment` vs `/assessment/deep` canonical | Blocks assessment rework only |

**→ Proceed to implementation plan.**
