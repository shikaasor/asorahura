// Fetch a Paddle sandbox notification destination's secret and write it into
// .env.local as PADDLE_WEBHOOK_SECRET.
//
//   npx tsx scripts/get-webhook-secret.ts                 # list destinations
//   npx tsx scripts/get-webhook-secret.ts ntfset_01...    # write that one's secret
//
// The secret is never printed — only a masked prefix, so it stays out of
// terminal history.

import { readFileSync, writeFileSync } from "node:fs";
import { Environment, Paddle } from "@paddle/paddle-node-sdk";

process.loadEnvFile(".env.local");

const apiKey = process.env.PADDLE_API_KEY;
if (!apiKey?.startsWith("pdl_sdbx_apikey_")) {
  console.error(
    `PADDLE_API_KEY must be a sandbox key (pdl_sdbx_apikey_...), got: ${apiKey ? apiKey.slice(0, 16) + "..." : "unset"}`,
  );
  process.exit(1);
}

const paddle = new Paddle(apiKey, { environment: Environment.sandbox });
const mask = (s: string) => `${s.slice(0, 14)}...${s.slice(-4)}`;

async function main() {
  const id = process.argv[2];

  if (!id) {
    console.log("Destinations in your sandbox account:\n");
    for (const s of await paddle.notificationSettings.list()) {
      console.log(`  ${s.id}`);
      console.log(`    description: ${s.description}`);
      console.log(`    destination: ${s.destination}`);
      console.log(`    active:      ${s.active}`);
      console.log(`    events:      ${s.subscribedEvents.map((e) => e.name).join(", ")}\n`);
    }
    console.log("Re-run with a destination id to write its secret to .env.local.");
    return;
  }

  const setting = await paddle.notificationSettings.get(id);
  const secret = setting.endpointSecretKey;
  if (!secret) {
    console.error(`No endpointSecretKey returned for ${id}.`);
    process.exit(1);
  }

  const line = `PADDLE_WEBHOOK_SECRET=${secret}`;
  let env = readFileSync(".env.local", "utf8");
  env = /^PADDLE_WEBHOOK_SECRET=.*$/m.test(env)
    ? env.replace(/^PADDLE_WEBHOOK_SECRET=.*$/m, line)
    : env.replace(/^(PADDLE_API_KEY=.*)$/m, `$1\n${line}`);
  writeFileSync(".env.local", env);

  console.log(`Destination: ${setting.destination}`);
  console.log(`Events:      ${setting.subscribedEvents.map((e) => e.name).join(", ")}`);
  console.log(`Wrote PADDLE_WEBHOOK_SECRET=${mask(secret)} to .env.local`);
  console.log("\nRestart `npm run dev` for it to take effect.");
}

main().catch((e) => {
  console.error(e.code ?? e.message);
  process.exit(1);
});
