// TODO: Identify and update specific functions that render dependency graphs or
// index views to import and use dependencyGraphContent/indexContent from the
// appropriate modules.

const { dependencyGraphContent } = require('./dependencyGraph');
const { indexContent } = require('./index');

function renderDependencyGraph(container) {
  return dependencyGraphContent();
}

function renderIndex(container) {
  return indexContent();
}

module.exports = {
  renderDependencyGraph,
  renderIndex
};