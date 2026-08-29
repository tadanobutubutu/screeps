// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

// New functionality: Ensure element has an id, add aria-label, render dependency graphs
function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `el-${Math.random().toString(36).slice(2, 11)}`;
  }
  return element;
}

function addAriaLabel(element, label) {
  if (!element.hasAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
  return element;
}

function renderDependencyGraph(graphData, container) {
  ensureElementHasId(container);
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