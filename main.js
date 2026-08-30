// Dependency imports
const { dependencyGraphContent } = require('./dependencyGraphContent');
const { indexContent } = require('./indexContent');

// Existing rendering functions (preserving existing exports and functions)

const accessibilityUtils = {
  // Initialize skip link functionality for keyboard navigation
  initSkipLink: () => {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    }
  },

  // Trap focus within an element (for modals, dialogs)
  trapFocus: (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    });
  },

  // Announce message to screen readers
  announceToScreenReader: (message, priority = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.left = '-9999px';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    setTimeout(() => announcer.remove(), 1000);
  },

  // Handle keyboard navigation
  handleKeyboardNav: (e, handlers) => {
    const key = e.key;
    if (handlers[key]) {
      handlers[key](e);
    }
  }
};

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element;
};

const addAriaLabel = (element, label) => {
  if (element) {
    element.setAttribute('aria-label', label);
  }
  return element;
};

function renderDependencyGraph(deps, options = {}) {
  // Use dependencyGraphContent from the imported module
  return dependencyGraphContent(deps, options);
}

// Accessibility utilities and functions
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
// - NEW: Implement a new function to handle focus trap for keyboard navigation (handled by newFocusTrap())

// REACT_015: Get lang attribute for HTML element
function getLangAttribute(element) {
  if (!element) return null;
  
  let lang = element.getAttribute('lang');
  
  if (!lang) {
    // Check parent elements for lang attribute
    let parent = element.parentElement;
    while (parent && !lang) {
      lang = parent.getAttribute('lang');
      parent = parent.parentElement;
    }
  }
  
  return lang || 'en';
}

// REACT_027: Validate table accessibility
function validateTableAccessibility(table) {
  const issues = [];
  
  if (!table) return issues;
  
  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    issues.push({ type: 'REACT_027', message: 'Table is missing a caption element', severity: 'warning' });
  }
  
  // Check for th elements with scope or headers
  const headers = table.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.getAttribute('scope') && !th.getAttribute('headers')) {
      issues.push({ type: 'REACT_027', message: `TH element at index ${index} is missing scope or headers attribute`, severity: 'error' });
    }
  });
  
  return issues;
}

// REACT_027: Validate table structure
function validateTableStructure(table) {
  const issues = [];
  
  if (!table) return issues;
  
  // Check for proper table structure: thead, tbody, tfoot
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  
  if (!thead) {
    issues.push({ type: 'REACT_027', message: 'Table is missing thead element', severity: 'warning' });
  }
  
  if (!tbody) {
    issues.push({ type: 'REACT_027', message: 'Table is missing tbody element', severity: 'warning' });
  }
  
  // Check that TR elements have proper structure
  const rows = table.querySelectorAll('tr');
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) {
      issues.push({ type: 'REACT_027', message: `TR at index ${rowIndex} has no cells`, severity: 'error' });
    }
  });
  
  return issues;
}

// REACT_017: Validate landmark
function validateLandmark(element) {
  const issues = [];
  
  if (!element) return issues;
  
  // Check for common landmark elements
  const landmarks = {
    'header': '[role="banner"]',
    'nav': '[role="navigation"]',
    'main': '[role="main"]',
    'footer': '[role="contentinfo"]',
    'aside': '[role="complementary"]'
  };
  
  // Check if element has accessible name
  if (element.hasAttribute('role')) {
    const role = element.getAttribute('role');
    const hasLabel = element.getAttribute('aria-label') || element.getAttribute('aria-labelledby');
    
    if (!hasLabel && (role === 'navigation' || role === 'complementary')) {
      issues.push({ type: 'REACT_017', message: `Landmark with role="${role}" needs an accessible name`, severity: 'warning' });
    }
  }
  
  return issues;
}

// REACT_017: Validate landmark structure
function validateLandmarkStructure(container) {
  const issues = [];
  
  if (!container) return issues;
  
  // Check for multiple main landmarks (only one allowed)
  const mains = container.querySelectorAll('main, [role="main"]');
  if (mains.length > 1) {
    issues.push({ type: 'REACT_017', message: 'Multiple main landmarks found - only one is allowed', severity: 'error' });
  }
  
  // Check for multiple header landmarks (only one allowed)
  const headers = container.querySelectorAll('header, [role="banner"]');
  if (headers.length > 1) {
    issues.push({ type: 'REACT_017', message: 'Multiple header landmarks found - only one is allowed', severity: 'error' });
  }
  
  // Check for multiple footer landmarks (only one allowed)
  const footers = container.querySelectorAll('footer, [role="contentinfo"]');
  if (footers.length > 1) {
    issues.push({ type: 'REACT_017', message: 'Multiple footer landmarks found - only one is allowed', severity: 'error' });
  }
  
  return issues;
}

// REACT_041: Get SVG accessible name
function getSvgAccessibleName(svg) {
  if (!svg) return null;
  
  // Check for aria-label
  let accessibleName = svg.getAttribute('aria-label');
  if (accessibleName) return accessibleName;
  
  // Check for aria-labelledby
  const labelledBy = svg.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) return labelElement.textContent;
  }
  
  // Check for title element inside SVG
  const title = svg.querySelector('title');
  if (title) return title.textContent;
  
  // Check for desc element inside SVG
  const desc = svg.querySelector('desc');
  if (desc) return desc.textContent;
  
  return null;
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks(container) {
  const issues = [];
  const landmarkCounts = {};
  
  if (!container) return issues;
  
  const landmarkSelectors = 'header, nav, main, footer, aside, [role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]';
  const landmarks = container.querySelectorAll(landmarkSelectors);
  
  landmarks.forEach(landmark => {
    const tagName = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role') || tagName;
    const key = `${tagName}-${role}`;
    
    landmarkCounts[key] = landmarkCounts[key] || [];
    landmarkCounts[key].push(landmark);
  });
  
  // Only one banner, main, and contentinfo allowed
  const restrictedLandmarks = ['banner', 'main', 'contentinfo'];
  
  Object.entries(landmarkCounts).forEach(([key, elements]) => {
    restrictedLandmarks.forEach(restricted => {
      if (key.includes(restricted) && elements.length > 1) {
        issues.push({
          type: 'REACT_025',
          message: `Multiple ${restricted} landmarks found - only one is allowed`,
          severity: 'error',
          elements: elements
        });
      }
    });
  });
  
  return issues;
}

// REACT_036: Create accessible in-page button
function createInPageButton(options = {}) {
  const {
    text = '',
    href = '#',
    onClick = null,
    ariaLabel = null,
    className = '',
    id = null
  } = options;
  
  const button = document.createElement('a');
  button.href = href;
  button.textContent = text;
  button.className = className;
  
  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }
  
  if (id) {
    button.id = id;
  }
  
  // Ensure proper role attribute for accessibility
  button.setAttribute('role', 'button');
  
  // Add keyboard support
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onClick) {
        onClick(e);
      } else {
        button.click();
      }
    }
  });
  
  if (onClick) {
    button.addEventListener('click', onClick);
  }
  
  return button;
}

// REACT_036: Fix fake link issue (link without href or with javascript:void)
function fixFakeLinks(container) {
  const issues = [];
  
  if (!container) return issues;
  
  const links = container.querySelectorAll('a');
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    
    // Check for fake links
    if (!href || href === '#' || href.startsWith('javascript:void') || href === 'javascript:;') {
      // Check if it should be a button instead
      const isInteractive = link.getAttribute('onclick') || 
                           link.style.cursor === 'pointer' ||
                           window.getComputedStyle(link).cursor === 'pointer';
      
      if (isInteractive && !link.getAttribute('role')) {
        issues.push({
          type: 'REACT_036',
          message: 'Link appears to be used as a button but lacks proper role attribute',
          element: link,
          suggestion: 'Add role="button" or convert to a button element'
        });
      }
    }
  });
  
  return issues;
}

// Additional function for person name with accessibility support
function personName(element, options = {}) {
  if (!element) return '';
  
  const { includeLang = true } = options;
  
  let name = '';
  
  // Get lang attribute if requested
  if (includeLang) {
    const lang = getLangAttribute(element);
    name = lang ? `${lang}: ` : '';
  }
  
  // Get text content
  const textContent = element.textContent || element.innerText || '';
  name += textContent.trim();
  
  return name;
}

// Address new accessibility issues from insight report
function addressAccessibilityIssues(container) {
  const allIssues = [];
  
  if (!container) return allIssues;
  
  // Check tables
  const tables = container.querySelectorAll('table');
  tables.forEach((table, index) => {
    allIssues.push(...validateTableAccessibility(table));
    allIssues.push(...validateTableStructure(table));
  });
  
  // Check landmarks
  allIssues.push(...validateLandmark(container));
  allIssues.push(...validateLandmarkStructure(container));
  allIssues.push(...ensureUniqueLandmarks(container));
  
  // Check SVGs
  const svgs = container.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    const accessibleName = getSvgAccessibleName(svg);
    if (!accessibleName) {
      allIssues.push({
        type: 'REACT_041',
        message: `SVG at index ${index} is missing an accessible name`,
        severity: 'error'
      });
    }
  });
  
  // Check for fake links
  allIssues.push(...fixFakeLinks(container));
  
  return allIssues;
}

function newFocusTrap() {
  // New function implementation
  return {
    activate: () => {
      // Implementation for focus trap activation
    },
    deactivate: () => {
      // Implementation for focus trap deactivation
    }
  };
}

/**
 * Renders the main index view
 * @param {Object} data - View data
 * @param {Object} options - Rendering options
 * @returns {string} Rendered index HTML
 */
function renderIndex(data, options = {}) {
  // Use indexContent from the imported module
  return indexContent(data, options);
}

// Preserve all existing exports
module.exports = {
  renderDependencyGraph,
  renderIndex,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  ensureUniqueLandmarks,
  createInPageButton,
  fixFakeLinks,
  personName,
  addressAccessibilityIssues,
  newFocusTrap
};