# Sector-Targeted AI Readiness Assessment — Redesign Plan

**Status:** Proposal — awaiting approval before implementation
**Author:** Drafted with Claude, June 2026
**Scope:** `src/lib/assessment.ts`, `src/lib/deepAssessment.ts`, assessment components, results screens, sector-specific landing routes
**Target markets:** US / Canada / Europe
**Verticals:** Law · Finance · Real Estate & Property · Construction · Other / Cross-Industry (catch-all)

**Decisions locked (from review):**
1. The role question is **replaced** by the sector question. There is no separate role step — sector is the sole routing signal.
2. Sector-specific SEO landing routes (`/assessment/law` etc.) are **deferred** to a later round. The picker covers direct traffic now; landing routes can be added once paid campaigns or sector-specific SEO becomes a priority.
3. The catch-all track is labelled **"Other / Cross-Industry"** in the UI. The internal type code remains `General` for code clarity.
4. Both Quick and Deep are sector-flavored. Quick: 9 questions, one Compliance question gets sector copy. Deep: full Dimension F + three Dim-C overrides.
5. Lead routing: universal booking calendar. Sector is pre-tagged in the form payload that goes to Google Script and Resend metadata so sales has context, but everyone sees the same booking URL.
6. No deadline-driven CTA framing. Regulations are referenced factually in Compliance question text only.

---

## 1. Why redesign

The current Quick (8q) and Deep (20q) assessments are sector-agnostic. They route on role (Founder / CTO / Ops Manager / Other) and use generic language — "workflows", "compliance frameworks", "data accessibility". For a US/CA/EU firm in Law or Finance, that reads as a horizontal tool. It does not signal that we understand:

- Why an AmLaw 200 partner refuses to paste an unredacted brief into ChatGPT (ABA Model Rule 1.6, privilege, the 600+ sanctioned hallucination cases since *Mata v. Avianca*).
- Why an RIA's compliance officer cares more about FINRA/SEC marketing-rule capture of AI-generated client comms than about "audit logs".
- Why a CRE underwriter's bottleneck is lease abstraction and rent-roll extraction, not "process documentation".
- Why a GC's preconstruction lead is drowning in takeoff and bid management, not "data quality".

Selling AI readiness to these buyers requires the assessment itself to feel like it was written by someone who has done the work in that vertical. This plan adds sector-specific tracks while keeping the five-dimension foundation that already works.

---

## 2. Sector research — pain points, regulation, readiness signals

Each subsection below is the substrate for that sector's questions and recommendations. Sources are listed at the end of the document.

### 2.1 Law (US / CA / EU)

**Adoption posture.** Thomson Reuters' 2025 survey shows 26% of legal organizations actively integrating GenAI (up from 14% in 2024), but firms describe themselves as "hyper-cautious". 60% of firms are unsure when they will implement; 42% of slow adopters cite mistrust, 41% want to wait for reliability, 36% worry about privilege misuse. AllRize's 2025 Legal Technology Report found 38.8% of firms have *no* AI integration with existing applications and another 31.8% have only limited integration. The top operational pain points named were document management (54.1%), case management (44.7%), and billing (43.5%).

**Hallucinations are now a real liability.** The original *Mata v. Avianca* sanction was $5,000. By August 2025 a Los Angeles federal judge issued a $31,000 sanction — the largest single AI-hallucination penalty on record. Public trackers logged 600+ sanctioned cases of fabricated authority by late 2025, growing from ~2/week early in the year to 2–6/day by December. A real "AI-ready" law firm has a written verification protocol, not a hope.

**Regulatory pressure.**
- **ABA Model Rule 1.6 + Comment 18** requires lawyers to safeguard client information against unauthorized access and inadvertent disclosure. Non-human assistants (AI) fall inside this duty; lawyers must supervise an AI assistant as they would any other.
- **EU AI Act Annex III, point 8** classifies AI used in the administration of justice as high-risk. Full application to such systems lands **August 2026**. Generative AI tools themselves are not high-risk by default but must meet transparency and copyright requirements; AI-generated documents must be labelled.
- Many US state bars (CA, NY, FL, TX) have issued GenAI advisory opinions; firms increasingly need updated engagement letters disclosing AI use.

**High-value AI use cases firms are actually deploying.** Contract review/redlining, due diligence at portfolio scale (PE M&A), eDiscovery and document review, legal research with citation grounding, regulatory tracking across jurisdictions, deal management. Harvey reports 92% monthly adoption inside its customer base and "25+ hours saved per user per month" for in-house teams; A&O Shearman deployed Harvey firmwide across 7,000+ staff. The signal of readiness is: a firm that has scoped *which* matter type/practice group will pilot, not "AI everywhere".

**Business-model tension.** The billable hour rewards time spent, AI rewards time saved. Firms that haven't decided how AI productivity gets billed (fixed-fee on AI-assisted work, value-based, hybrid) will find adoption stalls at the partner level. This is a strategic-alignment question, not a tech question.

### 2.2 Finance (Banks · RIAs · Insurance · Fintech)

**Adoption posture.** 63% of RIAs were using AI tools in some capacity by late 2025 (Schwab Advisor Services). But the compliance gap is sharp: 40% of investment adviser firms have implemented AI tools, and 44% of those have *no formal testing or validation* of outputs. Banks have moved faster on internal pilots but slower on customer-facing deployment due to model risk discipline.

**Regulatory pressure.**
- **US — SR 11-7** (Fed/OCC model risk management) is still the controlling framework. A May 2025 GAO review confirmed regulators are applying SR 11-7 to AI systems. SR 11-7 requires (a) independent validation, (b) ongoing monitoring vs. actual outcomes, and (c) documentation comprehensible to unfamiliar parties — all three are hard for non-deterministic GenAI.
- **EU AI Act Annex III, Part 5(b) and 5(c)** classify creditworthiness/credit-scoring systems and risk-pricing for life and health insurance as **high-risk**. Banks and insurers using AI in these workflows must run conformity assessments, log decisions, ensure human oversight, and register the systems.
- **SEC** has proposed rules requiring broker-dealers and RIAs to identify and neutralize conflicts of interest arising from predictive analytics in investor interactions. The large-firm SEC AI compliance deadline (AUM ≥ $1.5B) passed Dec 3, 2025; smaller firms must comply by **June 3, 2026** — extremely fresh.
- **GLBA, NYDFS Part 500, FCA SS1/23 (UK), DORA (EU)** all sit underneath, plus jurisdictional model risk guidance.

**High-value AI use cases.** Personalized advice prep & meeting notes (RIAs); compliance comms surveillance; KYC/AML enhancement; fraud pattern detection; claims triage (insurance); credit memo drafting; portfolio rebalancing tax-loss harvesting; regulatory-update monitoring. The genuine readiness signal: a model risk management policy that *names* GenAI as in scope.

**Buyer pain points.**
- "We can't put client PII into a cloud LLM" → private deployments, redaction layers
- "Our compliance team can't validate a non-deterministic model" → MRM upgrade, eval framework
- "We have 12 systems and none talk" → integration & data layer before AI
- "Our advisors won't trust output they can't explain to a client" → XAI / source-grounded outputs

### 2.3 Real Estate & Property (Brokerage · Property Mgmt · CRE)

The vertical splits cleanly into three sub-segments — language must accommodate all three.

**Residential brokerage / agents.** Pain: lead routing, listing copy generation, CMA prep, contract redlines, MLS data quality. AI tools are widely available (CRM-embedded GPTs, listing writers), but fair-housing exposure is real.

**Property management.** Pain: the average property manager handles **23 maintenance requests per 100 units per month**, each requiring 4–8 manual touchpoints; tenant communications, lease renewals, rent collection follow-ups. AppFolio's leasing AI handles 90% of prospective inquiries automatically and saves leasing staff ~14 hours/week; Buildium's Lumina embeds AI in accounting/comms/leasing/maintenance. These are reference points — the readiness question is whether the firm has the tenant-comms volume and ticketing structure to make AI worthwhile.

**Commercial real estate (CRE) / REITs / institutional.** Pain: lease abstraction, rent-roll standardization, T-12/operating-statement extraction, due-diligence document review at portfolio scale. Goldman Sachs estimated AI tools could cut CRE due-diligence cost 20–35% for large portfolios; CBRE's 2025 Tech Adoption Report found AI-using teams complete preliminary underwriting analysis 3× faster. **32% of CRE firms report data is too fragmented to train AI models.** NAIOP: 88% of investors have piloted, only 5% have hit program objectives.

**Regulatory pressure.**
- **Fair Housing Act + HUD guidance (2024–2025)** on AI in tenant screening and housing advertising — disparate-impact liability for AI-driven decisions, including via "proxies" (income/zip → protected class).
- **CFPB** scrutiny of automated valuation models (AVMs) under-valuing homes in historically marginalized communities.
- **Colorado AI Act** (effective June 30, 2026) requires impact assessments, risk management policies, and consumer notices for tenant screening and lending — sets precedent other states will follow.
- **Massachusetts AG** has already settled a fair-lending action over an AI underwriting model (July 2025).
- **EU AI Act** Annex III for credit scoring still applies if the firm is a lender.

**Readiness signal.** A firm that (a) has documented which AI use cases touch protected classes (advertising, screening, valuation, lending) and (b) has a bias-testing or impact-assessment plan, not just enthusiasm for listing copy.

### 2.4 Construction (GCs · Subs · A/E)

**Adoption posture.** 76% of construction leaders are increasing AI investment (Autodesk 2025 Design & Make Report, +9 YoY). But RICS' 2025 AI in Construction Report: 45% of respondents have *no* AI implementation; 34% are in early pilots. ASCE/civil-engineering survey echoes the slow-adoption pattern. The gap between investment intent and deployed reality is the largest of any vertical we are targeting.

**Why slow.** The top adoption barriers reported industry-wide:
- Data privacy concerns (25.7%)
- Lack of integration with existing tools (22.8%)
- Lack of understanding (20.8%)
- Fragmented stack: ERP + Procore + BIM (Revit/Navisworks) + IoT + spreadsheets, with poor interconnection
- Project-by-project workforces (each job site is partly bespoke)
- Razor-thin margins (3–5% net) on the GC side — can't afford pilots that don't pay back

**McKinsey-class context.** McKinsey calls construction productivity improvement "no longer optional"; up to 30% of construction tasks could be automated by 2025. 56% of survey respondents believe AI will compensate for skilled-trades shortage.

**High-value AI use cases.**
- **Preconstruction & estimating.** Togal.AI cuts full-plan takeoff to ~12 minutes (90% manual reduction); Beam AI handles specs/legends/notes. STACK, Kreo, Bluebeam ecosystem.
- **Schedule optimization.** ALICE Technologies generates and explores millions of schedule scenarios for risk/sequence optimization.
- **Progress & documentation.** Buildots (camera-equipped hard hats → progress vs. plan); OpenSpace (360° walkthrough → automatic floor-plan mapping); Trunk Tools / DroneDeploy.
- **Safety.** Computer vision detecting PPE, exclusion zones, unsafe behaviors.
- **Doc intelligence.** RFI/submittal routing, BIM clash analysis, change-order classification.

**Readiness signal.** A firm that has (a) standardized at least one platform across its job sites (Procore is the common one) and (b) can name a specific workflow — usually takeoff, RFIs, or schedule risk — where it would pilot first. "AI for safety" without a unified jobsite documentation pipeline is not ready.

### 2.5 Other / Cross-Industry (catch-all)

Healthcare, NGO/nonprofit, manufacturing, professional services outside the four core verticals, SaaS, gov, retail. The current generic assessment lives here. We keep the existing 5-dimension framework and language, but make the routing explicit so this track doesn't see sector copy that doesn't apply. Display label in the picker: **"Other / Cross-Industry"**; internal code: `General`.

---

## 3. Assessment architecture: shared core + sector modules

```
┌─────────────────────────────────────────────────────────────────┐
│                  Sector selector (Q0 — routing)                 │
│  Law · Finance · Real Estate · Construction · Other/Cross-Ind.  │
└───────────┬─────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│              SHARED CORE — 5 dimensions, 60 pts                 │
│  A Process Intelligence       (15)                              │
│  B Data & Infrastructure      (15)                              │
│  C Compliance & Governance    (12)  ← sector-flavored copy      │
│  D Team & Change Readiness     (9)                              │
│  E Strategic Alignment         (9)                              │
└───────────┬─────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│      SECTOR MODULE — Dimension F, 12 pts (4 questions)          │
│   Sector-specific readiness questions per track.                │
│   For Other/Cross-Industry, F holds 4 horizontal questions      │
│   so total stays 72 across all paths.                           │
└───────────┬─────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│     Sector-aware results screen + email                         │
│     Score / 72 · Sector benchmarks · Tailored recommendations   │
│     Sector-specific next-step CTA                               │
└─────────────────────────────────────────────────────────────────┘
```

### Why this shape

- **The 5 existing dimensions are universal.** Process, data, compliance, team, strategy apply to a Magic Circle firm, a community bank, a 200-unit landlord, and a regional GC. We do not throw out work that already works.
- **Dimension C (Compliance) is where sector copy adds the most value.** Same question, sector-aware framing: a question about "Data Sovereignty" reads as "client privilege & matter file residency" for Law and as "PII residency under GLBA/NYDFS" for Finance.
- **Dimension F is a clean additive.** 4 questions per sector means we maintain the existing 20-question Deep flow at exactly 24 questions total — still well under the abandonment threshold, and 75% of the questions are shared so we don't duplicate engineering work.
- **The Quick (8q) assessment becomes 9 questions** (sector routing + 8 core, with one question re-framed by sector) — still ~4 minutes.

### Scoring scale

| Track | Quick | Deep |
|---|---|---|
| Existing | 0–100 (re-scaled from weights) | 0–60 |
| New | 0–100 (sector adds weight in one Q) | **0–72** (60 core + 12 sector) |

Deep-assessment tier thresholds rescale:

| Old (/60) | New (/72) | Tier |
|---|---|---|
| 0–19 | 0–23 | Not Ready |
| 20–34 | 24–41 | Pre-Deployment |
| 35–47 | 42–56 | Deployment Ready |
| 48–60 | 57–72 | High Readiness |

(These map linearly at ×1.2.)

---

## 4. Sector question banks

Format: each Dimension-F question scores 0–3 with explicit anchors, matching the existing `DeepQuestion` shape.

### 4.1 Law — Dimension F: Legal Practice Readiness

**F1 · Matter-Type Pilot Selection**
*Have you chosen a specific matter type or practice area (NDA review, M&A due diligence, eDiscovery, litigation drafting) to pilot AI on first?*
- 0 — No pilot scoped; "AI everywhere" is the current ambition
- 1 — Several candidate areas discussed; no commitment
- 2 — Pilot area chosen; pilot lead not yet named
- 3 — Specific matter type chosen with named pilot lead and success criteria

**F2 · Privilege & Confidentiality Architecture**
*Do you have a defensible answer for ABA Model Rule 1.6 / GDPR / professional secrecy when client matter content goes through an AI system?*
- 0 — Lawyers are pasting matter content into public ChatGPT/Gemini with no policy
- 1 — Written "no client info in AI" policy exists but isn't enforced or audited
- 2 — Enterprise license (Harvey / CoCounsel / Microsoft Copilot Enterprise) with DPA; partial enforcement
- 3 — Private-tenant or self-hosted AI for matter content, with audit logs and a written privilege impact assessment

**F3 · Citation Verification Protocol**
*Do you have a written, enforced process for verifying every AI-generated citation, statute reference, and quotation before it leaves the firm?*
- 0 — No protocol; relying on individual judgment
- 1 — Informal "double-check it" guidance; no documented procedure
- 2 — Written verification checklist; compliance varies by partner
- 3 — Mandatory verification step with sign-off and training; tied to malpractice/risk-management policy

**F4 · Billing-Model Adaptation**
*Have your partners agreed on how AI-accelerated work is billed (fixed fee on AI-assisted matters, blended rates, value pricing) and communicated this to clients?*
- 0 — No discussion; billing-hour model unchanged; AI gains are invisible to the P&L
- 1 — Internal debate ongoing; no decision
- 2 — Decision made for select matter types; client comms in progress
- 3 — Billing-model policy decided, in client engagement letters, with rate-card adjustments live

### 4.2 Finance — Dimension F: Financial Services Readiness

**F1 · Model Risk Management Coverage of GenAI**
*Does your MRM framework (or its equivalent — SR 11-7-aligned in US, FCA SS1/23 in UK) explicitly name generative AI and non-deterministic models as in-scope?*
- 0 — MRM exists but does not mention GenAI; or no MRM at all
- 1 — Informal acknowledgment GenAI is different; no policy update yet
- 2 — MRM update in draft; some GenAI use cases catalogued
- 3 — Updated MRM in force with GenAI inventory, validation cadence, and ongoing monitoring requirements

**F2 · High-Risk Workflow Inventory**
*Have you identified which AI use cases would trigger EU AI Act high-risk classification (credit scoring, insurance pricing) or SEC predictive-analytics conflict-of-interest rules?*
- 0 — Not assessed; not sure which use cases are in scope
- 1 — Aware some applications may be high-risk; not formally classified
- 2 — Classification in progress; some workflows tagged
- 3 — Complete inventory of high-risk AI use cases with conformity-assessment / impact-assessment plans

**F3 · Client-Facing Output Governance**
*Are AI-generated client communications (advisor emails, marketing collateral, generated investment commentary) captured for regulatory review under marketing/comms rules (FINRA 2210, SEC Marketing Rule, MiFID II)?*
- 0 — AI-generated client content is not captured or reviewed
- 1 — Manual review on a sample basis; no system capture
- 2 — Some channels captured (email yes, chat no); inconsistent
- 3 — All AI-generated client comms are captured, reviewed, and archived consistent with applicable comms rules

**F4 · Data Residency for Customer PII**
*Do you have an enforced answer for where customer PII can be processed by AI — and have you eliminated shadow use of public LLMs by advisors/analysts?*
- 0 — No policy; some staff use public ChatGPT with customer info
- 1 — Policy exists; enforcement informal; shadow use suspected
- 2 — Enterprise-licensed AI with DPAs; periodic audits
- 3 — Tenant-isolated or on-prem AI for PII workflows; shadow-AI scanning in place

### 4.3 Real Estate & Property — Dimension F: Property Sector Readiness

**F1 · Sub-Segment Use-Case Focus**
*Have you scoped the first AI use case to the segment you actually operate — brokerage lead/CMA workflow, property-mgmt maintenance & leasing triage, or CRE lease abstraction & rent-roll standardization?*
- 0 — "AI for real estate" is the current scope; no concrete workflow chosen
- 1 — Two or three candidate workflows discussed
- 2 — Workflow chosen; resourcing not yet committed
- 3 — Specific workflow, owner, and 60–90 day pilot timeline locked

**F2 · Fair-Housing / Bias Exposure Review**
*Have you reviewed which AI applications touch protected-class outcomes — tenant screening, housing advertising audience targeting, AVM valuation, mortgage underwriting?*
- 0 — Not assessed; no awareness of HUD / FHA / CFPB exposure
- 1 — Aware of exposure; no impact assessment yet
- 2 — Initial bias review done on one or two workflows
- 3 — Bias-testing or impact-assessment program in place (aligned with HUD 2024 guidance, Colorado AI Act, or equivalent state framework)

**F3 · Data Standardization Across Properties / Markets**
*Is your operational data — rent rolls, lease abstracts, listings, work orders — consistently structured across properties, markets, or franchisees?*
- 0 — Each property / market / franchisee uses its own formats; no central standard
- 1 — Standards exist on paper; widely ignored in practice
- 2 — Standards enforced in core systems; legacy gaps remain
- 3 — Consistent data model across the portfolio; aggregation/AI-ready

**F4 · Tenant or Client Communication Volume**
*Do you have the inbound communication volume (tenant tickets, prospect inquiries, broker emails) and ticketing structure that makes conversational AI worth deploying?*
- 0 — Volume is too low or too irregular to justify automation
- 1 — Volume is there but not captured in a structured ticketing system
- 2 — Volume + structure exist; routing is manual
- 3 — Volume, structured intake, and a defined triage taxonomy ready for AI

### 4.4 Construction — Dimension F: Construction Operations Readiness

**F1 · Unified Project Platform**
*Do you have a standardized project-management platform (Procore, Autodesk Construction Cloud, Plangrid, etc.) deployed across all active job sites — not optional per superintendent?*
- 0 — Each job site / superintendent uses their own tools; no central platform
- 1 — Platform chosen; rollout partial or contested
- 2 — Platform standard on new projects; legacy projects still mixed
- 3 — Single platform across all active jobs with data flowing centrally

**F2 · Document & Drawing Digitization**
*Are RFIs, submittals, change orders, daily reports, and current drawing sets in digital, searchable form — not PDFs in email or paper at the trailer?*
- 0 — Critical project documents live in paper, email, or unsearchable PDFs
- 1 — Some doc types digitized; coverage inconsistent across jobs
- 2 — Most documents digital and searchable; gaps in one or two categories
- 3 — All project documents digital, searchable, version-controlled across job sites

**F3 · Pilot Workflow Selection**
*Have you chosen the first AI pilot workflow — takeoff/estimating, schedule-risk forecasting, jobsite progress capture, RFI triage, safety monitoring — with a named owner and ROI hypothesis?*
- 0 — No pilot scoped; broad "AI for construction" interest only
- 1 — Two or three pilot candidates being weighed
- 2 — Pilot chosen; owner not yet named or ROI not quantified
- 3 — Specific workflow, named owner, ROI hypothesis, and 60–90 day measurement plan

**F4 · Field-Force Connectivity & Adoption**
*Do field crews and subs have the devices, connectivity, and willingness to use a digital tool on-site — or will any AI deployment stop at the office?*
- 0 — Field crews are paper-based; office tech doesn't reach the trailer
- 1 — Some devices in the field; usage inconsistent
- 2 — Field tools widely deployed; some sub-contractor friction
- 3 — Office and field operate on the same tools; subs are onboarded; jobsite Wi-Fi/cellular accounted for

### 4.5 Other / Cross-Industry — Dimension F: Horizontal Readiness

For the catch-all track, Dimension F repeats four vertical-neutral readiness questions that round out the existing 5 dimensions without introducing sector framing. Suggested:

**F1 · First Pilot Scope** — *Have you scoped the single highest-value pilot workflow with named owner?*
**F2 · ROI Hypothesis** — *Is there a quantified before/after metric (hours saved, error rate, cycle time) for the pilot?*
**F3 · Build vs Buy Posture** — *Have you decided whether the pilot is off-the-shelf, vendor-built, or custom?*
**F4 · Post-Pilot Path** — *Is there a written rule for what triggers expanding the pilot vs. killing it?*

(Same 0–3 anchor structure as above.)

### 4.6 Sector overrides for shared questions (Dimension C)

To deepen the sector signal without adding question count, three Dimension C questions get sector-specific text. The score scale stays 0–3; only the prompt text changes.

| Dim-C Question | Law copy override | Finance copy override | Real Estate copy override | Construction copy override |
|---|---|---|---|---|
| **C11 Regulatory Awareness** | "Has your firm identified the ABA Model Rules, state-bar AI opinions, and EU AI Act provisions that apply to your matters?" | "Has your team mapped SR 11-7, EU AI Act Annex III, SEC predictive-analytics rules, and applicable state insurance regs to your AI use cases?" | "Have you reviewed Fair Housing Act / HUD AI guidance, CFPB AVM scrutiny, Colorado AI Act, and applicable state tenant-screening laws?" | "Have you reviewed OSHA implications of AI safety monitoring, state contractor licensing for AI-generated specs, and EU AI Act conformity for autonomous equipment?" |
| **C12 Data Sovereignty** | "Where can privileged matter content be processed? Are you enforcing matter-file residency for AI workloads?" | "Where can customer PII be processed under GLBA / NYDFS / GDPR? Are you enforcing it across AI workloads?" | "Where can tenant PII, lease abstracts, and rent-roll data be stored and processed? Is residency enforced across your portfolio?" | "Where can project documents, drawings, and submittal data be processed? Is owner-confidential information protected from public model training?" |
| **C14 Vendor Risk Review** | "Have you reviewed data-handling for Harvey, CoCounsel, Lexis+ AI, Spellbook, and any embedded AI in your DMS?" | "Have you reviewed AI data-handling for your CRM, custodian, planning, and comms-surveillance tools? Is shadow AI usage tracked?" | "Have you reviewed AI features embedded in AppFolio, Buildium, Realm-X, your MLS, your CMA tool, and your CRM?" | "Have you reviewed AI in Procore, ACC, Bluebeam, OpenSpace, Buildots, your takeoff tool, and your scheduling platform?" |

These overrides reuse the existing `roleSpecific` pattern (renamed `sectorSpecific`) so the engineering change is small.

---

## 5. Sector-aware results & recommendations engine

The same tier name is shown for the same total score, but the **recommendation text and CTAs differ by sector**. This is where the assessment proves we understand the buyer.

### Example outputs by tier × sector

**Tier: Pre-Deployment (24–41/72)**

- **Law:** *"You have process structure but the privilege architecture isn't there yet. The fastest unlock is a private-tenant AI for one matter type (NDA review or contract redlining) with a written verification protocol. Most firms at this tier benefit from a 4-week pilot-readiness sprint covering: privilege impact assessment, one Harvey/CoCounsel/equivalent license, citation-verification workflow, and a billing-model decision for AI-assisted matters."*
- **Finance:** *"Your foundation is partial. The blocker is almost always MRM coverage of GenAI and a defensible answer for client PII residency. A 4–6 week readiness sprint should produce: GenAI inventory mapped to SR 11-7 / Annex III, updated MRM policy, comms-surveillance capture for AI-generated client content, and a tenant-isolated environment for a first pilot."*
- **Real Estate:** *"Your operation is automatable, but fair-housing exposure and data fragmentation will block scale-up. A 4-week sprint covering bias-impact review on screening/advertising, lease/listing data standardization, and a single scoped pilot (tenant comms or lease abstraction) is the right next move."*
- **Construction:** *"You're past 'no AI' but not yet ready for production. The unblocker is unifying the platform across job sites and digitizing one priority document workflow (RFIs or submittals). A 6-week pilot-readiness sprint with takeoff or schedule-risk as the first workflow is the typical engagement."*
- **Other / Cross-Industry:** existing copy unchanged.

(Each sector × tier combination gets a paragraph of this shape. Full matrix lives in `src/lib/sectorRecommendations.ts` after implementation.)

### Sector-specific preview bullets

`getPreviewBullets()` already exists for Quick assessment. Extend it to take a sector and return 3 tailored next-step bullets. Example for Construction × Pre-Deployment:

- "Standardize on Procore (or ACC) across all active job sites — kill the per-superintendent fragmentation"
- "Digitize RFI and submittal flow before any AI pilot — the data has to exist first"
- "Pilot Togal.AI or Beam on one estimating workflow with a measured baseline (current hours, error rate)"

---

## 6. Implementation — file-by-file

Numbered phases. Each phase is small enough to ship independently and each ends in a working app.

### Phase 1 — Types & sector routing (no UX rewrite)

**Files:**
- `src/lib/assessment.ts`
  - Add `export type Sector = "Law" | "Finance" | "RealEstate" | "Construction" | "General";` (display label for `General` is **"Other / Cross-Industry"**, mapped in a `SECTOR_LABELS` const).
  - **Remove the `Role` type and the `roleSpecific` field on Question.** Sector replaces role as the sole routing signal — there is no role follow-up.
  - Replace Q1 (role) with Q1 (sector). Q1 options: Law, Finance, Real Estate & Property, Construction, Other / Cross-Industry.
  - Introduce `sectorSpecific?: Partial<Record<Sector, string[]>>` on Question for the role-style override pattern.
  - Update `getQuestionOptions` to read `sectorSpecific` (drop the `roleSpecific` branch — pre-existing role-specific option lists are migrated into the General sector or removed).
  - Update `calculateScore`, `getTierName`, `getTierDescription`, `getPreviewBullets` to take a `sector` argument.
- `src/lib/deepAssessment.ts`
  - Add `Dimension = "A" | "B" | "C" | "D" | "E" | "F"`
  - Add `DIMENSIONS.F = { name: "Sector Readiness", max: 12, description: "Sector-specific readiness — the deployment realities of your industry." }`
  - Add `sector` field to `DeepQuestion`; existing questions become `sector: "all"`.
  - Add `sectorSpecific?: Record<Sector, { text: string; subtext: string; options: [string,string,string,string] }>` for the three Dim-C overrides (C11/C12/C14 → existing IDs 11/12/14).
  - Append 4 Dimension-F questions per sector to `deepQuestions` (20 → tagged by sector; only questions matching the user's sector + universal core get presented).
  - Rewrite `calculateDeepScore` to take `sector`, accumulate across A–F, return `byDimension: Record<Dimension, number>` (now 6 entries).
  - Rewrite `getDeepTier` for the new 0–72 scale with the rescaled thresholds in §3.
  - Extend `getDimensionInterpretation` to handle dimension F per sector.

**Test:** Existing Quick + Deep flows still run end-to-end when sector = "General". Snapshot the math.

### Phase 2 — UI shells & sector selector

**Files:**
- `src/components/assessment/SectorPicker.tsx` (new) — first step of both shells; persists to localStorage.
- `src/components/assessment/AssessmentShell.tsx` — insert sector step before "questions" step; read sector from state into `getQuestionOptions(qid, sector)`.
- `src/components/assessment/DeepAssessmentShell.tsx` — same insertion; filter `deepQuestions` to those where `sector === "all"` or `sector === selectedSector`; render the appropriate Dim-C sector copy.
- `src/components/assessment/QuestionCard.tsx` — no change needed unless we surface sector-aware subtext.

**Test:** Switching sector at the picker yields different copy on C11/C12/C14 and different Dim-F questions; counts: Quick = 9 (sector + 8), Deep = 24 (sector + 20 core questions but Dim F replaces 4 of them? — *clarify*: Deep is 20 existing + 4 sector = 24 total. We are extending, not replacing).

### Phase 3 — Results, email, CTA

**Files:**
- `src/lib/sectorRecommendations.ts` (new) — Pure data file: `Record<Sector, Record<Tier, { headline; paragraph; bullets[]; ctaLabel; ctaHref }>>`. Drives the results screen and the email body.
- `src/components/assessment/ResultsScreen.tsx` / `DeepResultsScreen.tsx` — read sector from props, look up `sectorRecommendations`, render. Replace sector-neutral copy.
- `src/app/assessment/actions.ts` and `src/app/assessment/deep/actions.ts` — accept sector in payload; pass to `calculateScore`/`calculateDeepScore`; include `sector` in the Google Script POST payload; render sector-aware HTML email.
- `src/lib/email.ts` — `sendAssessmentEmailSequence` signature gains `sector`; templates conditional on sector.

**Test:** End-to-end: pick each sector, complete assessment, receive Resend email whose subject/body references the sector's pain points and CTA. Google Sheet row includes `sector` column.

### Phase 4 — Content & social proof

- Update `src/components/home/PainSection.tsx`, `ServicesPreview.tsx`, `SocialProof.tsx` with sector cuts.
- Add at least one case study or POV piece per sector under `content/blog/` referencing the redesign. The Asor Ahura content engine skill (`asorahura-content-engine`) is the right tool for these.

### Deferred — Sector SEO landing routes (`/assessment/law`, etc.)

Not in this round. Worth adding once paid campaigns or sector-targeted SEO becomes a priority: sector-specific `<h1>`, meta tags, and hero copy that mirrors §2 research; the route pre-selects the sector and skips the picker. Deep-linkable from LinkedIn ads, sales DMs, and sector-specific blog posts. Picker covers direct/general traffic today.

---

## 7. Risks & open decisions

**Decided (locked in):**

1. Role question is dropped entirely. Sector replaces it; there is no role follow-up step. The existing `roleSpecific` field on Question is removed in Phase 1.
2. Catch-all track is labelled **"Other / Cross-Industry"** in the picker; internal code stays `General`.
3. Sector SEO landing routes are deferred (see end of §6). Picker covers direct traffic.
4. **Sector-flavor both Quick and Deep.** Quick stays at 9 questions; only the Compliance-equivalent question gets sector copy. Deep gets the full Dimension F + Dim-C overrides.
5. **Lead routing:** one universal calendar. Sector is pre-tagged in the form payload (Google Script POST and Resend metadata) so it flows into the CRM/sheet for sales context, but the booking URL is the same for everyone.
6. **No deadline-driven CTA framing.** EU AI Act and SEC AI dates are referenced factually in Compliance question text where relevant, but not used as urgency-driven CTA copy.

---

## 8. Verification checklist (before merge)

- [ ] Sector = "General" runs the existing flow with identical scoring outputs as today (regression check).
- [ ] Each sector's Quick flow ≤ 9 questions; Deep flow = 24 questions.
- [ ] Dim-C overrides display correct sector copy for each sector.
- [ ] Dim-F questions filtered correctly per sector (no cross-leak).
- [ ] Deep total score caps at 72 and tier mapping uses rescaled thresholds.
- [ ] Resend email body shows sector-specific recommendation text.
- [ ] Google Script POST includes `sector` field; sheet has new column.
- [ ] `localStorage` persists sector across page refresh during in-progress flow.
- [ ] Existing in-progress assessments saved to localStorage migrate gracefully (fallback `sector = "General"` if no sector key is present).
- [ ] No surviving references to `Role` / `roleSpecific` in `src/lib`, components, or actions.
- [ ] Every claim in §2 maps to a source in §10; pull any unverifiable stat before launch.

---

## 9. Estimated effort

| Phase | Scope | Effort |
|---|---|---|
| 1 | Types, sector routing, score math (role removed) | ~1 day |
| 2 | Sector picker UI, shell wiring | ~1 day |
| 3 | Results, recommendations engine, email, logging | ~1.5 days |
| 4 | Home-page sector cuts + sector blog stub | ~1 day (+ content time) |
| **Total** | | **~4.5 dev-days** |
| _Deferred_ | _Sector SEO landing routes_ | _~0.5 day when needed_ |

---

## 10. Sources

**Law**
- [2025 Guide to Using AI in Law — MyCase](https://www.mycase.com/blog/ai/ai-in-law/)
- [AllRize 2025 Legal Technology and AI Adoption Report — LawSites](https://www.lawnext.com/2025/10/allrize-releases-findings-from-2025-legal-technology-and-ai-adoption-report.html)
- [AI Hallucinations in Law Firms — Voibe](https://www.getvoibe.com/resources/ai-hallucinations-law-firms/)
- [From Enhancement to Dependency — Jones Walker LLP](https://www.joneswalker.com/en/insights/blogs/ai-law-blog/from-enhancement-to-dependency-what-the-epidemic-of-ai-failures-in-law-means-for.html?id=102l04x)
- [ABA ethics rules related to Generative AI — Thomson Reuters](https://legal.thomsonreuters.com/blog/generative-ai-and-aba-ethics-rules/)
- [EU AI Act: Key compliance obligations for lawyers — Lexiel](https://lexiel.ai/en/blog/eu-ai-act-key-compliance-obligations-for-lawyers-and-law-firms-2026)
- [High-level summary of the AI Act — artificialintelligenceact.eu](https://artificialintelligenceact.eu/high-level-summary/)
- [Top Harvey Use Cases for Law Firms](https://www.harvey.ai/blog/top-harvey-use-cases)
- [Will AI Require a Change in Attorney Billing? — Georgetown Journal of Legal Ethics](https://www.law.georgetown.edu/legal-ethics-journal/blog/will-the-integration-of-artificial-intelligence-into-the-legal-profession-ethically-require-a-change-in-attorney-billing/)

**Finance**
- [Operationalise EU AI Act in Financial Services — Modulos](https://www.modulos.ai/industries/financial-services/)
- [A Guide to AI Risk Management in Financial Services — InnReg](https://www.innreg.com/blog/ai-risk-management-in-financial-services)
- [Model Risk Management for Generative AI — Anaptyss](https://www.anaptyss.com/blog/model-risk-management-for-generative-ai-in-banks-and-financial-institutions/)
- [AI Compliance for Firms and RIAs in 2026 — Ncontracts](https://www.ncontracts.com/nsight-blog/investment-advisers-artificial-intelligence)
- [AI in RIA Operations — WealthTech Today](https://wealthtechtoday.com/2025/06/30/the-silent-revolution-how-ai-in-ria-operations-is-eating-your-tech-stack/)
- [How AI Automation Is Reshaping RIA Competitive Landscape — Surmount](https://surmountwealth.com/blog/ai-automation-ria-competitive-advantage-2025)
- [EU AI Act for Financial Services — Alice Labs](https://alicelabs.ai/en/insights/eu-ai-act-for-financial-services)
- [AI in Lending: AI Credit Regulations 2025 — HES Fintech](https://hesfintech.com/blog/all-legislative-trends-regulating-ai-in-lending/)

**Real Estate & Property**
- [From Risky Business to AI Brilliance — NAR Tech & Innovation](https://tech.realtor/2025/07/01/from-risky-business-to-ai-brilliance-how-to-make-ai-your-real-estate-ally/)
- [HUD Issues Fair Housing Act Guidance on AI Use](https://www.housingfinance.com/management-operations/hud-issues-fair-housing-act-guidance-on-ai-use_s)
- [Understanding the New HUD Guidance on AI in Tenant Screening — NavigateHousing](https://www.navigatehousing.com/understanding-the-new-hud-guidance-on-ai-in-tenant-screening-and-advertising/)
- [Massachusetts AG Settles Fair Lending Action — CFS Review](https://www.cfsreview.com/2025/07/massachusetts-ag-settles-fair-lending-action-based-upon-ai-underwriting-model/)
- [Cracking the Code: AI and Fair Housing Marketing — Fair Housing Institute](https://fairhousinginstitute.com/ai-and-fair-housing-marketing/)
- [AI Regulation 2026: CRE Investor Compliance Guide — AI Consulting Network](https://www.theaiconsultingnetwork.com/blog/ai-regulation-2026-cre-investors-compliance-guide)
- [7 Practical Use Cases for AI in Property Management — Buildium](https://www.buildium.com/blog/ai-in-property-management-use-cases/)
- [Top 7 AI in Property Management Trends 2025 — Showdigs](https://www.showdigs.com/property-managers/ai-in-property-management)
- [AI in Commercial Real Estate Finance — Fractional Analyst](https://thefractionalanalyst.com/tfa-blog/ai-in-commercial-real-estate-finance)
- [Streamlining CRE Lease Abstraction with AI — Smart Capital Center](https://smartcapitalcenter.com/blog-post/streamlining-cre-lease-abstraction-with-ai)
- [Commercial Real Estate AI Guide 2025 — GrowthFactor](https://www.growthfactor.ai/blog-posts/commercial-real-estate-ai-guide)

**Construction**
- [The Rise of AI in Construction — Autodesk](https://www.autodesk.com/blogs/construction/ai-construction/)
- [Top 2025 AI Construction Trends — Autodesk Digital Builder](https://www.autodesk.com/blogs/construction/top-2025-ai-construction-trends-according-to-the-experts/)
- [RICS Artificial Intelligence in Construction Report 2025](https://www.rics.org/news-insights/artificial-intelligence-in-construction-report)
- [AEC sector slow to adopt AI, survey shows — ASCE](https://www.asce.org/publications-and-news/civil-engineering-source/article/2025/12/18/architecture-engineering-construction-sector-slow-to-adapt-ai-survey-shows)
- [AI Adoption in Construction: Where Builders Stand 2025 — Rowan](https://blog.rowan.build/ai-adoption-construction-industry-2025)
- [Data Reveals the Biggest Motivators and Challenges to AI Adoption — BuiltWorlds](https://builtworlds.com/news/data-reveals-biggest-motivators-challenges-ai-adoption-construction/)
- [How AI Can Relieve Construction's Pain Points — ALICE Technologies](https://blog.alicetechnologies.com/news/how-ai-can-relieve-construction-pain-points)
- [Togal.AI vs Beam AI — Comparison](https://www.ibeam.ai/blog/togal-vs-beamai-comparison)
- [Best AI Construction Tools 2026 — DownToBid](https://downtobid.com/blog/best-ai-construction-tools)
- [The Barriers to AI and ML Adoption in AEC — Guido Maciocci](https://medium.com/@guidomaciocci/the-barriers-to-ai-and-ml-adoption-in-the-aec-industry-c15d89891d8f)
- [State of AI in Construction Project Management — Mastt](https://www.mastt.com/research/ai-in-construction)
