// TODO: Address accessibility issues from insight report — FIXED

// Functions to ensure the element has an id, add aria-label, render dependency graphs

// New functionality: Ensure element has an id, add aria-label, render dependency graphs

function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `element-${Math.random().toString(36).substr(2, 11)}`;
  }
  return element;
}

function addAriaLabel(element, label) {
  if (label) {
    element.setAttribute('aria-label', label);
  }
  return element;
}

function renderDependencyGraph(graphData, container) {
  if (!container) {
    throw new Error('Container element is required');
  }
  
  ensureElementHasId(container);
  addAriaLabel(container, 'Dependency graph');
  
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