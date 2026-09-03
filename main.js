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
  newFocusTrap,
  ensureElementId: ensureElementIdOrigin,
  ensureElementId,
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addAriaLabel,
  addressAccessibilityIssues,
  handleCredentialResponse,
  ensureElementHasIdOrigin,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addSvgAccessibleName,
  addMainLandmarkToIndex,
  focusTrap,
  renderAdditionalContent,
} = main;

// Utility functions for ensuring elements have IDs and adding labels
const ensureElementIdFn = (element) => {
  if (element && !element.id) {
    element.id = 'element-' + Math.random().toString(36).substr(2, 9);
  }
  return element;
};

const ensureElementHasIdFn = (element, prefix = 'element') => {
  if (!element) {
    throw new Error('Element is required');
  }
};

const wrapPrimaryContentInMain = () => {
  // Check if a main element already exists
  let mainElement = document.querySelector('main');

  if (!mainElement) {
    // If no main element exists, create one
    mainElement = document.createElement('main');

    // Find the primary content container (commonly #content, .content, or the body)
    const contentSelectors = ['#content', '.content', '#main', '.main', 'article', '[role="main"]'];
    let primaryContent = null;

    for (const selector of contentSelectors) {
      primaryContent = document.querySelector(selector);
      if (primaryContent) {
        break;
      }
    }

    if (primaryContent && primaryContent.parentNode) {
      primaryContent.parentNode.insertBefore(mainElement, primaryContent);
      while (primaryContent.firstChild) {
        mainElement.appendChild(primaryContent.firstChild);
      }
    }
  }

  return mainElement;
};

const newFocusTrap = (element) => {
  if (!element) return;
  const focusable = element.querySelectorAll(
    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  });
};

const trapFocus = (element) => {
  if (!element) return;
  const focusable = element.querySelectorAll(
    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  if (focusable.length === 0) return;
  
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  
  element.setAttribute('tabindex', '-1');
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    }
  });
  first.focus();
};

// Accessibility utilities and functions
const accessibilityUtils = {
  initSkipLink,
  trapFocus,
  newFocusTrap,
  announceToScreenReader: originalAnnounceToScreenReader,
  ensureElementId: ensureElementIdOrigin,
  ensureElementHasId: ensureElementHasIdOrigin,
  addAriaLabel,
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addSvgAccessibleName,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  handleKeyboardNav,
  renderDependencyGraphs,
  handleCredentialResponse,

  addressAccessibilityIssues() {
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

  createWebResourceButton(url, options = {}) {
    const {
      label,
      icon,
      iconPosition = 'before',
      buttonClass = 'web-resource-btn',
      ariaLabel,
      target = '_blank',
      rel = 'noopener noreferrer'
    } = options;

    // Create the anchor element for external web resources
    const button = document.createElement('a');
    button.href = url;
    button.target = target;
    button.rel = rel;
    
    // Set accessible label
    if (ariaLabel) {
      button.setAttribute('aria-label', ariaLabel);
    } else {
      button.setAttribute('aria-label', label);
    }
    
    // Set role for accessibility
    button.setAttribute('role', 'button');
    
    // Add class for styling
    button.className = buttonClass;
    
    // Make it keyboard accessible
    button.tabIndex = 0;
    
    // Add icon if provided
    if (icon) {
      if (iconPosition === 'before') {
        button.appendChild(icon);
        button.appendChild(document.createTextNode(` ${label}`));
      } else {
        button.appendChild(document.createTextNode(`${label} `));
        button.appendChild(icon);
      }
    } else {
      button.textContent = label;
    }
    
    // Handle keyboard interaction
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
      }
    });
    
    return button;
  },
};

// Placeholder for newFunction
const newFunction = (...args) => {
  // Implementation for newFunction
  return args;
};

module.exports = {
  ...main,
  ...accessibilityUtils,
  createWebResourceButton: accessibilityUtils.createWebResourceButton,
  addressAccessibilityIssues: accessibilityUtils.addressAccessibilityIssues,
  accessibilityUtils,
  newFocusTrap,
  wrapPrimaryContentInMain,
  ensureElementId: ensureElementIdFn,
  ensureElementHasId: ensureElementHasIdFn,
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  ensureElementHasIdOrigin,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addSvgAccessibleName,
  addMainLandmarkToIndex,
  focusTrap,
  renderAdditionalContent,
  newFunction,
};