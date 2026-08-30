// TODO: This is the modified and merged code

const dependencyGraphContent = require('./dependencyGraphContent');
const indexContent = require('./indexContent');

/**
 * Renders a dependency graph view
 * @param {Object} options - Options for rendering
 * @returns {string} The rendered HTML/content for the dependency graph
 */
function renderDependencyGraph(options = {}) {
  // Update: Incorporate both changes to generate the content
  const content = (options.isDependencyGraphNeeded) ? dependencyGraphContent.generate(options) : indexContent.generate(options);

  // Add lang attribute to the 'div' element containing the rendered dependency graph
  const lang = navigator.language || navigator.userLanguage; // Fallback to system's default language if navigator properties are not available
  return `<div class="dependency-graph" lang="${lang}">${content}</div>`;
}

/**
 * Renders the index view
 * @param {Object} data - Data for the index view
 * @returns {string} The rendered HTML/content for the index
 */
function renderIndex(data = {}) {
  // Ensure the index view is rendered when the dependency graph view is not requested
  const content = (options.isDependencyGraphNeeded) ? '' : indexContent.generate(data);

  // Add lang attribute to the 'div' element containing the rendered index view
  const lang = navigator.language || navigator.userLanguage; // Fallback to system's default language if navigator properties are not available
  return `<div class="index-view hidden" lang="${lang}"${(content !== '') ? '' : ' style="display: none;"'}>${content}</div>`;
}

/**
 * Renders the main application view
 * @param {Object} context - Application context
 * @returns {string} The rendered application view
 */
function renderApp(context) {
  // Update: Conditionally render the index or the dependency graph based on context
  const viewFunction = (context.isDependencyGraphNeeded) ? renderDependencyGraph : renderIndex;

  // Add lang attribute to the 'div' element containing the rendered main application view
  const lang = navigator.language || navigator.userLanguage; // Fallback to system's default language if navigator properties are not available
  return `<div id="app" lang="${lang}">${viewFunction(context)}</div>`;
}

module.exports = {
  renderDependencyGraph,
  renderIndex,
  renderApp
};