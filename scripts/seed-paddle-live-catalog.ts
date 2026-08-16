// Run once to create the live Paddle catalog: npx tsx scripts/seed-paddle-live-catalog.ts
// Requires PADDLE_API_KEY (live key) set in the environment.

import { Environment, Paddle } from "@paddle/paddle-node-sdk";

const paddle = new Paddle(process.env.PADDLE_API_KEY!, {
  environment: Environment.production,
});

async function seed() {
  const consultation = await paddle.products.create({
    name: "Consultation Call",
    taxCategory: "standard",
    description: "1-hour strategy/discovery consultation call.",
  });
  const consultationPrice = await paddle.prices.create({
    productId: consultation.id,
    description: "Consultation Call — $100/hr",
    unitPrice: { amount: "10000", currencyCode: "USD" },
  });

  const instagramDfy = await paddle.products.create({
    name: "Instagram Comment-to-DM — Done For You",
    taxCategory: "standard",
    description: "Provisioned server, Meta app setup, live in 3–5 days.",
  });
  const instagramDfyPrice = await paddle.prices.create({
    productId: instagramDfy.id,
    description: "Instagram DFY — $500 one-time",
    unitPrice: { amount: "50000", currencyCode: "USD" },
  });

  const emailTriageTier1 = await paddle.products.create({
    name: "Inbox Assistant",
    taxCategory: "standard",
    description: "Telegram email triage — instant urgent alerts + daily brief.",
  });
  const emailTriageTier1Price = await paddle.prices.create({
    productId: emailTriageTier1.id,
    description: "Inbox Assistant — $500 one-time",
    unitPrice: { amount: "50000", currencyCode: "USD" },
  });

  const emailTriageTier2 = await paddle.products.create({
    name: "Inbox Assistant Pro",
    taxCategory: "standard",
    description: "Inbox Assistant plus VIP escalation, summaries, and draft replies.",
  });
  const emailTriageTier2Price = await paddle.prices.create({
    productId: emailTriageTier2.id,
    description: "Inbox Assistant Pro — $900 one-time",
    unitPrice: { amount: "90000", currencyCode: "USD" },
  });

  const carePlan = await paddle.products.create({
    name: "Care Plan",
    taxCategory: "standard",
    description: "Token renewals, uptime monitoring, copy updates, priority support.",
  });
  const carePlanPrice = await paddle.prices.create({
    productId: carePlan.id,
    description: "Care Plan — $9.99/mo",
    unitPrice: { amount: "999", currencyCode: "USD" },
    billingCycle: { interval: "month", frequency: 1 },
  });

  console.log(
    JSON.stringify(
      {
        consultation: { productId: consultation.id, priceId: consultationPrice.id },
        instagramDfy: { productId: instagramDfy.id, priceId: instagramDfyPrice.id },
        emailTriageTier1: { productId: emailTriageTier1.id, priceId: emailTriageTier1Price.id },
        emailTriageTier2: { productId: emailTriageTier2.id, priceId: emailTriageTier2Price.id },
        carePlan: { productId: carePlan.id, priceId: carePlanPrice.id },
      },
      null,
      2,
    ),
  );
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
