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
  addressAccessibilityIssues
} = main

const http = require('http')

// New function to ensure the element has an id
const ensureElementHasId = (element, prefix = 'element') => {
  if (!element.id) {
    element.id = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
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