import { describe, it, expect } from "vitest";
import { formatMoney } from "../src/lib/money";

describe("formatMoney", () => {
  it("converts USD minor units to a readable amount", () => {
    expect(formatMoney("10000", "USD")).toBe("$100.00");
    expect(formatMoney("20000", "USD")).toBe("$200.00");
    expect(formatMoney("80000", "USD")).toBe("$800.00");
    expect(formatMoney("999", "USD")).toBe("$9.99");
  });

  it("does not divide zero-decimal currencies", () => {
    // JPY has no minor unit: 1000 is ¥1,000, not ¥10.00.
    expect(formatMoney("1000", "JPY")).toBe("¥1,000");
  });

  it("accepts a number as well as a string", () => {
    expect(formatMoney(50000, "USD")).toBe("$500.00");
  });

  it("returns the raw input rather than throwing on bad data", () => {
    expect(formatMoney("not-a-number", "USD")).toBe("not-a-number");
    expect(formatMoney("10000", "NOT_A_CURRENCY")).toBe("10000");
  });
});
