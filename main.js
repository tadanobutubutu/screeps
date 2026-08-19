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
    // Check if this is a row header (based on class or other attributes)
    if (match.includes('class="row-header"') || match.includes('scope="row"')) {
      return match.replace(/^<th/, '<th scope="row"');
    }
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
 * Adds scope attributes to all <th> elements in the content
 * @param {string} content - HTML/JSX content containing table headers
 * @returns {string} - Content with scope attributes added to all <th> elements
 */
function addScopeToAllHeaders(content) {
  // First add scope="col" to all headers that don't have a scope
  let result = addScopeToColumnHeaders(content);

  // Then specifically handle row headers
  result = addScopeToRowHeaders(result);

  return result;
}

// Export all functions
module.exports = {
  addScopeToColumnHeaders,
  addScopeToRowHeaders,
  fixTableHeadersAccessibility,
  validateTableHeaders,
  addScopeToAllHeaders
};