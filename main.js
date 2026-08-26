// TODO: Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role

// Assuming dependencyGraph exists with an id of 'dependencyGraph'
const dependencyGraph = document.getElementById('dependencyGraph');
if (dependencyGraph) {
  // Set appropriate ARIA role for the container
  dependencyGraph.setAttribute('role', 'tree');
}