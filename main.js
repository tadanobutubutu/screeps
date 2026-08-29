// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_025: Add other accessibility changes as per the insight report
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

/**
 * Adds lang attribute to the HTML element for accessibility
 * @param {string} langCode - The language code (e.g., 'en', 'es', 'fr')
 */
function addLangAttribute(langCode = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', langCode);
  }
}

/**
 * Adds accessibility properties to an SVG element
 * @param {SVGElement} svgElement - The SVG element to add accessibility props to
 * @param {Object} options - Options for accessibility
 * @param {string} options.label - Label for the SVG (creates aria-label)
 * @param {string} options.role - Role for the SVG (default: 'img')
 */
function addSVGAccessibilityProps(svgElement, options = {}) {
  if (!svgElement) {
    return;
  }

  const { label, role = 'img' } = options;

  // Ensure SVG has a role for accessibility
  if (role) {
    svgElement.setAttribute('role', role);
  }

  // Set aria-label if a label is provided
  if (label) {
    svgElement.setAttribute('aria-label', label);
  }

  // Make SVG focusable for keyboard navigation
  svgElement.setAttribute('focusable', 'false');

  return svgElement;
}

/**
 * Enhances accessibility for all SVG elements on the page
 */
function enhanceSVGsAccessibility() {
  const svgElements = document.querySelectorAll('svg');
  
  svgElements.forEach(svg => {
    // Skip if already has accessibility attributes
    const hasRole = svg.hasAttribute('role');
    const hasAriaLabel = svg.hasAttribute('aria-label') || svg.hasAttribute('aria-labelledby');
    const hasDescriptiveChild = svg.querySelector('title, desc');

    if (!hasRole && !hasAriaLabel && !hasDescriptiveChild) {
      // Add default accessibility props to bare SVGs
      addSVGAccessibilityProps(svg);
    }
  });
}

/**
 * Sets up basic accessibility features
 */
function setupAccessibility() {
  // Add lang attribute with default English
  addLangAttribute();

  // Ensure skip links work properly
  const skipLink = document.querySelector('.skip-link, [href="#main-content"]');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      const targetId = skipLink.getAttribute('href')?.substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.tabIndex = -1;
        target.focus();
      }
    });
  }

  // Enhance SVG accessibility for all SVGs on the page
  enhanceSVGsAccessibility();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupAccessibility);
} else {
  setupAccessibility();
}

// Export for testing
module.exports = {
  addLangAttribute,
  setupAccessibility,
  addSVGAccessibilityProps,
  enhanceSVGsAccessibility
}