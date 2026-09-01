const fs = require('fs');
const main = require('./utilities');

const { createInPageButton, createWebResourceButton, validateTableAccessibility, validateTableStructure, validateLandmark, validateLandmarkStructure, getSvgAccessibleName, getLangAttribute, validateAccessibilityReport, exportUtils, addressAccessibilityIssues, handleCredentialResponse, ensureElementHasId, ensureElementHasIdOrigin, addAriaLabel, renderDependencyGraphs, fixButtonIdentifiers, fixDependencyGraphAria, addMainLandmarkToIndex, focusTrap, renderAdditionalContent } = main;

const ensureElementIdUtil = (element) => {
  if (element && !element.id) {
    element.id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element;
};

const newFocusTrap = accessibilityUtils.newFocusTrap;

const accessibilityUtils = {
  ...accessibilityUtils,
  ...{
    initSkipLink: function () {
      const skipLink = document.querySelector('.skip-link, [href="#main-content"]');
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

    trapFocus: function (element) {
      const focusableElements = element.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
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

    getFullLangAttribute: function (locale = 'en') {
      return `${locale}-RU`;
    },

    createInPageButton: createInPageButton,

    createWebResourceButton: createWebResourceButton,

    ensureUniqueLandmarkId: function (landmark) {
      if (!landmark) return;
      if (landmark.id) return landmark.id;
      landmark.id = `landmark-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return landmark.id;
    },

    uniqueLandmarks: function () {
      const landmarks = document.querySelectorAll('[role=banner], [role=navigation]');
      const ids = new Set();

      landmarks.forEach((landmark) => {
        const id = landmark.id;
        if (id) ids.add(id);
      });

      return ids.size < 2;
    },

    createAccessibleLink: function (url, text, target, ariaLabel) {
      const link = document.createElement('a');
      link.href = url;
      link.textContent = text;
      link.setAttribute('target', target || '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      if (ariaLabel) {
        link.setAttribute('aria-label', ariaLabel);
      }
      return link;
    },

    initSkipLink: function () {
      const skipLink = document.querySelector('.skip-link, [href="#main-content"]');
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

    trapFocus: function (element) {
      const focusableElements = element.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
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

    getFullLangAttribute: function (locale = 'en') {
      return `${locale}-RU`;
    },

    createInPageButton: createInPageButton,

    createWebResourceButton: createWebResourceButton,

    ensureUniqueLandmarkId: function (landmark) {
      if (!landmark) return;
      if (landmark.id) return landmark.id;
      landmark.id = `landmark-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return landmark.id;
    },

    uniqueLandmarks: function () {
      const landmarks = document.querySelectorAll('[role=banner], [role=navigation]');
      const ids = new Set();

      landmarks.forEach((landmark) => {
        const id = landmark.id;
        if (id) ids.add(id);
      });

      return ids.size < 2;
    },

    createAccessibleLink: function (url, text, target, ariaLabel) {
      const link = document.createElement('a');
      link.href = url;
      link.textContent = text;
      link.setAttribute('target', target || '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      if (ariaLabel) {
        link.setAttribute('aria-label', ariaLabel);
      }
      return link;
    },

    handleAccessibilityIssues: function (options = {}) {
      const root = options.root || document;
      const report = {
          langApplied: false,
          landmarksValidated: 0,
          tablesValidated: 0,
          svgsLabeled: 0,
          fakeLinksHandled: 0
      };

      if (!root) {
        return report;
      }

      // Add lang attribute to HTML element (REACT_015)
      if (!root.documentElement.hasAttribute('lang')) {
        root.documentElement.setAttribute('lang', 'en');
        report.langApplied = true;
      }

      // Fix table structure issues (REACT_027)
      const tables = root.querySelectorAll('table');
      tables.forEach(table => {
        const headers = table.querySelectorAll('th');
        headers.forEach(th => {
          if (!th.hasAttribute('scope')) {
            th.setAttribute('scope', 'col');
          }
        });
        report.tablesValidated++;
      });

      // Add landmark roles and fix landmark issues (REACT_017)
      const main = root.querySelector('main');
      if (main && !main.hasAttribute('role')) {
        main.setAttribute('role', 'main');
        report.landmarksValidated++;
      }

      // Add accessible names to SVGs (REACT_041)
      const svgs = root.querySelectorAll('svg');
      svgs.forEach((svg, index) => {
        if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
          svg.setAttribute('aria-label', `svg-${index + 1}`);
          report.svgsLabeled++;
        }
      });

      // Ensure unique landmarks (REACT_025)
      const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
      landmarks.forEach(landmark => {
        const elements = root.querySelectorAll(landmark);
        if (elements.length > 1) {
          elements.forEach((el, i) => {
            if (!el.id) {
              el.id = `${landmark}-${i + 1}`;
            }
          });
        }
      });

      // Fix fake link issue (REACT_036)
      const fakeLinks = root.querySelectorAll('a[href="#"]:not([role="button"])');
      fakeLinks.forEach(link => {
        if (!link.hasAttribute('role')) {
          link.setAttribute('role', 'button');
          report.fakeLinksHandled++;
        }
      });

      return report;
    },

    addLangAttribute: function (element, locale = 'en') {
      if (element) {
        element.setAttribute('lang', locale);
      }
    }
  }
};

function createAccessibleLink({ href, text, ariaLabel, role = 'link' } = {}) {
  const a = (typeof document !== 'undefined') ? document.createElement('a') : null;
  if (!a) {
    return null;
  }
  a.setAttribute('href', href || '#');
  a.setAttribute('role', role);
  a.textContent = text || '';
  if (ariaLabel) {
    a.setAttribute('aria-label', ariaLabel);
  }
  return a;
}

function handleAccessibilityIssues(options = {}) {
  const root = options.root || document;
  return accessibilityUtils.handleAccessibilityIssues(options);
}

module.exports = {
  ...main,
  ...accessibilityUtils,
  ensureElementId,
  ensureElementIdUtil,
  newFocusTrap,
  log,
  sanitizeFilename,
  readFileSafe,
  processData,
  filterValidItems,
  initAccessibility,
  groupByCategory,
  transformInputData,
  validateTableAccessibility,
  displayModuleStructure,
  generateDependencyGraph,
  validateAccessibilityReport,
  addressAccessibilityIssues,
  newAccessibilityCheck,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  renderAdditionalContent,
  checkLinkAccessibility,
  createInPageButton,
  createWebResourceButton,
  addAriaLabel,
  ...accessibilityUtils
};

// Function to ensure unique landmark IDs (REACT_025)
function ensureUniqueLandmarkId(root = document) {
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  landmarks.forEach(landmark => {
    const elements = root.querySelectorAll(landmark);
    if (elements.length > 1) {
      elements.forEach((el, i) => {
        if (!el.id) {
          el.id = `${landmark}-${i + 1}`;
        }
      });
    }
  });
}

// Function to validate unique landmarks (REACT_025)
function uniqueLandmarks(root = document) {
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  const issues = [];

  landmarks.forEach(landmark => {
    const elements = root.querySelectorAll(landmark);
    if (elements.length > 1) {
      issues.push(`Multiple ${landmark} elements found`);
    }
  });

  return issues.length === 0;
}

// Function to ensure all landmarks are unique (REACT_025)
function ensureUniqueLandmarks(root = document) {
  ensureUniqueLandmarkId(root);
  return uniqueLandmarks(root);
}