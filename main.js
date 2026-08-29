// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
// main.js - Accessibility improvements implementation

import { dependencyGraphContent, indexContent } from './content';

/**
 * Ensures an element has an id attribute, generating one if needed
 * @param {HTMLElement} element - The element to check
 * @param {string} prefix - Prefix for the generated id
 * @returns {string} The element's id
 */
export function ensureElementHasId(element, prefix = 'element') {
    if (!element.id) {
        element.id = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
    }
    return element.id;
}

/**
 * Adds an aria-label attribute to an element for accessibility
 * @param {HTMLElement} element - The element to enhance
 * @param {string} label - The aria-label text
 */
export function addAriaLabel(element, label) {
    if (element && label) {
        element.setAttribute('aria-label', label);
    }
}

/**
 * Renders a dependency graph visualization
 * @param {HTMLElement} container - The container element for the graph
 * @param {Object} dependencies - The dependency data to render
 */
export function renderDependencyGraph(container, dependencies) {
    if (!container || !dependencies) return;
    
    const graphContainer = document.createElement('div');
    graphContainer.className = 'dependency-graph';
    graphContainer.setAttribute('role', 'img');
    graphContainer.setAttribute('aria-label', 'Dependency graph visualization');
    
    // Render the graph content
    const graphContent = document.createElement('pre');
    graphContent.textContent = dependencyGraphContent(dependencies);
    graphContainer.appendChild(graphContent);
    
    container.appendChild(graphContainer);
}

/**
 * Ensures element has proper accessibility attributes
 * @param {HTMLElement} element - The element to enhance
 * @param {Object} options - Accessibility options
 * @returns {HTMLElement} The enhanced element
 */
export function enhanceAccessibility(element, options = {}) {
    if (!element) return element;
    
    // Ensure id
    if (options.id) {
        ensureElementHasId(element, options.idPrefix || 'accessible');
    }
    
    // Add aria-label if provided
    if (options.ariaLabel) {
        addAriaLabel(element, options.ariaLabel);
    }
    
    // Add role if provided
    if (options.role) {
        element.setAttribute('role', options.role);
    }
    
    // Add aria-describedby for additional context
    if (options.describedBy) {
        element.setAttribute('aria-describedby', options.describedBy);
    }
    
    return element;
}