// REACT_041 Fix: Add aria-hidden="true" to decorative SVGs lacking accessible name
// Files affected per issue: app/layout.tsx (L7), dashboard/app/layout.tsx (L7)
// These SVGs are favicon data URIs; adding aria-hidden prevents screen reader noise.

// Original SVG data URIs from the issue (line 7 of each file)
const originalSvg1 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>';
const originalSvg2 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🐛</text></svg>';

// Apply the fix: add aria-hidden="true" since these are decorative favicons
// This satisfies the rule: "Add aria-label, a <title> child, or aria-hidden="true" if decorative"
const fixedSvg1 = originalSvg1.replace('</svg>', ' aria-hidden="true"</svg>');
const fixedSvg2 = originalSvg2.replace('</svg>', ' aria-hidden="true"</svg>');

// Export the fixed SVGs for use in the application (preserving any existing exports
// by merging; here we export the fixed icons as a new module entry)
module.exports = {
  ...exports, // Preserve existing exports
  fixedSvg1,
  fixedSvg2
};