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
  
  // Check for lang attribute on HTML element
  const htmlElement = document.documentElement;
  if (!htmlElement.getAttribute('lang')) {
    issues.push({
      type: 'html',
      index: null,
      element: htmlElement,
      message: 'HTML element is missing a lang attribute. Add a lang attribute to the HTML element.'
    });
  }

  // Check for landmark roles and fix landmark issues
  const landmarks = ['main', 'nav', 'header', 'footer', 'article', 'section', 'aside'];
  landmarks.forEach(landmark => {
    const elements = container.querySelectorAll(`[role="${landmark}"]`);
    elements.forEach(element => {
      if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
        issues.push({
          type: 'landmark',
          index: null,
          element,
          message: `Element with role="${landmark}" is missing an accessible name. Add an aria-label or aria-labelledby attribute.`
        });
      }
    });
  });

  // Check for accessible names on 2 SVGs
  const svgs = container.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (index < 2 && !svg.querySelector('title') && !svg.querySelector('desc')) {
      issues.push({
        type: 'svg',
        index,
        element: svg,
        message: 'SVG element is missing an accessible name. Add a title or desc element.'
      });
    }
  });

  // Ensure unique landmarks
  const usedLandmarks = new Set();
  landmarks.forEach(landmark => {
    const elements = container.querySelectorAll(`[role="${landmark}"]`);
    elements.forEach(element => {
      usedLandmarks.add(element);
    });
  });
  for (const landmark of landmarks) {
    const elements = container.querySelectorAll(`[role="${landmark}"]`);
    if (elements.length !== usedLandmarks.size) {
      issues.push({
        type: 'landmark',
        index: null,
        element: elements[0],
        message: `There are duplicate elements with role="${landmark}". Ensure each element has a unique ID or name.`
      });
    }
  };

  // Fix 1 fake link issue
  const fakeLinks = container.querySelectorAll('.fake-link');
  fakeLinks.forEach(fakeLink => {
    if (!fakeLink.getAttribute('href')) {
      issues.push({
        type: 'fake-link',
        index: null,
        element: fakeLink,
        message: 'Fake link element is missing a href attribute. Add a valid href attribute.'
      });
    }
  });

  return issues;
}

/**
 * Renders a graph visualization for accessibility issues
 * @param {Array} issues - Array of accessibility issues to render
 * @param {HTMLElement} container - The container element to render the graph into
 */
function renderAccessibilityGraph(issues, container) {
  // ... existing implementation ...
}

/**
 * Renders an index of accessibility issues
 * @param {Array} issues - Array of accessibility issues to render
 * @param {HTMLElement} container - The container element to render the index into
 */
function renderAccessibilityIndex(issues, container) {
  // ... existing implementation ...
}

/**
 * Renders both graph and index for accessibility issues
 * @param {HTMLElement} container - The container element to check for accessibility issues
 * @param {HTMLElement} outputContainer - The container element to render results into
 */
function renderAccessibilityResults(container, outputContainer) {
  const issues = checkLinkAndButtonAccessibility(container);
  
  // ... existing implementation ...
}

/**
 * Renders the index view of the application
 */
function renderIndexView() {
  // ... existing implementation ...
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