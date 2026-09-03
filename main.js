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

// Function to add language attribute to HTML element
const addLanguageAttribute = () => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = 'en';
  }
}

const renderGraphIndex = (graphData) => {
  addressAccessibilityIssues();
  renderDependencyGraphs(graphData);
}

// Update the existing function using the new functions for rendering graph/index
const renderGraphIndexUpdated = (graphData) => {
  addLanguageAttribute();
  renderGraphIndex(graphData);
}

// Add a language attribute to the HTML element
const initializePageLanguage = () => {
  addLanguageAttribute();
}

module.exports = {
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  validateAccessibilityReport,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  addressAccessibilityIssues,
  renderGraphIndex,
  renderGraphIndexUpdated,
  initializePageLanguage
}