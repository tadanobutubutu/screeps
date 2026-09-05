// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

// Ensure an element has an id attribute
function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `element-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element.id;
}

// Add aria-label to an element if it doesn't have one
function addAriaLabel(element, label) {
  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
  return element;
}

// Render dependency graphs
function renderDependencyGraph(dependencies) {
  const graphContainer = document.createElement('div');
  graphContainer.className = 'dependency-graph';
  
  dependencies.forEach(dep => {
    const node = document.createElement('div');
    node.className = 'graph-node';
    node.textContent = dep.name;
    node.setAttribute('data-dependency', dep.id);
    ensureElementHasId(node);
    addAriaLabel(node, `Dependency: ${dep.name}`);
    graphContainer.appendChild(node);
  });
  
  return graphContainer;
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ensureElementHasId,
    addAriaLabel,
    renderDependencyGraph
  };
}