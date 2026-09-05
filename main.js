import { dependencyGraphContent, indexContent } from './content';

// Ensure the element has an id, generating one if it doesn't exist
export function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `element-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element.id;
}

// Add aria-label to an element
export function addAriaLabel(element, label) {
  if (element && label) {
    element.setAttribute('aria-label', label);
  }
  return element;
}

// Render dependency graphs in the main.js context
export function renderDependencyGraphs(container) {
  if (container && dependencyGraphContent) {
    const graphContainer = document.createElement('div');
    graphContainer.innerHTML = dependencyGraphContent;
    container.appendChild(graphContainer.firstChild);
  }
}