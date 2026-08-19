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
 * Converts fake links (href="#") to proper buttons for better accessibility
 * @param {string} content - HTML/JSX content containing links
 * @returns {string} - Content with fake links converted to buttons
 */
function convertFakeLinksToButtons(content) {
  // Match <a> tags with href="#"
  const fakeLinkPattern = /<a\s+[^>]*href=["']#["'][^>]*>(.*?)<\/a>/gi;

  return content.replace(fakeLinkPattern, (match, linkText) => {
    // Extract attributes from the original <a> tag
    const attributes = match.match(/<a\s+([^>]*)>/i)[1];

    // Create a button with the same attributes (excluding href)
    const buttonAttributes = attributes.replace(/href=["']#["']/i, '');

    return `<button ${buttonAttributes}>${linkText}</button>`;
  });
}

// Export all functions
module.exports = {
  addScopeToColumnHeaders,
  addScopeToRowHeaders,
  fixTableHeadersAccessibility,
  validateTableHeaders,
  convertFakeLinksToButtons
};