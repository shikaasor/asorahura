import { describe, it, expect, vi, afterEach } from "vitest";
import { trackAnalyticsEvent } from "../src/lib/analytics";

describe("trackAnalyticsEvent", () => {
  afterEach(() => {
    delete (globalThis as { window?: unknown }).window;
  });

  it("does not throw when window is undefined", () => {
    expect(() => trackAnalyticsEvent("Land", { utm_source: "direct" })).not.toThrow();
  });

  it("does not throw when window.plausible is not yet loaded", () => {
    (globalThis as { window?: unknown }).window = {};

    expect(() => trackAnalyticsEvent("Demo Interaction")).not.toThrow();
  });

  it("calls window.plausible with the exact event name and props", () => {
    const plausible = vi.fn();
    (globalThis as { window?: unknown }).window = { plausible };

    trackAnalyticsEvent("Purchase", { product_type: "dfy", amount: 500, currency: "usd" });

    expect(plausible).toHaveBeenCalledWith("Purchase", {
      props: { product_type: "dfy", amount: 500, currency: "usd" },
    });
  });

  it("passes undefined props through when no props are given", () => {
    const plausible = vi.fn();
    (globalThis as { window?: unknown }).window = { plausible };

    trackAnalyticsEvent("Build Map Submit");

    expect(plausible).toHaveBeenCalledWith("Build Map Submit", { props: undefined });
  });

  it("calls window.plausible with the exact event name and props for Offering Card Click", () => {
    const plausible = vi.fn();
    (globalThis as { window?: unknown }).window = { plausible };

    trackAnalyticsEvent("Offering Card Click", { offering_id: "instagram" });

    expect(plausible).toHaveBeenCalledWith("Offering Card Click", {
      props: { offering_id: "instagram" },
    });
  });

  it("calls window.plausible with the exact event name and props for Waitlist CTA Click", () => {
    const plausible = vi.fn();
    (globalThis as { window?: unknown }).window = { plausible };

    trackAnalyticsEvent("Waitlist CTA Click", { offering_id: "email-triage" });

    expect(plausible).toHaveBeenCalledWith("Waitlist CTA Click", {
      props: { offering_id: "email-triage" },
    });
  });
});
