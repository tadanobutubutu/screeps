// Main module

// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

function ensureId(element) {
  if (element && !element.id) {
    element.id = 'element-' + Math.random().toString(36).slice(2, 11);
  }
  return element;
}

function addAriaLabel(element, label) {
  if (element) {
    element.setAttribute('aria-label', label || '');
  }
  return element;
}

function renderDependencyGraph(data) {
  const container = document.createElement('div');
  container.className = 'dependency-graph';
  if (data && typeof data === 'object') {
    const list = document.createElement('ul');
    Object.keys(data).forEach(function (key) {
      const item = document.createElement('li');
      item.textContent = key + ': ' + JSON.stringify(data[key]);
      list.appendChild(item);
    });
    container.appendChild(list);
  }
  return container;
}

module.exports = {
  ensureId: ensureId,
  addAriaLabel: addAriaLabel,
  renderDependencyGraph: renderDependencyGraph
};