// This appears to be a git merge conflict that needs to be resolved.
// Resolving the conflict by keeping the relevant content and adding the requested updates.

const dependencyGraphContent = require('./content/dependencyGraphContent');
const indexContent = require('./content/indexContent');

// Main application module
// ... existing code ...

/**
 * Renders the dependency graph view
 * @param {Object} options - Rendering options
 * @returns {string} HTML content for the dependency graph
 */
function renderDependencyGraph(options = {}) {
    return dependencyGraphContent.render(options);
}

/**
 * Renders the index view
 * @param {Object} options - Rendering options
 * @returns {string} HTML content for the index view
 */
function renderIndex(options = {}) {
    return indexContent.render(options);
}

/**
 * Renders the main view with dependency graph
 * @param {Object} data - Data for rendering
 * @returns {string} HTML content
 */
function renderMain(data) {
    const graphHtml = renderDependencyGraph(data);
    const indexHtml = renderIndex(data);
    
    return `
        <div class="main-container">
            ${indexHtml}
            ${graphHtml}
        </div>
    `;
}

// TODO: Identify and update specific functions that render dependency graphs or
// index views to import and use dependencyGraphContent/indexContent from
// their respective modules for better maintainability and content separation.

// Existing exports preserved
module.exports = {
    renderDependencyGraph,
    renderIndex,
    renderMain
};