import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const deepPagePath = path.resolve(__dirname, "../src/app/assessment/deep/page.tsx");
const pagePath = path.resolve(__dirname, "../src/app/assessment/page.tsx");

describe("assessment route consolidation", () => {
  it("/assessment/deep is a redirect to /assessment?depth=deep", () => {
    const contents = readFileSync(deepPagePath, "utf-8");
    expect(contents).toContain('redirect("/assessment?depth=deep")');
  });

  it("/assessment renders AssessmentShell or DeepAssessmentShell based on depth", () => {
    const contents = readFileSync(pagePath, "utf-8");
    expect(contents).toContain('depth === "deep"');
    expect(contents).toContain("AssessmentShell");
    expect(contents).toContain("DeepAssessmentShell");
  });

  it("orphaned components no longer exist on disk", () => {
    expect(
      existsSync(
        path.resolve(__dirname, "../src/components/assessment/ResultsScreen.tsx")
      )
    ).toBe(false);
    expect(
      existsSync(
        path.resolve(__dirname, "../src/components/assessment/DeepResultsScreen.tsx")
      )
    ).toBe(false);
    expect(
      existsSync(
        path.resolve(__dirname, "../src/components/assessment/SectorPicker.tsx")
      )
    ).toBe(false);
  });
});
