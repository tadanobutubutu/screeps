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
  announceToScreenReader: originalAnnounceToScreenReader,
  handleKeyboardNav,
  exportUtils,
  transformInputData,
  addressAccessibilityIssues,
  handleCredentialResponse,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  renderAdditionalContent,
  initSkipLink,
  trapFocus,
  ensureElementHasId,
  newFocusTrap,
} = main;

const accessibilityUtils = {
  initSkipLink,
  trapFocus,
  announceToScreenReader: originalAnnounceToScreenReader,
  ensureElementId,

  renderDependencyGraph,
  renderIndex,
  addAccessibleName,
  handleCredentialResponse,
  initAccessibility,
  groupByCategory,
  log,
  sanitizeFilename,
  readFileSafe,
  processData,
  filterValidItems,
  exportUtilities,
  harvest,
  harvestSync,
};

// Utility functions for ensuring elements have IDs and adding labels
const ensureElementIdFn = (element) => {
  if (element && !element.id) {
    element.id = 'element-' + Math.random().toString(36).substr(2, 9);
  }
  return element;
};

const ensureElementHasIdFn = (element, prefix = 'element') => {
  if (!element) {
    throw new Error('Element is required');
  }
};

const wrapPrimaryContentInMain = () => {
  // Check if a main element already exists
  let mainElement = document.querySelector('main');

  if (!mainElement) {
    // If no main element exists, create one
    mainElement = document.createElement('main');

    // Find the primary content container (commonly #content, .content, or the body)
    const contentSelectors = ['#content', '.content', '#main', '.main', 'article', '[role="main"]'];
    let primaryContent = null;

    for (const selector of contentSelectors) {
      primaryContent = document.querySelector(selector);
      if (primaryContent) {
        break;
      }
    }

    // If no specific content container found, use body
    if (!primaryContent) {
      primaryContent = document.body;
    }

    // Move the primary content into the main element
    if (primaryContent !== document.body) {
      mainElement.appendChild(primaryContent);
      document.body.insertBefore(mainElement, document.body.firstChild);
    } else {
      // Wrap all body children except script and style elements
      const children = Array.from(document.body.children);
      children.forEach(child => {
        if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE' && child.tagName !== 'LINK') {
          mainElement.appendChild(child);
        }
      });
      document.body.insertBefore(mainElement, document.body.firstChild);
    }

    // Add ARIA landmark attribute
    mainElement.setAttribute('role', 'main');

    // Add accessible label if not present
    if (!mainElement.getAttribute('aria-label') && !mainElement.getAttribute('aria-labelledby')) {
      mainElement.setAttribute('aria-label', 'Main content');
    }
  }

  return mainElement;
};

const combinedUtils = Object.assign({}, accessibilityUtils, { focusTrap: newFocusTrap });

// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.
// Version 1 implementation (HEAD branch) - preserved accessibility enhancements

module.exports = {
  ...accessibilityUtils,
  renderDependencyGraph: main.renderDependencyGraph || (() => {}),
  renderIndex: main.renderIndex || (() => {}),
  validateTableAccessibility,
  validateTableStructure,
  addAccessibleName: accessibilityUtils.addAriaLabel,
  accessibilityUtils,
  ensureElementId: ensureElementIdFn,
  ensureElementHasId: ensureElementHasIdFn,
  newFocusTrap,
  wrapPrimaryContentInMain,
};