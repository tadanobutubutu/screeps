// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

/**
 * Ensures the element has an id attribute, generating one if necessary
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
 * Adds aria-label to an element if it doesn't have one
 * @param {HTMLElement} element - The element to update
 * @param {string} label - The aria-label to add
 */
function addAriaLabel(element, label) {
  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
}

/**
 * Renders dependency graphs for the given data
 * @param {Object} data - The dependency data to render
 * @param {HTMLElement} container - The container element for the graph
 */
function renderDependencyGraphs(data, container) {
  if (!data || !container) {
    throw new Error('Data and container are required');
  }
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  
  container.innerHTML = '';
  container.appendChild(svg);
  
  return svg;
}

module.exports = {
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs
};