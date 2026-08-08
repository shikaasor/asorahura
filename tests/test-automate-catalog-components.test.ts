import { describe, it, expect } from "vitest";
import Breadcrumb from "../src/components/automate/Breadcrumb";

describe("Breadcrumb", () => {
  it("module loads without throwing", () => {
    expect(typeof Breadcrumb).toBe("function");
  });
});
