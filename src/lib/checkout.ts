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
      "Full AI Opportunity Discovery across 5 operational dimensions",
      "Personalised automation roadmap — top 5 opportunities ranked by impact",
      "Tool stack review and integration recommendations",
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
      "Full AI Opportunity Discovery included",
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

export type AutomateTierId = "build-map" | "dfy" | "dwy" | "care-plan";

export interface AutomateTier {
  id: AutomateTierId;
  name: string;
  price: string;
  priceDetail: string;
  billingType: "one-time" | "recurring" | "free";
  paddlePriceId: string;
  description: string;
}

export const automateTiers: AutomateTier[] = [
  {
    id: "build-map",
    name: "Build Map",
    price: "Free",
    priceDetail: "",
    billingType: "free",
    paddlePriceId: "",
    description: "4 n8n workflows, environment template, deployment guide. Self-host at ~$6/mo.",
  },
  {
    id: "dfy",
    name: "Done For You",
    price: "$500",
    priceDetail: "one-time",
    billingType: "one-time",
    paddlePriceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_DFY || "",
    description: "Provisioned server, Meta app setup, live in 3–5 days.",
  },
  {
    id: "dwy",
    name: "Done With You",
    price: "$800",
    priceDetail: "one-time",
    billingType: "one-time",
    paddlePriceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_DWY || "",
    description: "Screen-to-screen build session. You maintain it going forward.",
  },
  {
    id: "care-plan",
    name: "Care Plan",
    price: "$9.99/mo",
    priceDetail: "monthly",
    billingType: "recurring",
    paddlePriceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_CARE_PLAN || "",
    description: "Token renewals, uptime monitoring, copy updates, priority support.",
  },
];

export function getAutomateTierById(id: AutomateTierId): AutomateTier {
  return automateTiers.find((t) => t.id === id) || automateTiers[0];
}

export function getPaddleEnvironment(): "sandbox" | "production" {
  return process.env.NEXT_PUBLIC_PADDLE_TOKEN?.startsWith("test_") ? "sandbox" : "production";
}
