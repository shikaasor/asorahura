import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import Breadcrumb from "../src/components/automate/Breadcrumb";
import OfferingCard from "../src/components/automate/OfferingCard";
import CatalogGrid from "../src/components/automate/CatalogGrid";

describe("Breadcrumb", () => {
  it("module loads without throwing", () => {
    expect(typeof Breadcrumb).toBe("function");
  });
});

describe("OfferingCard", () => {
  it("module loads without throwing", () => {
    expect(typeof OfferingCard).toBe("function");
  });

  it("has exactly two top-level <Link occurrences (no nested anchors)", () => {
    const source = readFileSync(
      join(__dirname, "../src/components/automate/OfferingCard.tsx"),
      "utf-8"
    );
    const matches = source.match(/<Link/g) ?? [];
    expect(matches.length).toBe(2);
  });
});

describe("CatalogGrid", () => {
  it("module loads without throwing", () => {
    expect(typeof CatalogGrid).toBe("function");
  });

  it("renders one OfferingCard per entry in offerings via Object.values", () => {
    const source = readFileSync(
      join(__dirname, "../src/components/automate/CatalogGrid.tsx"),
      "utf-8"
    );
    expect(source).toContain("Object.values(offerings)");
  });
});
