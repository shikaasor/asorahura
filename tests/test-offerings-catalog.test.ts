import { describe, it, expect } from "vitest";
import {
  offerings,
  getOfferingBySlug,
  getAllOfferingsSlugs,
  getWaitlistOfferingSlugs,
} from "../src/lib/checkout";

describe("getAllOfferingsSlugs", () => {
  it("returns exactly the five slugs in locked order", () => {
    expect(getAllOfferingsSlugs()).toEqual([
      "instagram",
      "email-triage",
      "writing-constitution",
      "rate-aware-invoice",
      "client-onboarding",
    ]);
  });
});

describe("getWaitlistOfferingSlugs", () => {
  it("returns exactly the three waitlist slugs (instagram and email-triage have live checkout)", () => {
    expect(getWaitlistOfferingSlugs()).toEqual([
      "writing-constitution",
      "rate-aware-invoice",
      "client-onboarding",
    ]);
  });
});

describe("offerings.instagram", () => {
  it("has live checkout and locked pricing/CTA fields", () => {
    expect(offerings.instagram.hasLiveCheckout).toBe(true);
    expect(offerings.instagram.setupPrice).toBe("$500");
    expect(offerings.instagram.ctaHref).toBe("/automate/instagram");
    expect(offerings.instagram.ctaLabel).toBe("View Offering");
  });
});

describe("offerings.email-triage", () => {
  it("has live checkout and points at its dedicated tier-picker page", () => {
    expect(offerings["email-triage"].hasLiveCheckout).toBe(true);
    expect(offerings["email-triage"].ctaHref).toBe("/automate/email-triage");
    expect(offerings["email-triage"].ctaLabel).toBe("View Offering");
  });
});

describe("offerings pricing (locked figures)", () => {
  it('"email-triage" setupPrice "$500" and monthlyPrice null', () => {
    expect(offerings["email-triage"].setupPrice).toBe("$500");
    expect(offerings["email-triage"].monthlyPrice).toBeNull();
  });

  it('"writing-constitution" setupPrice "$600" and monthlyPrice "$400/mo"', () => {
    expect(offerings["writing-constitution"].setupPrice).toBe("$600");
    expect(offerings["writing-constitution"].monthlyPrice).toBe("$400/mo");
  });

  it('"rate-aware-invoice" setupPrice "$1,000" and monthlyPrice null (DFY only)', () => {
    expect(offerings["rate-aware-invoice"].setupPrice).toBe("$1,000");
    expect(offerings["rate-aware-invoice"].monthlyPrice).toBeNull();
  });

  it('"client-onboarding" setupPrice "$2,000" and monthlyPrice null', () => {
    expect(offerings["client-onboarding"].setupPrice).toBe("$2,000");
    expect(offerings["client-onboarding"].monthlyPrice).toBeNull();
  });
});

describe("offerings — the three waitlist offerings", () => {
  it("all have hasLiveCheckout === false", () => {
    for (const slug of getWaitlistOfferingSlugs()) {
      expect(offerings[slug].hasLiveCheckout).toBe(false);
    }
  });

  it('all have ctaHref === "/engage" and ctaLabel === "Join Waitlist"', () => {
    for (const slug of getWaitlistOfferingSlugs()) {
      expect(offerings[slug].ctaHref).toBe("/engage");
      expect(offerings[slug].ctaLabel).toBe("Join Waitlist");
    }
  });

  it("all have a non-null scopeConstraint string and faqs.length >= 3", () => {
    for (const slug of getWaitlistOfferingSlugs()) {
      expect(typeof offerings[slug].scopeConstraint).toBe("string");
      expect(offerings[slug].faqs.length).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("copy-constraint locks", () => {
  it('"rate-aware-invoice".scopeConstraint does not contain forbidden overpromise phrases', () => {
    const scope = offerings["rate-aware-invoice"].scopeConstraint ?? "";
    expect(scope).not.toContain("AI price research");
    expect(scope).not.toContain("AI knows the market");
  });

  it('"email-triage".scopeConstraint contains "Gmail"', () => {
    expect(offerings["email-triage"].scopeConstraint).toContain("Gmail");
  });
});

describe("getOfferingBySlug", () => {
  it('returns null for "not-a-real-slug"', () => {
    expect(getOfferingBySlug("not-a-real-slug")).toBeNull();
  });

  it('returns the same object as offerings["email-triage"]', () => {
    expect(getOfferingBySlug("email-triage")).toBe(offerings["email-triage"]);
  });
});
