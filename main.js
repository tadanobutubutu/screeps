/**
 * Ensures the element has an id. If the element doesn't have an id,
 * generates one and assigns it to the element. Updates existing function to return the generated id if no id exists.
 * @param {HTMLElement} element - The element to check and modify
 * @param {string} [prefix='element'] - Prefix for the generated id
 * @returns {string} The element's id (existing or newly generated)
 */
function ensureElementHasId(element, prefix = 'element') {
  if (!element.id) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    element.id = `${prefix}-${timestamp}-${random}`;
  }

  if (element.id) {
    return element.id;
  }

  const id = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  element.id = id;
  return id;
}

/**
 * Adds an aria-label attribute to the element if it doesn't already have one. Modifies and adds error handling.
 * @param {HTMLElement} element - The element to modify
 * @param {string} label - The aria-label value to set
 * @returns {boolean} True if label was added, false if element already had one
 */
function addAriaLabel(element, label) {
  if (element) {
    if (!element.hasAttribute('aria-label')) {
      element.setAttribute('aria-label', label);
      return true;
    } else if (!label) {
      throw new Error('Label is required');
    }
  } else {
    throw new Error('Element is required');
  }
  return false;
}

// Accessible Insight Report Interface - Dependency Graph Rendering
// Updateária-labelledby for the container and initialize accessibility features on DOM ready
function initAccessibilityFeatures() {
  const container = document.getElementById('dependency-graph-container');
  if (container) {
    container.setAttribute('aria-labelledby', 'dependency-graph-label');
  }

  if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('DOMContentLoaded', () => {
      // ... Existing functions and exports ...

      // New accessibility improvements
      fixTableStructureIssues();
      addMainLandmark();
      addSvgAccessibleNames();
      ensureUniqueLandmarks();
      fixFakeLinkIssue();

      announceToScreenReader('Page loaded and additional accessibility features initialized', 'assertive');
    });
  }
}

/**
 * Renders dependency graphs for the given configuration. Modifies to support processing dependencies into graphData format and applying any options.
 * @param {HTMLElement} container - The container element to render into
 * @param {Object} dependencies - The dependencies data to render
 * @param {Object} [options={}] - Optional rendering configuration
 * @returns {Object} The rendered graph instance
 */
function renderDependencyGraphs(container, dependencies, options = {}) {
  if (!container) {
    throw new Error('Container element is required');
  }

  if (!dependencies) {
    throw new Error('Dependencies data is required');
  }

  // Process dependencies into graphData format expected by renderDependencyGraph
  const graphData = Array.isArray(dependencies) ? dependencies :
    (dependencies && dependencies.nodes ? dependencies.nodes : []);

  // Apply any options (e.g., theme, layout)
  const processedData = graphData.map(node => ({
    name: node.name || node.id || 'Unknown',
    dependencies: node.dependencies || node.deps || []
  }));

  return renderDependencyGraph(container, processedData);
}

// Initialize accessibility features on DOM ready
if (typeof document !== 'undefined' && document.addEventListener) {
  document.addEventListener('DOMContentLoaded', () => {
    initAccessibilityFeatures();

    // ... Existing functions and exports ...
  });
}

// Export functions for testing and external use
module.exports = {
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs,
  renderDependencyGraph,
  updateDependencyGraph,
  isLandmarkElement,
  checkElementAccessibility,
  initAccessibilityFeatures
};