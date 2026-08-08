# Phase 10: Assessment Re-point + Enterprise Track - Research

**Researched:** 2026-08-08
**Domain:** Assessment routing + revenue framing + sector gating + enterprise track creation
**Confidence:** HIGH

## Summary

Phase 10 repoints the assessment from an "AI readiness score" model to a "revenue opportunity" model and gates the four regulated verticals (Law, Finance, Real Estate & Property, Construction) behind a secondary enterprise track. The new ICP is small business owners (creators/coaches/info-product sellers); the four regulated verticals become an enterprise-only path. This phase consolidates `/assessment` and `/assessment/deep` into one canonical route, removes Calendly from the primary path entirely, and replaces the assessment results screen's routing from a 10-field form to a direct purchase/checkout pathway.

**Primary recommendation:** Create a unified assessment route with sector-gating logic that branches regulated verticals to an enterprise gate before the assessment, collect only sector and first name during assessment (not 10 fields after), display revenue-framed results ("automations worth ~$X/month"), and route directly to `/checkout` instead of `/engage`.

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ASSESS-11 | Sector routing serves the new ICP by default; regulated verticals sit behind enterprise entry so no "Other/Cross-Industry" fallback | Sector routing exists; DEFAULT_SECTOR currently = "Other / Cross-Industry"; need to invert logic |
| ASSESS-12 | Results are revenue-framed ("automations worth ~$X/month") not "AI readiness scores" | Current: shows "AI Opportunity Score"; sector recommendations exist with bullets (leverage these) |
| ASSESS-13 | Results screen routes to purchase, not 10-field form | Current: ResultsScreen links to `/engage?score={score}`; need to route to `/checkout` instead |
| ASSESS-14 | `/assessment` and `/assessment/deep` merged to one canonical route | Two separate routes/components exist; deep = 8q full, quick = 7q summary |
| ASSESS-15 | Calendly removed from primary path; appears on enterprise track only | Five hardcoded Calendly references found across codebase |
| ASSESS-16 | `BOOKING_SLOTS` manual scarcity automated or retired | Constant defined at `src/config/booking.ts` value=2; used in BookingUrgency component |
| ENT-01 | Enterprise track page carries case studies, regulated verticals, `/engage`, `/services` tiers | Case studies exist at `/work`; regulated verticals in sector recommendations; engage/services exist separately |
| ENT-02 | Enterprise track reachable from footer and secondary nav slot, never primary path | Footer has basic nav; no secondary slot exists yet |

## Current State Audit

### Assessment Routes & Components

**Route structure:**
- `/assessment` → `src/app/assessment/page.tsx` → `<AssessmentShell />`
  - 7-question quick assessment
  - Hero: "Find Out Exactly Where AI Can Save Your Business 10+ Hours a Week"
  - Trust pills: "Free", "Takes 4 Minutes", "Instant Results", "No Sales Call"
  
- `/assessment/deep` → `src/app/assessment/deep/page.tsx` → `<DeepAssessmentShell />`
  - 8-question full assessment (24q actually, 6 dimensions, structured differently)
  - Hero: "Full AI Opportunity Discovery Scorecard"
  - Trust pills: "Free", "Takes 10 Minutes", "Section-Level Scores", "No Sales Call"

**Sector routing logic (`src/lib/assessment.ts`):**
- Five sectors defined: "Law", "Finance", "Real Estate & Property", "Construction", "Other / Cross-Industry"
- DEFAULT_SECTOR = "Other / Cross-Industry" — [VERIFIED: src/lib/assessment.ts line 21]
- Q1 is routing question (weight=0, not scored): "Which sector best describes your organisation?"
- Questions 2-8 have sectorSpecific overrides for Law/Finance/Real Estate/Construction
- "Other / Cross-Industry" uses generic options, no compliance/regulatory specifics

**Score & tier calculation (`src/lib/assessment.ts` + `src/lib/sectorRecommendations.ts`):**
- Quick assessment: 0-100 scale
  - Tier 1 (0-29): "Early Stage — Systems Needed"
  - Tier 2 (30-59): "Pre-Deployment Ready"
  - Tier 3 (60-79): "Deployment Ready"
  - Tier 4 (80+): "Advanced Optimization Ready"
- Deep assessment: 0-72 scale (6 dimensions × 12 max)
  - Similar tier thresholds: ≤23→1, ≤41→2, ≤56→3, >56→4
- Segment calculation: "cold" (<40), "warm" (40-69), "hot" (70+)

**Results screen routing:**
- Quick assessment (`ResultsScreen`): 
  - Shows "Your AI Opportunity Score" (number/100)
  - Shows tier name ("Early Stage", etc.)
  - Shows description + three bullets
  - **CTA 1**: "Tell Me About Your Problem →" → `/engage?score={score}` [VERIFIED: src/components/assessment/ResultsScreen.tsx line 57]
  - **CTA 2**: "Book a discovery call →" → `https://calendly.com/asorahura` [hardcoded]
  - Shows testimonial
  
- Deep assessment (`DeepResultsScreen`):
  - Shows total score and section breakdown (6 cards with dimension scores/interpretations)
  - **CTA**: "Book a Discovery Call" → `https://calendly.com/asorahura` [hardcoded]
  - No form routing option
  - No purchase routing

### Calendly References (Five Hardcoded Occurrences)

[VERIFIED: grep across src/]

1. `src/app/assessment/deep/actions.ts` — email body: `<a href="https://calendly.com/asorahura">`
2. `src/app/checkout/page.tsx` — enterprise button: `<Link href="https://calendly.com/asorahura">`
3. `src/app/engage/actions.ts` — two redirect() calls to Calendly after form submission (cold/warm intent)
4. `src/app/services/page.tsx` — four Calendly CTA links on service tier cards (all `"Book Strategy Session"`)
5. `src/components/assessment/DeepResultsScreen.tsx` — results button: `<a href="https://calendly.com/asorahura">`
6. `src/components/assessment/ResultsScreen.tsx` — secondary CTA: `<a href="https://calendly.com/asorahura">`
7. `src/emails/AssessmentReport.tsx` — email CTA
8. `src/lib/email.ts` — constant: `export const CALENDLY_URL = "https://calendly.com/asorahura"`
9. `src/lib/pdf.ts` — PDF copy: "calendly.com/asorahura"
10. `src/lib/prompts.ts` — multiple references (cold/warm/hot segmentation email CTAs)

Count: 5 primary hardcoded URLs + 5 additional supporting references = **10 total references**, with the 5 "primary path" being the user-facing CTAs in main flows.

### BOOKING_SLOTS Manual Scarcity

[VERIFIED: src/config/booking.ts]
```typescript
export const BOOKING_SLOTS: number = 2;
```

Used in `src/components/services/BookingUrgency.tsx`:
```typescript
if (BOOKING_SLOTS <= 0) return null;
<p>Currently booking for {month} — {BOOKING_SLOTS} slot{BOOKING_SLOTS !== 1 ? 's' : ''} remaining</p>
```

Manual, hardcoded, non-automated. Can go stale and show false scarcity signals.

### Engage Form (10 Fields)

`src/app/engage/page.tsx` — **currently 10 fields:**
1. Full Name
2. Email
3. Company / Organization
4. Your Role
5. Which service are you interested in? (select: Starter/Operational/Systems/Enterprise)
6. Company Size (select: 1-10, 11-50, 51-200, 201-500, 500+)
7. Monthly Operational Volume (select: <1k, 1k-10k, 10k-100k, 100k+)
8. Primary Operational Challenge (textarea)
9. Engagement Timeline (select: immediate/1-month/1-3-months/exploring)
10. Budget Alignment (select: <5k, 5k-15k, 15k-30k, 30k+)

Plus one hidden field: assessment score (if coming from `/engage?score=X`).

Form submission routes to: `submitInquiry()` → on success: success page, on cold/warm segment: redirect to Calendly.

### Services & Engage Pages

**`/services` page (`src/app/services/page.tsx`):**
- Four tiers all marked `enterprise: false` initially, last tier `enterprise: true`
- All four tiers have CTAs: `"Book Strategy Session"` → `https://calendly.com/asorahura`
- Includes `<BookingUrgency />` scarcity component
- Testimonials from `content/testimonials.json` (services section)
- No differentiation between "small business" and "enterprise" pricing tiers

**`/engage` page:**
- Labeled "Discovery Brief"
- Headline: "Tell Me About Your Problem"
- 10-field form
- No revenue framing
- Success page routes to Calendly for cold/warm, or confirmation for hot

### Case Studies & Regulated Verticals

**Case studies (`src/app/work/page.tsx`):**
- Four case studies (resume screening, chatbot analysis, maritime records, health diagnostics)
- NOT enterprise-specific; mixed verticals
- No law/finance/realestate/construction examples shown
- /work is linked in footer nav, primary nav

**Regulated verticals content:**
- **Law (ABA Rule 1.6):** Tier descriptions in `src/lib/sectorRecommendations.ts` — mentions "600+ sanctioned hallucination cases since Mata v. Avianca"
- **Finance (SR 11-7 / EU AI Act):** Tier descriptions mention "Model Risk Management", "customer PII", "comms-surveillance"
- **Real Estate & Property (Fair Housing / HUD 2024):** Tier descriptions mention "protected classes", "bias-impact review"
- **Construction:** Tier descriptions mention "platform standardisation", "Procore/ACC"

All four have full Tier 1-4 recommendation matrices with bullets and CTAs. Not currently presented as "enterprise-only" — just sector branches within the same assessment flow.

### Navigation & Footer

**Navigation (`src/components/Navigation.tsx`):**
- Links: Services, Work, Discovery (assessment), Blog
- CTA: "Start AI Opportunity Discovery"
- No secondary slot for enterprise track

**Footer (`src/components/home/Footer.tsx`):**
- Logo + tagline: "Scale your business without scaling your payroll"
- Nav column: Home, Discovery (assessment), Engage, Work
- Legal column: Privacy, Terms, Refund
- LinkedIn social link
- Copyright year: hardcoded "2026"
- No enterprise track link

### Revenue & Pricing Display

No existing "revenue framing" components found. Current patterns:
- `/automate` page shows pricing: "$500 DFY", "$800 DWY", "$9.99/mo Care"
- `/checkout` shows hourly: "$50/hr Discovery", "$75/hr Strategy"
- `/services` shows: "$5,000", "$5k–$15k", "$15k–$30k", "$30k+"

Assessment currently shows **"AI Opportunity Score"** (0-100), not revenue. Sector recommendations include bullets like:
- "Expand the pilot from one matter type to two more" (Law Tier 3)
- "Build the explainability framework" (Finance Tier 3)
- But NO "$X/month saved" or "worth $Y in annual productivity"

## Architecture Patterns

### Assessment Flow (Current → Target)

**Current:**
```
Visitor → /assessment 
  → [Sector Q1] → [7 quick Qs] 
  → Score: 0-100 "AI Opportunity Score"
  → ResultsScreen 
    → CTA: /engage (10-field form) OR Calendly (second CTA)
```

```
Visitor → /assessment/deep 
  → [Sector Q1] → [8 full Qs across 6 dimensions]
  → Score: 0-72 by dimension
  → DeepResultsScreen 
    → CTA: Calendly only
```

**Target:**
```
Visitor → [Enterprise Gate: "Is this a regulated-vertical business?"]
  ├─ YES (Law/Finance/RealEstate/Construction) → /enterprise track (separate path)
  │  ├─ Info about enterprise engagement
  │  ├─ Link to /engage (10-field form for enterprise)
  │  ├─ Case studies, /services tiers marked as enterprise
  │  └─ Calendly available
  │
  └─ NO or "Small Business" 
     → /assessment [merged route; Q1 = sector with SMB default]
     → [7 or 8 questions] 
     → Score: "Revenue Opportunity" framed in $/month per vertical
     → Single ResultsScreen
       → Sector-specific revenue recommendations
       → CTA: /checkout (direct purchase path)
```

### Sector-Specific Revenue Framing

Based on current offerings and sector recommendations, infer revenue ranges:

| Sector | SMB Default Automations | Est. Monthly Value* |
|--------|------------------------|-------------------|
| Small Business (Other/SMB) | Email triage, client intake, reporting | $100–$300/mo (1–3 small automations) |
| Law | Client intake + conflicts, document review triage, billing reconciliation | $500–$2,000/mo (partner time at $300–500/hr) |
| Finance | KYC/AML automation, portfolio reporting, comms surveillance | $800–$3,000/mo (advisor time value) |
| Real Estate | Lease abstraction, tenant triage, listing generation | $300–$1,500/mo (agent/PM time) |
| Construction | Daily reports, RFI triage, estimating AI, schedule updates | $400–$2,000/mo (PM/super time) |

*[ASSUMED: No official revenue model defined; inferred from sector readiness recommendations and typical automation ROI formulas (hours saved × internal hourly rate)]*

### Enterprise Track Structure (Conceptual)

New `/enterprise` page (or `/enterprise/track` or similar) should consolidate:
1. **Hero:** Reposition the four regulated verticals
2. **Four vertical cards:** Law, Finance, Real Estate, Construction
   - Link to sector-specific intake (`/engage?sector=law`, etc.)
   - OR consolidated intake with sector pre-selected
3. **Case studies:** Existing /work case studies (possibly curated or marked enterprise)
4. **Services tiers:** Current `/services` page tiers, but positioned as enterprise offerings
5. **Calendly availability:** Positioned only here, not in primary SMB path
6. **/Engage form:** 10-field form, but for enterprise leads only

**Reachability:**
- Footer: Add "Enterprise Track" link
- Secondary nav slot: Possibly a top-right "For Enterprise" or similar (not defined yet — leave for planner)
- NOT: Primary nav, primary CTA, or primary hero

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sector-specific revenue calculation | Custom "calculate $X/month" logic | Reference existing sector recommendation tiers as heuristic; map to price bands | Sector-readiness framework already exists and is maintained; adding revenue model should layer on top, not fork |
| Assessment consolidation logic | New assessment engine replacing existing one | Keep existing calculation engine; add routing logic before/after to gate enterprise and unify UX | The assessment scoring and sector-specific questions are validated; only routing and output format changes |
| Calendly removal automation | Custom "find-and-replace Calendly" script | Manual grep + targeted edits per file; verify in test/staging | Grep shows 5 primary + 5 supporting references across 10 files; some embedded in email templates, PDFs, prompts — worth checking each context |
| Enterprise track page build | Custom "landing page builder" | Re-use existing components (ServiceCard, TestimonialCard, etc.) and existing `/work` case study content | Design system exists; case studies already in memory; just need new layout + routing |

## Common Pitfalls

### Pitfall 1: Revenue Framing Without Context
**What goes wrong:** Showing "$200/mo" savings but not explaining *which automations* or *why* — leads to disbelief or scope creep confusion later.
**Why it happens:** Sector-readiness tiers explain which workflows save time, but don't connect to dollar values; revenue model exists in Asor's head, not in code.
**How to avoid:** Build revenue framing as *bullet points* tethered to the existing sector-recommendation bullets. E.g., instead of "AI Opportunity Score: 65", show:
  ```
  Your Top 3 Automations (Est. Value):
  • Email triage automation → ~$100/mo (5 hrs/wk at $20/hr)
  • Client intake system → ~$150/mo (10 hrs/wk at $15/hr)
  • Reporting pipeline → ~$80/mo (4 hrs/wk at $20/hr)
  Total: ~$330/mo
  ```
**Warning signs:** Planner writes new "revenue calculation component" or hard-codes dollar values per tier; ask for underlying rationale first.

### Pitfall 2: Premature Route Consolidation
**What goes wrong:** Merging `/assessment` and `/assessment/deep` into one route, then realizing the "8q deep" and "7q quick" have different UX expectations (progress bars, step counts, time estimates).
**Why it happens:** Both routes currently exist and work; merging them seems simple but requires UI decisions about which length to show, whether to offer both, or how to transition between them.
**How to avoid:** Keep both assessment engines as-is; merge at the *results screen level* (one unified ResultsScreen component that works for both 0-100 and 0-72 scales). Route `/assessment` and `/assessment/deep` both to the same results component, parameterizing it by assessment type.
**Warning signs:** Planner or executor deletes `DeepAssessmentShell` or tries to unify questions array; maintain both.

### Pitfall 3: Calendly Removal Context Blindness
**What goes wrong:** Removing Calendly from `/services` and `/checkout` but forgetting it in `/lib/prompts.ts` AI email logic — users still get Calendly CTAs in segmentation emails.
**Why it happens:** Grep finds the 5 primary links, but not the 5 supporting references baked into email templates, PDFs, and prompt strings.
**How to avoid:** Before removing any Calendly URL, search for uses of `CALENDLY_URL` constant and trace all email/PDF paths that reference calendar booking. Update those templates/prompts *before* removing the constant.
**Warning signs:** Search results show "10+ references" but plan only addresses 5; look for `.ts` and `.tsx` files using calendar URLs indirectly (via constants, prompt injections, template substitutions).

### Pitfall 4: Enterprise Gate Too Aggressive
**What goes wrong:** Gating ALL of Law, Finance, Real Estate, Construction behind enterprise entry means a solo paralegal or small 2-person law firm can't access the quick assessment — they hit "enterprise" gate and get routed to a 10-field form instead.
**Why it happens:** Requirement says "regulated verticals sit behind enterprise entry", interpreted as "all people in these industries must use enterprise path".
**How to avoid:** Gate should be *informational*, not *gatekeeping*. E.g., "This sector is regulated — we recommend our enterprise intake to scope compliance from the start. Continue to self-serve assessment anyway?" Allow bypass to SMB assessment but with a compliance disclaimer.
**Warning signs:** Planner creates an if/then gate with no escape hatch; requirements say "sits behind" not "only accessible via".

### Pitfall 5: Revenue Numbers Without Validation
**What goes wrong:** Showing "$500–$2,000/mo" for Law without user validation — when a 3-person practice runs the assessment, they see "$2,000" but their actual savings are $80/mo because they have no delegation loop.
**Why it happens:** Revenue estimates in this research are [ASSUMED] — inferred from sector descriptions and typical automation ROI, but not validated against real data.
**How to avoid:** Frame revenue as "potential" or "typical range", not "guaranteed". Pair with a disclaimer: "Actual value depends on your specific workflow size and internal hourly rate." Link to a calculator or breakdown doc the user can personalize.
**Warning signs:** Revenue numbers appear without context or ranges; results screen shows a single "$X/mo" instead of a range with assumptions.

## Code Examples

### Pattern: Sector-Gated Assessment Entry

[ASSUMED: No existing gate in codebase; conceptual pattern]

```typescript
// Conceptual routing pattern for enterprise gate
// src/app/assessment/route-handler.ts or similar

export async function assessmentEntryRoute(sector?: string) {
  // If sector is regulated, offer enterprise gate
  const regulatedSectors = ["Law", "Finance", "Real Estate & Property", "Construction"];
  
  if (sector && regulatedSectors.includes(sector)) {
    return {
      gate: true,
      message: "This sector requires compliance-aware scoping. Enterprise intake recommended.",
      choices: [
        { label: "Use Enterprise Intake (10-field form)", href: "/engage?sector=" + sector },
        { label: "Continue with Self-Serve Assessment", href: "/assessment?sector=" + sector },
      ]
    };
  }
  
  // Otherwise, proceed to assessment
  return { gate: false, href: "/assessment?sector=" + (sector || "Other") };
}
```

### Pattern: Revenue-Framed Results Output

[ASSUMED: Conceptual — planner will implement actual calculation]

```typescript
// src/lib/assessment.ts — extend with revenue model

export interface AutomationOpportunity {
  name: string;
  hoursPerWeek: number;
  internalHourlyRate: number;
  monthlyValue: number; // derived
}

export function getRevenueOpportunities(
  score: number, 
  sector: Sector
): AutomationOpportunity[] {
  // Map score + sector to top 3 automations and typical ROI
  const tier = quickScoreToTierLevel(score);
  const opportunities = SECTOR_OPPORTUNITIES[sector][tier]; // to be defined
  
  return opportunities.map(opp => ({
    ...opp,
    monthlyValue: (opp.hoursPerWeek * opp.internalHourlyRate * 4.33) // weeks in month
  }));
}

// Usage in ResultsScreen:
const opportunities = getRevenueOpportunities(score, sector);
const totalMonthly = opportunities.reduce((sum, o) => sum + o.monthlyValue, 0);
return (
  <div>
    <h2>Your Top Opportunities (Est. Monthly Value)</h2>
    {opportunities.map(opp => (
      <div key={opp.name}>
        <p>{opp.name} → ~${opp.monthlyValue}/mo</p>
      </div>
    ))}
    <p>Total: ~${totalMonthly}/mo</p>
  </div>
);
```

### Pattern: Unified Results Screen (Handles Both Assessment Types)

[VERIFIED: Current components can be unified with type parameter]

```typescript
// src/components/assessment/ResultsScreen.tsx — updated signature

interface ResultsScreenProps {
  assessmentType: "quick" | "deep"; // new param
  score: number;
  byDimension?: Record<string, number>; // only for deep
  tier: string;
  firstName: string;
  sector?: Sector;
}

export function ResultsScreen({ 
  assessmentType, 
  score, 
  byDimension, 
  tier, 
  firstName, 
  sector = DEFAULT_SECTOR 
}: ResultsScreenProps) {
  // Conditional rendering based on assessmentType
  return (
    <div>
      <h2>Your AI Opportunity Score</h2>
      <p>{score}/{assessmentType === "quick" ? 100 : 72}</p>
      
      {assessmentType === "deep" && byDimension && (
        <div>Dimension Breakdown: ...</div>
      )}
      
      {/* Revenue-framed next steps */}
      <CTA href="/checkout?tier=strategy">
        See Your Automation Roadmap (${initialPrice})
      </CTA>
    </div>
  );
}
```

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Assessment question routing & scoring | API / Backend | — | Calculation engine is backend logic; scoring remains server-side (no change from current) |
| Sector gating before assessment | Frontend (Browser) | API / Backend | Gate can be client-side (check URL param, show message), but enterprise route detection is logical (could be SSR) |
| Revenue framing + display | Frontend Server (SSR) | Frontend (Browser) | Results screen is currently client-side; revenue calculations can move to server for security (don't expose rate assumptions to client) |
| Enterprise track page | Frontend Server (SSR) | — | New page, static layout + existing components; no dynamic logic, SRR-ready |
| Calendly removal from primary path | Frontend (Browser) + Email Templates | — | Remove href attributes from components; update email templates (backend) |
| BOOKING_SLOTS automation (if needed) | API / Backend | Database | If automated, read from CMS or database instead of hardcoded constant |
| Engage form (10 fields) | Frontend (Browser) | API / Backend | Form submission logic remains in server action (current pattern); no tier change |

## Validation & Dependencies

### Test Coverage Expectations (if enabled)

- **Assessment routing:** Test that /assessment?sector=Law routes to assessment, not enterprise gate
- **Revenue calculation:** Unit test that score + sector → [automations with $X/mo values]
- **Sector gating:** Test that Law/Finance routes show enterprise option, SMB routes do not
- **Results screen:** Test that results display revenue framing and CTA links to /checkout (not /engage or Calendly)
- **Calendly removal:** Grep check that no Calendly URLs appear in primary assessment/results flow (allow only in /enterprise)
- **Engage form:** Verify 10-field form exists only at /engage for enterprise intake, not in assessment flow

### Environment Availability

No external dependencies required for this phase beyond:
- Existing Paddle checkout (`/checkout` route already works)
- Existing email templates (will need updates, but no new services)

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Revenue ranges for sectors ($100–$2,000/mo depending on vertical) are appropriate and won't create false expectations | Revenue Framing, Architecture Patterns | Underestimate → no urgency; Overestimate → credibility damage post-purchase |
| A2 | "Revenue-framed results" should map to specific automations (email triage, client intake, reporting) rather than abstract "hours saved" | Revenue Framing, Pitfall 1 | If vague ($X/month with no breakdown), users won't trust the number or understand what drives it |
| A3 | Small business assessment should NOT gate Law/Finance/RealEstate/Construction at entry; gate should be informational, allowing bypass | Common Pitfalls, Pitfall 4 | If gate is hard rejection, legitimate small businesses in regulated sectors get trapped in enterprise path |
| A4 | Enterprise track should consolidate `/engage`, `/services`, `/work`, and Calendly into one `/enterprise` page or subpath | ENT-01, ENT-02 | If scattered across multiple routes, not clear that they belong to enterprise; users still see them in primary nav |
| A5 | Calendly removal from primary path includes removing from email segmentation logic (`src/lib/prompts.ts`) not just UI components | Common Pitfalls, Pitfall 3 | If emails still reference Calendly, cold/warm users get booking CTA even though assessment doesn't show it |
| A6 | `/assessment/deep` 8-question full assessment should be preserved alongside `/assessment` 7-question quick version | Common Pitfalls, Pitfall 2 | Consolidation should be at results-screen level, not question-engine level; deleting one assessment type loses a validated asset |

**Validation needed before plan execution:** User confirms revenue ranges are ballpark accurate and acceptable for first-cut results display (can be refined post-launch with real user feedback).

## Open Questions

1. **Unified assessment route naming:** Should `/assessment/deep` redirect to `/assessment?depth=deep`, or stay as separate route with same results component? Affect on bookmarkability, analytics, user expectations.
   - What we know: Both routes exist and work; no requirement to change URLs, just to "resolve" them
   - Recommendation: Keep both URLs live (no breakage), but both point to same unified shell with depth param

2. **Enterprise track URL structure:** `/enterprise`, `/enterprise/track`, or nested under services (`/services/enterprise`)?
   - What we know: Requirement says "enterprise track page" singular; footer and nav should link it
   - Recommendation: `/enterprise` (simple, memorable, foot-linkable)

3. **Revenue calculation scope:** Should revenue estimates be hard-coded per sector × tier, or dynamic based on user inputs (company size, operational volume)?
   - What we know: Current engage form collects size/volume; could feed into revenue model
   - Recommendation: Start with sector × tier matrix (simple); add volume/size adjustments in Phase 11 if needed

4. **Calendly on enterprise track:** Should enterprise intake still offer Calendly as an option after `/engage` submission, or is Calendly only for existing relationships (post-purchase support)?
   - What we know: Current `/engage` redirects cold/warm to Calendly; hot scores go to success page
   - Recommendation: Enterprise track's `/engage` should also use same segmentation logic (cold → Calendly, hot → engagement form processing)

5. **Secondary nav slot for enterprise link:** What is the "secondary nav slot" mentioned in ENT-02? Top-right corner, menu, or footer second column?
   - What we know: Current nav has primary links (Services, Work, Discovery, Blog) and one CTA; footer has 3 columns
   - Recommendation: Add "Enterprise" link to footer second column OR as separate top-nav link after Blog; defer final placement to planner

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| "Hours saved" / "Productivity score" | "Revenue opportunity" / "$X/month" framing | This phase | Aligns language to buyer motivation (income growth, not time savings) |
| Calendly in primary flow | Calendly on enterprise track only | This phase | Removes booking friction from self-serve path; maintains for complex sales |
| `/assessment` and `/assessment/deep` as separate UX | Both routes use unified results component | This phase | Single mental model for assessment completion; preserves both assessment depths |
| "Other / Cross-Industry" as default | Small business vertical (creators/coaches) as default | Phase 9 (ICP pivot); this phase gates enterprise | Funnel now optimized for SMB primary path; regulated verticals gated |

## Sources

### Primary (HIGH confidence)
- **Codebase audit** — `/src` directory grep, file reads:
  - `src/lib/assessment.ts` — sector routing logic, DEFAULT_SECTOR, questions
  - `src/lib/sectorRecommendations.ts` — four regulated verticals + tiers 1-4, revenue heuristics
  - `src/components/assessment/ResultsScreen.tsx` — current results layout + CTA routing
  - `src/components/assessment/DeepResultsScreen.tsx` — deep assessment results variant
  - `src/app/assessment/page.tsx` + `src/app/assessment/deep/page.tsx` — route structure
  - `src/app/engage/page.tsx` — 10-field form, current flow
  - `src/app/services/page.tsx` — tier definitions, Calendly CTAs
  - `src/components/home/Footer.tsx` — footer nav structure
  - `src/components/Navigation.tsx` — primary nav structure
  - `src/config/booking.ts` — BOOKING_SLOTS constant
  - `src/lib/checkout.ts` — pricing tiers and Paddle integration
- **Requirements.md** — Phase 10 requirements (ASSESS-11 through ENT-02)
- **PROJECT.md + STATE.md** — ICP pivot context, project decisions

### Secondary (MEDIUM confidence)
- **REQUIREMENTS.md section references (§A1, §C4, §C5, §C6, etc.)** — audit findings tied to this phase
- **Existing case studies at `/work`** — four examples, not currently marked enterprise
- **Sector recommendation tiers** — Tier 1-4 progression mapped to business readiness (not validated against real revenue, but internally consistent)

### Tertiary (LOW confidence — marked [ASSUMED])
- Revenue ranges ($100–$2,000/mo per sector) — inferred from sector recommendations + typical SaaS automation ROI, not from real data or Asor's pricing model
- "Enterprise gate should be informational not gatekeeping" — inferred from phrase "sits behind", but not explicit in requirements

## Metadata

**Confidence breakdown:**
- **Sector routing logic:** HIGH — verified in codebase, requirements are clear
- **Calendly references:** HIGH — all 5 primary + supporting references found via grep
- **Assessment consolidation:** HIGH — two routes, one results component can serve both
- **Revenue framing:** MEDIUM — concept is clear (ASSESS-12), but actual $X/month calculations are [ASSUMED]
- **Enterprise track structure:** MEDIUM — requirements specify what goes on it (cases, verticals, engage, services, tiers), but layout/UX not specified; planner decides
- **Calendly removal scope:** MEDIUM-HIGH — 5 primary hardcoded found; email/prompt references need context-aware edits, not just deletions

**Research valid until:** 2026-08-22 (14 days — moderate-velocity phase, assessment engine is stable, main change is routing/output)

**Next step:** Planner consumes this research and creates PLAN.md with task breakdown for:
1. Assessment routing + gating logic (new)
2. Revenue framing component (new)
3. Results screen unification (refactor)
4. Calendly removal from primary path (surgery)
5. Enterprise track page creation (new)
6. /engage form repositioning as enterprise-only (move)
7. Footer + nav updates (small edits)
