// ... (Existing code here)

const landmarks = [];

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
 * Adds a unique landmark to the landmarks array and renders the main application view
 * @param {Object} landmark - Landmark object
 * @param {Object} context - Application context
 * @returns {string} The rendered application view
 */
function renderAppWithUniqueLandmark(landmark, context) {
  if (landmarks.includes(landmark)) {
    console.error(`Landmark ${landmark} is already present in the scene.`);
    return `<div id="app">${renderIndex(context)}</div>`;
  }

  landmarks.push(landmark);
  return `<div id="app">${renderIndex({ ...context, landmarks: landmarks })}</div>`;
}

/**
 * Renders the main application view
 * @param {Object} context - Application context
 * @returns {string} The rendered application view
 */
function renderApp(context) {
  return renderAppWithUniqueLandmark('initialLandmark', context);
}

module.exports = {
  renderDependencyGraph,
  renderIndex,
  renderApp,
  // Add additional functions here if required
};