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
  addLanguageAttribute();
  renderDependencyGraphs(graphData);
}

// TODO: Update the existing function using the new functions for rendering graph/index
// DO NOT REMOVE OR RENAME THE EXISTING FUNCTIONS BELOW

// Update the call to the new function in the existing context
// For instance, if there was a call to `renderDependencyGraphs` somewhere in the codebase, replace it with `renderGraphIndex`
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