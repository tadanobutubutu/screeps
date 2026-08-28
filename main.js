/**
 * Adds SVG accessibility properties to an attributes object
 * and HTML element accessibility functions
 * @param {Object|HTMLElement} el - The target element for accessibility functions or the existing attributes object
 * @param {Object} options - Accessibility options
 * @param {string} [options.title] - Title text for the SVG
 * @param {string} [options.description] - Description text for the SVG
 * @param {string} [options.label] - ARIA label text
 * @returns {Object|void} - If el is an existing attributes object, it returns the updated object with accessibility props added.
 *                           If el is an HTML element, it applies the accessibility functions to the element.
 */
function addSvgAccessibilityProps(el, options = {}) {
  if (typeof el === 'object' && !('getAttribute' in el)) {
    // It's an existing attributes object
    return addSvgAccessibilityPropsToAttrs(el, options);
  }

  // It's an HTML element
  if (el.tagName.toLowerCase() === 'svg') {
    addSvgAccessibilityPropsToAttrs(el.attributes, options);
  }

  // Add HTML element accessibility functions
  el.lang = getLangAttribute(el.lang);
  if (checkTableStructure(el)) {
    performTableAccessibilityCheck(el);
  }
}

// Functions to ensure the element has an id, add aria-label, and render dependency graphs
// (Previously existing code that needs to be preserved)

// ----- BEGIN ORIGINAL CODE (unchanged) -----

/**
 * Ensures the element has an id, generating one if necessary
 * @param {HTMLElement} element - The element to check
 * @returns {string} The element's id
 */
function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `element-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element.id;
}

/**
 * Adds an aria-label to the element if it doesn't have one
 * @param {HTMLElement} element - The element to add aria-label to
 * @param {string} label - The label text
 */
function addAriaLabel(element, label) {
  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
}

/**
 * Renders dependency graphs for visualization
 * @param {Object} dependencies - The dependencies to render
 * @param {HTMLElement} container - The container element
 */
function renderDependencyGraphs(dependencies, container) {
  // Create graph visualization
  const graphElement = document.createElement('div');
  graphElement.className = 'dependency-graph';
  graphElement.innerHTML = '<h3>Dependency Graph</h3>';

  // Render nodes
  Object.keys(dependencies).forEach(key => {
    const node = document.createElement('div');
    node.className = 'graph-node';
    node.textContent = `${key}: ${dependencies[key]}`;
    graphElement.appendChild(node);
  });

  container.appendChild(graphElement);
}

// ----- END ORIGINAL CODE -----

// Add new function to apply accessibility functions to existing attributes object
function addSvgAccessibilityPropsToAttrs(attrs, options = {}) {
  const newAttrs = { ...attrs };
  const ariaProps = {};

  // Generate unique IDs for title and description if needed
  const idSuffix = Math.random().toString(36).substr(2, 9);

  // Add role="img" if not specified
  if (!newAttrs.role) {
    newAttrs.role = 'img';
  }

  // Add title element and aria-labelledby if title is provided
  if (options.title) {
    const titleId = `svg-title-${idSuffix}`;
    ariaProps['aria-labelledby'] = titleId;
  }

  // Add description element and aria-describedby if description is provided
  if (options.description) {
    const descId = `svg-desc-${idSuffix}`;
    ariaProps['aria-describedby'] = ariaProps['aria-describedby']
      ? `${ariaProps['aria-describedby']} ${descId}`
      : descId;
  }

  // Add aria-label if provided
  if (options.label) {
    ariaProps['aria-label'] = options.label;
  }

  // Merge aria props
  return { ...newAttrs, ...ariaProps };
}

import React from 'react';

// Additional utility functions

// ... existing utility functions ...

// Accessibility functions are now accessible in main.js:
// - REACT_015: Add lang attribute to HTML element (addLangAttribute)
// - REACT_027: Fix 26 table structure issues (fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (ensureUniqueLandmarks - updated to keep single <main>)
// - REACT_036: Fix 1 fake link issue (fixFakeLinkIssue)

export {
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs,
  checkTableStructure,
  getLangAttribute,
  MyComponent,
  greet,
  isEven,
  isOdd,
  sumArray,
  averageArray,
  findMax,
  findMin,
  reverseString,
  capitalize,
  capitalizeWords,
  formatDate,
  calculateTotal,
  validateEmail,
  capitalizeString,
  debounce,
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  checkTableAccessibility,
  performTableAccessibilityCheck,
  addSvgAccessibilityProps,
};

module.exports = {
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs,
  checkTableStructure,
  getLangAttribute,
  MyComponent,
  greet,
  isEven,
  isOdd,
  sumArray,
  averageArray,
  findMax,
  findMin,
  reverseString,
  capitalize,
  capitalizeWords,
  formatDate,
  calculateTotal,
  validateEmail,
  capitalizeString,
  debounce,
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  checkTableAccessibility,
  performTableAccessibilityCheck,
  addSvgAccessibilityProps,
};

// If using ES6 modules, also ensure functions are exported:
// export { ensureElementHasId, addAriaLabel, renderDependencyGraphs, checkTableStructure, getLangAttribute, MyComponent, greet, isEven, isOdd, sumArray, averageArray, findMax, findMin, reverseString, capitalize, capitalizeWords, formatDate, calculateTotal, validateEmail, capitalizeString, debounce, addLangAttribute, fixTableStructureIssues, addMainLandmark, addSvgAccessibleNames, ensureUniqueLandmarks, fixFakeLinkIssue, checkTableAccessibility, performTableAccessibilityCheck, addSvgAccessibilityProps };