const main = require('./utilities')

const {
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  validateAccessibilityReport,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  setSvgAccessibilityProps,
  addAccessibleNamesToSVGs,
  addSvgAccessibleNames,
  ensureElementHasIdOrigin,
  addAriaLabel: addAriaLabelAlt,
  googleSignIn,
  handleCredentialResponseAlt,
  renderGraphIndexUtil,
  addressAccessibilityIssues
} = require('./utilities');

const http = require('http')

// New function to ensure the element has an id
const ensureElementHasId = (element, prefix = 'element') => {
  if (!element.id) {
    element.id = `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  return element.id
}

// New function to add aria-label to an element
const addAriaLabel = (element, label) => {
  if (element) {
    element.setAttribute('aria-label', label)
  }
  return element
}

// Updated function using new functions for rendering graph/index
const renderGraphIndex = (graphData) => {
  addressAccessibilityIssues()
  renderDependencyGraphs(graphData)
}

function renderGraphIndexAlt(graphData) {
  addressAccessibilityIssues();
  renderDependencyGraphs(graphData);
}

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd

module.exports = {
  ensureElementHasId,
  addAriaLabel,
  renderGraphIndex,
  renderGraphIndexAlt
};