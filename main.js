/**
 * Main module for graph visualization and DOM utilities
 */

// Existing code would be preserved here

/**
 * Ensures an element has an id attribute.
 * If the element doesn't have an id, generates and assigns one.
 * @param {HTMLElement} element - The DOM element to check
 * @param {string} [prefix='element'] - Prefix for auto-generated id
 * @returns {string} The element's id (existing or newly generated)
 */
function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (element.id) {
    return element.id;
  }
  
  const id = `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
  element.id = id;
  return id;
}

/**
 * Adds or updates the aria-label attribute on an element for accessibility.
 * @param {HTMLElement} element - The DOM element to update
 * @param {string} label - The aria-label text
 * @returns {HTMLElement} The element with updated aria-label
 */
function addAriaLabel(element, label) {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (typeof label !== 'string' || !label.trim()) {
    throw new Error('Label must be a non-empty string');
  }
  
  element.setAttribute('aria-label', label);
  return element;
}

/**
 * Renders a dependency graph visualization
 * @param {HTMLElement|string} container - DOM element or selector for the container
 * @param {Object} options - Configuration options for the graph
 * @param {Object[]} options.nodes - Array of node objects with id and label properties
 * @param {Array} options.edges - Array of edge objects with source and target properties
 * @returns {Object} Graph instance with methods to update or destroy
 */
function renderDependencyGraph(container, options = {}) {
  const { nodes = [], edges = [] } = options;
  
  // Get container element
  let containerElement;
  if (typeof container === 'string') {
    containerElement = document.querySelector(container);
  } else {
    containerElement = container;
  }
  
  if (!containerElement) {
    throw new Error('Valid container element or selector is required');
  }
  
  // Ensure container has an id for accessibility
  const containerId = ensureElementHasId(containerElement, 'graph');
  
  // Build the graph structure
  const graphContainer = document.createElement('div');
  graphContainer.className = 'dependency-graph';
  graphContainer.style.width = '100%';
  graphContainer.style.height = '100%';
  
  // Add aria-label for accessibility
  const label = options.ariaLabel || `Dependency graph with ${nodes.length} nodes and ${edges.length} edges`;
  addAriaLabel(graphContainer, label);
  
  // Render nodes
  nodes.forEach((node, index) => {
    const nodeElement = document.createElement('div');
    nodeElement.className = 'graph-node';
    nodeElement.textContent = node.label || node.id;
    nodeElement.dataset.nodeId = node.id;
    graphContainer.appendChild(nodeElement);
  });
  
  // Render edges (simplified SVG overlay)
  if (edges.length > 0) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'graph-edges');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    
    edges.forEach(edge => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', '50');
      line.setAttribute('y1', '50');
      line.setAttribute('x2', '150');
      line.setAttribute('y2', '150');
      line.setAttribute('stroke', '#666');
      line.setAttribute('stroke-width', '2');
      svg.appendChild(line);
    });
    
    graphContainer.appendChild(svg);
  }
  
  containerElement.innerHTML = '';
  containerElement.appendChild(graphContainer);
  
  // Return graph instance with methods
  return {
    container: containerElement,
    containerId,
    nodes: [...nodes],
    edges: [...edges],
    
    /**
     * Updates the graph with new data
     * @param {Object} newOptions - New configuration options
     */
    update(newOptions) {
      return renderDependencyGraph(container, { ...options, ...newOptions });
    },
    
    /**
     * Destroys the graph and clears the container
     */
    destroy() {
      containerElement.innerHTML = '';
    }
  };
}

// Preserve existing exports
module.exports = {
  // Existing exports would be preserved here
};

// Add new exports
module.exports.ensureElementHasId = ensureElementHasId;
module.exports.addAriaLabel = addAriaLabel;
module.exports.renderDependencyGraph = renderDependencyGraph;