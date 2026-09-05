// TODO: Add new functions to ensure the element has an id, add aria-label, render dependency graphs

function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `generated-id-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element.id;
}

function addAriaLabel(element, label) {
  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
  return element;
}

function renderDependencyGraph(container, graphData) {
  const graphContainer = typeof container === 'string' ? document.querySelector(container) : container;
  
  if (!graphContainer) {
    console.error('Graph container not found');
    return;
  }
  
  const graphElement = document.createElement('div');
  graphElement.className = 'dependency-graph';
  graphElement.setAttribute('role', 'img');
  graphElement.setAttribute('aria-label', 'Dependency graph visualization');
  
  // Render nodes and connections based on graphData
  graphData.nodes.forEach(node => {
    const nodeElement = document.createElement('div');
    nodeElement.id = node.id || `node-${Math.random().toString(36).substr(2, 9)}`;
    nodeElement.textContent = node.label || node.id;
    nodeElement.className = 'graph-node';
    graphElement.appendChild(nodeElement);
  });
  
  graphContainer.appendChild(graphElement);
  return graphElement;
}

module.exports = {
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph
};