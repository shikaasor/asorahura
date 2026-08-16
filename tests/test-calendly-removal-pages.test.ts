import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const servicesSource = readFileSync(join(process.cwd(), "src/app/services/page.tsx"), "utf-8");
const checkoutSource = readFileSync(join(process.cwd(), "src/app/checkout/page.tsx"), "utf-8");

describe("Calendly removal from services and checkout pages", () => {
  it("services/page.tsx contains no calendly references", () => {
    expect(servicesSource.toLowerCase()).not.toContain("calendly");
  });

  // The "systems" tier was removed when pricing moved to three tiers and
  // Systems Integration was folded into Enterprise. The point of this test is
  // that no tier CTA escapes to Calendly, so it tracks the tiers that exist.
  it("services/page.tsx routes every tier CTA through /engage", () => {
    expect(servicesSource).toContain("/engage?tier=starter");
    expect(servicesSource).toContain("/engage?tier=ops");
    expect(servicesSource).toContain("/engage?tier=enterprise");
    expect(servicesSource).not.toContain("/engage?tier=systems");
  });

  it("services/page.tsx no longer imports or renders BookingUrgency", () => {
    expect(servicesSource).not.toContain("BookingUrgency");
  });

  it("checkout/page.tsx contains no calendly references", () => {
    expect(checkoutSource.toLowerCase()).not.toContain("calendly");
  });

  it("checkout/page.tsx routes the enterprise CTA through /engage", () => {
    expect(checkoutSource).toContain("/engage?enterprise=true");
  });
});
