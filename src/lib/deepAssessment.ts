import { DEFAULT_SECTOR, type Sector } from "./assessment";
import { SECTOR_RECOMMENDATIONS, deepScoreToTierLevel } from "./sectorRecommendations";

export type Dimension = "A" | "B" | "C" | "D" | "E" | "F";

export interface DimensionInfo {
  name: string;
  max: number;
  description: string;
}

export const DIMENSIONS: Record<Dimension, DimensionInfo> = {
  A: { name: "Process Intelligence", max: 15, description: "Are your workflows documented, measurable, and automation-viable?" },
  B: { name: "Data & Infrastructure", max: 15, description: "Is your data accessible, clean, and your infrastructure deployment-ready?" },
  C: { name: "Compliance & Governance", max: 12, description: "Can you deploy in a regulated environment without legal or compliance blockers?" },
  D: { name: "Team & Change Readiness", max: 9, description: "Does your organisation have the ownership and capacity to absorb a new system?" },
  E: { name: "Strategic Alignment", max: 9, description: "Is there a real problem with a measurable outcome that justifies the investment?" },
  F: { name: "Sector Readiness", max: 12, description: "Sector-specific readiness, the deployment realities of your industry." },
};

export const DEEP_MAX_SCORE = 72;

export interface DeepQuestionOverride {
  text?: string;
  subtext?: string;
  options?: [string, string, string, string];
}

export interface DeepQuestion {
  id: number;
  dimension: Dimension;
  /** "all" = applies to every sector. Otherwise, only served when that sector is selected. */
  sector: Sector | "all";
  text: string;
  subtext: string;
  options: [string, string, string, string]; // index = score 0–3
  sectorSpecific?: Partial<Record<Sector, DeepQuestionOverride>>;
}

export const deepQuestions: DeepQuestion[] = [
  // ─── Section A: Process Intelligence ───────────────────────────────────────
  {
    id: 1,
    dimension: "A",
    sector: "all",
    text: "Process Documentation",
    subtext: "Are your highest-friction workflows written down with clear steps, owners, and outputs?",
    options: [
      "Nothing is documented, it lives entirely in people's heads",
      "A few processes are loosely written down but incomplete",
      "Most key workflows are documented, though not consistently maintained",
      "All high-friction workflows are documented, owned, and regularly reviewed",
    ],
  },
  {
    id: 2,
    dimension: "A",
    sector: "all",
    text: "Volume & Repetition",
    subtext: "Do you handle high volumes of similar tasks daily or weekly (form processing, data entry, report generation)?",
    options: [
      "Tasks are mostly unique, no meaningful repetition",
      "Some repetitive tasks exist but volume is low or inconsistent",
      "Regular high-volume repetitive tasks, though not formally tracked",
      "High-volume, well-defined repetitive tasks run on a predictable daily or weekly cycle",
    ],
  },
  {
    id: 3,
    dimension: "A",
    sector: "all",
    text: "Output Measurability",
    subtext: "Can you define a 'correct' output for the tasks you want to automate? Are success criteria explicit?",
    options: [
      "Success is judged subjectively, no explicit criteria exist",
      "Some outputs are defined but applied inconsistently",
      "Most tasks have defined outputs with occasional exceptions",
      "Every target task has explicit, measurable success criteria agreed by stakeholders",
    ],
  },
  {
    id: 4,
    dimension: "A",
    sector: "all",
    text: "Error & Rework Rate",
    subtext: "Do you track failure rates, rework, or manual corrections in your current processes?",
    options: [
      "Errors are dealt with as they come, nothing is tracked",
      "We are aware of common errors but don't formally measure them",
      "We track some error metrics but not consistently across all processes",
      "Error and rework rates are tracked, reviewed, and actively used to drive improvement",
    ],
  },
  {
    id: 5,
    dimension: "A",
    sector: "all",
    text: "Process Ownership",
    subtext: "Is there a named person, not just a team, responsible for the processes you want to automate?",
    options: [
      "Ownership is shared or unclear, no single person is accountable",
      "Ownership is implied but not formally assigned",
      "Owners are named for most processes but accountability is loose",
      "Every target process has a named owner with clear accountability and authority",
    ],
  },

  // ─── Section B: Data & Infrastructure ─────────────────────────────────────
  {
    id: 6,
    dimension: "B",
    sector: "all",
    text: "Data Accessibility",
    subtext: "Can relevant operational data be programmatically accessed via API or database, or is it locked in PDFs, emails, or spreadsheets?",
    options: [
      "Data is locked in PDFs, email threads, or spreadsheets with no programmatic access",
      "Some data is accessible but most requires manual extraction or export",
      "Most data is accessible programmatically, with a few gaps remaining",
      "All relevant data is accessible via API, database query, or structured export",
    ],
  },
  {
    id: 7,
    dimension: "B",
    sector: "all",
    text: "Data Quality & Consistency",
    subtext: "Is your data consistently formatted, labelled, and free of significant corruption or duplication across sources?",
    options: [
      "Data is inconsistent, frequently duplicated, or contains significant errors",
      "Quality varies, some sources are clean, others require heavy cleaning",
      "Most data is clean and consistently formatted, with minor issues",
      "Data is consistently formatted, labelled, and validated across all sources",
    ],
  },
  {
    id: 8,
    dimension: "B",
    sector: "all",
    text: "Historical Data Volume",
    subtext: "Do you have at least 6–12 months of historical operational data relevant to the target workflow?",
    options: [
      "Less than 3 months of relevant historical data exists",
      "3–6 months of historical data, with gaps or inconsistencies",
      "6–12 months of mostly complete historical data",
      "12+ months of clean, consistent historical data across all target workflows",
    ],
  },
  {
    id: 9,
    dimension: "B",
    sector: "all",
    text: "Infrastructure Maturity",
    subtext: "Do you have cloud, on-premises, or hybrid infrastructure capable of hosting containerised AI workloads?",
    options: [
      "No server infrastructure, running entirely on local machines or third-party SaaS",
      "Basic cloud or hosting exists but is not configured for AI workloads",
      "Cloud infrastructure is in place and can be adapted with some configuration",
      "Production-ready cloud or hybrid infrastructure capable of containerised AI deployment",
    ],
  },
  {
    id: 10,
    dimension: "B",
    sector: "all",
    text: "Connectivity & Deployment Constraints",
    subtext: "Does your deployment context require offline-capable or low-bandwidth AI? Has this been accounted for in your infrastructure planning?",
    options: [
      "We haven't considered connectivity constraints, assumed always-online",
      "Aware of constraints but haven't planned for them yet",
      "Connectivity requirements are identified and partially addressed in planning",
      "Offline or low-bandwidth requirements are explicitly designed for in our infrastructure",
    ],
  },

  // ─── Section C: Compliance & Governance ───────────────────────────────────
  {
    id: 11,
    dimension: "C",
    sector: "all",
    text: "Regulatory Awareness",
    subtext: "Does your team know which compliance frameworks apply, GDPR, HIPAA, NDPR, SOC2, ISO 27001? Has legal reviewed AI tool usage policies?",
    options: [
      "We haven't identified which regulations apply to our AI use",
      "We have a general sense of applicable regulations but no formal legal review",
      "Key regulations are identified and partially reviewed by legal",
      "All applicable frameworks are identified, documented, and legally reviewed with a written policy",
    ],
    sectorSpecific: {
      Law: {
        subtext:
          "Has your firm identified the ABA Model Rules, state-bar AI advisory opinions, and EU AI Act provisions that apply to your matters and client communications?",
      },
      Finance: {
        subtext:
          "Has your team mapped SR 11-7 (model risk management), EU AI Act Annex III, SEC predictive-analytics rules, and applicable state insurance regs to your AI use cases?",
      },
      "Real Estate & Property": {
        subtext:
          "Have you reviewed Fair Housing Act / HUD AI guidance, CFPB AVM scrutiny, Colorado AI Act, and applicable state tenant-screening laws against your AI use?",
      },
      Construction: {
        subtext:
          "Have you reviewed OSHA implications of AI safety monitoring, state contractor licensing rules around AI-generated specs, and EU AI Act conformity for autonomous equipment?",
      },
    },
  },
  {
    id: 12,
    dimension: "C",
    sector: "all",
    text: "Data Sovereignty",
    subtext: "Do you have explicit requirements on where client or patient data can be stored or processed? Are you actively enforcing them?",
    options: [
      "No data residency requirements have been defined",
      "Requirements exist informally but are not consistently enforced",
      "Requirements are defined and mostly enforced, with some gaps",
      "Data sovereignty requirements are explicit, documented, and actively enforced across all systems",
    ],
    sectorSpecific: {
      Law: {
        subtext:
          "Where can privileged matter content be processed? Are you enforcing matter-file residency for AI workloads, and does the policy hold up to a Rule 1.6 / professional-secrecy challenge?",
      },
      Finance: {
        subtext:
          "Where can customer PII be processed under GLBA / NYDFS / GDPR? Are you enforcing residency across every AI workload, including shadow use of public LLMs?",
      },
      "Real Estate & Property": {
        subtext:
          "Where can tenant PII, lease abstracts, and rent-roll data be stored and processed? Is residency enforced across your portfolio or franchisee network?",
      },
      Construction: {
        subtext:
          "Where can project documents, drawings, and submittal data be processed? Is owner-confidential information protected from public model training and vendor reuse?",
      },
    },
  },
  {
    id: 13,
    dimension: "C",
    sector: "all",
    text: "Audit & Explainability",
    subtext: "Can your current systems produce audit logs? Do you have a plan for explaining AI decisions to regulators or clients?",
    options: [
      "No audit logging and no plan for AI explainability",
      "Basic system logging exists, but no explainability plan for AI decisions",
      "Audit logs are in place and explainability is being planned",
      "Full audit trail capability with a documented explainability framework for AI-driven decisions",
    ],
  },
  {
    id: 14,
    dimension: "C",
    sector: "all",
    text: "Vendor Risk Review",
    subtext: "Have you reviewed the data-handling practices of AI tools your team uses (ChatGPT, Gemini, Copilot)? Is shadow AI usage tracked?",
    options: [
      "AI tools are used without any vendor review or usage policy",
      "Some informal review has happened but no structured review exists",
      "Key AI vendors have been assessed and shadow AI is partially tracked",
      "All AI vendor data practices are formally assessed and shadow AI usage is actively monitored",
    ],
    sectorSpecific: {
      Law: {
        subtext:
          "Have you reviewed data-handling for Harvey, CoCounsel, Lexis+ AI, Spellbook, and any embedded AI in your DMS or eDiscovery platform?",
      },
      Finance: {
        subtext:
          "Have you reviewed AI data-handling for your CRM, custodian, planning, and comms-surveillance tools? Is shadow AI usage by advisors and analysts tracked?",
      },
      "Real Estate & Property": {
        subtext:
          "Have you reviewed AI features embedded in AppFolio, Buildium, Realm-X, your MLS, your CMA tool, and your CRM, including how each handles tenant and prospect PII?",
      },
      Construction: {
        subtext:
          "Have you reviewed AI in Procore, Autodesk Construction Cloud, Bluebeam, OpenSpace, Buildots, your takeoff tool, and your scheduling platform?",
      },
    },
  },

  // ─── Section D: Team & Change Readiness ───────────────────────────────────
  {
    id: 15,
    dimension: "D",
    sector: "all",
    text: "Executive Sponsorship",
    subtext: "Is there a C-level or VP-level owner actively championing this AI initiative with budget and political capital?",
    options: [
      "No executive sponsor, this initiative has no leadership backing",
      "Senior interest exists but no formal sponsor with budget authority has been named",
      "An executive is engaged but commitment and budget are not fully formalised",
      "Named C-level or VP sponsor with allocated budget and active, ongoing advocacy",
    ],
  },
  {
    id: 16,
    dimension: "D",
    sector: "all",
    text: "Technical Ownership",
    subtext: "Is there a named technical lead who will own, maintain, and evolve the system after deployment?",
    options: [
      "No technical owner identified, it would fall to whoever is available",
      "Someone is informally expected to own it but not formally assigned",
      "A technical lead is named but their post-deployment role and scope are undefined",
      "Named technical owner with a clear mandate covering post-deployment maintenance and evolution",
    ],
  },
  {
    id: 17,
    dimension: "D",
    sector: "all",
    text: "Staff Adoption Readiness",
    subtext: "Have the staff who will use this system been consulted? Is a training and change management plan in place?",
    options: [
      "Staff haven't been consulted and there is no change management plan",
      "Informal conversations have happened but no plan exists",
      "Staff have been consulted and a basic training plan is being developed",
      "Staff are engaged and a structured change management and training plan is finalised",
    ],
  },

  // ─── Section E: Strategic Alignment ───────────────────────────────────────
  {
    id: 18,
    dimension: "E",
    sector: "all",
    text: "Problem Clarity",
    subtext: "Can you state the specific operational problem you're solving in one sentence? Does it have a measurable current cost in time, money, or errors?",
    options: [
      "The problem is vague, we know something is inefficient but can't quantify it",
      "The problem is understood but not precisely defined or costed",
      "The problem is clearly stated with an estimated cost, not yet formally documented",
      "The problem is precisely defined in one sentence with a documented, measurable cost agreed by leadership",
    ],
  },
  {
    id: 19,
    dimension: "E",
    sector: "all",
    text: "Success Metrics",
    subtext: "Are there defined KPIs or success criteria for this initiative that exist independently of the AI system itself?",
    options: [
      "No KPIs defined, success would be judged by whether the system functions",
      "Informal metrics exist but are not formally defined or baselined",
      "KPIs are defined and some baseline measurement exists",
      "KPIs are formally defined, baselined, and agreed upon by all key stakeholders before any build begins",
    ],
  },
  {
    id: 20,
    dimension: "E",
    sector: "all",
    text: "Stakeholder Alignment",
    subtext: "Do all key stakeholders (Operations, Finance, IT, Legal) agree this problem is worth solving at this investment level?",
    options: [
      "Alignment hasn't been sought, this is a top-down or single-person decision",
      "Some stakeholders are aware but not all have agreed to the investment",
      "Most stakeholders are aligned with minor objections still outstanding",
      "All key stakeholders are explicitly aligned on the problem definition, priority, and investment level",
    ],
  },

  // ─── Section F: Sector Readiness, Law (IDs 21–24) ────────────────────────
  {
    id: 21,
    dimension: "F",
    sector: "Law",
    text: "Matter-Type Pilot Selection",
    subtext: "Have you chosen a specific matter type or practice area (NDA review, M&A due diligence, eDiscovery, litigation drafting) to pilot AI on first?",
    options: [
      "No pilot scoped; \"AI everywhere\" is the current ambition",
      "Several candidate areas discussed; no commitment",
      "Pilot area chosen; pilot lead not yet named",
      "Specific matter type chosen with named pilot lead and success criteria",
    ],
  },
  {
    id: 22,
    dimension: "F",
    sector: "Law",
    text: "Privilege & Confidentiality Architecture",
    subtext: "Do you have a defensible answer for ABA Model Rule 1.6 / GDPR / professional secrecy when client matter content goes through an AI system?",
    options: [
      "Lawyers are pasting matter content into public ChatGPT/Gemini with no policy",
      "Written \"no client info in AI\" policy exists but isn't enforced or audited",
      "Enterprise license (Harvey / CoCounsel / Microsoft Copilot Enterprise) with DPA; partial enforcement",
      "Private-tenant or self-hosted AI for matter content, with audit logs and a written privilege impact assessment",
    ],
  },
  {
    id: 23,
    dimension: "F",
    sector: "Law",
    text: "Citation Verification Protocol",
    subtext: "Do you have a written, enforced process for verifying every AI-generated citation, statute reference, and quotation before it leaves the firm?",
    options: [
      "No protocol; relying on individual judgment",
      "Informal \"double-check it\" guidance; no documented procedure",
      "Written verification checklist; compliance varies by partner",
      "Mandatory verification step with sign-off and training; tied to malpractice/risk-management policy",
    ],
  },
  {
    id: 24,
    dimension: "F",
    sector: "Law",
    text: "Billing-Model Adaptation",
    subtext: "Have your partners agreed on how AI-accelerated work is billed (fixed fee on AI-assisted matters, blended rates, value pricing) and communicated this to clients?",
    options: [
      "No discussion; billable-hour model unchanged; AI gains are invisible to the P&L",
      "Internal debate ongoing; no decision",
      "Decision made for select matter types; client comms in progress",
      "Billing-model policy decided, in client engagement letters, with rate-card adjustments live",
    ],
  },

  // ─── Section F: Sector Readiness, Finance (IDs 25–28) ────────────────────
  {
    id: 25,
    dimension: "F",
    sector: "Finance",
    text: "Model Risk Management Coverage of GenAI",
    subtext: "Does your MRM framework (SR 11-7-aligned in US, FCA SS1/23 in UK, or equivalent) explicitly name generative AI and non-deterministic models as in-scope?",
    options: [
      "MRM exists but does not mention GenAI; or no MRM at all",
      "Informal acknowledgment GenAI is different; no policy update yet",
      "MRM update in draft; some GenAI use cases catalogued",
      "Updated MRM in force with GenAI inventory, validation cadence, and ongoing monitoring requirements",
    ],
  },
  {
    id: 26,
    dimension: "F",
    sector: "Finance",
    text: "High-Risk Workflow Inventory",
    subtext: "Have you identified which AI use cases would trigger EU AI Act high-risk classification (credit scoring, insurance pricing) or SEC predictive-analytics conflict-of-interest rules?",
    options: [
      "Not assessed; not sure which use cases are in scope",
      "Aware some applications may be high-risk; not formally classified",
      "Classification in progress; some workflows tagged",
      "Complete inventory of high-risk AI use cases with conformity-assessment / impact-assessment plans",
    ],
  },
  {
    id: 27,
    dimension: "F",
    sector: "Finance",
    text: "Client-Facing Output Governance",
    subtext: "Are AI-generated client communications (advisor emails, marketing collateral, investment commentary) captured for regulatory review under FINRA 2210, SEC Marketing Rule, or MiFID II?",
    options: [
      "AI-generated client content is not captured or reviewed",
      "Manual review on a sample basis; no system capture",
      "Some channels captured (email yes, chat no); inconsistent",
      "All AI-generated client comms captured, reviewed, and archived consistent with applicable comms rules",
    ],
  },
  {
    id: 28,
    dimension: "F",
    sector: "Finance",
    text: "Data Residency for Customer PII",
    subtext: "Do you have an enforced answer for where customer PII can be processed by AI, and have you eliminated shadow use of public LLMs by advisors and analysts?",
    options: [
      "No policy; some staff use public ChatGPT with customer info",
      "Policy exists; enforcement informal; shadow use suspected",
      "Enterprise-licensed AI with DPAs; periodic audits",
      "Tenant-isolated or on-prem AI for PII workflows; shadow-AI scanning in place",
    ],
  },

  // ─── Section F: Sector Readiness, Real Estate (IDs 29–32) ────────────────
  {
    id: 29,
    dimension: "F",
    sector: "Real Estate & Property",
    text: "Sub-Segment Use-Case Focus",
    subtext: "Have you scoped the first AI use case to the segment you actually operate (brokerage lead/CMA workflow, property-mgmt maintenance & leasing triage, or CRE lease abstraction & rent-roll standardization)?",
    options: [
      "\"AI for real estate\" is the current scope; no concrete workflow chosen",
      "Two or three candidate workflows discussed",
      "Workflow chosen; resourcing not yet committed",
      "Specific workflow, owner, and 60–90 day pilot timeline locked",
    ],
  },
  {
    id: 30,
    dimension: "F",
    sector: "Real Estate & Property",
    text: "Fair-Housing / Bias Exposure Review",
    subtext: "Have you reviewed which AI applications touch protected-class outcomes (tenant screening, housing advertising audience targeting, AVM valuation, mortgage underwriting)?",
    options: [
      "Not assessed; no awareness of HUD / FHA / CFPB exposure",
      "Aware of exposure; no impact assessment yet",
      "Initial bias review done on one or two workflows",
      "Bias-testing or impact-assessment program in place (aligned with HUD guidance, Colorado AI Act, or equivalent)",
    ],
  },
  {
    id: 31,
    dimension: "F",
    sector: "Real Estate & Property",
    text: "Data Standardization Across Properties / Markets",
    subtext: "Is your operational data (rent rolls, lease abstracts, listings, work orders) consistently structured across properties, markets, or franchisees?",
    options: [
      "Each property / market / franchisee uses its own formats; no central standard",
      "Standards exist on paper; widely ignored in practice",
      "Standards enforced in core systems; legacy gaps remain",
      "Consistent data model across the portfolio; aggregation/AI-ready",
    ],
  },
  {
    id: 32,
    dimension: "F",
    sector: "Real Estate & Property",
    text: "Tenant or Client Communication Volume",
    subtext: "Do you have the inbound communication volume (tenant tickets, prospect inquiries, broker emails) and ticketing structure that makes conversational AI worth deploying?",
    options: [
      "Volume is too low or too irregular to justify automation",
      "Volume is there but not captured in a structured ticketing system",
      "Volume + structure exist; routing is manual",
      "Volume, structured intake, and a defined triage taxonomy ready for AI",
    ],
  },

  // ─── Section F: Sector Readiness, Construction (IDs 33–36) ───────────────
  {
    id: 33,
    dimension: "F",
    sector: "Construction",
    text: "Unified Project Platform",
    subtext: "Do you have a standardized project-management platform (Procore, Autodesk Construction Cloud, PlanGrid, etc.) deployed across all active job sites, not optional per superintendent?",
    options: [
      "Each job site / superintendent uses their own tools; no central platform",
      "Platform chosen; rollout partial or contested",
      "Platform standard on new projects; legacy projects still mixed",
      "Single platform across all active jobs with data flowing centrally",
    ],
  },
  {
    id: 34,
    dimension: "F",
    sector: "Construction",
    text: "Document & Drawing Digitization",
    subtext: "Are RFIs, submittals, change orders, daily reports, and current drawing sets in digital, searchable form, not PDFs in email or paper at the trailer?",
    options: [
      "Critical project documents live in paper, email, or unsearchable PDFs",
      "Some doc types digitized; coverage inconsistent across jobs",
      "Most documents digital and searchable; gaps in one or two categories",
      "All project documents digital, searchable, version-controlled across job sites",
    ],
  },
  {
    id: 35,
    dimension: "F",
    sector: "Construction",
    text: "Pilot Workflow Selection",
    subtext: "Have you chosen the first AI pilot workflow, takeoff/estimating, schedule-risk forecasting, jobsite progress capture, RFI triage, safety monitoring, with a named owner and ROI hypothesis?",
    options: [
      "No pilot scoped; broad \"AI for construction\" interest only",
      "Two or three pilot candidates being weighed",
      "Pilot chosen; owner not yet named or ROI not quantified",
      "Specific workflow, named owner, ROI hypothesis, and 60–90 day measurement plan",
    ],
  },
  {
    id: 36,
    dimension: "F",
    sector: "Construction",
    text: "Field-Force Connectivity & Adoption",
    subtext: "Do field crews and subs have the devices, connectivity, and willingness to use a digital tool on-site, or will any AI deployment stop at the office?",
    options: [
      "Field crews are paper-based; office tech doesn't reach the trailer",
      "Some devices in the field; usage inconsistent",
      "Field tools widely deployed; some sub-contractor friction",
      "Office and field operate on the same tools; subs are onboarded; jobsite Wi-Fi/cellular accounted for",
    ],
  },

  // ─── Section F: Sector Readiness, Other / Cross-Industry (IDs 37–40) ─────
  {
    id: 37,
    dimension: "F",
    sector: "Other / Cross-Industry",
    text: "First Pilot Scope",
    subtext: "Have you scoped the single highest-value pilot workflow with a named owner and a 60–90 day timeline?",
    options: [
      "No pilot scoped; \"AI everywhere\" interest only",
      "Two or three candidate workflows discussed",
      "Pilot workflow chosen; owner not yet named",
      "Specific workflow, named owner, success criteria, and timeline locked",
    ],
  },
  {
    id: 38,
    dimension: "F",
    sector: "Other / Cross-Industry",
    text: "ROI Hypothesis",
    subtext: "Is there a quantified before/after metric (hours saved, error rate, cycle time) for the pilot, with a current baseline measured?",
    options: [
      "No baseline metric; success is \"see if it works\"",
      "Rough qualitative expectation; no numbers",
      "Estimated before/after ROI; not formally baselined",
      "Quantified baseline metric with measurable target and review cadence",
    ],
  },
  {
    id: 39,
    dimension: "F",
    sector: "Other / Cross-Industry",
    text: "Build vs Buy Posture",
    subtext: "Have you decided whether the pilot is off-the-shelf, vendor-built, or custom, with rationale and budget agreed?",
    options: [
      "Not decided; default assumption is \"build something\"",
      "Some vendor evaluation; no commitment",
      "Decision in progress; trade-offs being weighed",
      "Build/buy/custom decision documented with rationale and budget",
    ],
  },
  {
    id: 40,
    dimension: "F",
    sector: "Other / Cross-Industry",
    text: "Post-Pilot Path",
    subtext: "Is there a written rule for what triggers expanding the pilot vs. killing it after the measurement window?",
    options: [
      "No rule for what happens after the pilot",
      "Vague intent to \"expand if it works\"",
      "Success criteria exist but no clear go/no-go process",
      "Written rule for expand vs. kill, with decision-makers named",
    ],
  },
];

/** Returns the questions that should be served for a given sector (core + sector F-questions). */
export function getDeepQuestionsForSector(sector: Sector): DeepQuestion[] {
  return deepQuestions.filter((q) => q.sector === "all" || q.sector === sector);
}

/** Applies sector-specific text/subtext/options overrides to a question. */
export function resolveDeepQuestion(q: DeepQuestion, sector: Sector): DeepQuestion {
  const override = q.sectorSpecific?.[sector];
  if (!override) return q;
  return {
    ...q,
    ...(override.text !== undefined ? { text: override.text } : {}),
    ...(override.subtext !== undefined ? { subtext: override.subtext } : {}),
    ...(override.options !== undefined ? { options: override.options } : {}),
  };
}

export function calculateDeepScore(
  answers: Record<number, number>,
  sector: Sector = DEFAULT_SECTOR,
): {
  total: number;
  byDimension: Record<Dimension, number>;
} {
  const byDimension: Record<Dimension, number> = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
  getDeepQuestionsForSector(sector).forEach((q) => {
    byDimension[q.dimension] += answers[q.id] ?? 0;
  });
  const total = Object.values(byDimension).reduce((s, v) => s + v, 0);
  return { total, byDimension };
}

export function getDeepTier(
  score: number,
  sector: Sector = DEFAULT_SECTOR,
): { name: string; description: string; action: string } {
  const tier = deepScoreToTierLevel(score);
  const rec = SECTOR_RECOMMENDATIONS[sector][tier];
  const name =
    tier === 1 ? "Not Ready"
    : tier === 2 ? "Pre-Deployment"
    : tier === 3 ? "Deployment Ready"
    : "High Readiness";
  return {
    name,
    description: rec.paragraph,
    action: rec.ctaHint,
  };
}

export function getDimensionInterpretation(
  dimension: Dimension,
  score: number,
  _sector: Sector = DEFAULT_SECTOR,
): string {
  const max = DIMENSIONS[dimension].max;
  const pct = score / max;
  if (dimension === "A") {
    if (pct < 0.4) return "Foundational process work needed before any AI deployment. Map and document your 3 highest-friction workflows first.";
    if (pct < 0.7) return "Process gaps will slow delivery. A scoped automation-readiness sprint is strongly recommended.";
    return "Strong process foundation. AI deployment will be faster and ROI will be measurable from day one.";
  }
  if (dimension === "B") {
    if (pct < 0.5) return "Data cleaning, extraction pipelines, and infrastructure provisioning will add 30–60% to your delivery timeline.";
    if (pct < 0.8) return "Data and infrastructure are workable but have gaps that need addressing before full deployment.";
    return "Data and infrastructure are solid. AI systems can be deployed without major remediation work.";
  }
  if (dimension === "C") {
    if (pct < 0.5) return "In a regulated industry, this is a deployment blocker. Compliance review must run parallel to design, not after it.";
    if (pct < 0.8) return "Compliance posture is developing. Legal review of AI tool usage policies should happen before full deployment.";
    return "Compliance and governance are strong. Procurement and legal sign-off should be straightforward.";
  }
  if (dimension === "D") {
    if (pct < 0.4) return "Without named ownership and a change management plan, 60% of AI systems degrade within 6 months.";
    if (pct < 0.8) return "Team readiness is partial. Define technical ownership and a staff training plan before deployment.";
    return "Team and change readiness are solid. The organisation can absorb and sustain a new AI system.";
  }
  if (dimension === "E") {
    if (pct < 0.4) return "If you can't state the problem and its cost in one sentence, you're not ready to commission a build. Start with a discovery sprint.";
    if (pct < 0.8) return "Strategic intent is there but alignment gaps exist. Ensure all stakeholders agree on the problem before scoping a solution.";
    return "Clear problem definition and stakeholder alignment. You're ready to move to solution design.";
  }
  // Dimension F, Sector Readiness
  if (pct < 0.4) return "Sector-specific readiness gaps remain. The deployment realities of your industry will block scale-up until these are addressed.";
  if (pct < 0.8) return "Sector readiness is partial. Specific industry pain points still need work before broad deployment.";
  return "Strong sector-specific readiness. The deployment realities of your industry are accounted for.";
}
