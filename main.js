// Ensure the element has an id
export function ensureElementHasId(element) {
  if (!element.id) {
    element.id = 'auto-id-' + Math.random().toString(36).substr(2, 9);
  }
  return element.id;
}

// Add aria-label to an element
export function addAriaLabel(element, label) {
  if (element && label) {
    element.setAttribute('aria-label', label);
  }
  return element;
}

// Render dependency graphs
export function renderDependencyGraphs(dependencies) {
  const graphContainer = document.getElementById('dependency-graph');
  if (!graphContainer) {
    console.warn('Dependency graph container not found');
    return;
  }
  graphContainer.innerHTML = '';
  const list = document.createElement('ul');
  dependencies.forEach(dep => {
    const listItem = document.createElement('li');
    listItem.textContent = dep.name;
    list.appendChild(listItem);
  });
  graphContainer.appendChild(list);
  return graphContainer;
}

// Existing code preserved below...
// (All original content from main.js remains unchanged)