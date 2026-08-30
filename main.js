// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role

// New function to ensure proper ARIA role for dependencyGraph container
function setARIARoleForDependencyGraph() {
    const dependencyGraphContainer = document.getElementById('dependencyGraph');
    if (dependencyGraphContainer) {
        dependencyGraphContainer.setAttribute('role', 'application');
    }
}

// Call the new function to update the ARIA role
setARIARoleForDependencyGraph();