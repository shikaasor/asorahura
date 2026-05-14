export type Role = "Founder" | "CTO" | "Operations Manager" | "Other";

export interface Question {
  id: number;
  text: string;
  type: "single-select";
  options: string[];
  weight: number; // 0 for routing question, 12.5 for scored questions (7 scored × ~14.3 ≈ 100)
  roleSpecific?: Partial<Record<Role, string[]>>;
}

export const assessmentQuestions: Question[] = [
  {
    id: 1,
    text: "What best describes your role?",
    type: "single-select",
    options: ["Founder", "CTO", "Operations Manager", "Other"],
    weight: 0, // routing question — not scored
  },
  {
    id: 2,
    text: "Which activity consumes most of your manual time each week?",
    type: "single-select",
    options: ["Data entry", "Document processing", "Communications", "Reporting", "Scheduling"],
    weight: 12.5,
    roleSpecific: {
      Founder: [
        "Hiring and onboarding",
        "Customer acquisition follow-up",
        "Strategic planning sessions",
        "Admin and operations",
      ],
      CTO: [
        "Architecture and design reviews",
        "Team management and 1:1s",
        "Tech debt triage",
        "Vendor and tooling decisions",
      ],
      "Operations Manager": [
        "Data entry and reconciliation",
        "Status report generation",
        "Email and communication triage",
        "Scheduling and coordination",
      ],
      Other: [
        "Data entry",
        "Document processing",
        "Reporting",
        "Email and communication triage",
      ],
    },
  },
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
  },
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
  },
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
    roleSpecific: {
      Founder: [
        "Me — I'm the only one who can",
        "A trusted team member",
        "We have a documented process",
        "An automated workflow handles it",
      ],
      CTO: [
        "Me — it's faster than explaining",
        "I delegate to an engineer",
        "We have a documented runbook",
        "Automated CI/CD or tooling",
      ],
      "Operations Manager": [
        "Me — it falls to ops",
        "A team member with a checklist",
        "A documented SOP",
        "An automated process",
      ],
      Other: [
        "Me personally",
        "A team member I delegate to",
        "A documented process",
        "An automated system",
      ],
    },
  },
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
  },
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
  },
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
  },
];

// Answer index maps to score position within weight
// Index 0 = lowest score, last index = highest score
export function calculateScore(answers: Record<number, string>): number {
  let total = 0;
  assessmentQuestions.forEach((q) => {
    if (q.weight === 0) return;
    const answer = answers[q.id];
    if (!answer) return;
    const options = getQuestionOptions(q.id, (answers[1] as Role) || "Other");
    const idx = options.indexOf(answer);
    if (idx === -1) return;
    const answerScore = (idx / Math.max(options.length - 1, 1)) * q.weight;
    total += answerScore;
  });
  return Math.round(Math.min(total, 100));
}

export function getTierName(score: number): string {
  if (score < 30) return "Early Stage — Systems Needed";
  if (score < 60) return "Pre-Deployment Ready";
  if (score < 80) return "Deployment Ready";
  return "Advanced Optimization Ready";
}

export function getTierDescription(score: number): string {
  if (score < 30)
    return "You're running everything manually. AI systems could reclaim 10–20 hours per week and remove you as the bottleneck.";
  if (score < 60)
    return "You have some structure, but key processes still depend on you. Targeted automation could cut manual effort by 40–60%.";
  if (score < 80)
    return "Your systems are working, but there are clear opportunities to automate further and scale without adding headcount.";
  return "You're well-systematized. AI optimization can drive compounding efficiency gains and unlock growth without proportional cost.";
}

export function getPreviewBullets(score: number): string[] {
  if (score < 30) {
    return [
      "Automate client onboarding — eliminate 5+ manual touchpoints",
      "Build a reporting pipeline so data flows without you",
      "Document and systematize your top 3 recurring tasks",
    ];
  }
  if (score < 60) {
    return [
      "Connect your tool stack — eliminate copy-paste between platforms",
      "Automate your most frequent delegation loop",
      "Create a self-serve client portal to reduce inbound questions",
    ];
  }
  if (score < 80) {
    return [
      "Layer AI decision support on top of your existing workflows",
      "Automate exception handling so the team escalates less",
      "Build monitoring dashboards so issues surface without you",
    ];
  }
  return [
    "Explore AI agents for complex multi-step workflows",
    "Optimize your automation stack for reliability and cost",
    "Instrument your systems for continuous improvement",
  ];
}

export function getQuestionOptions(questionId: number, role: Role): string[] {
  const q = assessmentQuestions.find((q) => q.id === questionId);
  if (!q) return [];
  if (q.roleSpecific && q.roleSpecific[role]) {
    return q.roleSpecific[role]!;
  }
  return q.options;
}
