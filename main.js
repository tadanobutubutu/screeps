/**
 * React Table Structure Accessibility Fix
 * Adds scope attributes to <th> elements for REACT_027 rule compliance
 */

// Regex patterns for matching <th> elements without scope attribute
const TH_WITHOUT_SCOPE_COL = /<th(?![^>]*\bscope=)(?![^>]*\bclass="[^"]*row-header[^"]*")[^>]*>/gi;
const TH_WITHOUT_SCOPE_ROW = /<th(?![^>]*\bscope=)(?![^>]*\bclass="[^"]*col-header[^"]*")[^>]*>/gi;

/**
 * Adds scope="col" to header cells that don't have a scope attribute
 * @param {string} content - HTML/JSX content containing table headers
 * @returns {string} - Content with scope="col" added to appropriate <th> elements
 */
function addScopeToColumnHeaders(content) {
  return content.replace(TH_WITHOUT_SCOPE_COL, (match) => {
    if (match.includes('scope=')) return match;
    return match.replace(/^<th/, '<th scope="col"');
  });
}

/**
 * Adds scope="row" to row header cells that don't have a scope attribute
 * @param {string} content - HTML/JSX content containing table headers
 * @returns {string} - Content with scope="row" added to appropriate <th> elements
 */
function addScopeToRowHeaders(content) {
  return content.replace(TH_WITHOUT_SCOPE_ROW, (match) => {
    if (match.includes('scope=')) return match;
    return match.replace(/^<th/, '<th scope="row"');
  });
}

/**
 * Auto-detects and adds appropriate scope attributes to all <th> elements
 * @param {string} content - HTML/JSX content containing table headers
 * @returns {string} - Content with scope attributes added to all <th> elements
 */
function fixTableHeadersAccessibility(content) {
  // Match any <th> without scope attribute
  const thWithoutScope = /<th(?![^>]*\bscope=)[^>]*>/gi;

  return content.replace(thWithoutScope, (match) => {
    return match.replace(/^<th/, '<th scope="col"');
  });
}

/**
 * Validates that all <th> elements have scope attributes
 * @param {string} content - HTML/JSX content to validate
 * @returns {boolean} - True if all <th> elements have scope attributes
 */
function validateTableHeaders(content) {
  const thWithoutScope = /<th(?![^>]*\bscope=)[^>]*>/gi;
  return !thWithoutScope.test(content);
}

/**
 * Adds aria-hidden="true" to SVG elements that are decorative
 * @param {string} content - HTML/JSX content containing SVG elements
 * @returns {string} - Content with aria-hidden="true" added to decorative SVGs
 */
function addAriaHiddenToDecorativeSVGs(content) {
  // Match SVG elements that don't have aria-hidden or aria-label
  const decorativeSVG = /<svg(?![^>]*\baria-hidden="true")(?![^>]*\baria-label=)[^>]*>/gi;

  return content.replace(decorativeSVG, (match) => {
    if (match.includes('aria-hidden') || match.includes('aria-label')) return match;
    return match.replace(/^<svg/, '<svg aria-hidden="true"');
  });
}

/**
 * Validates that all non-decorative SVG elements have accessible names
 * @param {string} content - HTML/JSX content to validate
 * @returns {boolean} - True if all non-decorative SVGs have accessible names
 */
function validateSVGAccessibility(content) {
  // Match SVG elements that are not decorative but lack accessible names
  const nonDecorativeSVGWithoutName = /<svg(?![^>]*\baria-hidden="true")(?![^>]*\baria-label=)[^>]*>/gi;
  return !nonDecorativeSVGWithoutName.test(content);
}

// Export all functions
module.exports = {
  addScopeToColumnHeaders,
  addScopeToRowHeaders,
  fixTableHeadersAccessibility,
  validateTableHeaders,
  addAriaHiddenToDecorativeSVGs,
  validateSVGAccessibility
};