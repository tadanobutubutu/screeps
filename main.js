// Original content from main.js
// ... [Any existing code here] ...

// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

/**
 * Ensures the element has an id. If the element doesn't have an id,
 * generates one and assigns it to the element.
 * @param {HTMLElement} element - The element to check and modify
 * @param {string} [prefix='element'] - Prefix for the generated id
 * @returns {string} The element's id (existing or newly generated)
 */
function ensureElementHasId(element, prefix = 'element') {
  // ... [Existing ensureElementHasId implementation] ...
}

/**
 * Adds an aria-label attribute to the element if it doesn't already have one.
 * @param {HTMLElement} element - The element to modify
 * @param {string} label - The aria-label value to set
 * @returns {boolean} True if label was added, false if element already had one
 */
function addAriaLabel(element, label) {
  // ... [Existing addAriaLabel implementation] ...
}

/**
 * Renders dependency graphs for the given configuration.
 * @param {HTMLElement} container - The container element to render into
 * @param {Object} dependencies - The dependencies data to render
 * @param {Object} [options={}] - Optional rendering configuration
 * @returns {Object} The rendered graph instance
 */
function renderDependencyGraphs(container, dependencies, options = {}) {
  // ... [Existing renderDependencyGraphs implementation] ...
}

// TODO: Implement the new function as per the issue requirements

/**
 * Checks if the element has accessible naming (via id, aria-label, or aria-labelledby).
 * @param {HTMLElement} element - The element to check
 * @returns {Object} Object with hasAccessibleName boolean and namingMethods array
 */
function checkElementAccessibility(element) {
  if (!element) {
    throw new Error('Element is required');
  }
  
  const namingMethods = [];
  
  if (element.id) {
    namingMethods.push('id');
  }
  if (element.getAttribute('aria-label')) {
    namingMethods.push('aria-label');
  }
  if (element.getAttribute('aria-labelledby')) {
    namingMethods.push('aria-labelledby');
  }
  
  return {
    hasAccessibleName: namingMethods.length > 0,
    namingMethods: namingMethods
  };
}

// ... [Any other existing code here] ...

// Export functions for testing and external use
module.exports = {
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs,
  checkElementAccessibility
};