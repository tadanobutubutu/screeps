// Dependency imports
const { dependencyGraphContent } = require('./dependencyGraphContent');
const { indexContent } = require('./indexContent');

// Existing rendering functions (preserving existing exports and functions)

/**
 * Renders the dependency graph view
 * @param {Object} deps - Dependencies object
 * @param {Object} options - Rendering options
 * @returns {string} Rendered dependency graph HTML
 */
function renderDependencyGraph(deps, options = {}) {
  // Use dependencyGraphContent from the imported module
  return dependencyGraphContent(deps, options);
}

/**
 * Renders the main index view
 * @param {Object} data - View data
 * @param {Object} options - Rendering options
 * @returns {string} Rendered index HTML
 */
function renderIndex(data, options = {}) {
  // Use indexContent from the imported module
  return indexContent(data, options);
}

// New function to ensure the element has an id and add aria-label
/**
 * Ensures that the element has an id and adds an aria-label attribute if it doesn't have one
 * @param {Element} element - The element to check and modify
 * @param {string} label - The label text for the aria-label attribute
 */
function ensureElementIdAndAriaLabel(element, label) {
  if (!element.id) {
    element.id = 'unique-id'; // Assign a unique ID if none exists
  }
  element.setAttribute('aria-label', label);
}

// Preserve all existing exports
module.exports = {
  renderDependencyGraph,
  renderIndex,
  ensureElementIdAndAriaLabel,
  // Preserve any other existing exports here
};