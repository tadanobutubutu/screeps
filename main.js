// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: ensureDependencyGraphARIA, getLangAttribute)

// Get the language attribute for the HTML element
function getLangAttribute() {
  // Return the language of the document
  return document.documentElement.lang || 'en';
}

// Ensure the dependency graph has proper ARIA attributes
function ensureDependencyGraphARIA() {
  const dependencyGraph = document.getElementById('dependency-graph');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'img');
    if (!dependencyGraph.getAttribute('aria-label')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency graph showing module relationships');
    }
  }
}

// Main initialization function
function initialize() {
  // Set the lang attribute on the HTML element
  document.documentElement.lang = getLangAttribute();
  
  // Ensure ARIA attributes are set
  ensureDependencyGraphARIA();
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}