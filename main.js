// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: ensureDependencyGraphARIA, getLangAttribute)

/**
 * Ensures that the dependency graph has appropriate ARIA attributes.
 * This function should be called after the graph is rendered.
 */
export function ensureDependencyGraphARIA() {
  const graph = document.querySelector('[data-dependency-graph]') || document.querySelector('.dependency-graph');
  if (graph) {
    if (!graph.hasAttribute('aria-label')) {
      graph.setAttribute('aria-label', 'Dependency graph');
    }
    if (!graph.hasAttribute('aria-describedby')) {
      const description = document.getElementById('graph-description');
      if (description) {
        graph.setAttribute('aria-describedby', 'graph-description');
      }
    }
  }
}

/**
 * Returns the language attribute of the HTML element.
 * If not set, defaults to 'en'.
 * @returns {string} The language code.
 */
export function getLangAttribute() {
  const html = document.documentElement;
  return html.lang || 'en';
}

// Additional existing exports and functions should appear here unchanged.