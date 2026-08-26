// TODO: Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role

// Add proper ARIA role to dependencyGraph container
function initializeAccessibilityFeatures() {
    const dependencyGraph = document.getElementById('dependencyGraph') || 
                           document.querySelector('.dependencyGraph') ||
                           document.querySelector('#dependency-graph');
    
    if (dependencyGraph) {
        // Set ARIA role for accessibility
        dependencyGraph.setAttribute('role', 'region');
        dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
        
        // Add additional accessibility attributes
        dependencyGraph.setAttribute('tabindex', '0');
    }
}

// Initialize accessibility features when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAccessibilityFeatures);
} else {
    initializeAccessibilityFeatures();
}

// Export for testing purposes (if module system is used)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeAccessibilityFeatures };
}