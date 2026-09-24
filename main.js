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
  addAriaLabel,
  addLangAttribute: () => {
    // Example function to add lang attribute to the document
    const lang = document.documentElement.getAttribute('lang') || 'en';
    if (!lang) {
      console.error('No language set for document.');
    }
    document.documentElement.setAttribute('lang', lang);
  },
  addSvgAccessibleName: (svg, name) => {
    // Example function to add accessible name to SVGs
    if (svg) {
      const title = svg.querySelector('title');
      if (!title) {
        const titleElement = document.createElement('title');
        titleElement.textContent = name;
        svg.insertBefore(titleElement, svg.firstChild);
      } else {
        title.textContent = name;
      }
    }
  },
  ensureUniqueLandmarks: () => {
    // Example function to ensure unique landmarks
    const landmarks = ['nav', 'main', 'aside', 'footer', 'header'];
    landmarks.forEach(landmark => {
      const count = document.querySelectorAll(landmark).length;
      if (count > 1) {
        console.error(`Duplicate ${landmark} element detected.`);
      }
    });
  },
  fixTableStructureIssues: () => {
    // Example function to fix table structure issues
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      // Example check: Ensure table has a caption
      const caption = table.querySelector('caption');
      if (!caption) {
        const captionElement = document.createElement('caption');
        captionElement.textContent = 'Table content description';
        table.insertBefore(captionElement, table.firstChild);
      }
    });
  }
};

module.exports = {
  ...main,
  ...accessibilityUtils,
};