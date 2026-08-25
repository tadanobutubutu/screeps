const { dependencyGraphContent, indexContent } = require('./content');

function renderDependencyGraph() {
    return dependencyGraphContent;
}

function renderIndex() {
    return indexContent;
}

function renderIndexViewOrDependencyGraph(/* ... other arguments ... */) {
  // ... (Your existing function code)

  // Determine if this function should render a dependency graph or index view:
  const shouldRenderDependencyGraph = <condition>; // Replace `<condition>` with the appropriate test

  // In case the function should render a dependency graph:
  if (shouldRenderDependencyGraph) {
    // Render the dependency graph using the imported module:
    return dependencyGraphContent(/* ... arguments ... */);
  }

  // In case the function should render an index view:
  return indexContent(/* ... arguments ... */);
}

module.exports = {
    renderDependencyGraph,
    renderIndex,
    renderIndexViewOrDependencyGraph,
    // Re-export the content getters in case other modules want direct access.
    dependencyGraphContent,
    indexContent,
};