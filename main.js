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
    element.id = `${prefix}-${Date.now().toString(36).slice(-9)}`;
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
  
  // Ensure container has an id for accessibility
  const containerId = ensureElementHasId(container, 'graph-container');
  
  // Add aria-label for accessibility
  addAriaLabel(graphContainer, 'Dependency graph visualization');
  
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
    const sourceId = edge.source?.id || ensureElementHasId({ id: edge.source }, 'node-source');
    const targetId = edge.target?.id || ensureElementHasId({ id: edge.target }, 'node-target');
    
    const edgeElement = document.createElement('div');
    edgeElement.className = 'graph-edge';
    edgeElement.setAttribute('data-source', edge.source);
    edgeElement.setAttribute('data-target', edge.target);
    graphContainer.appendChild(edgeElement);
  });
  
  container.appendChild(graphContainer);
  return graphContainer;
}

/**
 * Renders the index page with dependency graph
 * @param {HTMLElement} container - The container element for the index
 * @param {Object} data - The index data containing nodes and edges
 * @returns {HTMLElement} The rendered index container
 */
function renderIndex(container, data = {}) {
  if (!container) {
    throw new Error('Container is required');
  }
  
  const indexContainer = document.createElement('div');
  indexContainer.className = 'index-container';
  
  // Ensure container has an id for accessibility
  ensureElementHasId(indexContainer, 'index');
  
  // Add aria-label for accessibility
  addAriaLabel(indexContainer, 'Dependency index');
  
  // Render the dependency graphs using the new function
  renderDependencyGraphs(indexContainer, {
    nodes: data.nodes || [],
    edges: data.edges || []
  });
  
  container.appendChild(indexContainer);
  return indexContainer;
}

// Export functions
module.exports = {
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs,
  renderIndex
};