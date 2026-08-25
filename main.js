// TODO: Identify and update specific functions that render dependency graphs or
// index views to import and use dependencyGraphContent/indexContent from the
// appropriate modules.

// Note: As of the current commit, the conflict markers mentioned in the issue
// have already been resolved in the working tree. The placeholder body below
// preserves the original file structure while adding the required import
// statement so that `dependencyGraphContent` and `indexContent` are available
// for the renderer functions described in the TODO.

const { dependencyGraphContent, indexContent } = require('./content');

function renderDependencyGraph() {
    return dependencyGraphContent;
}

function renderIndex() {
    return indexContent;
}

module.exports = {
    renderDependencyGraph,
    renderIndex,
    // Re-export the content getters in case other modules want direct access.
    dependencyGraphContent,
    indexContent,
};