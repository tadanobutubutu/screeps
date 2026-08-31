// Dependency imports
const { dependencyGraphContent } = require('./dependencyGraphContent');
const { indexContent } = require('./indexContent');

// Existing rendering functions (preserving existing exports and functions)

/**
 * Renders the dependency graph view
 * @param {Object} deps - Dependencies object
 * @param {Object} options - Rendering options
 * @returns {string} Rendered dependency graph HTML
 */
function renderDependencyGraph(deps, options = {}) {
  // Use dependencyGraphContent from the imported module
  return dependencyGraphContent(deps, options);
}

/**
 * Renders the main index view
 * @param {Object} data - View data
 * @param {Object} options - Rendering options
 * @returns {string} Rendered index HTML
 */
function renderIndex(data, options = {}) {
  // Use indexContent from the imported module
  return indexContent(data, options);
}

/**
 * Renders module structure for debugging
 * @param {Object} modules - Modules object
 * @param {Object} options - Rendering options
 * @returns {string} Rendered module structure HTML
 */
function renderModuleStructure(modules, options = {}) {
  // Simple HTML representation of module structure
  let html = '<div class="module-structure">';
  for (const [name, mod] of Object.entries(modules)) {
    html += `<div class="module"><h3>${name}</h3>`;
    if (mod.dependencies) {
      html += '<ul>';
      mod.dependencies.forEach(dep => {
        html += `<li>${dep}</li>`;
      });
      html += '</ul>';
    }
    html += '</div>';
  }
  html += '</div>';
  return html;
}

// Preserve all existing exports
module.exports = {
  renderDependencyGraph,
  renderIndex,
  renderModuleStructure,
};