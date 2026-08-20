// Update an existing Paddle price. The seed scripts only run once, so changing
// a price there does nothing to a catalog that already exists.
//
//   npx tsx scripts/reprice.ts pri_01... 20000 --description="Consultation Call — $200 flat fee"
//
// Environment follows the PADDLE_API_KEY in .env.local. Repricing in live
// changes what real customers are charged, so that path needs --yes-live.

import { Environment, Paddle } from "@paddle/paddle-node-sdk";
import { formatMoney } from "../src/lib/money";

process.loadEnvFile(".env.local");

const [priceId, amount, ...flags] = process.argv.slice(2);
const apiKey = process.env.PADDLE_API_KEY;

if (!priceId?.startsWith("pri_") || !/^\d+$/.test(amount ?? "")) {
  console.error("usage: npx tsx scripts/reprice.ts pri_01... <amount-in-minor-units>");
  console.error("       e.g. 20000 for $200.00 USD");
  process.exit(1);
}

if (!apiKey) {
  console.error("PADDLE_API_KEY is not set in .env.local");
  process.exit(1);
}

const descriptionFlag = flags.find((f) => f.startsWith("--description="))?.slice("--description=".length);

const isLive = apiKey.startsWith("pdl_live_apikey_");
if (isLive && !flags.includes("--yes-live")) {
  console.error(
    "PADDLE_API_KEY is a LIVE key. This changes what real customers are charged.\n" +
      "Re-run with --yes-live if that is what you intend.",
  );
  process.exit(1);
}

async function main() {
  const paddle = new Paddle(apiKey!, {
    environment: isLive ? Environment.production : Environment.sandbox,
  });

  const current = await paddle.prices.get(priceId);
  const currency = current.unitPrice.currencyCode;

  console.log(`environment : ${isLive ? "LIVE" : "sandbox"}`);
  console.log(`price       : ${current.id} (${current.description})`);
  console.log(`before      : ${formatMoney(current.unitPrice.amount, currency)}`);

  const updated = await paddle.prices.update(priceId, {
    unitPrice: { amount, currencyCode: currency },
    ...(descriptionFlag ? { description: descriptionFlag } : {}),
  });

  console.log(`after       : ${formatMoney(updated.unitPrice.amount, currency)} (${updated.description})`);
}

main().catch((e) => {
  console.error(e.code ?? e.message);
  process.exit(1);
});
