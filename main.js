// TODO: Identify and update specific functions that render dependency graphs or
// index views to import and use dependencyGraphContent/indexContent from the
// appropriate modules.

const { dependencyGraphContent, indexContent } = require('./views');

function renderDependencyGraph(data) {
  return dependencyGraphContent(data);
}

function renderIndex(data) {
  return indexContent(data);
}

module.exports = {
  renderDependencyGraph,
  renderIndex
};