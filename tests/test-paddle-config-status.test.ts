import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { GET } from "../src/app/api/paddle/config-status/route";

const ENV_KEYS = [
  "NEXT_PUBLIC_PADDLE_TOKEN",
  "NEXT_PUBLIC_PADDLE_PRICE_ID_DFY",
  "NEXT_PUBLIC_PADDLE_PRICE_ID_DWY",
  "NEXT_PUBLIC_PADDLE_PRICE_ID_CARE_PLAN",
  "PADDLE_WEBHOOK_SECRET",
] as const;

const originalEnv: Record<string, string | undefined> = {};

beforeEach(() => {
  for (const key of ENV_KEYS) {
    originalEnv[key] = process.env[key];
    delete process.env[key];
  }
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (originalEnv[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = originalEnv[key];
    }
  }
});

describe("GET /api/paddle/config-status", () => {
  it("exports a GET function, not POST", async () => {
    const routeModule = await import("../src/app/api/paddle/config-status/route");
    expect(typeof routeModule.GET).toBe("function");
    expect((routeModule as Record<string, unknown>).POST).toBeUndefined();
  });

  it("returns 503 with sandbox warning when token starts with test_ (current .env.local state)", async () => {
    process.env.NEXT_PUBLIC_PADDLE_TOKEN = "test_abc123";

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body.paddle_mode).toBe("sandbox");
    expect(body.warning).toBeTruthy();
    expect(body.dfy_price_id_set).toBe(false);
    expect(body.dwy_price_id_set).toBe(false);
    expect(body.care_plan_price_id_set).toBe(false);
    expect(body.webhook_secret_set).toBe(false);
    expect(JSON.stringify(body)).not.toContain("test_abc123");
  });

  it("returns 500 when in production mode but price IDs are missing", async () => {
    process.env.NEXT_PUBLIC_PADDLE_TOKEN = "live_prod_token_xyz";
    process.env.PADDLE_WEBHOOK_SECRET = "whsec_123";

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Missing price IDs");
    expect(body.paddle_mode).toBe("production");
    expect(body.paddle_token_set).toBe(true);
    expect(JSON.stringify(body)).not.toContain("live_prod_token_xyz");
  });

  it("returns 200 ok:true when fully configured in production", async () => {
    process.env.NEXT_PUBLIC_PADDLE_TOKEN = "live_prod_token_xyz";
    process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_DFY = "pri_dfy_123";
    process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_DWY = "pri_dwy_123";
    process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_CARE_PLAN = "pri_care_123";
    process.env.PADDLE_WEBHOOK_SECRET = "whsec_123";

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toMatchObject({
      ok: true,
      paddle_mode: "production",
      paddle_token_set: true,
      dfy_price_id_set: true,
      dwy_price_id_set: true,
      care_plan_price_id_set: true,
      webhook_secret_set: true,
    });
    expect(JSON.stringify(body)).not.toContain("pri_dfy_123");
  });
});
