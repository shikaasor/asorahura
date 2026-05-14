export type Dimension = "A" | "B" | "C" | "D" | "E";

export interface DeepQuestion {
  id: number;
  dimension: Dimension;
  text: string;
  subtext: string;
}

export const DIMENSIONS: Record<Dimension, { name: string; max: number; description: string }> = {
  A: { name: "Process Intelligence", max: 15, description: "Are your workflows documented, measurable, and automation-viable?" },
  B: { name: "Data & Infrastructure", max: 15, description: "Is your data accessible, clean, and your infrastructure deployment-ready?" },
  C: { name: "Compliance & Governance", max: 12, description: "Can you deploy in a regulated environment without legal or compliance blockers?" },
  D: { name: "Team & Change Readiness", max: 9, description: "Does your organisation have the ownership and capacity to absorb a new system?" },
  E: { name: "Strategic Alignment", max: 9, description: "Is there a real problem with a measurable outcome that justifies the investment?" },
};

export const RATING_OPTIONS = [
  { value: 0, label: "Not in place" },
  { value: 1, label: "Early / partial" },
  { value: 2, label: "Mostly in place" },
  { value: 3, label: "Fully operational" },
];

export const deepQuestions: DeepQuestion[] = [
  // Section A — Process Intelligence (5 questions, max 15)
  { id: 1, dimension: "A", text: "Process Documentation", subtext: "Are your highest-friction workflows written down with clear steps, owners, and outputs?" },
  { id: 2, dimension: "A", text: "Volume & Repetition", subtext: "Do you handle high volumes of similar tasks daily/weekly — form processing, data entry, report generation?" },
  { id: 3, dimension: "A", text: "Output Measurability", subtext: "Can you define a 'correct' output for the tasks you want to automate? Are success criteria explicit?" },
  { id: 4, dimension: "A", text: "Error / Rework Rate", subtext: "Do you track failure rates, rework, or manual corrections in your current processes?" },
  { id: 5, dimension: "A", text: "Process Ownership", subtext: "Is there a named person — not just a team — responsible for the processes you want to automate?" },

  // Section B — Data & Infrastructure (5 questions, max 15)
  { id: 6, dimension: "B", text: "Data Accessibility", subtext: "Can relevant operational data be programmatically accessed via API or database? Or is it locked in PDFs, emails, or spreadsheets?" },
  { id: 7, dimension: "B", text: "Data Quality & Consistency", subtext: "Is your data consistently formatted, labelled, and free of significant corruption or duplication across sources?" },
  { id: 8, dimension: "B", text: "Historical Data Volume", subtext: "Do you have at least 6–12 months of historical operational data relevant to the target workflow?" },
  { id: 9, dimension: "B", text: "Infrastructure Maturity", subtext: "Do you have cloud, on-premises, or hybrid infrastructure capable of hosting containerised AI workloads?" },
  { id: 10, dimension: "B", text: "Connectivity & Constraints", subtext: "Does your deployment context require offline-capable or low-bandwidth AI? Is this accounted for in your current stack?" },

  // Section C — Compliance & Governance (4 questions, max 12)
  { id: 11, dimension: "C", text: "Regulatory Awareness", subtext: "Does your team know which frameworks apply — GDPR, HIPAA, NDPR, SOC2, ISO 27001? Has legal reviewed AI tool usage policies?" },
  { id: 12, dimension: "C", text: "Data Sovereignty", subtext: "Do you have explicit requirements on where client data can be stored or processed? Are you enforcing these today?" },
  { id: 13, dimension: "C", text: "Audit & Explainability", subtext: "Can your current systems produce audit logs? Is there a plan for AI decision explainability when regulators or clients ask?" },
  { id: 14, dimension: "C", text: "Vendor Risk Assessment", subtext: "Have you assessed the data-handling practices of AI tools in use — ChatGPT, Gemini, Copilot? Is shadow AI usage tracked?" },

  // Section D — Team & Change Readiness (3 questions, max 9)
  { id: 15, dimension: "D", text: "Executive Sponsorship", subtext: "Is there a C-level or VP-level owner actively championing this AI initiative with budget and political capital?" },
  { id: 16, dimension: "D", text: "Technical Ownership", subtext: "Is there a named technical lead who will own the system after deployment?" },
  { id: 17, dimension: "D", text: "Staff Adoption Readiness", subtext: "Have staff who will interact with the system been consulted? Is there a training and change management plan in place?" },

  // Section E — Strategic Alignment (3 questions, max 9)
  { id: 18, dimension: "E", text: "Problem Clarity", subtext: "Can you state the specific operational problem you're solving in one sentence? Does it have a measurable current cost?" },
  { id: 19, dimension: "E", text: "Success Metrics", subtext: "Are there defined KPIs or success criteria for this initiative that exist independently of the AI system?" },
  { id: 20, dimension: "E", text: "Stakeholder Alignment", subtext: "Do all key stakeholders — Operations, Finance, IT, Legal — agree this problem is worth solving at this investment level?" },
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
  // E
  if (pct < 0.4) return "If you can't state the problem and its cost in one sentence, you're not ready to commission a build. Start with a discovery sprint.";
  if (pct < 0.8) return "Strategic intent is there but alignment gaps exist. Ensure all stakeholders agree on the problem before scoping a solution.";
  return "Clear problem definition and stakeholder alignment. You're ready to move to solution design.";
}
