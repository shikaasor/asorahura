import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  tiers,
  automateTiers,
  getAutomateTierById,
  getPaddleEnvironment,
} from "../src/lib/checkout";

const ENV_KEYS = [
  "NEXT_PUBLIC_PADDLE_TOKEN",
  "NEXT_PUBLIC_PADDLE_PRICE_ID_DFY",
  "NEXT_PUBLIC_PADDLE_PRICE_ID_DWY",
  "NEXT_PUBLIC_PADDLE_PRICE_ID_CARE_PLAN",
] as const;

const originalEnv: Record<string, string | undefined> = {};

beforeEach(() => {
  for (const key of ENV_KEYS) {
    originalEnv[key] = process.env[key];
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

describe("getPaddleEnvironment", () => {
  it('returns "sandbox" when NEXT_PUBLIC_PADDLE_TOKEN starts with "test_"', () => {
    process.env.NEXT_PUBLIC_PADDLE_TOKEN = "test_abc123";
    expect(getPaddleEnvironment()).toBe("sandbox");
  });

  it('returns "production" when NEXT_PUBLIC_PADDLE_TOKEN does not start with "test_"', () => {
    process.env.NEXT_PUBLIC_PADDLE_TOKEN = "live_prod_token_xyz";
    expect(getPaddleEnvironment()).toBe("production");
  });
});

describe("automateTiers / getAutomateTierById", () => {
  it('getAutomateTierById("care-plan") returns price exactly "$9.99/mo"', () => {
    const tier = getAutomateTierById("care-plan");
    expect(tier.price).toBe("$9.99/mo");
  });

  it('getAutomateTierById("dfy") sources paddlePriceId from NEXT_PUBLIC_PADDLE_PRICE_ID_DFY', () => {
    process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_DFY = "pri_dfy_123";
    const tier = getAutomateTierById("dfy");
    expect(tier.paddlePriceId).toBe("pri_dfy_123");
  });

  it("existing tiers array (discovery, strategy) is unchanged in length and content", () => {
    expect(tiers).toHaveLength(2);
    expect(tiers.map((t) => t.id)).toEqual(["discovery", "strategy"]);
  });

  it("automateTiers contains exactly four entries: build-map, dfy, dwy, care-plan", () => {
    expect(automateTiers.map((t) => t.id)).toEqual(["build-map", "dfy", "dwy", "care-plan"]);
  });
});
