// Adds lang attribute to the root HTML element and makes the dependency graph and index view focusable by screen readers
const dependencyGraphAriaLabel = 'Dependencies graph';
const indexAriaLabel = 'Index';

function addLangAttribute() {
  // Add your implementation here to set the lang attribute dynamically based on the expected locale
  document.documentElement.lang = 'en';
}

function renderDependencyGraph(options = {}) {
  const content = dependencyGraphContent.generate(options);
  // Render the dependency graph with the generated content
  return `<div class="dependency-graph" aria-labelledby="dependency-graph-label">${content}</div>`;
}

function renderIndex(data = {}) {
  const content = indexContent.generate(data);
  // Render the index with the generated content
  return `<div class="index-view" aria-labelledby="index-view-label">${content}</div>`;
}

function addDepGraphAriaLabel() {
  const dependencyGraphLabel = document.createElement('span');
  dependencyGraphLabel.id = 'dependency-graph-label';
  dependencyGraphLabel.innerText = dependencyGraphAriaLabel;
  document.body.appendChild(dependencyGraphLabel);
}

function addIndexAriaLabel() {
  const indexLabel = document.createElement('span');
  indexLabel.id = 'index-view-label';
  indexLabel.innerText = indexAriaLabel;
  document.body.appendChild(indexLabel);
}

function renderApp(context) {
  addLangAttribute();
  addDepGraphAriaLabel();
  addIndexAriaLabel();
  return `<div id="app">${renderIndex(context)}</div>`;
}

module.exports = {
  renderDependencyGraph,
  renderIndex,
  renderApp
};