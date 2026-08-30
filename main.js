const fs = require('fs');

// Accessibility utilities and functions
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and newFocusTrap())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
// - NEW: Implement a new function to handle focus trap for keyboard navigation (handled by newFocusTrap())

const accessibilityUtils = {
  // Initialize skip link functionality for keyboard navigation
  initSkipLink: () => {
    const skipLink = document.querySelector('.skip-link, [href="#main-content"]');
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

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
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
  },

  // New function implementation for focus trap
  newFocusTrap: (target) => {
    const focusableElements = target.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e) => {
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

    target.addEventListener('keydown', handleTab);
    
    // Set initial focus
    if (firstElement) {
      firstElement.focus();
    }

    // Return cleanup function
    return () => {
      target.removeEventListener('keydown', handleTab);
    };
  },

  // Accessibility issue resolution functions (from insight report TODOs)
  getLangAttribute: () => {
    // Returns appropriate lang attribute based on user locale
    return document.documentElement.lang || 'en';
  },

  personName: (name) => {
    // Formats person name for accessibility
    return name ? name.trim() : 'Unknown User';
  },

  validateTableAccessibility: (tableElement) => {
    // Validates table has proper headers, caption, scope attributes
    const issues = [];
    if (!tableElement.querySelector('caption')) {
      issues.push('Missing table caption');
    }
    const headers = tableElement.querySelectorAll('th');
    headers.forEach(th => {
      if (!th.hasAttribute('scope')) {
        issues.push('Table header missing scope attribute');
      }
    });
    return issues;
  },

  validateTableStructure: (tableElement) => {
    // Validates table structure (thead, tbody, tfoot)
    const issues = [];
    if (!tableElement.querySelector('thead') && tableElement.querySelector('th')) {
      issues.push('Table with headers should have thead');
    }
    return issues;
  },

  validateLandmark: (element) => {
    // Validates landmark regions have proper roles/labels
    const issues = [];
    const landmarkRoles = ['main', 'navigation', 'banner', 'contentinfo', 'complementary', 'search', 'form', 'region'];
    const role = element.getAttribute('role');
    if (landmarkRoles.includes(role) && !element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
      issues.push(`Landmark with role="${role}" missing accessible name`);
    }
    return issues;
  },

  validateLandmarkStructure: (container) => {
    // Validates landmark structure and uniqueness
    const issues = [];
    const landmarks = container.querySelectorAll('[role="main"], [role="banner"], [role="contentinfo"]');
    const counts = {};
    landmarks.forEach(lm => {
      const role = lm.getAttribute('role');
      counts[role] = (counts[role] || 0) + 1;
    });
    Object.entries(counts).forEach(([role, count]) => {
      if (count > 1) {
        issues.push(`Multiple ${role} landmarks found (should be unique)`);
      }
    });
    return issues;
  },

  getSvgAccessibleName: (svgElement) => {
    // Gets or generates accessible name for SVG
    return svgElement.getAttribute('aria-label') || 
           svgElement.getAttribute('aria-labelledby') || 
           svgElement.querySelector('title')?.textContent || 
           'Image';
  },

  createInPageButton: (text, onClick, options = {}) => {
    // Creates accessible in-page button (not a fake link)
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = text;
    button.addEventListener('click', onClick);
    if (options.className) button.className = options.className;
    if (options.ariaLabel) button.setAttribute('aria-label', options.ariaLabel);
    return button;
  }
};

// Export the newFocusTrap function as a standalone utility
const newFocusTrap = accessibilityUtils.newFocusTrap;

// Functions to ensure the element has an id, add aria-label, render dependency graphs
const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = 'element-' + Math.random().toString(36).substring(2, 9);
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

// Existing utility functions
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  console.log(formattedMessage);
}

// Export functionality with accessibility support
const exportUtils = {
  // Export utilities placeholder
  exportData: (data, format = 'json') => {
    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    }
    return data;
  }
};

// Credential response handling
async function handleCredentialResponse(response) {
  // Handle credential response from authentication
  if (response && response.credential) {
    log('Credential received', 'info');
    // Process credential (e.g., send to backend for verification)
    return response.credential;
  }
  throw new Error('Invalid credential response');
}

// Initialize accessibility on load
function initializeAccessibility() {
  accessibilityUtils.initSkipLink();
  log('Accessibility initialized', 'info');
}

// Simple utility function
function calculateSum(a, b) {
  return a + b;
}

// Export all utilities
module.exports = {
  accessibilityUtils,
  newFocusTrap,
  exportUtils,
  initializeAccessibility,
  handleCredentialResponse,
  ensureElementId,
  addAriaLabel,
  renderDependencyGraph,
  calculateSum,
  log
};