export type TierId = "starter" | "ops" | "systems" | "enterprise";

export interface Tier {
  id: TierId;
  name: string;
  tagline: string;
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
    tagline: "Understand exactly where AI can save you time — before spending a dollar on build.",
    price: "$5,000",
    priceDetail: "One-time, fixed fee",
    deliverables: [
      "Full AI readiness audit across 5 operational dimensions",
      "Personalised automation roadmap — top 5 opportunities ranked by impact",
      "Tool stack assessment and integration recommendations",
      "Written report with priority-ordered action plan",
    ],
    timeline: "5–7 business days",
    support: "1 × 60-min strategy call + async Q&A",
    paddlePriceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_DISCOVERY_CALL || "",
  },
  {
    id: "ops",
    name: "Ops Automation Build",
    tagline: "Remove your highest-friction workflows with 1–3 custom automation systems.",
    price: "$5,000–$15,000",
    priceDetail: "Scoped per project",
    deliverables: [
      "Full AI audit included",
      "1–3 automation workflows built and deployed",
      "Documentation and team handover",
      "Staff training session",
    ],
    timeline: "2–4 weeks",
    support: "Weekly check-ins + 30-day post-launch support",
    paddlePriceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_STRATEGY_SESSION || "",
  },
  {
    id: "systems",
    name: "Systems Architecture",
    tagline: "A fully designed and implemented AI operations layer across your entire business.",
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
    paddlePriceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_STRATEGY_SESSION || "",
  },
  {
    id: "enterprise",
    name: "Enterprise Retainer",
    tagline: "Dedicated ongoing capacity for organisations scaling AI across multiple functions.",
    price: "$30,000+",
    priceDetail: "Monthly retainer — minimum 3 months",
    deliverables: [
      "Ongoing AI systems strategy and implementation",
      "Dedicated capacity with priority access",
      "Quarterly operations reviews",
      "Full IP ownership of all built systems",
    ],
    timeline: "Ongoing — minimum 3-month commitment",
    support: "Weekly calls + unlimited async support",
    paddlePriceId: "", // Enterprise is not a Paddle product — handled via Calendly
  },
];

export function getTierById(id: TierId): Tier {
  return tiers.find((t) => t.id === id) || tiers[0];
}
