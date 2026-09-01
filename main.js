const http = require('http');
const path = require('path');

// TODO: This is the existing code that needs to be preserved

// Application configuration
const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

/**
 * Validates if the landmark is valid
 * @param {string} landmark - The landmark to validate
 * @returns {boolean} - Returns true if the landmark is valid, otherwise false
 */
function validateLandmark(landmark) {
  // Implement validation logic here, for example:
  return landmark && landmark.trim().length > 0;
}

/**
 * Ensures that the given element has an id attribute.
 * If the element does not have an id, one is generated using the provided prefix.
 * @param {HTMLElement} element - The element to check/update
 * @param {string} prefix - The prefix to use for generating an id (default: 'element')
 * @returns {string} The id of the element
 */
function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (element.id && element.id.trim().length > 0) {
    return element.id;
  }
  
  const generatedId = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  element.id = generatedId;
  return generatedId;
}

/**
 * Adds or updates an aria-label attribute on the given element.
 * @param {HTMLElement} element - The element to add the aria-label to
 * @param {string} label - The label text to set
 * @returns {HTMLElement} The element with the aria-label added/updated
 */
function addAriaLabel(element, label) {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (typeof label !== 'string') {
    throw new Error('Label must be a string');
  }
  
  element.setAttribute('aria-label', label);
  return element;
}

/**
 * Renders a dependency graph based on the provided data.
 * @param {Object} data - The dependency data to render
 * @param {Array} data.nodes - Array of node objects with id and label properties
 * @param {Array} data.edges - Array of edge objects with source and target properties
 * @param {HTMLElement} container - The container element to render the graph in
 * @returns {Object} An object containing the rendered graph with nodes and edges
 */
function renderDependencyGraph(data, container) {
  if (!data || !Array.isArray(data.nodes)) {
    throw new Error('Invalid data: nodes array is required');
  }
  
  const graph = {
    nodes: [],
    edges: [],
    container: container
  };
  
  // Process nodes
  data.nodes.forEach((node, index) => {
    const nodeId = node.id || `node-${index}`;
    const nodeLabel = node.label || nodeId;
    
    graph.nodes.push({
      id: nodeId,
      label: nodeLabel,
      metadata: node.metadata || {}
    });
  });
  
  // Process edges
  if (Array.isArray(data.edges)) {
    data.edges.forEach((edge, index) => {
      if (edge.source && edge.target) {
        graph.edges.push({
          id: edge.id || `edge-${index}`,
          source: edge.source,
          target: edge.target,
          metadata: edge.metadata || {}
        });
      }
    });
  }
  
  // Render to container if provided
  if (container) {
    container.innerHTML = '';
    container.setAttribute('data-graph-rendered', 'true');
    
    // Create visual representation
    graph.nodes.forEach(node => {
      const nodeElement = document.createElement('div');
      nodeElement.id = ensureElementHasId(nodeElement, 'graph-node');
      nodeElement.setAttribute('data-node-id', node.id);
      nodeElement.textContent = node.label;
      addAriaLabel(nodeElement, `Dependency graph node: ${node.label}`);
      container.appendChild(nodeElement);
    });
  }
  
  return graph;
}

/**
 * Creates and starts the HTTP server
 * @returns {http.Server} The created server instance
 */
function createServer() {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', config }));
  });
  return server;
}

/**
 * Starts the application
 */
function startApp() {
  const server = createServer();
  server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
  return server;
}

// Export functions for testing
module.exports = {
  createServer,
  startApp,
  config,
  validateLandmark, // Export the new function
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph
};

// Start the application if run directly
if (require.main === module) {
  startApp();
}