// TODO: Identify and update specific functions that render dependency graphs or

const { getDepGraph } = require('./depGraph');

// Render dependency graph - main function
function renderDependencyGraph(container) {
    const graph = getDepGraph();
    if (!graph) {
        return null;
    }
    
    const nodes = graph.nodes || [];
    const edges = graph.edges || [];
    
    return {
        nodes: nodes,
        edges: edges,
        render: function(target) {
            if (target && typeof target.render === 'function') {
                target.render(this.nodes, this.edges);
            }
        }
    };
}

// Update dependency graph rendering based on config
function updateDependencyGraphRender(targetConfig) {
    const graph = renderDependencyGraph();
    if (!graph) {
        return false;
    }
    
    if (targetConfig && targetConfig.renderMode) {
        graph.renderMode = targetConfig.renderMode;
    }
    
    return true;
}

// Get all dependency graph nodes
function getAllDependencyNodes() {
    const graph = getDepGraph();
    return graph ? graph.nodes : [];
}

// Get all dependency graph edges
function getAllDependencyEdges() {
    const graph = getDepGraph();
    return graph ? graph.edges : [];
}

module.exports = {
    renderDependencyGraph,
    updateDependencyGraphRender,
    getAllDependencyNodes,
    getAllDependencyEdges
};