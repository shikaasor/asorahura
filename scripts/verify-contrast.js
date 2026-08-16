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

// Tokens that name a colour but are never a solid foreground/background
// pair on their own: gradients, and low-alpha washes that always composite
// over a surface rather than replacing it. Checking them yields a ratio
// against a colour the user never actually sees.
const NON_PAIRING_TOKENS = new Set([
  "--accent-sheen",
  "--accent-tint",
  "--accent-tint-strong",
]);

// Foreground tokens that are only ever used on the light --paper panels,
// never on the dark canvas. Same class of wrong-pairing error the accent
// note below describes, in the other direction.
const PAPER_INKS = new Set(["--ink-on-paper"]);

// Given a token map, normalizes ink/surface/semantic color tokens to RGB,
// computes contrast ratios for the pairings that actually occur in the UI,
// and validates against the WCAG floor. Returns { failures }.
function checkContrast(tokens) {
  const colors = {};
  const failures = [];

  Object.entries(tokens).forEach(([name, value]) => {
    const isRelevant =
      name.startsWith("--ink-") ||
      name.startsWith("--surface-") ||
      name.startsWith("--accent") ||
      name === "--cream" ||
      name === "--on-accent" ||
      name === "--paper" ||
      name === "--paper-2" ||
      name === "--success" ||
      name === "--error" ||
      name === "--warn";
    if (!isRelevant || NON_PAIRING_TOKENS.has(name)) return;

    const parsed = parseColor(value);
    if (parsed && parsed.values) {
      colors[name] = parsed.values.slice(0, 3).map((v) => Math.round(v));
    } else {
      failures.push(`${name}: unable to parse color value, skipping contrast check`);
    }
  });

  const surfaces = Object.keys(colors).filter((k) => k.startsWith("--surface-"));
  const papers = Object.keys(colors).filter((k) => k.startsWith("--paper"));
  const inks = Object.keys(colors).filter(
    (k) => (k.startsWith("--ink-") || k === "--cream") && !PAPER_INKS.has(k)
  );
  const paperInks = Object.keys(colors).filter((k) => PAPER_INKS.has(k));
  // --accent-ink / --accent-on-ink are the accent used AS TEXT; the bare
  // --accent family is the accent used as a FILL. They need opposite checks.
  const accentText = Object.keys(colors).filter(
    (k) => k === "--accent-ink" || k === "--accent-on-ink"
  );
  const accentFills = Object.keys(colors).filter(
    (k) => k.startsWith("--accent") && !accentText.includes(k)
  );
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

  paperInks.forEach((ink) => {
    papers.forEach((paper) => checkPair(ink, paper, 4.5));
  });

  // Accent fill tokens are backgrounds (CTA button fills), not foreground
  // text — checking them against surfaces tests the wrong pairing
  // (accent-as-text) and both misses the real risk and over-flags a pairing
  // that never occurs in the UI. The component pairing is --on-accent text
  // on an --accent* fill, so that's what gets validated. (This was --ink-1
  // when the accent was a mid gold; the accent is now light enough that
  // --ink-1 on it would be unreadable, which is exactly what --on-accent
  // exists to prevent.)
  if (colors["--on-accent"]) {
    accentFills.forEach((accent) => checkPair("--on-accent", accent, 4.5));
  } else {
    failures.push("--on-accent: token missing, cannot verify accent button text contrast");
  }

  // The accent-as-text tokens get the ordinary foreground treatment.
  accentText.forEach((accent) => {
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
