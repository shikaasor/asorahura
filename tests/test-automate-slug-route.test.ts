import { describe, it, expect } from "vitest";
import * as SlugPage from "../src/app/automate/[slug]/page";
import { getWaitlistOfferingSlugs, getOfferingBySlug } from "../src/lib/checkout";

describe("generateStaticParams", () => {
  it("resolves to exactly the 4 waitlist offering slugs, excluding instagram", async () => {
    const params = await SlugPage.generateStaticParams();

    expect(params).toHaveLength(4);

    const slugs = params.map((p) => p.slug).sort();
    const expectedSlugs = [...getWaitlistOfferingSlugs()].sort();

    expect(slugs).toEqual(expectedSlugs);
    expect(slugs).not.toContain("instagram");
  });
});

describe("generateMetadata", () => {
  it.each(getWaitlistOfferingSlugs())(
    'returns correct title and description for "%s"',
    async (slug) => {
      const metadata = await SlugPage.generateMetadata({
        params: Promise.resolve({ slug }),
      });
      const offering = getOfferingBySlug(slug)!;

      expect(metadata.title).toBe(`${offering.name} | Asor Ahura`);
      expect(metadata.title as string).toMatch(/ \| Asor Ahura$/);
      expect(metadata.description).toBe(offering.description);
    }
  );

  it("returns an empty object for an unknown slug", async () => {
    const metadata = await SlugPage.generateMetadata({
      params: Promise.resolve({ slug: "not-a-real-slug" }),
    });

    expect(metadata).toEqual({});
  });
});

describe("dynamicParams", () => {
  it("is set to false", () => {
    expect(SlugPage.dynamicParams).toBe(false);
  });
});
