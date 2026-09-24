const { dependencyGraphContent, indexContent, accessibilityUtils, a11yStore, mathHelpers, main } = require('./');

const {
  addLangAttribute,
  fixTableStructure,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  ensureUniqueLandmarks,
  uniqueLandmarks,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  googleSignIn,
  decodeJwtResponse,
  fixButtonIdentifiers,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs
} = accessibilityUtils;

const { dependencyGraphContent: dependencyGraphContentDep, indexContent: indexContentDep } = require('./');

const React = require('react');
const { render } = require('react-dom');

const mainDependencies = {
  dependencyGraphContent,
  indexContent,
  accessibilityUtils,
  a11yStore,
  mathHelpers,
  main
};

const { dependencyGraphContent: dependencyGraphContentOrigin, indexContent: indexContentOrigin } = mainDependencies;

const renderDependencyGraphsDep = (container) => {
  // ... Previous code for rendering dependency graphs ...
  if (container && container.tagName.toLowerCase() === 'svg') {
    const accessibleName = getSvgAccessibleName(container);
    if (accessibleName) {
      container.setAttribute('aria-label', accessibleName);
    }
  }
  // ... Rest of the code for rendering dependency graphs ...
};

const renderIndexDep = () => {
  // Use indexContentDep instead of indexContent to render with proper landmarks
  // ... Code for rendering index view ...
};

module.exports = {
  renderDependencyGraphs: renderDependencyGraphsDep,
  renderIndex: renderIndexDep
};

// Add or update the logic for handling additional rendering in renderDependencyGraphsDep
const handleAdditionalRendering = (data) => {
  // ... Your implementation for handling additional rendering ...
};

const renderDependencyGraphsPlus = (container) => {
  // ... Previous code for rendering dependency graphs ...

  if (container && container.tagName.toLowerCase() === 'svg') {
    const accessibleName = getSvgAccessibleName(container);
    if (accessibleName) {
      container.setAttribute('aria-label', accessibleName);
    }
  }

  // Handle additional rendering logic
  if (container && container.tagName.toLowerCase() === 'div' && data) {
    handleAdditionalRendering(data);
  }

  // ... Rest of the code for rendering dependency graphs ...
};

// Replace renderDependencyGraphs export with renderDependencyGraphsPlus
module.exports.renderDependencyGraphs = renderDependencyGraphsPlus;

// Update index view to use renderIndexDep and indexContentDep
module.exports.renderIndex = renderIndexDep;

// Attach to global scope for browser/standalone access
if (typeof window !== 'undefined') {
  window.renderDependencyGraphs = module.exports.renderDependencyGraphs;
  window.renderIndex = module.exports.renderIndex;
}