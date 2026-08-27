// TODO: Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role

// Assuming dependencyGraph is a container element
const dependencyGraph = document.getElementById('dependencyGraph');
if (dependencyGraph) {
  dependencyGraph.setAttribute('role', 'img');
  dependencyGraph.setAttribute('aria-label', 'Dependency graph showing project dependencies');
}