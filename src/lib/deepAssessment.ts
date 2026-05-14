export type Dimension = "A" | "B" | "C" | "D" | "E";

export interface DeepQuestion {
  id: number;
  dimension: Dimension;
  text: string;
  subtext: string;
  options: [string, string, string, string]; // index = score 0–3
}

export const DIMENSIONS: Record<Dimension, { name: string; max: number; description: string }> = {
  A: { name: "Process Intelligence", max: 15, description: "Are your workflows documented, measurable, and automation-viable?" },
  B: { name: "Data & Infrastructure", max: 15, description: "Is your data accessible, clean, and your infrastructure deployment-ready?" },
  C: { name: "Compliance & Governance", max: 12, description: "Can you deploy in a regulated environment without legal or compliance blockers?" },
  D: { name: "Team & Change Readiness", max: 9, description: "Does your organisation have the ownership and capacity to absorb a new system?" },
  E: { name: "Strategic Alignment", max: 9, description: "Is there a real problem with a measurable outcome that justifies the investment?" },
};

export const deepQuestions: DeepQuestion[] = [
  // ─── Section A: Process Intelligence ───────────────────────────────────────
  {
    id: 1,
    dimension: "A",
    text: "Process Documentation",
    subtext: "Are your highest-friction workflows written down with clear steps, owners, and outputs?",
    options: [
      "Nothing is documented — it lives entirely in people's heads",
      "A few processes are loosely written down but incomplete",
      "Most key workflows are documented, though not consistently maintained",
      "All high-friction workflows are documented, owned, and regularly reviewed",
    ],
  },
  {
    id: 2,
    dimension: "A",
    text: "Volume & Repetition",
    subtext: "Do you handle high volumes of similar tasks daily or weekly — form processing, data entry, report generation?",
    options: [
      "Tasks are mostly unique — no meaningful repetition",
      "Some repetitive tasks exist but volume is low or inconsistent",
      "Regular high-volume repetitive tasks, though not formally tracked",
      "High-volume, well-defined repetitive tasks run on a predictable daily or weekly cycle",
    ],
  },
  {
    id: 3,
    dimension: "A",
    text: "Output Measurability",
    subtext: "Can you define a 'correct' output for the tasks you want to automate? Are success criteria explicit?",
    options: [
      "Success is judged subjectively — no explicit criteria exist",
      "Some outputs are defined but applied inconsistently",
      "Most tasks have defined outputs with occasional exceptions",
      "Every target task has explicit, measurable success criteria agreed by stakeholders",
    ],
  },
  {
    id: 4,
    dimension: "A",
    text: "Error & Rework Rate",
    subtext: "Do you track failure rates, rework, or manual corrections in your current processes?",
    options: [
      "Errors are dealt with as they come — nothing is tracked",
      "We are aware of common errors but don't formally measure them",
      "We track some error metrics but not consistently across all processes",
      "Error and rework rates are tracked, reviewed, and actively used to drive improvement",
    ],
  },
  {
    id: 5,
    dimension: "A",
    text: "Process Ownership",
    subtext: "Is there a named person — not just a team — responsible for the processes you want to automate?",
    options: [
      "Ownership is shared or unclear — no single person is accountable",
      "Ownership is implied but not formally assigned",
      "Owners are named for most processes but accountability is loose",
      "Every target process has a named owner with clear accountability and authority",
    ],
  },

  // ─── Section B: Data & Infrastructure ─────────────────────────────────────
  {
    id: 6,
    dimension: "B",
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
    text: "Data Quality & Consistency",
    subtext: "Is your data consistently formatted, labelled, and free of significant corruption or duplication across sources?",
    options: [
      "Data is inconsistent, frequently duplicated, or contains significant errors",
      "Quality varies — some sources are clean, others require heavy cleaning",
      "Most data is clean and consistently formatted, with minor issues",
      "Data is consistently formatted, labelled, and validated across all sources",
    ],
  },
  {
    id: 8,
    dimension: "B",
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
    text: "Infrastructure Maturity",
    subtext: "Do you have cloud, on-premises, or hybrid infrastructure capable of hosting containerised AI workloads?",
    options: [
      "No server infrastructure — running entirely on local machines or third-party SaaS",
      "Basic cloud or hosting exists but is not configured for AI workloads",
      "Cloud infrastructure is in place and can be adapted with some configuration",
      "Production-ready cloud or hybrid infrastructure capable of containerised AI deployment",
    ],
  },
  {
    id: 10,
    dimension: "B",
    text: "Connectivity & Deployment Constraints",
    subtext: "Does your deployment context require offline-capable or low-bandwidth AI? Has this been accounted for in your infrastructure planning?",
    options: [
      "We haven't considered connectivity constraints — assumed always-online",
      "Aware of constraints but haven't planned for them yet",
      "Connectivity requirements are identified and partially addressed in planning",
      "Offline or low-bandwidth requirements are explicitly designed for in our infrastructure",
    ],
  },

  // ─── Section C: Compliance & Governance ───────────────────────────────────
  {
    id: 11,
    dimension: "C",
    text: "Regulatory Awareness",
    subtext: "Does your team know which compliance frameworks apply — GDPR, HIPAA, NDPR, SOC2, ISO 27001? Has legal reviewed AI tool usage policies?",
    options: [
      "We haven't identified which regulations apply to our AI use",
      "We have a general sense of applicable regulations but no formal legal review",
      "Key regulations are identified and partially reviewed by legal",
      "All applicable frameworks are identified, documented, and legally reviewed with a written policy",
    ],
  },
  {
    id: 12,
    dimension: "C",
    text: "Data Sovereignty",
    subtext: "Do you have explicit requirements on where client or patient data can be stored or processed? Are you actively enforcing them?",
    options: [
      "No data residency requirements have been defined",
      "Requirements exist informally but are not consistently enforced",
      "Requirements are defined and mostly enforced, with some gaps",
      "Data sovereignty requirements are explicit, documented, and actively enforced across all systems",
    ],
  },
  {
    id: 13,
    dimension: "C",
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
    text: "Vendor Risk Assessment",
    subtext: "Have you assessed the data-handling practices of AI tools your team uses — ChatGPT, Gemini, Copilot? Is shadow AI usage tracked?",
    options: [
      "AI tools are used without any vendor assessment or usage policy",
      "Some informal review has happened but no structured assessment exists",
      "Key AI vendors have been assessed and shadow AI is partially tracked",
      "All AI vendor data practices are formally assessed and shadow AI usage is actively monitored",
    ],
  },

  // ─── Section D: Team & Change Readiness ───────────────────────────────────
  {
    id: 15,
    dimension: "D",
    text: "Executive Sponsorship",
    subtext: "Is there a C-level or VP-level owner actively championing this AI initiative with budget and political capital?",
    options: [
      "No executive sponsor — this initiative has no leadership backing",
      "Senior interest exists but no formal sponsor with budget authority has been named",
      "An executive is engaged but commitment and budget are not fully formalised",
      "Named C-level or VP sponsor with allocated budget and active, ongoing advocacy",
    ],
  },
  {
    id: 16,
    dimension: "D",
    text: "Technical Ownership",
    subtext: "Is there a named technical lead who will own, maintain, and evolve the system after deployment?",
    options: [
      "No technical owner identified — it would fall to whoever is available",
      "Someone is informally expected to own it but not formally assigned",
      "A technical lead is named but their post-deployment role and scope are undefined",
      "Named technical owner with a clear mandate covering post-deployment maintenance and evolution",
    ],
  },
  {
    id: 17,
    dimension: "D",
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
    text: "Problem Clarity",
    subtext: "Can you state the specific operational problem you're solving in one sentence? Does it have a measurable current cost in time, money, or errors?",
    options: [
      "The problem is vague — we know something is inefficient but can't quantify it",
      "The problem is understood but not precisely defined or costed",
      "The problem is clearly stated with an estimated cost, not yet formally documented",
      "The problem is precisely defined in one sentence with a documented, measurable cost agreed by leadership",
    ],
  },
  {
    id: 19,
    dimension: "E",
    text: "Success Metrics",
    subtext: "Are there defined KPIs or success criteria for this initiative that exist independently of the AI system itself?",
    options: [
      "No KPIs defined — success would be judged by whether the system functions",
      "Informal metrics exist but are not formally defined or baselined",
      "KPIs are defined and some baseline measurement exists",
      "KPIs are formally defined, baselined, and agreed upon by all key stakeholders before any build begins",
    ],
  },
  {
    id: 20,
    dimension: "E",
    text: "Stakeholder Alignment",
    subtext: "Do all key stakeholders — Operations, Finance, IT, Legal — agree this problem is worth solving at this investment level?",
    options: [
      "Alignment hasn't been sought — this is a top-down or single-person decision",
      "Some stakeholders are aware but not all have agreed to the investment",
      "Most stakeholders are aligned with minor objections still outstanding",
      "All key stakeholders are explicitly aligned on the problem definition, priority, and investment level",
    ],
  },
];

export function calculateDeepScore(answers: Record<number, number>): {
  total: number;
  byDimension: Record<Dimension, number>;
} {
  const byDimension: Record<Dimension, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  deepQuestions.forEach((q) => {
    byDimension[q.dimension] += answers[q.id] ?? 0;
  });
  const total = Object.values(byDimension).reduce((s, v) => s + v, 0);
  return { total, byDimension };
}

export function getDeepTier(score: number): { name: string; description: string; action: string } {
  if (score <= 19) return {
    name: "Not Ready",
    description: "Foundational gaps across process, data, or governance. AI deployment now will waste resources and erode confidence in the technology.",
    action: "Process and data audit first. Build the foundation before any AI scoping.",
  };
  if (score <= 34) return {
    name: "Pre-Deployment",
    description: "Some strong areas but critical gaps exist. A targeted readiness sprint of 4–8 weeks can close the distance before full deployment.",
    action: "Engage for a System Architecture Audit to identify and sequence the gaps.",
  };
  if (score <= 47) return {
    name: "Deployment Ready",
    description: "Foundational pieces are in place. AI deployment is viable with the right architectural choices and scoped implementation plan.",
    action: "Move to solution design. Define scope, timeline, and ROI targets.",
  };
  return {
    name: "High Readiness",
    description: "Strong readiness across all five dimensions. You're positioned to move fast, get early measurable results, and scale from a working base.",
    action: "Book a discovery call. This is the profile we build for.",
  };
}

export function getDimensionInterpretation(dimension: Dimension, score: number): string {
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
    if (pct < 0.5) return "In a regulated industry, this is a deployment blocker. Compliance review must run parallel to design — not after it.";
    if (pct < 0.8) return "Compliance posture is developing. Legal review of AI tool usage policies should happen before full deployment.";
    return "Compliance and governance are strong. Procurement and legal sign-off should be straightforward.";
  }
  if (dimension === "D") {
    if (pct < 0.4) return "Without named ownership and a change management plan, 60% of AI systems degrade within 6 months.";
    if (pct < 0.8) return "Team readiness is partial. Define technical ownership and a staff training plan before deployment.";
    return "Team and change readiness are solid. The organisation can absorb and sustain a new AI system.";
  }
  if (pct < 0.4) return "If you can't state the problem and its cost in one sentence, you're not ready to commission a build. Start with a discovery sprint.";
  if (pct < 0.8) return "Strategic intent is there but alignment gaps exist. Ensure all stakeholders agree on the problem before scoping a solution.";
  return "Clear problem definition and stakeholder alignment. You're ready to move to solution design.";
}
