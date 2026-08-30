// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
// main.js - Accessibility improvements implementation
// main.js - Combined utility and accessibility features

/**
 * Ensures an element has an id attribute, generating one if necessary
 * @param {HTMLElement} element - The element to check
 * @param {string} [prefix] - Optional prefix for the generated id
 * @returns {string} The element's id (existing or newly generated)
 */
function ensureElementHasId(element, prefix = 'element') {
    if (!element) {
        throw new Error('Element is required');
    }
    
    if (element.id) {
        return element.id;
    }
    
    const generatedId = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
    element.id = generatedId;
    return generatedId;
}

/**
 * Adds an aria-label to an element if one doesn't exist
 * @param {HTMLElement} element - The element to modify
 * @param {string} label - The aria-label text
 * @returns {HTMLElement} The modified element
 */
function addAriaLabel(element, label) {
    if (!element) {
        throw new Error('Element is required');
    }
    
    if (!element.getAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
    }
    
    return element;
}

/**
 * Renders a dependency graph visualization
 * @param {HTMLElement} container - The container element for the graph
 * @param {Object} dependencies - The dependency data to render
 * @returns {HTMLElement} The rendered graph element
 */
function renderDependencyGraph(container, dependencies = {}) {
    if (!container) {
        throw new Error('Container element is required');
    }
    
    const graphElement = document.createElement('div');
    graphElement.className = 'dependency-graph';
    graphElement.setAttribute('role', 'img');
    graphElement.setAttribute('aria-label', 'Dependency graph visualization');
    
    const nodes = dependencies.nodes || [];
    const edges = dependencies.edges || [];
    
    // Create SVG for graph rendering
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('aria-hidden', 'true');
    
    // Render edges
    edges.forEach((edge, index) => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', edge.source?.x || 0);
        line.setAttribute('y1', edge.source?.y || 0);
        line.setAttribute('x2', edge.target?.x || 0);
        line.setAttribute('y2', edge.target?.y || 0);
        line.setAttribute('stroke', '#666');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('id', `edge-${index}`);
        svg.appendChild(line);
    });
    
    // Render nodes
    nodes.forEach((node, index) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', node.x || 0);
        circle.setAttribute('cy', node.y || 0);
        circle.setAttribute('r', node.size || 20);
        circle.setAttribute('fill', node.color || '#4A90E2');
        circle.setAttribute('id', `node-${index}`);
        
        const nodeId = ensureElementHasId(circle, 'graph-node');
        if (node.label) {
            addAriaLabel(circle, node.label);
        }
        
        svg.appendChild(circle);
    });
    
    graphElement.appendChild(svg);
    container.appendChild(graphElement);
    
    return graphElement;
}

/**
 * Applies accessibility improvements to an element
 * @param {HTMLElement} element - The element to improve
 * @param {Object} options - Accessibility options
 * @returns {HTMLElement} The improved element
 */
function applyAccessibilityImprovements(element, options = {}) {
    if (!element) {
        throw new Error('Element is required');
    }
    
    // Ensure element has an id
    if (options.ensureId !== false) {
        ensureElementHasId(element, options.idPrefix || 'accessible');
    }
    
    // Add aria-label if provided
    if (options.label) {
        addAriaLabel(element, options.label);
    }
    
    // Add role attribute if provided
    if (options.role) {
        element.setAttribute('role', options.role);
    }
    
    // Add tabindex if specified
    if (options.tabbable === true) {
        element.setAttribute('tabindex', options.tabIndex || '0');
    }
    
    return element;
}

// Export functions for testing and external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ensureElementHasId,
        addAriaLabel,
        renderDependencyGraph,
        applyAccessibilityImprovements
    };
}