// main.js - Helper utilities for accessibility fixes

/**
 * Checks if the given JSX/TSX content has a <main> landmark
 * @param {string} content - File content to check
 * @returns {boolean} - True if <main> landmark exists
 */
function hasMainLandmark(content) {
  const mainRegex = /<main[\s>]/gi;
  return mainRegex.test(content);
}

/**
 * Wraps children in a <main> landmark
 * @param {string} content - File content to modify
 * @param {string} childrenTag - The tag containing main children (e.g., 'body', 'div')
 * @returns {string} - Modified content with <main> landmark
 */
function addMainLandmark(content, childrenTag = 'children') {
  // Pattern to find <body>{children}</body> or <div>{children}</div>
  const bodyPattern = /<(\w+)>\s*\{(\w+)\}\s*<\/\1>/g;
  
  return content.replace(bodyPattern, (match, tag, children) => {
    if (tag === 'body' || tag === 'div' || tag === 'section') {
      return `<${tag}>\n    <main>\n        {${children}}\n    </main>\n</${tag}>`;
    }
    return match;
  });
}

/**
 * Escapes HTML entities in a string
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
function escapeHtml(str) {
  const htmlEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.split('').map(char => htmlEscapeMap[char] || char).join('');
}

/**
 * Checks if SVG elements in the content have accessible names
 * An SVG has an accessible name if it has aria-label, aria-labelledby, a <title> child, or aria-hidden="true"
 * @param {string} content - File content to check
 * @returns {boolean} - True if all SVG elements have accessible names
 */
function hasSvgAccessibleNames(content) {
  // Match SVG elements that don't have accessible name attributes
  const svgWithoutAccessibleName = /<svg(?![^>]*\b(?:aria-label|aria-labelledby|aria-hidden)\b)[^>]*>/gi;
  return !svgWithoutAccessibleName.test(content);
}

/**
 * Adds aria-hidden="true" to SVG elements without accessible names (decorative SVGs)
 * @param {string} content - File content to modify
 * @returns {string} - Modified content with aria-hidden on decorative SVGs
 */
function addSvgAccessibleName(content) {
  // Match SVG elements that don't have aria-label, aria-labelledby, or aria-hidden
  const svgWithoutAccessibleName = /<svg(?![^>]*\b(?:aria-label|aria-labelledby|aria-hidden)\b)([^>]*)>/gi;
  
  return content.replace(svgWithoutAccessibleName, (match, attrs) => {
    // Add aria-hidden="true" for decorative SVGs
    return `<svg aria-hidden="true"${attrs}>`;
  });
}

/**
 * Checks if a specific SVG element has an accessible name
 * @param {string} svgElement - The SVG element string to check
 * @returns {boolean} - True if the SVG has an accessible name
 */
function svgHasAccessibleName(svgElement) {
  const hasAriaLabel = /aria-label\s*=/i.test(svgElement);
  const hasAriaLabelledby = /aria-labelledby\s*=/i.test(svgElement);
  const hasTitle = /<title[\s>]/i.test(svgElement);
  const isAriaHidden = /aria-hidden\s*=\s*["']true["']/i.test(svgElement);
  
  return hasAriaLabel || hasAriaLabelledby || hasTitle || isAriaHidden;
}

// Export utilities for testing
module.exports = {
  hasMainLandmark,
  addMainLandmark,
  escapeHtml,
  hasSvgAccessibleNames,
  addSvgAccessibleName,
  svgHasAccessibleName
};