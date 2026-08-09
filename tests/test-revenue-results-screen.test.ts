import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const contents = readFileSync(
  path.resolve(__dirname, "../src/components/assessment/RevenueResultsScreen.tsx"),
  "utf-8"
);

describe("src/components/assessment/RevenueResultsScreen.tsx source", () => {
  it("uses getRevenueOpportunities", () => {
    expect(contents).toContain("getRevenueOpportunities");
  });

  it("has a quick-mode CTA href of /checkout", () => {
    expect(contents).toContain('"/checkout"');
  });

  it("has a deep-mode CTA href of /checkout?assessment=deep", () => {
    expect(contents).toContain('"/checkout?assessment=deep"');
  });

  it('has quick-mode CTA text "See Your Purchase Options"', () => {
    expect(contents).toContain("See Your Purchase Options");
  });

  it('has deep-mode CTA text "View Your Roadmap"', () => {
    expect(contents).toContain("View Your Roadmap");
  });

  it("contains no calendly references", () => {
    expect(contents.toLowerCase()).not.toContain("calendly");
  });

  it("derives tierLevel via deepScoreToTierLevel/quickScoreToTierLevel before calling getRevenueOpportunities(sector, tierLevel)", () => {
    expect(contents).toContain("getRevenueOpportunities(sector, tierLevel)");
    expect(contents).toContain("deepScoreToTierLevel(score)");
    expect(contents).toContain("quickScoreToTierLevel(score)");
  });

  it("renders deep-mode dimension breakdown when byDimension is provided (exercises assessmentType=deep path)", () => {
    expect(contents).toContain('assessmentType === "deep" && byDimension');
    expect(contents).toContain("DIMENSIONS");
    expect(contents).toContain("getDimensionInterpretation");
  });
});
