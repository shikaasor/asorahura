import { describe, it, expect } from "vitest";
import { getRevenueOpportunities } from "../src/lib/revenueCalculation";
import { type Sector, SECTORS } from "../src/lib/assessment";
import { type TierLevel } from "../src/lib/sectorRecommendations";

const TIER_LEVELS: TierLevel[] = [1, 2, 3, 4];

describe("getRevenueOpportunities", () => {
  it("returns 3 named opportunities for Other / Cross-Industry at tier 2, scaled by the 0.85 multiplier", () => {
    const result = getRevenueOpportunities("Other / Cross-Industry", 2);
    expect(result.opportunities).toHaveLength(3);
    expect(result.opportunities.map((o) => o.name)).toEqual([
      "Email triage automation",
      "Client intake system",
      "Reporting pipeline",
    ]);
    // Email triage automation: low 40*0.85=34 -> 30, high 100*0.85=85 -> 90
    expect(result.opportunities[0].lowMonthly).toBe(30);
    expect(result.opportunities[0].highMonthly).toBe(90);
    // totals equal sum of the 3 opportunities' low/high
    const totalLow = result.opportunities.reduce((s, o) => s + o.lowMonthly, 0);
    const totalHigh = result.opportunities.reduce((s, o) => s + o.highMonthly, 0);
    expect(result.totalLow).toBe(totalLow);
    expect(result.totalHigh).toBe(totalHigh);
  });

  it("returns 3 named opportunities for Law at tier 4, scaled by the 1.5 multiplier", () => {
    const result = getRevenueOpportunities("Law", 4);
    expect(result.opportunities.map((o) => o.name)).toEqual([
      "Client intake & conflicts check automation",
      "Document review triage",
      "Billing reconciliation automation",
    ]);
  });

  it("rounds lowMonthly/highMonthly/totalLow/totalHigh to the nearest 10", () => {
    const result = getRevenueOpportunities("Finance", 3);
    for (const opp of result.opportunities) {
      expect(opp.lowMonthly % 10).toBe(0);
      expect(opp.highMonthly % 10).toBe(0);
    }
    expect(result.totalLow % 10).toBe(0);
    expect(result.totalHigh % 10).toBe(0);
  });

  it("has totalLow <= totalHigh and totalLow > 0 for every sector x tier combination", () => {
    for (const sector of SECTORS as Sector[]) {
      for (const tier of TIER_LEVELS) {
        const result = getRevenueOpportunities(sector, tier);
        expect(result.totalLow).toBeLessThanOrEqual(result.totalHigh);
        expect(result.totalLow).toBeGreaterThan(0);
        expect(result.totalLow % 10).toBe(0);
      }
    }
  });
});
