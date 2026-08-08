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

export type OfferingSlug =
  | "instagram"
  | "email-triage"
  | "writing-constitution"
  | "rate-aware-invoice"
  | "client-onboarding";

export interface OfferingFAQItem {
  question: string;
  answer: string;
}

export interface OfferingMetadata {
  id: OfferingSlug;
  name: string;
  tagline: string;
  description: string;
  heroHeadline: string;
  heroSubheading: string;
  setupPrice: string | null;
  setupLabel: string | null;
  monthlyPrice: string | null;
  monthlyLabel: string | null;
  hasLiveCheckout: boolean;
  ctaLabel: string;
  ctaHref: string;
  scopeConstraint: string | null;
  faqs: OfferingFAQItem[];
}

export const offerings: Record<OfferingSlug, OfferingMetadata> = {
  instagram: {
    id: "instagram",
    name: "Instagram Comment-to-DM",
    tagline: "The front door",
    description:
      "Auto-DMs Reel commenters with a lead magnet link. Start here — it's the cheapest, fastest automation to set up.",
    heroHeadline: "Instagram Lead Automation for Creators",
    heroSubheading: "Stop paying by the contact. Own your list. The bill stays flat at $6/mo.",
    setupPrice: "$500",
    setupLabel: "DFY — one-time",
    monthlyPrice: null,
    monthlyLabel: null,
    hasLiveCheckout: true,
    ctaLabel: "View Offering",
    ctaHref: "/automate/instagram",
    scopeConstraint: null,
    faqs: [],
  },
  "email-triage": {
    id: "email-triage",
    name: "Email Triage on Telegram",
    tagline: "The flagship",
    description:
      "Triage 20–30 emails per day via Telegram. No new app to learn. Proven revenue driver.",
    heroHeadline: "Email Triage on Telegram",
    heroSubheading:
      "Twenty to thirty emails a day, sorted and routed to a Telegram bot you already know how to use.",
    setupPrice: "$1,500",
    setupLabel: "setup",
    monthlyPrice: "$250/mo",
    monthlyLabel: "monthly",
    hasLiveCheckout: false,
    ctaLabel: "Join Waitlist",
    ctaHref: "/engage",
    scopeConstraint:
      "Gmail's API verification governs how fast we can onboard each new inbox. We'll confirm your setup timeline before you commit — not promise instant multi-client rollout.",
    faqs: [
      {
        question: "Do I need to learn a new app?",
        answer:
          "No. Triage runs through Telegram, an app you likely already have installed. There's no new dashboard to learn.",
      },
      {
        question: "How fast can this go live for my business?",
        answer:
          "Timeline depends on Gmail's API verification for your account. We'll confirm your specific setup timeline on the waitlist call before you commit to anything.",
      },
      {
        question: "What happens to emails it can't classify?",
        answer:
          "Anything outside its confidence threshold gets flagged and routed to you directly, not auto-answered.",
      },
    ],
  },
  "writing-constitution": {
    id: "writing-constitution",
    name: "Writing Constitution + Content",
    tagline: "The highest margin",
    description:
      "Build a writing constitution (capture your voice), then run a content subscription on top. Highest margin per offering.",
    heroHeadline: "Writing Constitution + Content",
    heroSubheading:
      "The deliverable is the constitution — an 8-module document that captures your voice, not a promise that we'll write your posts for you.",
    setupPrice: "$600",
    setupLabel: "Constitution — one-off",
    monthlyPrice: "$400/mo",
    monthlyLabel: "Content subscription",
    hasLiveCheckout: false,
    ctaLabel: "Join Waitlist",
    ctaHref: "/engage",
    scopeConstraint:
      "This is not a 'we post for you' service. The constitution — an 8-module document capturing your voice — is the paid, differentiated deliverable. The content subscription runs on top of it once it exists.",
    faqs: [
      {
        question: "What exactly is a writing constitution?",
        answer:
          "An 8-module document that captures how you write — tone, structure, do's and don'ts — so anyone (including AI) can produce content that sounds like you.",
      },
      {
        question: "Do I have to buy the content subscription too?",
        answer:
          "No. The constitution stands alone as a deliverable. The subscription is an optional next step once it exists.",
      },
      {
        question: "Is this the same as generic AI ghostwriting?",
        answer:
          "No. Most services skip the constitution and guess at your voice from a few examples. We build the document first, so every piece of content traces back to a defined standard.",
      },
    ],
  },
  "rate-aware-invoice": {
    id: "rate-aware-invoice",
    name: "Rate-Aware Invoice & Quote",
    tagline: "The differentiator",
    description:
      "Quote jobs at current market rates instead of guessing. Rate card + research + markup logic, source-cited.",
    heroHeadline: "Rate-Aware Invoice & Quote",
    heroSubheading:
      "Quote at current market rates instead of undercutting from ignorance — built on your rate card, not AI guesswork.",
    setupPrice: "$1,000",
    setupLabel: "setup",
    monthlyPrice: "$150/mo",
    monthlyLabel: "monthly",
    hasLiveCheckout: false,
    ctaLabel: "Join Waitlist",
    ctaHref: "/engage",
    scopeConstraint:
      "This isn't AI-guessed pricing. You bring your own rate card and comparable jobs; the system structures the math, applies your markup logic, and cites every source it uses — flagging anything it isn't confident about instead of inventing a number.",
    faqs: [
      {
        question: "Does the AI make up prices?",
        answer:
          "No. It never invents a number. It works from your rate card and comparable jobs you supply, applies your markup rules, and cites its sources.",
      },
      {
        question: "What if it isn't confident in a quote?",
        answer:
          "It flags low-confidence line items instead of guessing, so you know exactly where to double-check before sending a quote.",
      },
      {
        question: "Who is this built for?",
        answer:
          "Small businesses — construction and trades in particular — that currently quote from memory or gut feel and lose margin to it.",
      },
    ],
  },
  "client-onboarding": {
    id: "client-onboarding",
    name: "Client Onboarding Agent",
    tagline: "The expansion play",
    description:
      "Provisions welcome packs, channels, and client folders in ~20 seconds. Best live demo. For agencies and consultancies.",
    heroHeadline: "Client Onboarding Agent",
    heroSubheading:
      "Watches Slack, Drive, and Zoom, then provisions a welcome pack, channel, and folder for a new client in about 20 seconds.",
    setupPrice: "$2,000",
    setupLabel: "one-time",
    monthlyPrice: null,
    monthlyLabel: null,
    hasLiveCheckout: false,
    ctaLabel: "Join Waitlist",
    ctaHref: "/engage",
    scopeConstraint:
      "Built for agencies and consultancies onboarding clients regularly, not the small-business self-serve buyer of the other four offerings. Widest integration surface of the five — expect the most setup coordination.",
    faqs: [
      {
        question: "What does it actually provision?",
        answer:
          "A welcome pack, a dedicated channel, and a client folder — created automatically the moment a new client is confirmed, in about 20 seconds.",
      },
      {
        question: "Is this for solo operators or agencies?",
        answer:
          "Agencies and consultancies onboarding clients on a regular cadence. It's the highest-ticket offering of the five and the most complex to set up.",
      },
      {
        question: "What tools does it need access to?",
        answer:
          "Slack, Drive, and Zoom in your current setup. Because it touches more systems than the other offerings, onboarding takes coordination — we'll scope that with you on the waitlist call.",
      },
    ],
  },
};

export function getOfferingBySlug(slug: string): OfferingMetadata | null {
  return (offerings as Record<string, OfferingMetadata>)[slug] || null;
}

export function getAllOfferingsSlugs(): OfferingSlug[] {
  return Object.keys(offerings) as OfferingSlug[];
}

export function getWaitlistOfferingSlugs(): OfferingSlug[] {
  return getAllOfferingsSlugs().filter((s) => !offerings[s].hasLiveCheckout);
}
