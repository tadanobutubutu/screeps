// TODO: Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role

// Function to initialize the dependency graph with accessibility support
function initDependencyGraph(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.setAttribute('role', 'img');
    container.setAttribute('aria-label', 'Dependency graph visualization');
  }
  return container;
}

module.exports = { initDependencyGraph };