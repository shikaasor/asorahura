import { describe, it, expect } from "vitest";
import { metadata, default as PaletteReviewPage } from "../src/app/internal/palette-review/page";

describe("palette review route metadata", () => {
  it("sets robots.index to false and robots.follow to true", () => {
    expect(metadata.robots).toMatchObject({
      index: false,
      follow: true,
    });
  });
});

describe("palette review page component", () => {
  it("renders without throwing and returns a truthy React element", () => {
    const element = PaletteReviewPage();
    expect(element).toBeTruthy();
  });
});
