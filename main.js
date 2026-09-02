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

// TODO: Update the existing function using the new functions for rendering graph/index
// DO NOT REMOVE OR RENAME THE EXISTING FUNCTIONS BELOW

const renderGraphIndex = (graphData) => {
  addressAccessibilityIssues();
  renderDependencyGraphs(graphData);
}

module.exports = {
  renderGraphIndex
}