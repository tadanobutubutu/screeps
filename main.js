// Restoring previously removed exports below
const { renderGraphContent } = require('./dependency-graph');

// New function: Render dependency graph content
function renderDependencyGraphContent(data) {
  // Replace the existing content within the dependencyGraph div using the provided data.
  document.querySelector('#dependencyGraph .dependencyGraph').innerHTML = data;

  // Adding landmark for main content
  document.getElementById('dependencyGraph').setAttribute('role', 'region');
}

// Export renderDependencyGraphContent function
module.exports = {
  renderDependencyGraphContent
};

// Call renderGraphContent function from another file
renderGraphContent(someData);