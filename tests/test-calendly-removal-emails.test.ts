import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const deepActionsSource = readFileSync(
  join(process.cwd(), "src/app/assessment/deep/actions.ts"),
  "utf-8"
);
const emailSource = readFileSync(join(process.cwd(), "src/lib/email.ts"), "utf-8");
const assessmentReportSource = readFileSync(
  join(process.cwd(), "src/emails/AssessmentReport.tsx"),
  "utf-8"
);

describe("Calendly removal from assessment emails", () => {
  it("assessment/deep/actions.ts contains no calendly references", () => {
    expect(deepActionsSource.toLowerCase()).not.toContain("calendly");
  });

  it("assessment/deep/actions.ts routes the CTA through /checkout?assessment=deep", () => {
    expect(deepActionsSource).toContain("/checkout?assessment=deep");
  });

  it("email.ts no longer books a call in sendAssessmentEmailSequence's initial email", () => {
    expect(emailSource).not.toContain("Book a call:");
  });

  it("email.ts routes the initial email CTA through /checkout", () => {
    expect(emailSource).toContain("See your purchase options:");
  });

  it("AssessmentReport.tsx contains no calendly references", () => {
    expect(assessmentReportSource.toLowerCase()).not.toContain("calendly");
  });

  it("AssessmentReport.tsx's second Button hrefs ${BASE_URL}/checkout", () => {
    expect(assessmentReportSource).toContain("${BASE_URL}/checkout");
  });
});
