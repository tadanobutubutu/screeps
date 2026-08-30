// TODO: Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// Ensure all landmark elements have unique ids. If a landmark doesn't have an id, generates one.
// (Preserve existing function for control)

/**
 * Ensures an element has a unique id, generating one if it doesn't exist
 * @param {HTMLElement} element - The DOM element to check
 * @param {string} prefix - The prefix for the generated ID
 * @returns {string} The element's ID (existing or generated)
 */
function ensureUniqueId(element, prefix = 'landmark') {
    if (!element.id) {
        element.id = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    return element.id;
}

/**
 * Applies accessibility improvements to the dependencyGraph container
 * Ensures proper ARIA role and unique IDs for landmark elements
 * @param {HTMLElement} container - The dependency graph container element
 */
function applyAccessibilityToGraph(container) {
    // Ensure the container has a proper ARIA role for accessibility
    if (!container.getAttribute('role')) {
        container.setAttribute('role', 'application');
        container.setAttribute('aria-label', 'Dependency graph visualization');
    }
    
    // Ensure all landmark elements have unique IDs
    const landmarkSelectors = 'header, nav, main, aside, footer, section, article';
    const landmarks = container.querySelectorAll(landmarkSelectors);
    landmarks.forEach((landmark, index) => {
        ensureUniqueId(landmark, `landmark-${index}`);
    });
    
    // Also ensure interactive elements have proper labeling
    const buttons = container.querySelectorAll('button');
    buttons.forEach((button, index) => {
        if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
            button.setAttribute('aria-label', `Button ${index + 1}`);
        }
    });
}

// Example usage - initialize the dependencyGraph container with accessibility
function initializeDependencyGraph(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        applyAccessibilityToGraph(container);
    }
}

module.exports = {
    ensureUniqueId,
    applyAccessibilityToGraph,
    initializeDependencyGraph
};