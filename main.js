// TODO: Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role

// Add role="img" and aria-label to make the dependency graph accessible
const dependencyGraph = document.getElementById('dependencyGraph');
if (dependencyGraph) {
  dependencyGraph.setAttribute('role', 'img');
  dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
}