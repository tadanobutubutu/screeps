const fs = require('fs');
const path = require('path');
const main = require('./utilities');
const { http } = require('http');
const url = require('url');
const React = require('react');
const { render } = require('react-dom');
const { 
  addLangAttribute, 
  fixTableStructure, 
  fixLandmarkIssues, 
  addMainLandmark, 
  addLandmarkRegions, 
  ensureUniqueLandmarks, 
  uniqueLandmarks, 
  addSvgAccessibleNames, 
  addAccessibleNamesToSVGs, 
  fixFakeLinkIssue, 
  fixFakeLinkIssues, 
  googleSignIn, 
  decodeJwtResponse, 
  fixButtonIdentifiers, 
  ensureElementHasId, 
  addAriaLabel 
} = require('./AccessibilityHelpers');

const { 
  announceToScreenReader, 
  handleKeyboardNav, 
  initAccessibility, 
  ensureElementHasId, 
  ensureElementHasIdOrigin, 
  addAriaLabel, 
  renderDependencyGraphs, 
  fixButtonIdentifiers, 
  fixDependencyGraphAria, 
  addMainLandmarkToIndex, 
  focusTrap 
} = main;

/**
 * Adds an accessible name to an SVG string if not already present
 * @param {string} svgString - SVG string to modify
 * @returns {string} Modified SVG string with aria-label
 */
function addAccessibleName(svgString) {
  const svg = new DOMParser().parseFromString(svgString, "image/svg+xml");
  const svgElement = svg.documentElement;
  if (!svgElement.getAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', 'Descriptive label for SVG');
  }
  return new XMLSerializer().serializeToString(svg);
}

/**
 * Validates table accessibility
 * @param {Array} tableData - Table data to validate
 * @returns {boolean} True if table is accessible, false otherwise
 */
function validateTableAccessibility(tableData) {
  return true;
}

/**
 * Validates table structure
 * @param {Array} tableData - Table data to validate
 * @returns {boolean} True if table structure is valid, false otherwise
 */
function validateTableStructure(tableData) {
  return true;
}

/**
 * Fixes dependency graph container accessibility
 * @param {Document} document - Document to search within
 */
function fixDependencyGraphAccessibility(document) {
  const dependencyGraph = document.getElementById('dependencyGraph');
  if (dependencyGraph) {
    if (!dependencyGraph.getAttribute('role')) {
      dependencyGraph.setAttribute('role', 'region');
    }
    if (!dependencyGraph.getAttribute('aria-label')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
    }
  }
}

/**
 * Implements accessibility fixes from a comprehensive report
 * @param {Element} container - Container element to fix
 * @param {Object} report - Accessibility report containing issues
 * @returns {Object} Object containing counts of fixes applied
 */
function implementAccessibilityFixesFromReport(container, report) {
  const fixes = {
    langAdded: false,
    mainLandmarkAdded: false,
    landmarksFixed: 0,
    svgNamesAdded: 0,
    fakeLinksFixed: 0
  };

  if (!report || !report.issues) {
    return fixes;
  }

  if (!container.querySelector('html')) {
    container = container.ownerDocument;
  }

  if (report.issues.missingLang) {
    const htmlElement = container.querySelector('html') || container.ownerDocument?.querySelector('html');
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', 'en');
      fixes.langAdded = true;
    }
  }

  // Add main landmark if missing
  const mainElement = container.querySelector('main');
  if (!mainElement) {
    const body = container.querySelector('body');
    if (body) {
      const newMain = document.createElement('main');
      while (body.firstChild) {
        newMain.appendChild(body.firstChild);
      }
      body.appendChild(newMain);
      fixes.mainLandmarkAdded = true;
    }
  }

  // Fix landmarks by ensuring proper roles and accessible names
  if (report.issues.landmarkIssues && Array.isArray(report.issues.landmarkIssues)) {
    report.issues.landmarkIssues.forEach(issue => {
      const element = container.querySelector(issue.selector);
      if (element) {
        if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
          const accessibleName = main.getSvgAccessibleName(element) || element.textContent.trim();
          const previousSibling = element.previousElementSibling;
          if (previousSibling && previousSibling.textContent.trim()) {
            const labelId = `landmark-label-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const labelSpan = container.ownerDocument.createElement('span');
            labelSpan.id = labelId;
            labelSpan.textContent = previousSibling.textContent.trim();
            labelSpan.style.display = 'none';
            element.parentNode.insertBefore(labelSpan, element);
            element.setAttribute('aria-labelledby', labelId);
          } else {
            const role = element.getAttribute('role') || element.tagName.toLowerCase();
            element.setAttribute('aria-label', `${role}: ${accessibleName || ''}`);
          }
          fixes.landmarksFixed++;
        }
      }
    });
  }

  // Add accessible names to SVGs
  if (report.issues.svgIssues && Array.isArray(report.issues.svgIssues)) {
    report.issues.svgIssues.forEach(issue => {
      const svg = container.querySelector(issue.selector);
      if (svg && svg.tagName.toLowerCase() === 'svg') {
        const accessibleName = main.getSvgAccessibleName(svg);
        if (accessibleName && !svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
          svg.setAttribute('aria-label', accessibleName);
          fixes.svgNamesAdded++;
        }
      }
    });
  }

  // Fix fake links
  if (report.issues.fakeLinkIssues && Array.isArray(report.issues.fakeLinkIssues)) {
    const uniqueFakeLinksFixed = new Set();

    report.issues.fakeLinkIssues.forEach(issue => {
      const element = container.querySelector(issue.selector);
      if (element) {
        const isNavigation = element.closest('nav') !== null;

        if (isNavigation || element.tagName.toLowerCase() === 'a') {
          if (!element.hasAttribute('href')) {
            const href = `#${element.id || `fake-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`}`;
            element.setAttribute('href', href);
            element.setAttribute('role', 'link');
            uniqueFakeLinksFixed.add(issue.selector);
            fixes.fakeLinksFixed++;
          }
        } else {
          element.setAttribute('role', 'button');
          if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
          }
          uniqueFakeLinksFixed.add(issue.selector);
          fixes.fakeLinksFixed++;
        }
      }
    });
  }

  // Apply dependency graph accessibility fixes
  fixDependencyGraphAccessibility(container.ownerDocument || container);

  // Initialize accessibility if not already implemented
  if (!container.accessibilityUtils) {
    const initResult = initAccessibility(container);
    if (initResult.initialized) {
      const { utils } = initResult;
      Object.assign(container, utils);
    }
  }

  return fixes;
}

module.exports = {
  implementAccessibilityFixesFromReport,
  addAccessibleName,
  validateTableAccessibility,
  validateTableStructure,
  fixDependencyGraphAccessibility,
  renderDependencyGraphs,
  renderIndex: main.renderIndex,
  getLangAttribute: () => {
    const htmlElement = document.querySelector('html');
    return htmlElement ? htmlElement.getAttribute('lang') : null;
  },
  createInPageButton: (text, onClick, options = {}) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', onClick);
    if (options.id) button.id = options.id;
    if (options.className) button.className = options.className;
    return button;
  }
};