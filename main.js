// TODO: Identify and update specific functions that render dependency graphs or in main.js

function calculateSum(a, b) {
  return a + b;
}

function calculateProduct(a, b) {
  return a * b;
}

/**
 * Check the accessibility of all links and buttons on the page
 * @returns {Array} - Array of accessibility issues found
 */
function checkLinkAndButtonAccessibility() {
  const issues = [];

  let links, buttons;

  if (document.querySelectorAll('a[href]').length > 0) {
    links = [...document.querySelectorAll('a[href]')];
    links.forEach((link, index) => {
      if (!link.getAttribute('aria-label')) {
        issues.push({
          type: 'link',
          index: index,
          issue: 'Missing aria-label'
        });
      }
    });
  }

  if (document.querySelectorAll('button').length > 0) {
    buttons = [...document.querySelectorAll('button')];
    buttons.forEach((button, index) => {
      if (!button.setAttribute('aria-label', button.textContent)) {
        issues.push({
          type: 'button',
          index: index,
          issue: 'Missing aria-label'
        });
      }
    });
  }

  return issues;
}

/**
 * Checks links and buttons in the document for missing accessible names
 * @returns {Array} - Array of accessibility issues found
 */
function checkLinkAndButtonAccessibility() {
  const issues = [];
  const elements = document.querySelectorAll('a, button');

  elements.forEach((element, index) => {
    const hasAccessibleName = checkAccessibleName(element);
    if (!hasAccessibleName) {
      issues.push({
        type: element.tagName.toLowerCase() === 'a' ? 'link' : 'button',
        element: element,
        index: index,
        parentNode: element.parentNode
      });
    }
  });

  return issues;
}

/**
 * Determines whether an element has an accessible name
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - Whether the element has an accessible name
 */
function checkAccessibleName(element) {
  // Check for aria-label
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim() !== '') {
    return true;
  }

  // Check for aria-labelledby
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement && labelElement.textContent.trim() !== '') {
      return true;
    }
  }

  // Check for visible text content
  if (element.textContent.trim() !== '') {
    return true;
  }

  // Check for child img with alt text
  const img = element.querySelector('img[alt]');
  if (img && img.getAttribute('alt') && img.getAttribute('alt').trim() !== '') {
    return true;
  }

  // Check for title attribute
  const title = element.getAttribute('title');
  if (title && title.trim() !== '') {
    return true;
  }

  // Check for input with alt or aria-label (for embedded controls)
  const input = element.querySelector('input[type="image"][alt], input[type="image"][aria-label]');
  if (input) {
    const alt = input.getAttribute('alt');
    const inputAriaLabel = input.getAttribute('aria-label');
    if ((alt && alt.trim() !== '') || (inputAriaLabel && inputAriaLabel.trim() !== '')) {
      return true;
    }
  }

  return false;
}

/**
 * Checks link and button elements for accessibility issues
 * @param {Document|HTMLElement} root - The root element to scan (defaults to document)
 * @returns {Array} - Array of accessibility issues found
 */
function checkLinkAndButtonAccessibility(root) {
  const rootElement = root || (typeof document !== 'undefined' ? document : null);
  if (!rootElement) {
    return [];
  }

  const issues = [];

  // Check links
  const links = rootElement.querySelectorAll('a');
  links.forEach((link, index) => {
    const hasText = link.textContent && link.textContent.trim().length > 0;
    const hasAriaLabel = link.hasAttribute('aria-label') && link.getAttribute('aria-label').trim().length > 0;
    const hasAriaLabelledBy = link.hasAttribute('aria-labelledby');

    if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
      issues.push({
        type: 'link',
        index,
        element: link,
        problem: 'Missing accessible text'
      });
    }
  });

  // Check buttons
  const buttons = rootElement.querySelectorAll('button');
  buttons.forEach((button, index) => {
    const hasText = button.textContent && button.textContent.trim().length > 0;
    const hasAriaLabel = button.hasAttribute('aria-label') && button.getAttribute('aria-label').trim().length > 0;
    const hasAriaLabelledBy = button.hasAttribute('aria-labelledby');

    if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
      issues.push({
        type: 'button',
        index,
        element: button,
        problem: 'Missing accessible name'
      });
    }
  });

  return issues;
}

/**
 * Checks for accessibility issues on links and buttons within a given root element
 * @param {Object} rootElement - The root DOM element to scan for accessibility issues
 * @returns {Array} - Array of accessibility issues found
 */
function checkLinkAndButtonAccessibility(rootElement) {
  const issues = [];
  const baseElement = rootElement || (typeof document !== 'undefined' ? document.body : null);

  if (!baseElement) {
    return issues;
  }

  const links = baseElement.querySelectorAll ? baseElement.querySelectorAll('a') : [];
  const buttons = baseElement.querySelectorAll ? baseElement.querySelectorAll('button') : [];

  let index = 0;

  links.forEach((link) => {
    const hasText = link.textContent && link.textContent.trim().length > 0;
    const hasAriaLabel = link.getAttribute('aria-label');
    const hasAccessibleName = hasText || hasAriaLabel;

    if (!hasAccessibleName) {
      issues.push({
        type: 'link',
        element: link,
        index: index++,
        issue: 'Link is missing accessible text or aria-label'
      });
    }
  });

  buttons.forEach((button) => {
    const hasText = button.textContent && button.textContent.trim().length > 0;
    const hasAriaLabel = button.getAttribute('aria-label');
    const hasAccessibleName = hasText || hasAriaLabel;

    if (!hasAccessibleName) {
      issues.push({
        type: 'button',
        element: button,
        index: index++,
        issue: 'Button is missing accessible text or aria-label'
      });
    }
  });

  return issues;
}

/**
 * Addresses accessibility issues from an insight report by applying fixes
 * @param {Array} issues - Array of accessibility issues to address
 * @param {Object} options - Options for how to address the issues
 * @param {string} options.defaultText - Default text to add when no other text is available
 * @param {boolean} options.useAriaLabel - Prefer aria-label over visible text
 * @returns {Object} - Summary of fixes applied
 */
function addressAccessibilityIssues(issues, options = {}) {
  const defaultText = options.defaultText || 'Action';
  const useAriaLabel = options.useAriaLabel || false;

  const summary = {
    totalIssues: issues.length,
    linkIssuesFixed: 0,
    buttonIssuesFixed: 0,
    skipped: 0,
    fixes: []
  };

  // Modified to also handle the new checkLinkAndButtonAccessibility function
  issues = checkLinkAndButtonAccessibility();

    try {
      if (issue.type === 'link') {
        if (useAriaLabel) {
          issue.element.setAttribute('aria-label', defaultText);
        } else {
          // Add visible text content
          const textNode = document.createTextNode(defaultText);
          issue.element.appendChild(textNode);
        }
        issue.element.setAttribute('tabindex', '0');
        summary.linkIssuesFixed++;
        summary.fixes.push({
          type: 'link',
          index: issue.index,
          action: 'Added accessible text content'
        });
      } else if (issue.type === 'button') {
        if (useAriaLabel) {
          issue.element.setAttribute('aria-label', defaultText);
        } else {
          // Add visible text content
          const textNode = document.createTextNode(defaultText);
          issue.element.appendChild(textNode);
        }
        issue.element.setAttribute('aria-pressed', 'false');
        summary.buttonIssuesFixed++;
        summary.fixes.push({
          type: 'button',
          index: issue.index,
          action: 'Added accessible name'
        });
      }
    } catch (error) {
      summary.skipped++;
      summary.fixes.push({
        type: issue.type,
        index: issue.index,
        action: 'Failed to fix',
        error: error.message
      });
    }
  });

  return summary;
}

/**
 * Renders a graph visualization using the provided data
 * @param {HTMLElement} container - The container element to render into
 * @param {Object} data - The data to render in the graph
 * @param {Object} options - Rendering options
 * @returns {Object} - Rendering result with success status and details
 */
function renderGraph(container, data, options = {}) {
  const defaultOptions = {
    width: options.width || 600,
    height: options.height || 400,
    colorScheme: options.colorScheme || 'default'
  };

  const result = {
    success: true,
    container: container,
    dimensions: {
      width: defaultOptions.width,
      height: defaultOptions.height
    },
    nodes: data.nodes || [],
    edges: data.edges || []
  };

  if (typeof container !== 'undefined' && container) {
    container.style.width = `${defaultOptions.width}px`;
    container.style.height = `${defaultOptions.height}px`;
  }

  return result;
}

/**
 * Renders an index view for navigating graph data
 * @param {HTMLElement} container - The container element to render into
 * @param {Array} items - Array of items to display in the index
 * @param {Object} options - Rendering options
 * @returns {Object} - Rendering result with success status and details
 */
function renderIndex(container, items, options = {}) {
  const defaultOptions = {
    sortable: options.sortable !== undefined ? options.sortable : true,
    searchable: options.searchable !== undefined ? options.searchable : true
  };

  const result = {
    success: true,
    container: container,
    itemCount: items.length,
    options: defaultOptions,
    renderedItems: []
  };

  items.forEach((item, index) => {
    result.renderedItems.push({
      index: index,
      label: item.label || item.name || `Item ${index}`,
      id: item.id || index
    });
  });

  return result;
}

function calculateProduct(a, b) {
  return a * b;
}

// Exports for the functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { addressAccessibilityIssues, calculateSum, calculateProduct, renderGraph, renderIndex };
}

// If running in browser context
if (typeof window !== 'undefined') {
  window.addressAccessibilityIssues = addressAccessibilityIssues;
  window.calculateSum = calculateSum;
  window.calculateProduct = calculateProduct;
  window.renderGraph = renderGraph;
  window.renderIndex = renderIndex;
}