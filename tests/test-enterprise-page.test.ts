import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import * as EnterprisePage from "../src/app/enterprise/page";

describe("src/app/enterprise/page.tsx metadata", () => {
  it("has the enterprise page title", () => {
    expect(EnterprisePage.metadata.title).toBe(
      "Enterprise AI Automation Solutions | Asor Ahura"
    );
  });

  it("has the enterprise page description", () => {
    expect(EnterprisePage.metadata.description).toBe(
      "Custom scoping for regulated industries with compliance-aware implementation."
    );
  });
});

describe("src/app/enterprise/page.tsx source", () => {
  const contents = readFileSync(
    path.resolve(__dirname, "../src/app/enterprise/page.tsx"),
    "utf-8"
  );

  it("contains all four regulated vertical names", () => {
    expect(contents).toContain("Law");
    expect(contents).toContain("Finance");
    expect(contents).toContain("Real Estate & Property");
    expect(contents).toContain("Construction");
  });

  it("links to the enterprise engagement CTA", () => {
    expect(contents).toContain("/engage?enterprise=true");
  });

  it("links to /services", () => {
    expect(contents).toContain("/services");
  });

  it("links to /work", () => {
    expect(contents).toContain("/work");
  });
});
