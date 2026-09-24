const fs = require('fs');
const main = require('./utilities');

const {
  createInPageButton: existingCreateInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  announceToScreenReader: originalAnnounceToScreenReader,
  handleKeyboardNav,
  originNewFocusTrap,
  exportUtils,
  transformInputData,
  initSkipLink,
  trapFocus,
  newFocusTrap,
  announceToScreenReader,
  ensureElementId: ensureElementIdOrigin,
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addAriaLabel,
  ensureElementHasIdOrigin,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addSvgAccessibleName
} = main;

const newFocusTrap = (element) => {
  if (!element) return originNewFocusTrap(element);
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

const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element;
};

// Accessibility utilities and functions
const accessibilityUtils = {
  initSkipLink,
  trapFocus,
  newFocusTrap: newFocusTrapImpl,
  announceToScreenReader,
  ensureElementId: ensureElementIdImpl,
  addAriaLabel,

  addressAccessibilityIssues() {
    // Address accessibility issues based on the harvested data (Imaginary implementation)
    const issues = [
      {
        element: null,
        solution: () => {
          // Placeholder for accessibility fix
        },
      },
    ];

    issues.forEach((issue) => {
      if (issue.element) {
        issue.solution();
      }
    });
  },

  fixDependencyGraphAria(element) {
    // Ensure the dependencyGraph container has a proper ARIA role
    if (element) {
      if (!element.getAttribute('role')) {
        element.setAttribute('role', 'region');
      }
      if (!element.getAttribute('aria-label')) {
        element.setAttribute('aria-label', 'Dependency Graph');
      }
    }
    return element;
  }
};

module.exports = {
  ...accessibilityUtils,
  addressAccessibilityIssues: accessibilityUtils.addressAccessibilityIssues,
  fixDependencyGraphAria: accessibilityUtils.fixDependencyGraphAria,
  exportUtils,
  transformInputData,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  announceToScreenReader,
  handleKeyboardNav,
  initSkipLink,
  trapFocus,
  newFocusTrap,
  ensureElementId,
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addAriaLabel,
  ensureElementHasIdOrigin,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  addSvgAccessibleName,
  fs,
  main
};