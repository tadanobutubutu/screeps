// TODO: Add new functions to ensure the element has an id, add aria-label, render dependency graphs

/**
 * Ensures an element has an id attribute
 * @param {HTMLElement} element - The element to check
 * @param {string} [prefix='element'] - Prefix for auto-generated id
 * @returns {string} The element's id
 */
function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (!element.id) {
    element.id = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  return element.id;
}

/**
 * Adds an aria-label attribute to an element
 * @param {HTMLElement} element - The element to add aria-label to
 * @param {string} label - The label text
 */
function addAriaLabel(element, label) {
  if (!element) {
    throw new Error('Element is required');
  }
  
  element.setAttribute('aria-label', label);
}

/**
 * Renders dependency graphs
 * @param {HTMLElement} container - The container element for the graph
 * @param {Object} options - Graph rendering options
 * @param {Array} options.nodes - Array of dependency nodes
 * @param {Array} options.edges - Array of dependency edges
 * @returns {HTMLElement} The rendered graph container
 */
function renderDependencyGraphs(container, options = {}) {
  if (!container) {
    throw new Error('Container element is required');
  }
  
  const { nodes = [], edges = [] } = options;
  const graphContainer = document.createElement('div');
  graphContainer.className = 'dependency-graph';
  graphContainer.setAttribute('role', 'img');
  graphContainer.setAttribute('aria-label', 'Dependency graph visualization');
  
  // Render nodes
  nodes.forEach(node => {
    const nodeElement = document.createElement('div');
    nodeElement.id = ensureElementHasId(nodeElement, 'node');
    nodeElement.textContent = node.label || node.id;
    nodeElement.className = 'graph-node';
    graphContainer.appendChild(nodeElement);
  });
  
  // Render edges (connections between nodes)
  edges.forEach(edge => {
    const sourceId = ensureElementHasId(document.getElementById(edge.source) || { id: edge.source }, 'node-source');
    const targetId = ensureElementHasId(document.getElementById(edge.target) || { id: edge.target }, 'node-target');
    
    const edgeElement = document.createElement('div');
    edgeElement.className = 'graph-edge';
    edgeElement.setAttribute('data-source', edge.source);
    edgeElement.setAttribute('data-target', edge.target);
    graphContainer.appendChild(edgeElement);
  });
  
  container.appendChild(graphContainer);
  return graphContainer;
}

// Export functions
module.exports = {
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs
};