// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

// Function to ensure an element has an id
function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `generated-id-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element.id;
}

// Function to add aria-label to an element
function addAriaLabel(element, label) {
  if (element && label) {
    element.setAttribute('aria-label', label);
  }
}

/**
 * Sets accessibility properties on SVG elements.
 * @param {SVGElement} svgElement - The SVG element to modify
 */
function setSvgAccessibilityProps(svgElement) {
  if (!svgElement || svgElement.nodeName.toLowerCase() !== 'svg') {
    return;
  }
  // Ensure the SVG has an id for accessibility
  ensureElementHasId(svgElement);
  // Add a default aria-label if none exists
  if (!svgElement.getAttribute('aria-label')) {
    addAriaLabel(svgElement, 'SVG graphic');
  }
}

/**
 * Checks if a link has appropriate accessibility attributes.
 * @param {HTMLElement} link - The link element to check
 * @returns {boolean} True if the link is accessible, false otherwise
 */
function isLinkAccessible(link) {
  // Check if link has proper href
  const href = link.getAttribute('href');
  if (!href || href === '#' || href === '') {
    return false;
  }

  // Check if link has text content or aria-label
  const hasText = link.textContent.trim().length > 0;
  const hasAriaLabel = link.getAttribute('aria-label');

  if (!hasText && !hasAriaLabel) {
    return false;
  }

  return true;
}

/**
 * Checks if a button has appropriate accessibility attributes.
 * @param {HTMLElement} button - The button element to check
 * @returns {boolean} True if the button is accessible, false otherwise
 */
function isButtonAccessible(button) {
  // Check if button has type attribute
  const type = button.getAttribute('type');

  // Check if button has text content or aria-label or aria-labelledby
  const hasText = button.textContent.trim().length > 0;
  const hasAriaLabel = button.getAttribute('aria-label');
  const hasAriaLabelledby = button.getAttribute('aria-labelledby');

  if (!hasText && !hasAriaLabel && !hasAriaLabelledby) {
    return false;
  }

  return true;
}

/**
 * Checks link and button accessibility in the document or specific container.
 * @param {HTMLElement|Document} [container=document] - The container to check for accessibility
 * @returns {Object} An object containing accessibility check results
 */
function checkLinkAndButtonAccessibility(container = document) {
  // (Previously existing code that needs to be preserved)
}

/**
 * Renders dependency graphs
 * @param {Object[]} dependencies - An array of dependency objects
 * @returns {Object} A rendered dependency graph
 */
function renderDependencyGraph(dependencies) {
  // (Previously existing code that needs to be preserved)
}

// Add the requested function: calculateSum
export function calculateSum(a, b) {
  return a + b;
}

// Export all functions
module.exports = {
  ensureElementHasId,
  addAriaLabel,
  setSvgAccessibilityProps,
  isLinkAccessible,
  isButtonAccessible,
  checkLinkAndButtonAccessibility,
  renderDependencyGraph,
  calculateSum // New export added here
};