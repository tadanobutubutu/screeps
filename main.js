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

// Add a language attribute to the HTML element
addLanguageAttribute();

// Update the call to the new function in the existing context
// Example:
// renderDependencyGraphs(graphData); // Before
// renderGraphIndex(graphData); // After

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
  renderGraphIndex
}