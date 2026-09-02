const fs = require('fs');
const main = require('./utilities');

const {
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  announceToScreenReader: originalAnnounceToScreenReader,
  handleKeyboardNav,
  exportUtils,
  transformInputData,
  initSkipLink,
  trapFocus,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  renderAdditionalContent,
  ensureElementId,
  ensureElementHasId,
  newFocusTrap,
  renderAdditionalContent,
  transformInputData,
} = main;

const accessibilityUtils = {
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

  trapFocus: (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
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

  ensureElementId: (element) => {
    if (element && !element.id) {
      element.id = `elem-${Math.random().toString(36).substr(2, 9)}`;
    }
    return element;
  },

  addAriaLabel: (element) => {
    // Add ARIA label to improve accessibility
    element.setAttribute('aria-label', 'Accessible element');
  },

  addressAccessibilityIssues: () => {
    // Address accessibility issues based on the harvested data (Imaginary implementation)
    const issues = [
      {
        element: document.querySelector('#issue-1'),
        solution: () => {
          element.setAttribute('aria-label', 'Fixed Issue 1');
        },
      },
      {
        element: document.querySelector('#issue-2'),
        solution: () => {
          element.classList.add('focusable');
        },
      },
    ];

    issues.forEach((issue) => {
      if (issue.element) {
        issue.solution();
      }
    });
  },

  ensureElementIdOrigin: (element) => {
    if (!element) return;
    const id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    element.id = id;
    return id;
  },

  renderDependencyGraphs: () => {
    // Render dependency graphs in the UI
  },

  fixButtonIdentifiers: () => {
    // Fix button identifier issues
  },

  fixDependencyGraphAria: () => {
    // Fix ARIA issues in dependency graphs
  },

  addSvgAccessibleName: (svgElement) => {
    // Add accessible name to SVG elements
  }
} = main;

// Utility functions for ensuring elements have IDs and adding labels
const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element;
};

const ensureElementHasId = (element, prefix = 'element') => {
  if (!element) {
    throw new Error('Element is required');
  }

  const id = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  element.id = id;
  return id;
};

const accessibilityUtils = {
  initSkipLink,
  trapFocus,
  announceToScreenReader,
  ensureElementId,
  addAriaLabel,
  addressAccessibilityIssues,
  ensureElementIdOrigin,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addSvgAccessibleName,
  ensureElementIdOrigin,
  renderAdditionalContent,
};

module.exports = {
  ...main,
  ...accessibilityUtils,
  renderDependencyGraph,
  renderIndex,
  validateTableAccessibility,
  validateTableStructure,
  addAccessibleName,
  accessibilityUtils,
  ensureElementId,
  ensureElementHasId,
  newFocusTrap,
  handleCredentialResponse,
  initAccessibility,
  groupByCategory,
  log,
  sanitizeFilename,
  readFileSafe,
  processData,
  filterValidItems,
  exportUtilities,
  harvest,
  harvestSync
};