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
  announceToScreenReader,
  handleKeyboardNav,
  newFocusTrap: originNewFocusTrap,
  exportUtils,
  addressAccessibilityIssues,
  handleCredentialResponse,
  ensureElementId: ensureElementIdOrigin,
  ensureElementHasIdOrigin,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  renderAdditionalContent,
  transformInputData,
  addSvgAccessibleName,
  initSkipLink,
  trapFocus,
  announceToScreenReader: originalAnnounceToScreenReader,
  newFocusTrap,
  ensureElementId,
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addAriaLabel
} = main;

// Accessibility utilities and functions
const accessibilityUtils = {
  initSkipLink,
  trapFocus,
  newFocusTrap: (element) => {
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

// Implement the new createInPageButton function
function createInPageButton(options) {
  const { text, icon, onClick, id, className, ariaLabel, title, disabled } = options;
  const button = document.createElement('button');
  button.textContent = text;
  if (icon) button.appendChild(icon);
  button.addEventListener('click', onClick);
  button.id = id || '';
  button.className = className || '';
  button.setAttribute('aria-label', ariaLabel || '');
  button.title = title || '';
  button.disabled = disabled || false;
  return button;
}

module.exports = {
  ...main,
  ...accessibilityUtils,
  createInPageButton,
  renderDependencyGraph,
  renderIndex,
  validateTableAccessibility,
  validateTableStructure,
  addAccessibleName,
  accessibilityUtils,
  ensureElementId,
  ensureElementHasId,
  newFocusTrap,
};