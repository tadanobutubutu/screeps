function ensureDependencyGraphARIA() {
  const graph = document.getElementById('dependency-graph');
  if (graph) {
    graph.setAttribute('role', 'graph');
    graph.setAttribute('aria-label', 'Dependency graph');
  }
}

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

// Ensure HTML element has lang attribute for accessibility (REACT_015)
if (!document.documentElement.lang) {
  document.documentElement.lang = getLangAttribute();
}

ensureDependencyGraphARIA();

module.exports = { ensureDependencyGraphARIA, getLangAttribute };