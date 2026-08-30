const fs = require('fs');

// Accessibility utilities and functions
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and newFocusTrap())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), personName())
// - ADD: Address new accessibility issues from insight report
// - NEW: Implement a new function to handle focus trap for keyboard navigation (handled by newFocusTrap())

const accessibilityUtils = {
  // ... Existing accessibility utilities (initSkipLink, trapFocus, announceToScreenReader, handleKeyboardNav)

  newFocusTrap: (element) => {
    if (!element && typeof document !== 'undefined' && document.activeElement) {
      element = document.activeElement.closest ? document.activeElement.closest('[data-focus-trap]') : null;
    }
    if (!element || typeof element.querySelectorAll !== 'function') return;
    const focusable = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const onKeyDown = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    element.addEventListener('keydown', onKeyDown);
  },

  // ... Existing utilities (getLangAttribute(), personName())

  validateTableAccessibility: (table) => {
    // ... Existing implementation for validateTableAccessibility()
  },

  validateTableStructure: (table) => {
    // ... Existing implementation for validateTableStructure()
  },

  validateLandmark: (element) => {
    // ... Existing implementation for validateLandmark()
  },

  validateLandmarkStructure: (element) => {
    // ... Existing implementation for validateLandmarkStructure()
  },

  createInPageButton: (text, onClick) => {
    // ... Existing implementation for createInPageButton()
  },

  // ... Existing utilities (getSvgAccessibleName(), transformInputData())
};

// ... Existing data processing functions (processData(), filterValidItems())

const initAccessibility = () => {
  accessibilityUtils.initSkipLink();
  // ... Add keyboard support for all interactive elements
};

// ... New function: validateTableAccessibility

// ... Export all utilities
module.exports = {
  accessibilityUtils,
  initAccessibility,
  // ... Other exports like handleCredentialResponse, ensureElementId, addAriaLabel, renderDependencyGraph, calculateSum, newFocusTrap, log, sanitizeFilename, readFileSafe, processData, filterValidItems, groupByCategory, transformInputData, validateTableAccessibility, ensureElementHasId
};