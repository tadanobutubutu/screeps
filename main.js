// Main.js - Accessibility fix for REACT_017 (React Landmarks)

/**
 * Wraps content in a <main> landmark for accessibility
 * @param {string} content - The content to wrap
 * @returns {string} - Content wrapped in <main> tags
 */
function wrapInMainLandmark(content) {
  return `<main>${content}</main>`;
}

/**
 * Ensures primary content has a main landmark
 * @param {string} content - The main content area
 * @returns {string} - Content with main landmark
 */
function generateMainContent(content) {
  if (!content.includes('<main>')) {
    return wrapInMainLandmark(content);
  }
  return content;
}

/**
 * Checks if content already has a main landmark
 * @param {string} content - HTML content to check
 * @returns {boolean} - True if main landmark exists
 */
function hasMainLandmark(content) {
  return /<main[\s>]/.test(content);
}

/**
 * Wraps content in main landmark if not already present
 * @param {string} content - Content to potentially wrap
 * @returns {string} - Processed content
 */
function processMainLandmark(content) {
  if (hasMainLandmark(content)) {
    return content;
  }
  return wrapInMainLandmark(content);
}

/**
 * Adds an accessible name to SVG elements for screen reader support
 * @param {string} svgContent - The SVG content string
 * @returns {string} - SVG with aria-label attribute added
 */
function addAccessibleNameToSVG(svgContent) {
  return `<svg ${svgContent} aria-label="Accessible description of the SVG"></svg>`;
}

// Note: Replace problematic SVG usage in app/layout.tsx and dashboard/app/layout.tsx
// with calls to addAccessibleNameToSVG() function

// Export all functions for testing and external use
module.exports = {
  wrapInMainLandmark,
  generateMainContent,
  hasMainLandmark,
  processMainLandmark,
  addAccessibleNameToSVG
};