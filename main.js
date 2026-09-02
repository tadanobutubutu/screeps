// main.js - Accessibility-focused implementation with DOM utilities

/**
 * Ensures the given element has an id. If it does not, generates and assigns one.
 * @param {HTMLElement} element - The DOM element to check.
 * @param {string} [prefix='element'] - Prefix for the generated id.
 * @returns {string} The element's id.
 */
function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('ensureElementHasId: element is required');
  }
  if (!element.id) {
    element.id = `${prefix}-${Math.random().toString(36).slice(2, 11)}`;
  }
  return element.id;
}

/**
 * Adds an aria-label to the given element if one is not already present.
 * @param {HTMLElement} element - The DOM element to label.
 * @param {string} label - The aria-label text to add.
 * @returns {HTMLElement} The element for chaining.
 */
function addAriaLabel(element, label) {
  if (!element) {
    throw new Error('addAriaLabel: element is required');
  }
  if (!label) {
    throw new Error('addAriaLabel: label is required');
  }
  if (!element.hasAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
  return element;
}

/**
 * Renders a dependency graph into a target container.
 * @param {Object} graph - The dependency graph data.
 * @param {Array<{id: string, label?: string}>} graph.nodes - Nodes in the graph.
 * @param {Array<{from: string, to: string}>} graph.edges - Edges between nodes.
 * @param {HTMLElement} container - The DOM element to render the graph into.
 * @returns {HTMLElement} The container element with the rendered graph.
 */
function renderDependencyGraph(graph, container) {
  if (!graph) {
    throw new Error('renderDependencyGraph: graph is required');
  }
  if (!container) {
    throw new Error('renderDependencyGraph: container is required');
  }

  const nodes = graph.nodes || [];
  const edges = graph.edges || [];

  // Create the graph wrapper
  const graphWrapper = document.createElement('div');
  graphWrapper.className = 'dependency-graph';
  ensureElementHasId(graphWrapper, 'dependency-graph');
  addAriaLabel(graphWrapper, `Dependency graph with ${nodes.length} nodes and ${edges.length} edges`);

  // Render nodes
  const nodesContainer = document.createElement('ul');
  nodesContainer.className = 'dependency-graph-nodes';

  const nodeMap = {};
  nodes.forEach((node) => {
    const nodeEl = document.createElement('li');
    nodeEl.className = 'dependency-graph-node';
    nodeEl.dataset.id = node.id;
    nodeEl.textContent = node.label || node.id;
    ensureElementHasId(nodeEl, 'node');
    addAriaLabel(nodeEl, `Node: ${node.label || node.id}`);
    nodesContainer.appendChild(nodeEl);
    nodeMap[node.id] = nodeEl;
  });

  graphWrapper.appendChild(nodesContainer);

  // Render edges
  const edgesContainer = document.createElement('ul');
  edgesContainer.className = 'dependency-graph-edges';

  edges.forEach((edge) => {
    const edgeEl = document.createElement('li');
    edgeEl.className = 'dependency-graph-edge';
    edgeEl.dataset.from = edge.from;
    edgeEl.dataset.to = edge.to;
    edgeEl.textContent = `${edge.from} → ${edge.to}`;
    ensureElementHasId(edgeEl, 'edge');
    addAriaLabel(edgeEl, `Edge from ${edge.from} to ${edge.to}`);
    edgesContainer.appendChild(edgeEl);
  });

  graphWrapper.appendChild(edgesContainer);

  container.appendChild(graphWrapper);
  return container;
}

/**
 * Validates if an element has an id and adds an aria-label if not already present.
 * @param {HTMLElement} element - The DOM element to validate and label.
 * @param {string} label - The aria-label text to add.
 * @returns {HTMLElement} The element for chaining.
 */
function validateAndLabelElement(element, label) {
  ensureElementHasId(element);
  addAriaLabel(element, label);
  return element;
}

/**
 * Main application entry point with accessibility features
 */
function createServer() {
  // ... (existing code)
}

function startApp() {
  // ... (existing code)
}

/**
 * Spawn a child process to run some command with proper error handling.
 * @param {Function} callback - Invoked with (err, result) when the command exits.
 */
function spawnSomeCommand(callback) {
  const child_process = require('child_process');
  const child = child_process.spawn('someCommand', [], {
    stdio: 'inherit',
  });
  child.on('exit', (code, signal) => {
    if (code === 0) {
      callback(null, 'Successfully executed someCommand');
    } else {
      callback(new Error(`someCommand failed with code ${code}`));
    }
  });
}

// Export functions for testing
module.exports = {
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph,
  renderIndexView,
  createServer,
  startApp,
  config,
  countDependencies: AddressabilityIssues.countDependencies,
  addressAccessibilityIssues: AddressabilityIssues,
  spawnSomeCommand,
  spawnSomeCommandAlt: AddressabilityIssues.spawnSomeCommand,
  MyComponent,
  sampleInsightReport,
  addressAccessibilityIssuesFromInsightReport,
  validateAndLabelElement
};
// ... (other functions and setting up exports)