/**
 * Ensures the element has an id. If the element doesn't have an id,
 * generates one and assigns it to the element.
 * @param {HTMLElement} element - The element to check and modify
 * @param {string} [prefix='element'] - Prefix for the generated id
 * @returns {string} The element's id (existing or newly generated)
 */
function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }

  if (element.id) {
    return element.id;
  }

  const id = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  element.id = id;
  return id;
}

/**
 * Adds an aria-label attribute to the element if it doesn't already have one.
 * @param {HTMLElement} element - The element to modify
 * @param {string} label - The aria-label value to set
 * @returns {boolean} True if label was added, false if element already had one
 */
function addAriaLabel(element, label) {
  if (!element) {
    throw new Error('Element is required');
  }

  if (!label) {
    throw new Error('Label is required');
  }

  if (element.getAttribute('aria-label')) {
    return false;
  }

  element.setAttribute('aria-label', label);
  return true;
}

/**
 * Renders dependency graphs for the given configuration.
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

  // Ensure container has an id for graph references
  const containerId = ensureElementHasId(container, 'graph-container');

  // Add accessibility label if not present
  const hasAriaLabel = addAriaLabel(container, `Dependency graph: ${containerId}`);

  // Placeholder for graph rendering logic
  // Actual implementation would use a library like D3.js or similar
  const graphData = {
    id: containerId,
    dependencies: dependencies,
    options: options,
    rendered: true,
    timestamp: new Date().toISOString()
  };

  console.log('Rendering dependency graphs:', graphData);

  return graphData;
}

/**
 * Checks if the element is a landmark element.
 * Landmark elements are sections of a page that are important for
 * accessibility and navigation (e.g., main, nav, header, footer, aside, section).
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} True if the element is a landmark element, false otherwise
 */
function isLandmarkElement(element) {
  if (!element || !element.tagName) {
    return false;
  }

  const landmarkTags = [
    'MAIN',
    'NAV',
    'HEADER',
    'FOOTER',
    'ASIDE',
    'SECTION',
    'ARTICLE',
    'ADDRESS',
    'FORM',
    'DIALOG',
    'DETAILS'
  ];

  const tagName = element.tagName.toUpperCase();

  // Check if the element is a native landmark element
  if (landmarkTags.includes(tagName)) {
    return true;
  }

  // Check if the element has a landmark role
  const role = element.getAttribute && element.getAttribute('role');
  if (role) {
    const landmarkRoles = [
      'main',
      'navigation',
      'banner',
      'contentinfo',
      'complementary',
      'region',
      'article',
      'form',
      'dialog',
      'search'
    ];
    if (landmarkRoles.includes(role.toLowerCase())) {
      return true;
    }
  }

  return false;
}

/**
 * Checks if the element has accessible naming (via id, aria-label, or aria-labelledby).
 * @param {HTMLElement} element - The element to check
 * @returns {Object} Object with hasAccessibleName boolean and namingMethods array
 */
function checkElementAccessibility(element) {
  if (!element) {
    throw new Error('Element is required');
  }

  const namingMethods = [];

  if (element.id) {
    namingMethods.push('id');
  }
  if (element.getAttribute('aria-label')) {
    namingMethods.push('aria-label');
  }
  if (element.getAttribute('aria-labelledby')) {
    namingMethods.push('aria-labelledby');
  }

  return {
    hasAccessibleName: namingMethods.length > 0,
    namingMethods: namingMethods
  };
}

// Export functions for testing and external use
module.exports = {
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs,
  isLandmarkElement,
  checkElementAccessibility
};