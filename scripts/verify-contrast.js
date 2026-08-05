// scripts/verify-contrast.js
// WCAG 2.0 contrast verification for design tokens in src/app/globals.css.
// Usage: node scripts/verify-contrast.js
// Exit code 0: all pass, 1: failures found.

const fs = require("fs");
const postcss = require("postcss");
const parseColor = require("parse-css-color");

const GLOBALS_CSS_PATH = "src/app/globals.css";

// WCAG 2.0 Relative Luminance Formula
function getRelativeLuminance(r, g, b) {
  const toLinear = (c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const rL = toLinear(r);
  const gL = toLinear(g);
  const bL = toLinear(b);
  return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
}

// Contrast Ratio Formula: (L1 + 0.05) / (L2 + 0.05), lighter over darker
function getContrastRatio(L1, L2) {
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}

// Reads the tokens file from disk. On failure, throws a generic error that
// never interpolates the file path or file content (V7 mitigation).
function readTokensFile(path) {
  try {
    return fs.readFileSync(path, "utf8");
  } catch (err) {
    throw new Error("Unable to read design tokens file");
  }
}

// Parses a CSS string via PostCSS and extracts the :root custom property
// declarations as a flat { [customPropName]: value } map. Does not use
// regex line-matching per RESEARCH.md Pitfall 3 / "Don't Hand-Roll" guidance.
function parseTokens(cssString) {
  const root = postcss.parse(cssString);
  const tokens = {};
  root.walkRules(":root", (rule) => {
    rule.walkDecls((decl) => {
      if (decl.prop.startsWith("--")) {
        tokens[decl.prop] = decl.value.trim();
      }
    });
  });
  return tokens;
}

// Given a token map, normalizes ink/surface/semantic color tokens to RGB,
// computes contrast ratios for every ink x surface and semantic x surface
// pairing, and validates against the WCAG floor. Returns { failures }.
function checkContrast(tokens) {
  const colors = {};
  const failures = [];

  Object.entries(tokens).forEach(([name, value]) => {
    const isRelevant =
      name.startsWith("--ink-") ||
      name.startsWith("--surface-") ||
      name.startsWith("--accent") ||
      name === "--success" ||
      name === "--error" ||
      name === "--warn";
    if (!isRelevant) return;

    const parsed = parseColor(value);
    if (parsed && parsed.values) {
      colors[name] = parsed.values.slice(0, 3).map((v) => Math.round(v));
    } else {
      failures.push(`${name}: unable to parse color value, skipping contrast check`);
    }
  });

  const surfaces = Object.keys(colors).filter((k) => k.startsWith("--surface-"));
  const inks = Object.keys(colors).filter((k) => k.startsWith("--ink-"));
  const accents = Object.keys(colors).filter((k) => k.startsWith("--accent"));
  const semantics = Object.keys(colors).filter(
    (k) => k === "--success" || k === "--error" || k === "--warn"
  );

  function checkPair(tokenA, tokenB, minRatio) {
    const ratio = getContrastRatio(
      getRelativeLuminance(...colors[tokenA]),
      getRelativeLuminance(...colors[tokenB])
    );
    if (ratio < minRatio) {
      failures.push(
        `${tokenA} on ${tokenB}: ${ratio.toFixed(2)}:1 (required ${minRatio}:1)`
      );
    }
  }

  inks.forEach((ink) => {
    const minRatio = ink === "--ink-3" ? 3 : 4.5;
    surfaces.forEach((surface) => checkPair(ink, surface, minRatio));
  });

  accents.forEach((accent) => {
    surfaces.forEach((surface) => checkPair(accent, surface, 4.5));
  });

  semantics.forEach((semantic) => {
    surfaces.forEach((surface) => checkPair(semantic, surface, 4.5));
  });

  return { failures };
}

module.exports = {
  getRelativeLuminance,
  getContrastRatio,
  parseTokens,
  checkContrast,
  readTokensFile,
};

if (require.main === module) {
  let css;
  try {
    css = readTokensFile(GLOBALS_CSS_PATH);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  const tokens = parseTokens(css);
  const { failures } = checkContrast(tokens);

  if (failures.length > 0) {
    failures.forEach((f) => console.error(f));
    process.exit(1);
  } else {
    console.log("✓ All text/surface pairings pass WCAG AA");
    process.exit(0);
  }
}
