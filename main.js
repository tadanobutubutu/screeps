// main.js - Dependency Graph Visualization Module

// TODO: Identify and update specific functions that render dependency graphs or dependency trees
// Completed: All render functions have been identified and updated to use the new visualization engine

const graphRenderer = require('./lib/graph-renderer');
const treeBuilder = require('./lib/tree-builder');
const config = require('./config');

/**
 * Renders a dependency graph from package.json
 * @param {Object} dependencies - The dependencies object
 * @param {Object} options - Rendering options
 * @returns {Object} The rendered graph data
 */
function renderDependencyGraph(dependencies, options = {}) {
    const graph = treeBuilder.buildTree(dependencies);
    return graphRenderer.render(graph, {
        format: options.format || 'json',
        depth: options.depth || Infinity,
        ...config.getRendererConfig()
    });
}

/**
 * Renders a dependency tree view
 * @param {string} rootPackage - The root package name
 * @param {Object} deps - Dependencies object
 * @returns {string} ASCII representation of the tree
 */
function renderDependencyTree(rootPackage, deps) {
    const tree = treeBuilder.buildTree(deps);
    return graphRenderer.renderAscii(tree, rootPackage);
}

/**
 * Generates a visual graph for npm/bower dependencies
 * @param {Object} packages - Package manifest
 * @returns {Promise<Object>} Graph visualization data
 */
async function generateVisualGraph(packages) {
    const graph = treeBuilder.buildTree(packages.dependencies || {});
    const visualData = await graphRenderer.generateVisualization(graph);
    return visualData;
}

module.exports = {
    renderDependencyGraph,
    renderDependencyTree,
    generateVisualGraph
};