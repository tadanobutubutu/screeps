// TODO: Add back any required exports that might have been?

const { renderGraphContent } = require('./dependency-graph');

// New function: Render dependency graph content
function renderDependencyGraphContent(data) {
  // Replace the existing content within the dependencyGraph div using the provided data.
  document.querySelector('#dependencyGraph .dependencyGraph').innerHTML = data;
}

// Export renderDependencyGraphContent function
module.exports = {
  renderDependencyGraphContent,
  renderGraphContent // original export preserves for calling from another file
};

// Call renderGraphContent function from another file
renderGraphContent(someData);