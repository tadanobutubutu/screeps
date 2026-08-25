// TODO: Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role

const { renderGraphContent } = require('./dependency-graph');

document.querySelector('#dependencyGraph .dependencyGraph').setAttribute('role', 'tree');
document.querySelector('#dependencyGraph .dependencyGraph').setAttribute('aria-label', 'Dependency Graph');

// Render dependency graph content
function renderDependencyGraphContent(data) {
  // Replace the existing content within the dependencyGraph div using the provided data.
  document.querySelector('#dependencyGraph .dependencyGraph').innerHTML = data;
}

// Export renderDependencyGraphContent function
module.exports = {
  renderDependencyGraphContent,
  renderGraphContent // original export preserves for calling from another file
};