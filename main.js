// main.js

// TODO: Implement a function to count dependencies
// This is a placeholder for the actual implementation

function countDependencies(dependencies) {
  if (!dependencies) {
    return 0;
  }
  
  if (Array.isArray(dependencies)) {
    return dependencies.length;
  }
  
  if (typeof dependencies === 'object') {
    return Object.keys(dependencies).length;
  }
  
  return 0;
}

/**
 * Ensures the element has an id attribute. If it doesn't, generates and sets one.
 * @param {HTMLElement} element - The element to check
 * @param {string} [prefix='element'] - Prefix for generated id
 * @returns {string} The element's id
 */
function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (!element.id) {
    element.id = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  return element.id;
}

/**
 * Adds an aria-label attribute to the element if it doesn't have one.
 * @param {HTMLElement} element - The element to modify
 * @param {string} label - The label text to set
 * @returns {HTMLElement} The modified element
 */
function addAriaLabel(element, label) {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
  
  return element;
}

/**
 * Renders dependency graphs in the specified container.
 * @param {HTMLElement|string} container - The container element or its id
 * @param {Object} options - Graph rendering options
 * @returns {Object} The rendered graph instance
 */
function renderDependencyGraphs(container, options = {}) {
  if (!container) {
    throw new Error('Container is required');
  }
  
  const containerElement = typeof container === 'string' 
    ? document.getElementById(container) 
    : container;
  
  if (!containerElement) {
    throw new Error(`Container element not found: ${container}`);
  }
  
  const {
    data = {},
    width = containerElement.clientWidth || 800,
    height = containerElement.clientHeight || 600,
    nodeSpacing = 100,
    rankSpacing = 80
  } = options;
  
  // Create SVG element for the graph
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.setAttribute('class', 'dependency-graph');
  
  containerElement.appendChild(svg);
  
  return {
    svg,
    container: containerElement,
    data,
    options: { nodeSpacing, rankSpacing }
  };
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    countDependencies,
    ensureElementHasId,
    addAriaLabel,
    renderDependencyGraphs
  };
}