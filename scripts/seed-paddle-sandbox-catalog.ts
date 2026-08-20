// Run once to create the sandbox Paddle catalog: npx tsx scripts/seed-paddle-sandbox-catalog.ts
// Reads PADDLE_API_KEY (sandbox key, pdl_sdbx_apikey_...) from .env.local.

import { Environment, Paddle } from "@paddle/paddle-node-sdk";

// tsx does not load .env.local the way `next dev` does, so load it explicitly.
// Without this the SDK sends `Bearer undefined` and Paddle returns
// authentication_malformed.
process.loadEnvFile(".env.local");

const apiKey = process.env.PADDLE_API_KEY;
if (!apiKey?.startsWith("pdl_sdbx_apikey_")) {
  console.error(
    `PADDLE_API_KEY must be a sandbox key (pdl_sdbx_apikey_...), got: ${apiKey ? apiKey.slice(0, 16) + "..." : "unset"}`,
  );
  process.exit(1);
}

const paddle = new Paddle(apiKey, {
  environment: Environment.sandbox,
});

async function seed() {
  const consultation = await paddle.products.create({
    name: "Consultation Call",
    taxCategory: "standard",
    description: "1-hour strategy/discovery consultation call.",
  });
  const consultationPrice = await paddle.prices.create({
    productId: consultation.id,
    description: "Consultation Call — $200 flat fee",
    unitPrice: { amount: "20000", currencyCode: "USD" },
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

  const instagramDwy = await paddle.products.create({
    name: "Instagram Comment-to-DM — Done With You",
    taxCategory: "standard",
    description: "Screen-to-screen build session. You maintain it going forward.",
  });
  const instagramDwyPrice = await paddle.prices.create({
    productId: instagramDwy.id,
    description: "Instagram DWY — $800 one-time",
    unitPrice: { amount: "80000", currencyCode: "USD" },
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
        instagramDwy: { productId: instagramDwy.id, priceId: instagramDwyPrice.id },
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
