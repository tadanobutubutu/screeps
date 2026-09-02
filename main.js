const fs = require('fs');
const { dependencyGraphContent, indexContent } = require('./dependencyContent');
const { main } = require('./utilities');

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
  ensureElementHasId: ensureElementIdOrigin,
  ensureElementId,
  addAriaLabel,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  renderAdditionalContent,
  checkLinkAccessibility,
  sanitizeFilename: main.sanitizeFilename,
  readFileSafe: main.readFileSafe,
  processData: main.processData,
  filterValidItems: main.filterValidItems,
  initAccessibility: main.initAccessibility,
  groupByCategory: main.groupByCategory,
  transformInputData: main.transformInputData,
  validateTableAccessibility,
  displayModuleStructure: main.displayModuleStructure,
  generateDependencyGraph: main.generateDependencyGraph,
  validateAccessibilityReport,
  addressAccessibilityIssues,
  newAccessibilityCheck,
  createInPageButton,
  createWebResourceButton,
  addAriaLabel,
  validateTableStructure,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  renderDependencyGraphs,
  renderGraphIndex,
} = main;

const ensureElementIdUtil = (element) => {
  if (element && !element.id) {
    element.id = `elem-${Date.now().toString(36).slice(-9)}`;
  }
  return element;
};

const newFocusTrap = (container) => {
  // Focus trap implementation for accessibility
  const focusableElements = container.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  const handleKeyDown = (e) => {
    if (e.key === 'Tab' || e.key === 'ShiftTab') {
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };
  
  container.addEventListener('keydown', handleKeyDown);
  
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
};

const log = (message, level = 'info') => {
  const levels = ['info', 'warn', 'error', 'debug'];
  if (levels.includes(level)) {
    console[level](message);
  }
};

// Function to render graph/index
function renderGraphIndex() {
    // Validate landmark structure for accessibility
    if (!validateLandmarkStructure()) {
        console.warn('Accessibility issues detected in graph/index');
    }
    
    // Create in-page buttons using the new function
    const prevButton = createInPageButton('prev-btn', 'Previous', 'nav-button');
    const nextButton = createInPageButton('next-btn', 'Next', 'nav-button');
    
    // Existing rendering logic
    const graphContainer = document.getElementById('graph-container');
    if (graphContainer) {
        graphContainer.appendChild(prevButton);
        graphContainer.appendChild(nextButton);
    }
}

// TODO: Implement this function for creating in-page buttons
function createInPageButton(buttonId, buttonText, buttonClass) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;
    return button;
}

const accessibilityUtils = {
  ...{
    initSkipLink: function () {
      const skipLink = document.getElementById('skip-link');
      if (skipLink) {
        skipLink.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = skipLink.getAttribute('href').substring(1);
          const target = document.getElementById(targetId);
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
            e.preventDefault();
            lastElement.focus();
            e.stopPropagation();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
            e.stopPropagation();
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
      landmark.id = `landmark-${Date.now().toString(36).slice(-9)}`;
      return landmark.id;
    },

    uniqueLandmarks: function () {
      const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="footer"], [role="header"]');
      const ids = new Set();

      landmarks.forEach((landmark) => {
        const id = landmark.id;
        if (id) ids.add(id);
      });

      return ids.size < 2;
    },

    createAccessibleLink: function (url, text, target) {
      const link = document.createElement('a');
      link.href = url;
      link.textContent = text;
      link.setAttribute('target', target || '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      link.setAttribute('aria-label', `Open ${text} in new window`);
      return link;
    },

    // Address accessibility issues from insight report
    handleAccessibilityIssues: function () {
      // Implementation to address accessibility issues in the report
      // This function should validate the report and fix issues as needed
    },

    addLangAttribute: function (element, locale = 'en') {
      if (element) {
        element.setAttribute('lang', locale);
      }
    }
  }
};

module.exports = {
  ...main,
  ...accessibilityUtils,
};