// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
// main.js - Accessibility improvements implementation

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Ensures an element has an id attribute
 * If the element doesn't have an id, generates one
 * @param {HTMLElement} element - The DOM element to check
 * @param {string} [prefix='element'] - Prefix for generated id
 * @returns {string} The element's id
 */
function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (element.id) {
    return element.id;
  }
  
  const id = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  element.id = id;
  return id;
}

/**
 * Adds an aria-label attribute to an element if it doesn't have one
 * @param {HTMLElement} element - The DOM element
 * @param {string} label - The aria-label text
 * @returns {HTMLElement} The element with aria-label
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
 * Ensures element has id and adds aria-label for accessibility
 * @param {HTMLElement} element - The DOM element
 * @param {string} label - The aria-label text
 * @param {string} [prefix='element'] - Prefix for generated id
 * @returns {Object} Object containing element, id, and ariaLabel
 */
function ensureAccessibility(element, label, prefix = 'element') {
  const id = ensureElementHasId(element, prefix);
  addAriaLabel(element, label);
  
  return {
    element,
    id,
    ariaLabel: label
  };
}

// ============================================================================
// DEPENDENCY GRAPH RENDERING
// ============================================================================

/**
 * Renders dependency graph for visualization
 * @param {HTMLElement} container - The container element for the graph
 * @param {Array} dependencies - Array of dependency objects
 * @returns {HTMLElement} The rendered graph element
 */
function renderDependencyGraph(container, dependencies = []) {
  if (!container) {
    throw new Error('Container element is required');
  }
  
  const graphElement = document.createElement('div');
  graphElement.className = 'dependency-graph';
  graphElement.setAttribute('role', 'img');
  graphElement.setAttribute('aria-label', `Dependency graph with ${dependencies.length} dependencies`);
  
  // Generate accessible id for the graph
  const graphId = ensureElementHasId(graphElement, 'dependency-graph');
  
  dependencies.forEach((dep, index) => {
    const node = document.createElement('div');
    node.className = 'dependency-node';
    
    const nodeId = ensureElementHasId(node, 'dep-node');
    addAriaLabel(node, dep.name || `Dependency ${index + 1}`);
    
    node.textContent = dep.name || dep;
    graphElement.appendChild(node);
  });
  
  container.appendChild(graphElement);
  
  return graphElement;
}

/**
 * Creates accessible SVG representation of dependency graph
 * @param {Array} dependencies - Array of dependency objects
 * @returns {SVGElement} SVG element representing the graph
 */
function createAccessibleGraphSVG(dependencies) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const svgId = ensureElementHasId(svg, 'dep-graph-svg');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `Accessible dependency graph`);
  
  // Add title for screen readers
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
  title.textContent = 'Dependency Graph';
  svg.appendChild(title);
  
  // Add desc for detailed description
  const desc = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
  desc.textContent = `Graph showing ${dependencies.length} dependencies`;
  svg.appendChild(desc);
  
  return svg;
}

// ============================================================================
// EXPORTS (preserving all existing exports)
// ============================================================================

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ensureElementHasId,
    addAriaLabel,
    ensureAccessibility,
    renderDependencyGraph,
    createAccessibleGraphSVG
  };
}

// Export for ES modules (if applicable)
if (typeof window !== 'undefined') {
  window.AccessibilityUtils = {
    ensureElementHasId,
    addAriaLabel,
    ensureAccessibility,
    renderDependencyGraph,
    createAccessibleGraphSVG
  };
}