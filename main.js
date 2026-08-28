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