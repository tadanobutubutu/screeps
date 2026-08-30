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
  // Render the dependency graph with the generated content
  return `<div class="dependency-graph">${content}</div>`;
}

/**
 * Renders the index view
 * @param {Object} data - Data for the index view
 * @returns {string} The rendered HTML/content for the index
 */
function renderIndex(data = {}) {
  // Ensure the index view is rendered when the dependency graph view is not requested
  const content = (options.isDependencyGraphNeeded) ? '' : indexContent.generate(data);
  // Render the index with the generated content
  return `<div class="index-view hidden"${(content !== '') ? '' : ' style="display: none;"'}>${content}</div>`;
}

/**
 * Additional Function3 to be implemented: Render function3 view
 * @param {Object} data3 - Data for function3 view
 * @returns {string} The rendered HTML/content for function3
 */
function renderFunction3(data3 = {}) {
  // Implement the logic for rendering function3 here
  // For example:
  // const content = `<div class="function3-view">Function3 Data: ${data3.someData}</div>`;
  // Return the rendered HTML/content for function3
  return `<div class="function3-view">Placeholder for Function3</div>`;
}

/**
 * Renders the main application view
 * @param {Object} context - Application context
 * @returns {string} The rendered application view
 */
function renderApp(context) {
  // Update: Conditionally render the index, dependency graph, or function3 based on context
  let viewFunction;

  if (context.isDependencyGraphNeeded) {
    viewFunction = renderDependencyGraph;
  } else if (context.isFunction3Needed) {
    viewFunction = renderFunction3;
  } else {
    viewFunction = renderIndex;
  }

  return `<div id="app">${viewFunction(context)}</div>`;
}

module.exports = {
  renderDependencyGraph,
  renderIndex,
  renderApp,    // Existing export
  renderFunction3   // New export for function3
};