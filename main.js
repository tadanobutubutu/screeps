// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

// New functionality: Ensure element has an id, add aria-label, render dependency graphs
function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element;
}

function addAriaLabel(element, label) {
  if (label && label.trim()) {
    element.setAttribute('aria-label', label);
  }
  return element;
}

function renderDependencyGraph(graphData, container) {
  addAriaLabel(container, 'Dependency graph');
  // Render the dependency graph into the container
  const graph = document.createElement('div');
  graph.className = 'dependency-graph';
  graph.textContent = JSON.stringify(graphData, null, 2);
  container.appendChild(graph);
  return graph;
}

export {
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph
};