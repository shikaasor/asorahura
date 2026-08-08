import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import nextConfig from "../next.config.mjs";

async function getRedirects() {
  if (!nextConfig.redirects) throw new Error("next.config.mjs has no redirects() function");
  return nextConfig.redirects();
}

describe("next.config.mjs redirects()", () => {
  it("includes a redirect from /automate/success to /automate/instagram/success", async () => {
    const redirects = await getRedirects();

    expect(redirects).toContainEqual(
      expect.objectContaining({
        source: "/automate/success",
        destination: "/automate/instagram/success",
        permanent: true,
      })
    );
  });

  it("still contains the existing /flowmorph redirect, unchanged", async () => {
    const redirects = await getRedirects();

    expect(redirects).toContainEqual(
      expect.objectContaining({
        source: "/flowmorph",
        destination: "/",
        permanent: true,
      })
    );
  });

  it("has exactly 2 redirect entries", async () => {
    const redirects = await getRedirects();

    expect(redirects).toHaveLength(2);
  });

  it("has no redirect destination that equals another redirect's source (no chain/loop)", async () => {
    const redirects = await getRedirects();
    const sources = new Set(redirects.map((r) => r.source));

    for (const redirect of redirects) {
      expect(sources.has(redirect.destination)).toBe(false);
    }
  });
});

describe("hardcoded reference fixes", () => {
  it("paddle webhook route references /automate/instagram for Plausible attribution", () => {
    const contents = readFileSync(
      path.resolve(__dirname, "../src/app/api/paddle/webhook/route.ts"),
      "utf-8"
    );

    expect(contents).toContain("/automate/instagram");
  });

  it("OrderNotification email references /automate/instagram/success", () => {
    const contents = readFileSync(
      path.resolve(__dirname, "../src/emails/OrderNotification.tsx"),
      "utf-8"
    );

    expect(contents).toContain("/automate/instagram/success");
  });
});
