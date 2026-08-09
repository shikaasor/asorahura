import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

describe("Footer enterprise reachability", () => {
  const contents = readFileSync(
    path.resolve(__dirname, "../src/components/home/Footer.tsx"),
    "utf-8"
  );

  it("contains a link to /enterprise", () => {
    expect(contents).toContain('href="/enterprise"');
  });
});

describe("Navigation enterprise reachability", () => {
  const contents = readFileSync(
    path.resolve(__dirname, "../src/components/Navigation.tsx"),
    "utf-8"
  );

  it("contains exactly two links to /enterprise (desktop + mobile)", () => {
    const matches = contents.match(/href="\/enterprise"/g) ?? [];
    expect(matches.length).toBe(2);
  });

  it("does not style the desktop enterprise link with the .cta class", () => {
    expect(contents).not.toContain("styles.cta}>Enterprise");
  });

  it("does not style the mobile enterprise link with the .mobileCta class", () => {
    expect(contents).not.toContain("mobileCta}>Enterprise");
  });
});
