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

function renderGraphIndex(graphData) {
  addressAccessibilityIssues();
  renderDependencyGraphs(graphData);
}
function renderGraphIndexAlt(graphData) {
  addressAccessibilityIssues();
  renderDependencyGraphs(graphData);
}

module.exports = {
  renderGraphIndex,
  renderGraphIndexAlt,
  // ... rest of the exports
};