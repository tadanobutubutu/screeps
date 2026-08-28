// TODO: Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role

const initDependencyGraph = () => {
  const container = document.getElementById('dependencyGraph');
  if (container) {
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Dependency graph visualization');
  }
};

document.addEventListener('DOMContentLoaded', initDependencyGraph);

module.exports = { initDependencyGraph };