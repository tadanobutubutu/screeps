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
  announceToScreenReader,
  handleKeyboardNav,
  exportUtils,
  transformInputData,
  initSkipLink,
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
  ensureElementId,
  addAriaLabel
};

module.exports = {
  ...main,
  ...accessibilityUtils,
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
  accessibilityUtils,
};