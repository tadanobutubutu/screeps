// main.js - Accessibility improvements implementation
// main.js - Combined utility and accessibility features

// (Previously existing code that needs to be preserved)

// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs

/**
 * Ensures an element has an id attribute
 * @param {HTMLElement} element - The element to check
 * @param {string} [prefix='element'] - Prefix for generated id
 * @returns {string} The element's id
 */
function ensureElementHasId(element, prefix = 'element') {
    if (!element) return null;
    
    if (!element.id) {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 9);
        element.id = `${prefix}-${timestamp}-${random}`;
    }
    
    return element.id;
}

/**
 * Adds aria-label to an element if it doesn't already have one
 * @param {HTMLElement} element - The element to modify
 * @param {string} label - The aria-label text
 * @returns {boolean} Whether the label was added
 */
function addAriaLabel(element, label) {
    if (!element || !label) return false;
    
    if (!element.getAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
        return true;
    }
    
    return false;
}

/**
 * Renders dependency graphs
 * @param {HTMLElement} container - The container element
 * @param {Array} dependencies - Array of dependency data
 * @returns {HTMLElement} The rendered graph element
 */
function renderDependencyGraph(container, dependencies = []) {
    if (!container) return null;
    
    const graphElement = document.createElement('div');
    graphElement.className = 'dependency-graph';
    graphElement.setAttribute('role', 'img');
    graphElement.setAttribute('aria-label', 'Dependency graph visualization');
    
    dependencies.forEach((dep, index) => {
        const node = document.createElement('div');
        node.className = 'dependency-node';
        node.id = `dep-node-${index}`;
        node.textContent = dep.name || `Dependency ${index + 1}`;
        node.setAttribute('data-target', dep.target || '');
        
        if (dep.dependencies && Array.isArray(dep.dependencies)) {
            const childContainer = document.createElement('div');
            childContainer.className = 'dependency-children';
            dep.dependencies.forEach(childDep => {
                const childNode = document.createElement('span');
                childNode.className = 'dependency-child';
                childNode.textContent = childDep;
                childContainer.appendChild(childNode);
            });
            node.appendChild(childContainer);
        }
        
        graphElement.appendChild(node);
    });
    
    container.appendChild(graphElement);
    return graphElement;
}

/**
 * Applies accessibility improvements to a container element
 * @param {HTMLElement} container - The container to improve
 * @param {Object} options - Configuration options
 * @returns {boolean} Success status
 */
function applyAccessibilityImprovements(container, options = {}) {
    if (!container) return false;
    
    const {
        addIds = true,
        addAriaLabels = true,
        enhanceFocus = true
    } = options;
    
    if (addIds) {
        const elements = container.querySelectorAll('[data-accessible]');
        elements.forEach(el => {
            const prefix = el.dataset.accessiblePrefix || 'accessible';
            ensureElementHasId(el, prefix);
        });
    }
    
    if (addAriaLabels) {
        const unlabeledElements = container.querySelectorAll('button:not([aria-label]), a:not([aria-label])');
        unlabeledElements.forEach(el => {
            if (el.textContent.trim()) {
                addAriaLabel(el, el.textContent.trim());
            }
        });
    }
    
    if (enhanceFocus) {
        const focusableElements = container.querySelectorAll('button, a, input, select, textarea');
        focusableElements.forEach(el => {
            if (!el.getAttribute('tabindex')) {
                el.setAttribute('tabindex', '0');
            }
        });
    }
    
    return true;
}

// Export functions for use in other modules
module.exports = {
    ensureElementHasId,
    addAriaLabel,
    renderDependencyGraph,
    applyAccessibilityImprovements
};