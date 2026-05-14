export type TierId = "starter" | "ops" | "systems" | "enterprise";

export interface Tier {
  id: TierId;
  name: string;
  price: string;
  priceDetail: string;
  deliverables: string[];
  timeline: string;
  support: string;
  paddlePriceId: string;
}

export const tiers: Tier[] = [
  {
    id: "starter",
    name: "AI Audit & Roadmap",
    price: "$5,000",
    priceDetail: "One-time",
    deliverables: [
      "Full AI readiness audit (20-question deep-dive)",
      "Personalized automation roadmap (top 5 opportunities)",
      "Tool stack assessment and recommendations",
      "Written report with priority-ordered action plan",
    ],
    timeline: "5–7 business days",
    support: "1 × 60-min strategy call + async Q&A",
    paddlePriceId: process.env.PADDLE_PRICE_ID_STARTER || "pri_placeholder_starter",
  },
  {
    id: "ops",
    name: "Ops Automation Build",
    price: "$5,000–$15,000",
    priceDetail: "Scoped per project",
    deliverables: [
      "Full AI audit included",
      "Build and deploy 1–3 automation workflows",
      "Documentation and handover",
      "Team training session",
    ],
    timeline: "2–4 weeks",
    support: "Weekly check-ins + 30-day post-launch support",
    paddlePriceId: process.env.PADDLE_PRICE_ID_OPS || "pri_placeholder_ops",
  },
  {
    id: "systems",
    name: "Systems Architecture",
    price: "$15,000–$30,000",
    priceDetail: "Scoped per project",
    deliverables: [
      "Full operations architecture design",
      "Multi-system automation implementation",
      "AI-powered reporting and dashboards",
      "Scalable SOPs and process documentation",
    ],
    timeline: "4–8 weeks",
    support: "Bi-weekly strategy calls + 60-day post-launch support",
    paddlePriceId: process.env.PADDLE_PRICE_ID_SYSTEMS || "pri_placeholder_systems",
  },
  {
    id: "enterprise",
    name: "Enterprise Retainer",
    price: "$30,000+",
    priceDetail: "Monthly retainer",
    deliverables: [
      "Ongoing AI systems strategy and implementation",
      "Dedicated capacity — priority access",
      "Quarterly operations reviews",
      "Full IP ownership of all built systems",
    ],
    timeline: "Ongoing — minimum 3 months",
    support: "Weekly calls + unlimited async support",
    paddlePriceId: process.env.PADDLE_PRICE_ID_ENTERPRISE || "pri_placeholder_enterprise",
  },
];

export function getTierById(id: TierId): Tier {
  return tiers.find((t) => t.id === id) || tiers[0];
}
