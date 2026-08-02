import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const globalsCssPath = path.join(process.cwd(), "src/app/globals.css");
const css = fs.readFileSync(globalsCssPath, "utf8");

// Scaffold test (Plan 06-01) — expected to FAIL/RED until Plan 06-02 replaces
// the dark legacy token set with the new semantic-scale token system.

describe("token naming (semantic-scale) — src/app/globals.css", () => {
  const expectedPresent = [
    "--surface-1",
    "--surface-2",
    "--surface-3",
    "--surface-4",
    "--ink-1",
    "--ink-2",
    "--ink-3",
    "--accent",
    "--accent-hover",
    "--accent-active",
    "--success",
    "--error",
    "--warn",
    "--border-1",
    "--border-2",
    "--fontSize-1",
    "--fontSize-2",
    "--fontSize-3",
    "--fontSize-4",
    "--fontSize-5",
    "--fontSize-6",
    "--fontSize-7",
    "--spacing-1",
    "--spacing-2",
    "--spacing-3",
    "--spacing-4",
    "--spacing-5",
    "--spacing-6",
    "--radius-1",
    "--radius-2",
    "--radius-3",
    "--shadow-1",
    "--shadow-2",
    "--shadow-3",
    "--duration-1",
    "--duration-2",
    "--duration-3",
  ];

  it.each(expectedPresent)("defines token %s", (token) => {
    const pattern = new RegExp(`${token}\\s*:`);
    expect(css).toMatch(pattern);
  });

  const expectedAbsent = [
    "--bg-base",
    "--gold",
    "--text-primary",
    "--text-secondary",
    "--text-muted",
    "--font-serif",
    "--background:",
    "--foreground:",
    "--muted:",
  ];

  it.each(expectedAbsent)("does not define legacy token %s", (token) => {
    expect(css).not.toContain(token);
  });
});
