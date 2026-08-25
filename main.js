// ... (Preserve existing code, exports, and functions from current main.js)

// Importing the required module
const { graphlib } = require('graphlib');

// Creating a new function that uses the imported module for rendering dependency graphs
function renderDependencyGraph(data) {
  const g = new graphlib.Graph();

  // Populate the graph with the data
  data.forEach((nodeData) => {
    const node = g.node(nodeData.id);

    node.package = nodeData.package;
    node.version = nodeData.version;

    data.edges.forEach((edgeData) => {
      if (edgeData.to === nodeData.id) {
        g.link(edgeData.from, nodeData.id);
      }
    });
  });

  // Rendering the graph using 'dot' string
  const dot = g.dot();

  const renderer = new (require('graphviz')).Renderer({ algorithm: 'dot', format: 'jpeg' });
  renderer.renderSync({
    data: dot,
    file: './dependency-graph.jpeg',
  });
}

// ... (Preserve existing code, exports, and functions from current main.js)

// Restoring previously removed exports below
module.exports = {
  // ... (Preserve existing code, exports, and functions from current main.js)
  fixTableStructure: fixTableStructure,
  fixFakeLinkIssue: fixFakeLinkIssue,
  fixTableStructureIssues: fixTableStructureIssues,
  addClassToElement: addClassToElement, // New export
  renderDependencyGraph: renderDependencyGraph, // Added back original export
  renderDependencyGraphForComponent: renderDependencyGraphForComponent, // Added back duplicate export with different name
  // ... (Preserve existing exports)
};