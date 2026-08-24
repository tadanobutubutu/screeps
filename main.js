/**
 * Main JavaScript Module
 * This file handles the SVG icon accessible name fixes for React SVG accessibility rule REACT_041
 */

/**
 * Check if an SVG element has an accessible name
 * An SVG has an accessible name if it has:
 * - An aria-label attribute
 * - A <title> child element
 * - aria-hidden="true" (for decorative SVGs)
 * 
 * @param {string} svgContent - The SVG markup string
 * @returns {boolean} - True if the SVG has an accessible name
 */
function hasAccessibleName(svgContent) {
  // Check for aria-label attribute
  const hasAriaLabel = /aria-label\s*=/i.test(svgContent);
  
  // Check for title child element
  const hasTitleChild = /<title[^>]*>/i.test(svgContent);
  
  // Check for aria-hidden
  const hasAriaHidden = /aria-hidden\s*=\s*["']true["']/i.test(svgContent);
  
  return hasAriaLabel || hasTitleChild || hasAriaHidden;
}

/**
 * Add accessible name to an SVG element
 * Adds a <title> element with appropriate id for accessibility
 * 
 * @param {string} svgContent - The SVG markup string
 * @param {string} titleText - The text for the title element
 * @returns {string} - The SVG with accessible name added
 */
function addAccessibleName(svgContent, titleText = 'Icon') {
  // If already has accessible name, return as-is
  if (hasAccessibleName(svgContent)) {
    return svgContent;
  }
  
  // Add title element after opening <svg> tag
  const titleId = 'svg-title-' + Math.random().toString(36).substr(2, 9);
  const titleElement = `<title id="${titleId}">${titleText}</title>`;
  
  // Insert title after <svg> opening tag
  let result = svgContent.replace(
    /<svg([^>]*)>/i,
    `<svg$1 aria-labelledby="${titleId}">${titleElement}`
  );
  
  return result;
}

/**
 * Mark SVG as decorative (hidden from screen readers)
 * Use this for purely decorative icons that don't convey meaning
 * 
 * @param {string} svgContent - The SVG markup string
 * @returns {string} - The SVG marked as decorative
 */
function markAsDecorative(svgContent) {
  // If already has accessible name, return as-is
  if (hasAccessibleName(svgContent)) {
    return svgContent;
  }
  
  // Add aria-hidden attribute to make it decorative
  let result = svgContent;
  
  // Check if the SVG already has attributes
  if (/<svg[^>]*>/i.test(result)) {
    result = result.replace(
      /<svg([^>]*)>/i,
      (match, attrs) => {
        // Check if aria-hidden is already present
        if (/aria-hidden/i.test(attrs)) {
          return match; // Don't modify if already present
        }
        // Add aria-hidden at the end of attributes
        return `<svg${attrs} aria-hidden="true">`;
      }
    );
  }
  
  return result;
}

// Export functions for external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    hasAccessibleName,
    addAccessibleName,
    markAsDecorative
  };
}

// Files to be fixed according to REACT_041:
// 1. app/layout.tsx - Add accessible name to favicon SVG
// 2. dashboard/app/layout.tsx - Add accessible name to favicon SVG