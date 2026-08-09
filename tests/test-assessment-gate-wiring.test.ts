import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const shellPath = path.resolve(
  __dirname,
  "../src/components/assessment/AssessmentShell.tsx"
);
const contents = readFileSync(shellPath, "utf-8");

describe("src/components/assessment/AssessmentShell.tsx source", () => {
  it("does not import SectorPicker", () => {
    expect(contents).not.toContain("SectorPicker");
  });

  it("does not include a sector Step literal", () => {
    const stepLine = contents
      .split("\n")
      .find((line) => line.includes("type Step ="));
    expect(stepLine).toBeDefined();
    expect(stepLine).not.toContain('"sector"');
  });

  it("imports and renders AssessmentSectorGate", () => {
    expect(contents).toContain("AssessmentSectorGate");
  });

  it("imports and renders RevenueResultsScreen", () => {
    expect(contents).toContain("RevenueResultsScreen");
  });

  it("does not import the legacy ResultsScreen component", () => {
    expect(contents).not.toContain('from "./ResultsScreen"');
  });
});
