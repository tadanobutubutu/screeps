const { dependencyGraphContent } = require('./dependencyGraphContent');
const { indexContent } = require('./indexContent');
const { spawn } = require('child_process');
const {
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  ensureUniqueLandmarks,
  setSvgAccessibilityProps,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  fixLandmarkIssues,
  addLandmarkRegions,
  uniqueLandmarks,
  fixImageAltTexts,
  googleSignIn,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  addressAccessibilityIssues,
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  validateAccessibilityReport,
  validateTableAccessibility,
  validateTableStructure,
  getSvgAccessibleName,
  getLangAttribute,
  addAltAttribute,
  replaceButtonId,
  addAriaAttribute,
  implementAccessibilityFixesFromReport,
  addSvgAccessibleName,
  handleCredentialResponse: handleCredentialResponseAlt,
  renderGraphIndex
} = require('./utilities');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Application data store
let appData = {
  tables: [],
  config: {}
};

// Accessibility utilities and functions
const accessibilityUtils = {
  // Utility functions for accessibility
  initSkipLink: () => {},
  trapFocus: (element) => {},
  announceToScreenReader: (message, priority = 'polite') => {},
  handleKeyboardNav: (e, handlers) => {},

  // Functions provided in both branches (merge)
  ensureElementId: ensureElementId,
  addAriaLabel: addAriaLabel,
  renderDependencyGraph: renderDependencyGraphs,

  // Functions from the 'HEAD' branch
  newFocusTrap: focusTrap,
  addLangAttribute: addLangAttribute,
  fixTableStructure: fixTableStructure,
  addLandmarkIssues: addLandmarkIssues,
  addSvgAccessibleNames: addSvgAccessibleNames,
  ensureUniqueLandmarks: ensureUniqueLandmarks,
  fixFakeLinkIssue: fixFakeLinkIssue,

  // Functions from the 'origin/main' branch
  validateTableAccessibility: validateTableAccessibility,
  validateTableStructure: validateTableStructure,
  transformInputData: transformInputData,
};

const main = require('./utilities');
const {
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  validateAccessibilityReport,
  validateTableAccessibility,
  validateTableStructure,
  renderDependencyGraph,
  renderIndex,
  renderGraphIndex,
  limitTabFunctionality,
  checkLandmarkElement,
  wrapPrimaryContentInMain,
  checkLandmarks,
  ensureUniqueLandmarks,
  handleFocusTrap,
  revokeSession,
  functionA,
  functionB,
  accessibilityUtils,
  newFocusTrap,
  addLangAttribute,
  fixTableStructure,
  addLandmarkIssues,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  validateTableAccessibilityImpl,
  validateTableStructureImpl,
  transformInputData,
  setSvgAccessibleProps,
  addAccessibleNamesToSVGs,
  fixLandmarkIssues,
  addLandmarkRegions,
  uniqueLandmarks,
  fixImageAltTexts,
  googleSignIn,
  addressAccessibilityIssues
} = main;

const a11yStore = {
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },
  newFocusTrap: newFocusTrap,
  addressAccessibilityIssues: addressAccessibilityIssues
};

// Initialize wrapPrimaryContentInMain on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  wrapPrimaryContentInMain();
});

// Import all utilities functions for convenience (merged from both branches)
module.exports = {
  accessibilityUtils,
  CONFIG,
  log,
  validateInput,
  parseJSONsafe,
  formatResponse,
  delay,
  retryOperation,
  sanitizeFilename,
  readFileSafe,
  processData,
  filterValidItems,
  groupByCategory,
  myNewFunction,
  calculateSum,
  ensureElementId,
  addAriaLabel,
  renderDependencyGraphs,
  handleCredentialResponse,
  focusTrap,
  generateSessionId,
  renderGraphIndex,
  wrapPrimaryContentInMain,
  addressAccessibilityIssues,
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  validateAccessibilityReport,
  getSvgAccessibleName,
  getLangAttribute,
  addAltAttribute,
  replaceButtonId,
  addAriaAttribute,
  implementAccessibilityFixesFromReport,
  ensureElementHasId,
  ensureUniqueLandmarks,
  addMainLandmark,
  fixTableStructure,
  addSvgAccessibleName,
  fixFakeLinkIssue,
  googleSignIn,
  handleCredentialResponseAlt,
  setSvgAccessibilityProps,
  addAccessibleNamesToSVGs,
  addSvgAccessibleNames,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  validateTableAccessibility,
  validateTableStructure,
  getConfig,
  setConfig,
  getTables,
  appData,
  appState,
  getActiveSessionsCount,
  dependencyGraphContent,
  indexContent
};