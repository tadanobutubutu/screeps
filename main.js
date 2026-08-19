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
 * Ensures only one <main> element exists in the content
 * @param {string} content - HTML/JSX content to check
 * @returns {string} - Content with only one <main> element
 */
function ensureSingleMainElement(content) {
  // Count all <main> elements in the content
  const mainElements = content.match(/<main\b[^>]*>/gi) || [];
  const mainCount = mainElements.length;

  if (mainCount <= 1) {
    return content; // No change needed
  }

  // If multiple <main> elements exist, keep the first one and remove others
  let firstMainFound = false;
  return content.replace(/<main\b[^>]*>/gi, (match) => {
    if (!firstMainFound) {
      firstMainFound = true;
      return match; // Keep the first <main>
    }
    return ''; // Remove subsequent <main> elements
  });
}

/**
 * Validates that only one <main> element exists in the content
 * @param {string} content - HTML/JSX content to validate
 * @returns {boolean} - True if only one <main> element exists
 */
function validateSingleMainElement(content) {
  const mainElements = content.match(/<main\b[^>]*>/gi) || [];
  return mainElements.length <= 1;
}

// Export all functions
module.exports = {
  addScopeToColumnHeaders,
  addScopeToRowHeaders,
  fixTableHeadersAccessibility,
  validateTableHeaders,
  ensureSingleMainElement,
  validateSingleMainElement
};