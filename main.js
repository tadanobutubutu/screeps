const fs = require('fs');
const main = require('./utilities');

const {
  createInPageButton,
  createWebResourceButton,
  validateTableAccessibility,
  validateLandmark,
  validateLandmarkStructure,
  validateAccessibilityReport,
  getSvgAccessibleName,
  getLangAttribute,
  ensureElementId,
  validateTableStructure,
  validateSession,
  handleCredentialResponse,
  accessibilityUtils,
  createAnnouncer,
  renderDependencyGraph,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  renderAdditionalContent,
  filterValidItems,
  log,
  sanitizeFilename,
  readFileSafe,
  processData,
  exportUtilities
} = main;

const ensureElementIdOrigin = ensureElementId;

accessibilityUtils = {
  initSkipLink: () => {},
  trapFocus: (element) => {},
  createInPageButton,
  createWebResourceButton: (options) => {},
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  announceToScreenReader: accessibilityUtils.announceToScreenReader,
  handleKeyboardNav: accessibilityUtils.handleKeyboardNav,
  newFocusTrap: newFocusTrap,
  exportUtils,
  personName: main.personName,
  validateTableStructureForAccessibility(tableData) {
    return validateTableStructure(tableData);
  },
  addressAccessibilityIssues(container, report) {
    return implementAccessibilityFixesFromReport(container, report);
  },
  checkAccessibilityForReport(content) {
    return checkAccessibilityForReport(content);
  },
  renderGraphIndex(content, options = {}) {
    return renderGraphIndex(content, options);
  },
  preferReducedMotion() {
    return preferReducedMotion();
  },
  renderSimpleDependencyGraph(content) {
    return renderSimpleDependencyGraph(content);
  },
  addAccessibleName(element, name) {
    if (!element) return null;
    element.setAttribute('aria-label', name);
    return element;
  },
  getActiveSessionsCount() {
    return getActiveSessionsCount();
  },
  ...accessibilityUtils
};

function filterValidItems(items, validator) {
  return items.filter((item) => {
    try {
      return validator(item);
    } catch {
      return false;
    }
  });
}

module.exports = {
  ...main,
  ...accessibilityUtils,
  ensureElementId,
  ensureElementIdOrigin,
  addAriaLabel,
  renderDependencyGraph,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  newFocusTrap,
  handleCredentialResponse,
  initAccessibility,
  groupByCategory(items, getCategory) {
    return groupByCategory(items, getCategory);
  },
  log,
  sanitizeFilename,
  readFileSafe,
  processData,
  filterValidItems,
  exportUtilities
};