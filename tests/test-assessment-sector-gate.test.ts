import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const contents = readFileSync(
  path.resolve(__dirname, "../src/components/assessment/AssessmentSectorGate.tsx"),
  "utf-8"
);

describe("src/components/assessment/AssessmentSectorGate.tsx source", () => {
  it("renders a Small Business choice", () => {
    expect(contents).toContain("Small Business");
  });

  it("renders an Enterprise choice", () => {
    expect(contents).toContain("Enterprise");
  });

  it("navigates Enterprise clicks to /enterprise via router.push", () => {
    expect(contents).toContain('router.push("/enterprise")');
  });

  it("calls onContinue() for the Small Business choice", () => {
    expect(contents).toContain("onContinue()");
  });
});
