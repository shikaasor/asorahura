import {
  SECTOR_RECOMMENDATIONS,
  quickScoreToTierLevel,
} from "./sectorRecommendations";

export type Sector =
  | "Law"
  | "Finance"
  | "Real Estate & Property"
  | "Construction"
  | "Other / Cross-Industry";

export const SECTORS: readonly Sector[] = [
  "Law",
  "Finance",
  "Real Estate & Property",
  "Construction",
  "Other / Cross-Industry",
] as const;

export const DEFAULT_SECTOR: Sector = "Other / Cross-Industry";

export function isValidSector(value: unknown): value is Sector {
  return typeof value === "string" && (SECTORS as readonly string[]).includes(value);
}

export interface QuestionOverride {
  text?: string;
  options?: string[];
}

export interface Question {
  id: number;
  text: string;
  type: "single-select";
  options: string[];
  weight: number; // 0 for routing question, 12.5 for scored questions
  sectorSpecific?: Partial<Record<Sector, QuestionOverride>>;
}

export const assessmentQuestions: Question[] = [
  {
    id: 1,
    text: "Which sector best describes your organisation?",
    type: "single-select",
    options: [...SECTORS],
    weight: 0, // routing question, not scored
  },

  // ─── Q2: Biggest manual time drain ──────────────────────────────────────────
  {
    id: 2,
    text: "Which activity consumes most of your manual time each week?",
    type: "single-select",
    options: ["Data entry", "Document processing", "Communications", "Reporting", "Scheduling"],
    weight: 12.5,
    sectorSpecific: {
      Law: {
        text: "Which activity consumes the most of your firm's manual time each week?",
        options: [
          "Time entry & billing reconciliation",
          "Filings, deadlines & docket management",
          "Client matter intake & conflicts checks",
          "Document review & contract redlining",
          "Client communications & email triage",
        ],
      },
      Finance: {
        text: "Which activity consumes the most of your team's manual time each week?",
        options: [
          "Data entry & internal reconciliation",
          "KYC / AML & client onboarding paperwork",
          "Portfolio reporting & performance updates",
          "Compliance review & comms surveillance",
          "Client meeting prep & follow-up notes",
        ],
      },
      "Real Estate & Property": {
        text: "Which activity consumes the most of your team's manual time each week?",
        options: [
          "Lease abstraction & rent roll work",
          "Listing prep, CMA & marketing collateral",
          "Tenant inquiries & maintenance triage",
          "Underwriting & due diligence",
          "Broker / vendor / agent coordination",
        ],
      },
      Construction: {
        text: "Which activity consumes the most of your team's manual time each week?",
        options: [
          "Daily reports & jobsite documentation",
          "RFIs, submittals & change orders",
          "Takeoff & estimating",
          "Schedule updates & project coordination",
          "Bid coordination & proposal prep",
        ],
      },
    },
  },

  // ─── Q3: Frequency of handling automatable work ─────────────────────────────
  {
    id: 3,
    text: "How often do you personally handle a task that could be automated?",
    type: "single-select",
    options: [
      "Multiple times a day",
      "Once a day",
      "A few times a week",
      "Rarely",
    ],
    weight: 12.5,
    sectorSpecific: {
      Law: {
        text: "How often do partners or senior associates handle work that could be automated?",
        options: [
          "Multiple times a day",
          "Once a day",
          "A few times a week",
          "Rarely, junior staff or tooling handle it",
        ],
      },
      Finance: {
        text: "How often do advisors or senior staff handle work that could be automated?",
        options: [
          "Multiple times a day",
          "Once a day",
          "A few times a week",
          "Rarely, operations or tooling handle it",
        ],
      },
      "Real Estate & Property": {
        text: "How often do brokers, agents, or owners handle work that could be automated?",
        options: [
          "Multiple times a day",
          "Once a day",
          "A few times a week",
          "Rarely, staff or platforms handle it",
        ],
      },
      Construction: {
        text: "How often do PMs, estimators, or superintendents handle work that could be automated?",
        options: [
          "Multiple times a day",
          "Once a day",
          "A few times a week",
          "Rarely, field staff or platforms handle it",
        ],
      },
    },
  },

  // ─── Q4: Disconnected tool count ────────────────────────────────────────────
  {
    id: 4,
    text: "How many tools does your team use daily that don't talk to each other?",
    type: "single-select",
    options: [
      "5 or more",
      "3–4",
      "1–2",
      "They're mostly integrated",
    ],
    weight: 12.5,
    sectorSpecific: {
      Law: {
        text: "How many systems does your firm use daily that don't talk to each other (DMS, time/billing, eDiscovery, CRM, email)?",
      },
      Finance: {
        text: "How many systems does your firm use daily that don't talk to each other (CRM, custodian, planning, comms surveillance, reporting)?",
      },
      "Real Estate & Property": {
        text: "How many systems does your operation use daily that don't talk to each other (CRM, MLS, property mgmt, accounting, listings)?",
      },
      Construction: {
        text: "How many systems does your firm use daily that don't talk to each other (Procore/ACC, estimating, accounting, scheduling, BIM)?",
      },
    },
  },

  // ─── Q5: Who does operational work ──────────────────────────────────────────
  {
    id: 5,
    text: "When a task needs doing, who typically does it?",
    type: "single-select",
    options: [
      "Me personally",
      "A team member I delegate to",
      "A documented process",
      "An automated system",
    ],
    weight: 12.5,
    sectorSpecific: {
      Law: {
        text: "When non-billable operational work needs doing, who typically handles it?",
        options: [
          "A partner, it falls to us",
          "An associate or paralegal",
          "A documented practice-group SOP",
          "An integrated platform workflow",
        ],
      },
      Finance: {
        text: "When operational work needs doing, who typically handles it?",
        options: [
          "A senior advisor or portfolio manager personally",
          "A junior associate or ops team",
          "A documented SOP",
          "An automated workflow",
        ],
      },
      "Real Estate & Property": {
        text: "When operational work needs doing, who typically handles it?",
        options: [
          "The broker or owner personally",
          "An agent or property manager",
          "A documented operating process",
          "An integrated platform workflow",
        ],
      },
      Construction: {
        text: "When operational work needs doing, who typically handles it?",
        options: [
          "The PM or superintendent personally",
          "The field team or subs",
          "A documented project process",
          "An integrated platform workflow",
        ],
      },
    },
  },

  // ─── Q6: Operational confidence without leader ──────────────────────────────
  {
    id: 6,
    text: "How confident are you that your team could run operations for a week without you?",
    type: "single-select",
    options: [
      "Not at all confident",
      "Slightly confident",
      "Fairly confident",
      "Very confident",
    ],
    weight: 12.5,
    sectorSpecific: {
      Law: {
        text: "If named partners were unavailable for a week, how confident are you the firm's operations would hold?",
        options: [
          "Not at all, partner involvement is constant",
          "Slightly, material decisions would stall",
          "Fairly, most matters move with delegated coverage",
          "Very, the firm runs on systems and senior associates",
        ],
      },
      Finance: {
        text: "If senior advisors or portfolio managers were unavailable for a week, how confident are you the firm's operations would hold?",
        options: [
          "Not at all, senior involvement is constant",
          "Slightly, client decisions would stall",
          "Fairly, most workflows continue with coverage",
          "Very, the firm runs on systems and team coverage",
        ],
      },
      "Real Estate & Property": {
        text: "If the principal broker or owner were unavailable for a week, how confident are you operations would hold?",
        options: [
          "Not at all, principal involvement is constant",
          "Slightly, material decisions would stall",
          "Fairly, most workflows continue with coverage",
          "Very, the operation runs on systems and team coverage",
        ],
      },
      Construction: {
        text: "If lead PMs or superintendents were unavailable for a week, how confident are you projects would hold?",
        options: [
          "Not at all, PM/super involvement is constant",
          "Slightly, material decisions would stall",
          "Fairly, most projects continue with coverage",
          "Very, projects run on systems and documented processes",
        ],
      },
    },
  },

  // ─── Q7: Key-person dependency ──────────────────────────────────────────────
  {
    id: 7,
    text: "What happens to your business when you take a week off?",
    type: "single-select",
    options: [
      "It effectively stops",
      "It slows significantly",
      "It runs but I get constant messages",
      "It runs smoothly",
    ],
    weight: 12.5,
    sectorSpecific: {
      Law: {
        text: "How dependent is matter progress on a single attorney being present?",
        options: [
          "It stalls, that attorney is the only one who can move the matter",
          "It slows materially, coverage exists but quality drops",
          "It continues, coverage is real but we're still in the loop daily",
          "It runs smoothly, matters move on documented processes regardless of who's away",
        ],
      },
      Finance: {
        text: "How dependent is client service on a single advisor or PM being present?",
        options: [
          "It stalls, that advisor is the only one who knows the client",
          "It slows materially, coverage exists but client experience drops",
          "It continues, coverage is real but we're still in the loop daily",
          "It runs smoothly, client service is shared with documented continuity",
        ],
      },
      "Real Estate & Property": {
        text: "How dependent is operations on a single broker or property manager being present?",
        options: [
          "It stalls, that person is the only one who can move it",
          "It slows materially, coverage exists but quality drops",
          "It continues, coverage is real but we're still in the loop daily",
          "It runs smoothly, work is shared with documented continuity",
        ],
      },
      Construction: {
        text: "How dependent is project progress on a single PM or superintendent being on-site?",
        options: [
          "It stalls, that person is the only one who can move the project forward",
          "It slows materially, coverage exists but quality drops",
          "It continues, coverage is real but we're still in the loop daily",
          "It runs smoothly, projects move on documented processes regardless of who's away",
        ],
      },
    },
  },

  // ─── Q8: Intake / onboarding process clarity ────────────────────────────────
  {
    id: 8,
    text: "How clearly defined is your process for onboarding a new client?",
    type: "single-select",
    options: [
      "It's in my head",
      "Loosely documented",
      "Documented but inconsistent",
      "Fully systematized",
    ],
    weight: 12.5,
    sectorSpecific: {
      Law: {
        text: "How clearly defined is your new matter intake and conflicts process?",
        options: [
          "It's ad hoc, depends who picks it up",
          "Loosely documented, varies by practice group",
          "Documented but inconsistently followed",
          "Fully systematised across the firm",
        ],
      },
      Finance: {
        text: "How clearly defined is your KYC, account opening, and client onboarding process?",
        options: [
          "It's ad hoc, varies by advisor",
          "Loosely documented, followed inconsistently",
          "Documented but with manual handoffs",
          "Fully systematised end-to-end",
        ],
      },
      "Real Estate & Property": {
        text: "How clearly defined is your new tenant onboarding or new listing intake process?",
        options: [
          "It's ad hoc, varies by property or agent",
          "Loosely documented, followed inconsistently",
          "Documented but with manual handoffs",
          "Fully systematised across the portfolio",
        ],
      },
      Construction: {
        text: "How clearly defined is your project mobilisation and kickoff process?",
        options: [
          "It's ad hoc, varies by PM",
          "Loosely documented, followed inconsistently",
          "Documented but inconsistently followed across jobs",
          "Fully systematised across all projects",
        ],
      },
    },
  },
];

// Answer index maps to score position within weight.
// Index 0 = lowest score, last index = highest score.
export function calculateScore(
  answers: Record<number, string>,
  sector: Sector = DEFAULT_SECTOR,
): number {
  let total = 0;
  assessmentQuestions.forEach((q) => {
    if (q.weight === 0) return;
    const answer = answers[q.id];
    if (!answer) return;
    const options = getQuestionOptions(q.id, sector);
    const idx = options.indexOf(answer);
    if (idx === -1) return;
    const answerScore = (idx / Math.max(options.length - 1, 1)) * q.weight;
    total += answerScore;
  });
  return Math.round(Math.min(total, 100));
}

export function getTierName(score: number, _sector: Sector = DEFAULT_SECTOR): string {
  if (score < 30) return "Early Stage, Systems Needed";
  if (score < 60) return "Pre-Deployment Ready";
  if (score < 80) return "Deployment Ready";
  return "Advanced Optimization Ready";
}

export function getTierDescription(score: number, sector: Sector = DEFAULT_SECTOR): string {
  const tier = quickScoreToTierLevel(score);
  return SECTOR_RECOMMENDATIONS[sector][tier].paragraph;
}

export function getPreviewBullets(score: number, sector: Sector = DEFAULT_SECTOR): string[] {
  const tier = quickScoreToTierLevel(score);
  return [...SECTOR_RECOMMENDATIONS[sector][tier].bullets];
}

export function getSegment(score: number): "cold" | "warm" | "hot" {
  if (score < 40) return "cold";
  if (score < 70) return "warm";
  return "hot";
}

export function getQuestionOptions(questionId: number, sector: Sector): string[] {
  const q = assessmentQuestions.find((q) => q.id === questionId);
  if (!q) return [];
  const override = q.sectorSpecific?.[sector];
  if (override?.options) return override.options;
  return q.options;
}

export function getQuestionText(questionId: number, sector: Sector): string {
  const q = assessmentQuestions.find((q) => q.id === questionId);
  if (!q) return "";
  const override = q.sectorSpecific?.[sector];
  if (override?.text) return override.text;
  return q.text;
}
