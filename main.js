const fs = require('fs');
const main = require('./utilities');

const { createInPageButton, createWebResourceButton, validateTableAccessibility, validateTableStructure, validateLandmark, validateLandmarkStructure, getSvgAccessibleName, getLangAttribute, validateAccessibilityReport, exportUtils, addressAccessibilityIssues, handleCredentialResponse, ensureElementHasId, ensureElementHasIdOrigin, addAriaLabel, renderDependencyGraphs, fixButtonIdentifiers, fixDependencyGraphAria, addMainLandmarkToIndex, focusTrap, renderAdditionalContent, ensureUniqueLandmarks, transformInputData } = main;

const accessibilityUtils = {
  initSkipLink: () => {
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

  trapFocus: (element) => {
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

  createInPageButton: createInPageButton,

  createWebResourceButton: createWebResourceButton,

  validateTableAccessibility,
  validateTableStructure,

  validateLandmark,
  validateLandmarkStructure,

  getSvgAccessibleName,

  getLangAttribute,

  validateAccessibilityReport,

  handleCredentialResponse: async function(response) {
    if (!response) {
      throw new Error('No response received');
    }

    if (response.error) {
      throw new Error(response.error);
    }

    if (response.token) {
      return {
        success: true,
        token: response.token,
        expiresIn: response.expiresIn || 3600
      };
    }

    throw new Error('Invalid credential response');
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

  handleKeyboardNav: (e, handlers) => {
    const key = e.key;
    if (handlers[key]) {
      handlers[key](e);
    }
  },

  newFocusTrap: (element) => {
    if (!element) {
      return () => {};
    }

    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) {
      console.warn('No focusable elements found in container');
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }

      if (e.key === 'Escape') {
        element.dispatchEvent(new CustomEvent('focusTrapEscape'));
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    firstElement.focus();

    // Return cleanup function
    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  },

  exportUtils
};

function ensureElementId(element, prefix = 'element') {
  return ensureElementHasId(element, prefix);
}

function ensureElementIdOrigin(element, origin = 'default') {
  return ensureElementHasIdOrigin(element, origin);
}

function addAriaLabelToElement(element, label) {
  return addAriaLabel(element, label);
}

function renderDependencyGraphs(data) {
  return renderDependencyGraphs(data);
}

function fixButtonIdentifiers(buttons) {
  return fixButtonIdentifiers(buttons);
}

function fixDependencyGraphAria(graph) {
  return fixDependencyGraphAria(graph);
}

function addMainLandmarkToIndex(mainElement) {
  return addMainLandmarkToIndex(mainElement);
}

function focusTrapElement(element) {
  return focusTrap(element);
}

function renderAdditionalContent(container, content) {
  return renderAdditionalContent(container, content);
}

function validateTableAccessibility(tableElement) {
  return validateTableAccessibility(tableElement);
}

function validateTableStructure(tableElement) {
  return validateTableStructure(tableElement);
}

function validateLandmark(element) {
  return validateLandmark(element);
}

function validateLandmarkStructure() {
  return validateLandmarkStructure();
}

function getSvgAccessibleName(svgElement) {
  return getSvgAccessibleName(svgElement);
}

function ensureUniqueLandmarks() {
  return ensureUniqueLandmarks();
}

function transformInputData(inputData, options = {}) {
  return transformInputData(inputData, options);
}

module.exports = {
  ...accessibilityUtils,
  ensureElementId,
  ensureElementIdOrigin,
  addAriaLabelToElement,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrapElement,
  renderAdditionalContent,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  ensureUniqueLandmarks,
  transformInputData
};