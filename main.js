// Dependency imports
const { dependencyGraphContent } = require('./dependencyGraphContent');
const { indexContent } = require('./indexContent');

// New rendering functions (to be added)

/**
 * New function for rendering the dependency graph view with additional styling
 * @param {Object} deps - Dependencies object
 * @param {Object} options - Rendering options including additional styling
 * @returns {string} Rendered dependency graph HTML with styling
 */
function renderDependencyGraphWithStyling(deps, options = {}) {
  // Use dependencyGraphContent from the imported module
  const graphContent = dependencyGraphContent(deps, options);
  // Add additional styling to the graphContent
  const styledGraphContent = `<style>${options.styling}</style>${graphContent}`;
  return styledGraphContent;
}

/**
 * New function for rendering the main index view with a custom layout
 * @param {Object} data - View data
 * @param {Object} options - Rendering options including custom layout
 * @returns {string} Rendered index HTML with custom layout
 */
function renderIndexWithCustomLayout(data, options = {}) {
  // Use indexContent from the imported module
  const indexContentHTML = indexContent(data, options);
  // Apply custom layout to the indexContentHTML
  const customLayoutContent = `<div class="${options.layoutClass}">${indexContentHTML}</div>`;
  return customLayoutContent;
}

// Existing rendering functions (preserving existing exports and functions)

/**
 * Renders the dependency graph view
 * @param {Object} deps - Dependencies object
 * @param {Object} options - Rendering options
 * @returns {string} Rendered dependency graph HTML
 */
function renderDependencyGraph(deps, options = {}) {
  // Use dependencyGraphContent from the imported module
  return dependencyGraphContent(deps, options);
}

/**
 * Renders the main index view
 * @param {Object} data - View data
 * @param {Object} options - Rendering options
 * @returns {string} Rendered index HTML
 */
function renderIndex(data, options = {}) {
  // Use indexContent from the imported module
  return indexContent(data, options);
}

// Preserve all existing exports
module.exports = {
  renderDependencyGraph,
  renderIndex,
  renderDependencyGraphWithStyling,
  renderIndexWithCustomLayout,
  // Preserve any other existing exports here
};