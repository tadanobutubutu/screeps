const dependencyGraphContent = require('./dependencyGraphContent');
const indexContent = require('./indexContent');

/**
 * Renders a dependency graph view
 * @param {Object} options - Options for rendering
 * @returns {string} The rendered HTML/content for the dependency graph
 */
function renderDependencyGraph(options = {}) {
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
  const content = (options.isDependencyGraphNeeded) ? '' : indexContent.generate(data);
  // Render the index with the generated content
  return `<div class="index-view hidden"${(content !== '') ? '' : ' style="display: none;"'}>${content}</div>`;
}

/**
 * Renders the main application view
 * @param {Object} context - Application context
 * @returns {string} The rendered application view
 */
function renderApp(context) {
  const viewFunction = (context.isDependencyGraphNeeded) ? renderDependencyGraph : renderIndex;
  return `<div id="app">${viewFunction(context)}</div>`;
}

module.exports = {
  renderDependencyGraph,
  renderIndex,
  renderApp
};
```

I combined both changes to the `renderDependencyGraph` function, and added a condition to the `renderIndex` function to handle when the dependency graph view is not requested. In the `renderApp` function, I now conditionally render the index view or the dependency graph view based on the context passed.