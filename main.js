import { dependencyGraphContent, indexContent } from './content';

// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

/**
 * Ensures the element has an id, adding one if it doesn't exist
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
 * Adds an aria-label to an element if it doesn't already have one
 * @param {HTMLElement} element - The element to add aria-label to
 * @param {string} label - The label text
 */
function addAriaLabel(element, label) {
  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
}

/**
 * Renders dependency graphs for the given element
 * @param {HTMLElement} container - The container element
 * @param {Object} dependencies - The dependency data
 */
function renderDependencyGraphs(container, dependencies) {
  if (dependencies && dependencies.length > 0) {
    const graphContent = dependencyGraphContent(dependencies);
    container.innerHTML = graphContent;
  }
}