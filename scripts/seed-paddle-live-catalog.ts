// Reconcile the live Paddle catalog with what the site sells.
//
//   npx tsx scripts/seed-paddle-live-catalog.ts
//
// Safe to run more than once. Products are matched by name, so a re-run creates
// only what is missing and leaves everything else alone. The previous version
// called products.create() unconditionally, which has no upsert behaviour —
// running it twice produced two of every product, each with its own price ID.
//
// Prices are never changed here. Amounts are reported, and a mismatch points at
// scripts/reprice.ts, which carries the --yes-live guard for the case where
// changing an amount changes what real customers are charged.

import { Environment, Paddle, type Product } from "@paddle/paddle-node-sdk";
import { formatMoney } from "../src/lib/money";

// tsx does not load .env.local the way `next dev` does, so load it explicitly.
// Without this the SDK sends `Bearer undefined` and Paddle returns
// authentication_malformed.
process.loadEnvFile(".env.local");

const apiKey = process.env.PADDLE_API_KEY;
if (!apiKey?.startsWith("pdl_live_apikey_")) {
  console.error(
    `PADDLE_API_KEY must be a live key (pdl_live_apikey_...), got: ${apiKey ? apiKey.slice(0, 16) + "..." : "unset"}`,
  );
  console.error("For the sandbox catalog use scripts/seed-paddle-sandbox-catalog.ts instead.");
  process.exit(1);
}

const paddle = new Paddle(apiKey, { environment: Environment.production });

interface CatalogEntry {
  /** The env var the resulting price ID belongs in. */
  envVar: string;
  name: string;
  description: string;
  priceDescription: string;
  /** Minor units — 50000 is $500.00. */
  amount: string;
  /** Present for subscriptions, absent for one-time purchases. */
  monthly?: boolean;
}

// Mirrors scripts/seed-paddle-sandbox-catalog.ts. Names are the match key, so
// renaming one here orphans the live product and creates a second alongside it.
const CATALOG: CatalogEntry[] = [
  {
    envVar: "NEXT_PUBLIC_PADDLE_PRICE_ID_CONSULTATION",
    name: "Consultation Call",
    description: "1-hour strategy/discovery consultation call.",
    priceDescription: "Consultation Call — $200 flat fee",
    amount: "20000",
  },
  {
    envVar: "NEXT_PUBLIC_PADDLE_PRICE_ID_DFY",
    name: "Instagram Comment-to-DM — Done For You",
    description: "Provisioned server, Meta app setup, live in 3–5 days.",
    priceDescription: "Instagram DFY — $500 one-time",
    amount: "50000",
  },
  {
    envVar: "NEXT_PUBLIC_PADDLE_PRICE_ID_DWY",
    name: "Instagram Comment-to-DM — Done With You",
    description: "Screen-to-screen build session. You maintain it going forward.",
    priceDescription: "Instagram DWY — $800 one-time",
    amount: "80000",
  },
  {
    envVar: "NEXT_PUBLIC_PADDLE_PRICE_ID_EMAIL_TRIAGE_TIER1",
    name: "Inbox Assistant",
    description: "Telegram email triage — instant urgent alerts + daily brief.",
    priceDescription: "Inbox Assistant — $500 one-time",
    amount: "50000",
  },
  {
    envVar: "NEXT_PUBLIC_PADDLE_PRICE_ID_EMAIL_TRIAGE_TIER2",
    name: "Inbox Assistant Pro",
    description: "Inbox Assistant plus VIP escalation, summaries, and draft replies.",
    priceDescription: "Inbox Assistant Pro — $900 one-time",
    amount: "90000",
  },
  {
    envVar: "NEXT_PUBLIC_PADDLE_PRICE_ID_CARE_PLAN",
    name: "Care Plan",
    description: "Token renewals, uptime monitoring, copy updates, priority support.",
    priceDescription: "Care Plan — $9.99/mo",
    amount: "999",
    monthly: true,
  },
];

async function loadExistingProducts(): Promise<Map<string, Product>> {
  const byName = new Map<string, Product>();
  for await (const product of paddle.products.list({
    status: ["active"],
    include: ["prices"],
    perPage: 100,
  })) {
    byName.set(product.name, product);
  }
  return byName;
}

async function reconcile() {
  const existing = await loadExistingProducts();
  const resolved: Array<[string, string]> = [];
  const warnings: string[] = [];

  for (const entry of CATALOG) {
    let product = existing.get(entry.name);

    if (product) {
      console.log(`product  reuse   ${entry.name} (${product.id})`);
    } else {
      product = await paddle.products.create({
        name: entry.name,
        taxCategory: "standard",
        description: entry.description,
      });
      console.log(`product  CREATE  ${entry.name} (${product.id})`);
    }

    // One price per product in this catalog, so billing shape is enough to
    // identify it — and it survives an edit to the price description.
    const price = (product.prices ?? []).find(
      (p) => p.status === "active" && Boolean(p.billingCycle) === Boolean(entry.monthly),
    );

    if (price) {
      const actual = formatMoney(price.unitPrice.amount, price.unitPrice.currencyCode);
      const intended = formatMoney(entry.amount, "USD");
      console.log(`price    reuse   ${entry.priceDescription} (${price.id}) at ${actual}`);
      if (price.unitPrice.amount !== entry.amount) {
        warnings.push(
          `${entry.name}: live price is ${actual}, this script expects ${intended}.\n` +
            `    Left as-is. To change it: npx tsx scripts/reprice.ts ${price.id} ${entry.amount} --yes-live`,
        );
      }
      resolved.push([entry.envVar, price.id]);
      continue;
    }

    const created = await paddle.prices.create({
      productId: product.id,
      description: entry.priceDescription,
      unitPrice: { amount: entry.amount, currencyCode: "USD" },
      ...(entry.monthly ? { billingCycle: { interval: "month" as const, frequency: 1 } } : {}),
    });
    console.log(`price    CREATE  ${entry.priceDescription} (${created.id})`);
    resolved.push([entry.envVar, created.id]);
  }

  if (warnings.length) {
    console.log("\nPrice mismatches (nothing was changed):");
    for (const w of warnings) console.log(`  - ${w}`);
  }

  console.log("\nPaste into your live environment:\n");
  for (const [envVar, priceId] of resolved) console.log(`${envVar}=${priceId}`);
}

reconcile().catch((e) => {
  console.error(e);
  process.exit(1);
});
