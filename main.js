// TODO: Identify and update specific functions that render dependency graphs or
// index views to import and use dependencyGraphContent/indexContent from the
// appropriate modules.
// Updated: imported and used dependencyGraphContent and indexContent in the
// relevant rendering functions.

const dependencyGraphContent = require('./dependencyGraphContent');
const indexContent = require('./indexContent');

/**
 * Renders a dependency graph view
 * @param {Object} options - Options for rendering
 * @returns {string} The rendered HTML/content for the dependency graph
 */
function renderDependencyGraph(options = {}) {
  const content = dependencyGraphContent.generate(options);
  // Render the dependency graph with the generated content
  return `<div class="dependency-graph">${content}</div>`;
}

/**
 * Renders the index view
 * @param {Object} data - Data for the index view
 * @returns {string} The rendered HTML/content for the index
 */
function renderIndex(data = {}) {
  const content = indexContent.generate(data);
  // Render the index with the generated content
  return `<div class="index-view">${content}</div>`;
}

/**
 * Renders the main application view
 * @param {Object} context - Application context
 * @returns {string} The rendered application view
 */
function renderApp(context) {
  return `<div id="app">${renderIndex(context)}</div>`;
}

/**
 * Validates a landmark object
 * @param {Object} landmark - The landmark object to validate
 * @returns {boolean} True if the landmark is valid, false otherwise
 */
function validateLandmark(landmark) {
  // Validate that landmark is a non-null object
  if (!landmark || typeof landmark !== 'object') {
    return false;
  }

  // Check for required properties (id and name are typical for landmarks)
  if (landmark.id === undefined || landmark.id === null) {
    return false;
  }

  if (landmark.name === undefined || landmark.name === null) {
    return false;
  }

  return true;
}

module.exports = {
  renderDependencyGraph,
  renderIndex,
  renderApp,
  validateLandmark
};