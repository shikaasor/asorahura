import { describe, it, expect } from "vitest";
import { productLabel, productNextSteps, productNeedsOnboarding } from "../src/lib/products";

const PURCHASABLE = [
  "consultation",
  "dfy",
  "dwy",
  "care-plan",
  "email-triage-tier1",
  "email-triage-tier2",
];

describe("productLabel", () => {
  it("names the offering, not just the delivery model", () => {
    expect(productLabel("dfy")).toBe("Instagram Comment-to-DM — Done For You");
    expect(productLabel("dwy")).toBe("Instagram Comment-to-DM — Done With You");
    expect(productLabel("email-triage-tier1")).toBe(
      "Email Triage on Telegram — Inbox Assistant"
    );
  });

  // "Done For You" alone told the owner the delivery model and nothing about
  // what was bought. Every label must identify the offering it belongs to.
  it("gives every purchasable product a label naming its offering", () => {
    for (const product of PURCHASABLE) {
      const label = productLabel(product);
      expect(label, product).not.toBe(product);
      expect(label.length, product).toBeGreaterThan("Done For You".length);
    }
  });

  it("falls back to the raw id rather than rendering nothing", () => {
    expect(productLabel("invoice-agent")).toBe("invoice-agent");
    expect(productLabel("")).toBe("unknown");
  });
});

describe("productNextSteps", () => {
  it("has copy for every purchasable product", () => {
    for (const product of PURCHASABLE) {
      expect(productNextSteps(product), product).not.toMatch(/^We'll be in touch shortly/);
    }
  });

  it("falls back to generic copy for an unrecognised product", () => {
    expect(productNextSteps("invoice-agent")).toBe(
      "We'll be in touch shortly with your next steps."
    );
  });
});

describe("productNeedsOnboarding", () => {
  it("flags everything except the subscription", () => {
    expect(productNeedsOnboarding("care-plan")).toBe(false);
    expect(productNeedsOnboarding("dfy")).toBe(true);
    expect(productNeedsOnboarding("consultation")).toBe(true);
  });
});
