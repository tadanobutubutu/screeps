// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
// main.js - Accessibility improvements implementation

// Helper function to ensure element has an id
function ensureElementHasId(element, fallbackId = 'generated-id') {
    if (!element.id) {
        element.id = fallbackId;
    }
    return element.id;
}

// Helper function to add aria-label to element
function addAriaLabel(element, label) {
    if (element && label) {
        element.setAttribute('aria-label', label);
    }
    return element;
}

// Helper function to render dependency graphs
function renderDependencyGraph(container, dependencies = []) {
    if (!container) return null;
    
    const graphContainer = document.createElement('div');
    graphContainer.className = 'dependency-graph';
    graphContainer.setAttribute('role', 'img');
    graphContainer.setAttribute('aria-label', `Dependency graph with ${dependencies.length} dependencies`);
    
    // Render nodes for each dependency
    dependencies.forEach((dep, index) => {
        const node = document.createElement('div');
        node.className = 'dependency-node';
        node.textContent = dep.name || dep;
        node.setAttribute('data-index', index);
        graphContainer.appendChild(node);
    });
    
    container.appendChild(graphContainer);
    return graphContainer;
}

// Export functions for accessibility improvements
module.exports = {
    ensureElementHasId,
    addAriaLabel,
    renderDependencyGraph
};