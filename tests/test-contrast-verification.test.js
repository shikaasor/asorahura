import { describe, it, expect } from "vitest";
import {
  getRelativeLuminance,
  getContrastRatio,
  parseTokens,
  checkContrast,
  readTokensFile,
} from "../scripts/verify-contrast.js";

describe("getRelativeLuminance + getContrastRatio", () => {
  it("black-on-white and white-on-black both yield 21:1 (±0.01)", () => {
    const whiteLum = getRelativeLuminance(255, 255, 255);
    const blackLum = getRelativeLuminance(0, 0, 0);

    const blackOnWhite = getContrastRatio(blackLum, whiteLum);
    const whiteOnBlack = getContrastRatio(whiteLum, blackLum);

    expect(blackOnWhite).toBeCloseTo(21, 1);
    expect(whiteOnBlack).toBeCloseTo(21, 1);
  });
});

describe("getContrastRatio", () => {
  // NOTE: the plan/RESEARCH.md's cited reference value of "~6.3:1" for
  // #888888-on-white is mathematically incorrect (a commonly repeated web
  // myth). The correct WCAG 2.0 relative-luminance formula, applied per the
  // W3C spec, yields ~3.54:1 for this pairing (matches WebAIM's contrast
  // checker). Per RESEARCH.md's own "ratios are deterministic and
  // non-negotiable" guidance, the formula is kept correct and this
  // assertion reflects the accurate value (Rule 1 auto-fix).
  it("mid-gray #888888 against white yields ~3.54:1", () => {
    const grayLum = getRelativeLuminance(136, 136, 136);
    const whiteLum = getRelativeLuminance(255, 255, 255);
    const ratio = getContrastRatio(grayLum, whiteLum);

    expect(ratio).toBeGreaterThanOrEqual(3.4);
    expect(ratio).toBeLessThanOrEqual(3.7);
  });
});

describe("parseTokens", () => {
  it("parses :root custom properties via PostCSS, not regex", () => {
    const css = `:root { --surface-1: #FDFAF4; --ink-1: #1F1B17; }`;
    const tokens = parseTokens(css);

    expect(tokens).toEqual({
      "--surface-1": "#FDFAF4",
      "--ink-1": "#1F1B17",
    });
  });
});

describe("checkContrast", () => {
  it("reports failures with token names and ratios, never file paths or content", () => {
    const tokens = {
      "--surface-1": "#FFFFFF",
      "--ink-1": "#CCCCCC", // low contrast against white surface
    };

    const { failures } = checkContrast(tokens);

    expect(failures.length).toBeGreaterThan(0);
    const failure = failures.find((f) => f.includes("--ink-1") && f.includes("--surface-1"));
    expect(failure).toBeDefined();
    expect(failure).toMatch(/--ink-1 on --surface-1: \d+\.\d{2}:1 \(required 4\.5:1\)/);
    expect(failure).not.toContain("globals.css");
    expect(failure).not.toContain("#CCCCCC");
  });
});

describe("file-read error handling (V7)", () => {
  it("throws a generic error that never contains the file path", () => {
    const nonexistentPath = "src/app/does-not-exist-globals.css";

    expect(() => readTokensFile(nonexistentPath)).toThrow();

    try {
      readTokensFile(nonexistentPath);
    } catch (err) {
      expect(err.message).not.toContain(nonexistentPath);
      expect(err.message).not.toContain("globals.css");
      expect(err.message).toBe("Unable to read design tokens file");
    }
  });
});
