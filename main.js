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
      link.setAttribute('aria-label', ariaLabel || `Open ${text} in new window`);
      link.setAttribute('role', 'link');
      return link;
    },

    ensureElementHasId: ensureElementIdUtil,

    mainFocusTrap: newFocusTrap,

    /**
     * Initializes the accessibility utilities, including skip link functionality and focus trap.
     */
    initAccessibility: function () {
      accessibilityUtils.initSkipLink();
      accessibilityUtils.mainFocusTrap();
    },

    addLangAttribute: function (element, locale = 'en') {
      if (element) {
        element.setAttribute('lang', accessibilityUtils.getFullLangAttribute(locale));
      }
    },

    /**
     * Checks the accessibility of SVG elements by looking for `title` and `desc` tags.
     * @param {NodeList} svgs - A list of SVG elements.
     */
    checkSvgAccessibility: function (svgs) {
      svgs.forEach((svg, index) => {
        const title = svg.querySelector('title');
        const desc = svg.querySelector('desc');
        if (title && desc) {
          report.passed.push({
            category: 'REACT_041',
            message: `SVG ${index + 1} has accessible title and description`,
            status: 'passed'
          });
        } else {
          report.issues.push({
            category: 'REACT_041',
            message: `SVG ${index + 1} is missing accessible name`,
            status: 'moderate'
          });
          report.summary.moderate++;
          report.summary.totalIssues++;
        }
      });
    },

    /**
     * Checks the accessibility of links by ensuring they have text content.
     * @param {NodeList} links - A list of link elements.
     */
    checkLinkAccessibility: function (links) {
      links.forEach((link, index) => {
        if (link.textContent.trim() === '') {
          report.issues.push({
            category: 'REACT_036',
            message: `Link ${index + 1} has no accessible text`,
            status: 'moderate'
          });
          report.summary.moderate++;
          report.summary.totalIssues++;
        } else {
          report.passed.push({
            category: 'REACT_036',
            message: `Link ${index + 1} has accessible text`,
            status: 'passed'
          });
        }
      });
    }
  }
};

// TODO: add the new functions or changes requested in the issue
// Here's a sample implementation for a new function named 'myNewFunction'
function myNewFunction() {
  // sample implementation
}

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c8cf4389f9c -->
// _Commit: 4a63dcac59b893a2efdccd50635fab9cc54e7989_
<!-- todo-hash: 69d71664fd0827cd05d345427adf276b26830ba5 -->

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
  createAccessibleLink,
  myNewFunction,
  ...accessibilityUtils
};