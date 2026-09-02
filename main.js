const main = require('./utilities')

const {
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  exportUtils,
  addressAccessibilityIssues,
  ensureElementHasIdOrigin,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  addLandmarkRegions,
  uniqueLandmarks,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssues,
  implementAccessibilityFixesFromReport,
  renderAdditionalContent,
  fixDependencyGraphAriaRole,
  initializeAccessibilityFixes,
  addTask,
  generateTaskId,
  cancelTask,
  processTasks,
  setElementLabel,
  setFocus,
  handleKeyboardNavigation,
  calculateComplexity,
  renderGraphIndex,
  renderDependencyGraph,
  renderIndex,
  ...utilities
} = main

module.exports = {
  // Core accessibility functions
  addLangAttribute,
  fixTableStructure,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  ensureUniqueLandmarks,
  uniqueLandmarks,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssues,
  implementAccessibilityFixesFromReport,

  // Validation functions
  validateTableAccessibility,
  validateTableStructure,

  // Utility functions
  focusTrap,
  checkAccessibility,
  validateTableStructureForAccessibility,
  ...utilities,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  checkAccessibilityForReport,

  // New functions
  addAccessibleName,
  renderAdditionalContent,
  fixDependencyGraphAriaRole,
  initializeAccessibilityFixes,

  // Task scheduling
  addTask,
  generateTaskId,
  cancelTask,
  processTasks,

  // Element labeling and focus
  setElementLabel,
  setFocus,
  handleKeyboardNavigation,

  // Utilities from utilities module
  ...utilities
};