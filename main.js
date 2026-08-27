// TODO: Identify and update the renderDependencyGraph function that renders dependency graphs or

/**
 * Renders a dependency graph visualization
 * @param {Object} graphData - The dependency data to render
 * @param {HTMLElement|string} container - The container element or selector for the graph
 * @param {Object} options - Configuration options for the graph
 * @returns {Object} - Returns the rendered graph state
 */
function renderDependencyGraph(graphData, container, options = {}) {
  // Handle container being a selector string
  let containerElement = container;
  if (typeof container === 'string') {
    containerElement = document.querySelector(container);
  }

  if (!graphData || !containerElement) {
    console.error('graphData and container are required');
    return null;
  }

  // Default options
  const config = {
    width: options.width || containerElement.clientWidth || 800,
    height: options.height || containerElement.clientHeight || 600,
    nodeRadius: options.nodeRadius || 25,
    nodeColor: options.nodeColor || '#4A90E2',
    edgeColor: options.edgeColor || '#999999',
    fontSize: options.fontSize || 12,
    ...options
  };

  // Clear existing content
  containerElement.innerHTML = '';

  // Create SVG element
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', config.width);
  svg.setAttribute('height', config.height);
  svg.setAttribute('viewBox', `0 0 ${config.width} ${config.height}`);

  // Process nodes
  const nodes = graphData.nodes || Object.keys(graphData);
  const nodePositions = {};

  // Calculate positions in a force-directed layout
  const centerX = config.width / 2;
  const centerY = config.height / 2;
  const radius = Math.min(centerX, centerY) * 0.6;

  nodes.forEach((node, index) => {
    const angle = (2 * Math.PI * index) / nodes.length;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    nodePositions[node] = { x, y, id: node };

    // Create node circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', config.nodeRadius);
    circle.setAttribute('fill', config.nodeColor);
    circle.setAttribute('stroke', '#333');
    circle.setAttribute('stroke-width', '2');
    circle.setAttribute('data-node', node);
    svg.appendChild(circle);

    // Create node label
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y + config.fontSize / 3);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', '#ffffff');
    text.setAttribute('font-size', config.fontSize);
    text.setAttribute('font-family', 'Arial, sans-serif');
    text.textContent = node.length > 3 ? node.substring(0, 3) : node;
    svg.appendChild(text);
  });

  // Process and draw edges
  const edges = graphData.edges || [];
  edges.forEach(edge => {
    const source = nodePositions[edge.source || edge.from];
    const target = nodePositions[edge.target || edge.to];

    if (source && target) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', source.x);
      line.setAttribute('y1', source.y);
      line.setAttribute('x2', target.x);
      line.setAttribute('y2', target.y);
      line.setAttribute('stroke', config.edgeColor);
      line.setAttribute('stroke-width', '2');
      svg.appendChild(line);
    }
  });

  containerElement.appendChild(svg);

  return {
    svg,
    nodes: nodePositions,
    config,
    container: containerElement
  };
}

// Helper function to add interactivity
function highlightNode(nodeId, graphState) {
  if (!graphState || !graphState.svg) return;
  
  const circles = graphState.svg.querySelectorAll('circle');
  circles.forEach(circle => {
    if (circle.getAttribute('data-node') === nodeId) {
      circle.setAttribute('stroke', '#ff6600');
      circle.setAttribute('stroke-width', '4');
    }
  });
}

// Helper function to reset highlights
function resetHighlights(graphState) {
  if (!graphState || !graphState.svg) return;
  
  const circles = graphState.svg.querySelectorAll('circle');
  circles.forEach(circle => {
    circle.setAttribute('stroke', '#333');
    circle.setAttribute('stroke-width', '2');
  });
}

// Export functions for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderDependencyGraph,
    highlightNode,
    resetHighlights
  };
}

// Initialize for browser usage
if (typeof window !== 'undefined') {
  window.renderDependencyGraph = renderDependencyGraph;
  window.highlightNode = highlightNode;
  window.resetHighlights = resetHighlights;
}