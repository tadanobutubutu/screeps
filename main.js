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
    element.id = `${prefix}-Date.now()-${Math.random().toString(36).substr(2, 9)}`
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

// REACT_015: Add lang attribute
const addLangAttribute = (lang = 'en') => {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('lang', lang)
  }
  return document.documentElement
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

module.exports = {
  ensureElementHasId,
  addAriaLabel,
  addLangAttribute,
  renderGraphIndex,
  renderGraphIndexAlt
};