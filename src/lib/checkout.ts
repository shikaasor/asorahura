export type TierId = "discovery" | "strategy";

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
    id: "discovery",
    name: "Discovery Call",
    tagline: "Understand exactly where AI can save you time — before spending a dollar on build.",
    price: "$50/hr",
    priceDetail: "Billed hourly",
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
    id: "strategy",
    name: "Strategy Session",
    tagline: "A working session to map your AI architecture and define the exact build scope.",
    price: "$75/hr",
    priceDetail: "Billed hourly",
    deliverables: [
      "Full AI audit included",
      "Deep-dive into your operational architecture",
      "Defined build scope with technical specification",
      "Prioritised implementation roadmap with effort estimates",
    ],
    timeline: "1–2 weeks",
    support: "2 × 90-min working sessions + async review",
    paddlePriceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_STRATEGY_SESSION || "",
  },
];

export function getTierById(id: TierId): Tier {
  return tiers.find((t) => t.id === id) || tiers[0];
}
