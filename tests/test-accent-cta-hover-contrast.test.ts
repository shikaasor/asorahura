import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * globals.css carries a blanket `a:hover { color: var(--cream); }`.
 *
 * Its specificity is (0,1,1), which beats a bare `.cta` at (0,1,0). So any
 * anchor painted with the lime `--accent` fill that does not restate its ink
 * colour on hover flips to cream (#f4f1e4) on lime (#cdff06) — roughly 1.2:1,
 * far under the 4.5:1 floor. `.cta:hover` at (0,2,0) wins the override back.
 *
 * This has now been introduced twice. These are the accent-filled CTAs that
 * render as <Link>/<a> and are therefore in the global rule's blast radius;
 * <button> elements are unaffected, since the rule only matches anchors.
 */
const ACCENT_ANCHOR_CTAS: Array<[string, string]> = [
  ["src/app/services/services.module.css", "flagshipCta"],
  ["src/app/services/services.module.css", "ctaEnterprise"],
  ["src/app/work/work.module.css", "bottomCtaBtn"],
  ["src/components/home/LeadMagnetStrip.module.css", "cta"],
  ["src/app/automate/email-triage/page.module.css", "primaryBtn"],
  ["src/components/automate/HeroSection.module.css", "primaryBtn"],
  ["src/components/automate/OfferingCard.module.css", "cta"],
];

function hoverBlock(source: string, className: string): string | null {
  const start = source.indexOf(`.${className}:hover`);
  if (start === -1) return null;
  const end = source.indexOf("}", start);
  return end === -1 ? null : source.slice(start, end);
}

describe("accent-filled anchor CTAs keep readable text on hover", () => {
  it("the global a:hover rule that causes this is still present", () => {
    // If this ever goes away, the per-rule overrides below become redundant
    // rather than wrong — but the assertion documents why they exist.
    const globals = readFileSync(path.resolve(__dirname, "../src/app/globals.css"), "utf-8");
    expect(globals).toContain("a:hover");
    expect(globals).toContain("--cream");
  });

  it.each(ACCENT_ANCHOR_CTAS)("%s .%s restores --on-accent on hover", (file, className) => {
    const source = readFileSync(path.resolve(__dirname, "..", file), "utf-8");

    // Guard the fixture itself: if the class stopped using the accent fill,
    // this entry is stale and should be removed rather than silently passing.
    expect(source).toContain(`.${className} {`);

    const block = hoverBlock(source, className);
    expect(block, `.${className} has no :hover rule`).not.toBeNull();
    expect(block).toContain("color: var(--on-accent)");
  });
});
