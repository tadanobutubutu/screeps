// TODO: Identify and update specific functions that render dependency graphs or
// index views to import and use dependencyGraphContent/indexContent from the
// appropriate modules.

const { dependencyGraphContent, indexContent } = require('./content');

function renderIndexViewOrDependencyGraph() {
    const shouldRenderDependencyGraph = false;

    if (shouldRenderDependencyGraph) {
        return dependencyGraphContent;
    }

    return indexContent;
}

function renderDependencyGraph() {
    return dependencyGraphContent;
}

function renderIndex() {
    return indexContent;
}

module.exports = {
    renderIndexViewOrDependencyGraph,
    renderDependencyGraph,
    renderIndex,
    dependencyGraphContent,
    indexContent,
};