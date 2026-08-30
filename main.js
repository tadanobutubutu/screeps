// main.js - Accessibility Checker Module

/**
 * Checks accessibility of links and buttons within a given container
 * @param {HTMLElement} container - The container element to check for accessibility issues
 * @returns {Array} - Array of accessibility issues found
 */
function checkLinkAndButtonAccessibility(container) {
  const issues = [];
  
  // Check links for accessibility
  const links = container.querySelectorAll('a');
  links.forEach((link, index) => {
    const text = link.textContent.trim();
    const ariaLabel = link.getAttribute('aria-label');
    const title = link.getAttribute('title');
    
    if (!text && !ariaLabel && !title) {
      issues.push({
        type: 'link',
        index,
        element: link,
        message: 'Link is missing accessible text content. Add visible text, aria-label, or title attribute.'
      });
    }
  });
  
  // Check buttons for accessibility
  const buttons = container.querySelectorAll('button, [role="button"]');
  buttons.forEach((button, index) => {
    const text = button.textContent.trim();
    const ariaLabel = button.getAttribute('aria-label');
    const ariaLabelledby = button.getAttribute('aria-labelledby');
    const title = button.getAttribute('title');
    
    if (!text && !ariaLabel && !ariaLabelledby && !title) {
      issues.push({
        type: 'button',
        index,
        element: button,
        message: 'Button is missing accessible name. Add visible text, aria-label, aria-labelledby, or title attribute.'
      });
    }
  });
  
  // Check for proper ARIA role on dependencyGraph container
  const dependencyGraph = container.querySelector('.dependencyGraph');
  if (dependencyGraph) {
    const role = dependencyGraph.getAttribute('role');
    if (!role || role !== 'application') {
      issues.push({
        type: 'container',
        index: null,
        element: dependencyGraph,
        message: 'The dependencyGraph container does not have a proper ARIA role. Add role="application".'
      });
    }
  }
  
  return issues;
}

/**
 * Renders a graph visualization for accessibility issues
 * @param {Array} issues - Array of accessibility issues to render
 * @param {HTMLElement} container - The container element to render the graph into
 */
function renderAccessibilityGraph(issues, container) {
  // ... (same as before)
}

/**
 * Renders an index of accessibility issues
 * @param {Array} issues - Array of accessibility issues to render
 * @param {HTMLElement} container - The container element to render the index into
 */
function renderAccessibilityIndex(issues, container) {
  // ... (same as before)
}

/**
 * Renders both graph and index for accessibility issues
 * @param {HTMLElement} container - The container element to check for accessibility issues
 * @param {HTMLElement} outputContainer - The container element to render results into
 */
function renderAccessibilityResults(container, outputContainer) {
  const issues = checkLinkAndButtonAccessibility(container);
  
  // ... (same as before)
}

/**
 * Renders the index view of the application
 */
function renderIndexView() {
  // ... (same as before)
}

// Example usage and export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    checkLinkAndButtonAccessibility,
    renderAccessibilityGraph,
    renderAccessibilityIndex,
    renderAccessibilityResults,
    renderIndexView
  };
}

// If running in browser context
if (typeof window !== 'undefined') {
  window.checkLinkAndButtonAccessibility = checkLinkAndButtonAccessibility;
  window.renderAccessibilityGraph = renderAccessibilityGraph;
  window.renderAccessibilityIndex = renderAccessibilityIndex;
  window.renderAccessibilityResults = renderAccessibilityResults;
  window.renderIndexView = renderIndexView;
}