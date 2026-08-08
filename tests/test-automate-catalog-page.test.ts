import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import * as CatalogPage from "../src/app/automate/page";

describe("src/app/automate/page.tsx metadata", () => {
  it("has the catalog page title", () => {
    expect(CatalogPage.metadata.title).toBe("Automations Catalog | Asor Ahura");
  });

  it("has the catalog page description", () => {
    expect(CatalogPage.metadata.description).toBe(
      "Five ready-made automations for small businesses and creators. Start with one, scale to all five."
    );
  });
});

describe("src/app/automate/page.tsx source", () => {
  const contents = readFileSync(
    path.resolve(__dirname, "../src/app/automate/page.tsx"),
    "utf-8"
  );

  it("imports CatalogGrid", () => {
    expect(contents).toContain("CatalogGrid");
  });

  it("does not import the Instagram-specific PricingSection", () => {
    expect(contents).not.toContain("PricingSection");
  });

  it("does not import the Instagram-specific TryItNowSection", () => {
    expect(contents).not.toContain("TryItNowSection");
  });
});
