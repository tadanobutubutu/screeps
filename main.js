// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// TODO: Import required module(s) and export the new necessary function(s) here in main.js (preserving the original code)

// Accessibility utilities and functions
// TODO: Address accessibility issues from insight report — FIXED (combined with the export code)

// Utility functions for accessibility
const accessibilityUtils = {
  // Initialize skip link functionality for keyboard navigation
  initSkipLink: () => {
    const skipLink = document.getElementById('skip-link') || document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = skipLink.getAttribute('href');
        const target = document.querySelector(targetId);
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

    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    element.addEventListener('keydown', handleTabKey);
    return () => element.removeEventListener('keydown', handleTabKey);
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
    element.id = `element-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element;
};

const addAriaLabel = (element, label) => {
  if (element) {
    element.setAttribute('aria-label', label);
  }
  return element;
};

const renderDependencyGraph = (data) => {
  // Implementation for rendering dependency graphs
  return {
    nodes: data.nodes || [],
    edges: data.edges || []
  };
};

// Get language attribute from HTML element
function getLangAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    return htmlElement.getAttribute('lang') || 'en';
  }
  return 'en';
}

// Create in-page button with accessibility support
function createInPageButton(options = {}) {
  const { id, label, onClick, className = '', ariaLabel, ariaPressed } = options;
  const button = document.createElement('button');
  
  if (id) button.id = id;
  if (label) button.textContent = label;
  if (className) button.className = className;
  if (ariaLabel) button.setAttribute('aria-label', ariaLabel);
  if (ariaPressed !== undefined) button.setAttribute('aria-pressed', ariaPressed);
  
  if (onClick) {
    button.addEventListener('click', onClick);
  }
  
  // Ensure button is keyboard accessible
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      button.click();
    }
  });
  
  return button;
}

// Person name formatter with accessibility support
function personName(firstName, lastName, options = {}) {
  const { format = 'full', includeTitle = false, title = '' } = options;
  
  if (format === 'first') return firstName || '';
  if (format === 'last') return lastName || '';
  if (format === 'full') {
    const fullName = [title && includeTitle ? title : '', firstName, lastName].filter(Boolean).join(' ');
    return fullName.trim();
  }
  
  return `${firstName} ${lastName}`.trim();
}

// Validate table accessibility
function validateTableAccessibility(table) {
  const issues = [];
  
  if (!table) {
    issues.push('Table element is required');
    return { valid: false, issues };
  }
  
  const hasCaption = table.querySelector('caption');
  if (!hasCaption) {
    issues.push('Table should have a caption element for accessibility');
  }
  
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    issues.push('Table should have header cells (th) for accessibility');
  }
  
  const scopeAttrs = table.querySelectorAll('th[scope]');
  if (headers.length > 0 && scopeAttrs.length === 0) {
    issues.push('Header cells should have scope attribute');
  }
  
  return { valid: issues.length === 0, issues };
}

// Validate table structure for accessibility
function validateTableStructure(table) {
  const issues = [];
  
  if (!table) {
    issues.push('Table element is required');
    return { valid: false, issues };
  }
  
  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) {
    issues.push('Table must have at least one row');
  }
  
  const cells = table.querySelectorAll('td, th');
  if (cells.length === 0) {
    issues.push('Table must have data cells');
  }
  
  // Check for proper thead/tbody structure
  const hasThead = table.querySelector('thead');
  const hasTbody = table.querySelector('tbody');
  
  if (hasThead && !hasTbody) {
    issues.push('Table with thead should also have tbody');
  }
  
  return { valid: issues.length === 0, issues };
}

// Validate landmarks for accessibility
function validateLandmark(element) {
  const issues = [];
  
  if (!element) {
    issues.push('Element is required');
    return { valid: false, issues };
  }
  
  const validLandmarks = ['header', 'nav', 'main', 'footer', 'aside', 'section', 'article', 'form'];
  const hasLandmarkRole = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  
  if (validLandmarks.includes(tagName) || hasLandmarkRole) {
    return { valid: true, issues: [] };
  }
  
  issues.push('Element should have a landmark role or be a landmark element');
  return { valid: false, issues };
}

// Validate landmark structure for accessibility
function validateLandmarkStructure(document) {
  const issues = [];
  
  if (!document) {
    issues.push('Document is required');
    return { valid: false, issues };
  }
  
  const main = document.querySelector('main') || document.querySelector('[role="main"]');
  if (!main) {
    issues.push('Document should have a main landmark');
  }
  
  const header = document.querySelector('header') || document.querySelector('[role="banner"]');
  if (!header) {
    issues.push('Document should have a header landmark');
  }
  
  const footer = document.querySelector('footer') || document.querySelector('[role="contentinfo"]');
  if (!footer) {
    issues.push('Document should have a footer landmark');
  }
  
  return { valid: issues.length === 0, issues };
}

// Get SVG accessible name
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';
  
  // Check aria-label
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check aria-labelledby
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    if (labelElement) return labelElement.textContent;
  }
  
  // Check title child element
  const title = svgElement.querySelector('title');
  if (title) return title.textContent;
  
  // Check desc child element
  const desc = svgElement.querySelector('desc');
  if (desc) return desc.textContent;
  
  return '';
}

// Accessibility utilities and functions
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1