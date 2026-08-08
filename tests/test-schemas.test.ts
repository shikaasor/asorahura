import { describe, it, expect } from "vitest";
import { buildMapSchema, automateSuccessSchema } from "../src/lib/schemas";

describe("buildMapSchema", () => {
  it("accepts a valid email", () => {
    expect(buildMapSchema.safeParse({ email: "valid@example.com" }).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(buildMapSchema.safeParse({ email: "not-an-email" }).success).toBe(false);
  });
});

describe("automateSuccessSchema", () => {
  it("accepts valid onboarding data", () => {
    expect(
      automateSuccessSchema.safeParse({
        igHandle: "@creator",
        keyword: "AUTOMATE",
        leadMagnetLink: "https://bit.ly/x",
        voiceTone: "Casual and funny, Gen Z audience",
      }).success
    ).toBe(true);
  });

  it("rejects invalid onboarding data", () => {
    expect(
      automateSuccessSchema.safeParse({
        igHandle: "",
        keyword: "x",
        leadMagnetLink: "not-a-url",
        voiceTone: "short",
      }).success
    ).toBe(false);
  });
});
