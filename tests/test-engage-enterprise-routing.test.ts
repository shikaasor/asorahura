import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const actionsSource = readFileSync(join(process.cwd(), "src/app/engage/actions.ts"), "utf-8");
const pageSource = readFileSync(join(process.cwd(), "src/app/engage/page.tsx"), "utf-8");

describe("engage enterprise-gated routing", () => {
  it("actions.ts does not gate the redirect on score thresholds", () => {
    expect(actionsSource).not.toContain("score >= 70");
    expect(actionsSource).not.toContain("score >= 40");
  });

  it("actions.ts reads the enterprise flag from form data", () => {
    expect(actionsSource).toContain('formData.get("enterprise")');
  });

  it("actions.ts redirects to both Calendly and the confirmation page", () => {
    expect(actionsSource).toContain('redirect("https://calendly.com/asorahura")');
    expect(actionsSource).toContain('redirect("/engage/confirmation")');
  });

  it("page.tsx reads the enterprise search param and submits it as a hidden field", () => {
    expect(pageSource).toContain('get("enterprise")');
    expect(pageSource).toContain('name="enterprise"');
  });
});
