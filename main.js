const fs = require('fs');
const main = require('./utilities');

const accessibilityUtils = {};
(main || {}).forEach(function (val) {
  if (typeof val === 'function') {
    accessibilityUtils[val.name] = val;
  }
});

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
  originNewFocusTrap,
  exportUtils,
  transformInputData,
  initSkipLink,
  trapFocus,
  newFocusTrap: originalNewFocusTrap,
  ensureElementId,
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addAriaLabel
} = main;

accessibilityUtils.newFocusTrap = (element) => {
  if (!element) return originalNewFocusTrap(element);
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

accessibilityUtils.addressAccessibilityIssues = () => {
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
};

module.exports = {
  // ... Previous exports defined here
  addressAccessibilityIssues,
  // The new accessibilityUtils object is added directly to the exports
  ...accessibilityUtils,
};