// Main entry point for dependency graph rendering and module structure display

// TODO: Identify and update specific functions that render dependency graphs or display module structure for debugging purposes.

/**
 * Renders a dependency graph based on the provided module structure.
 * @param {Array<Object>} modules - Array of module objects with `name` and `dependencies` properties.
 * @returns {string} A formatted string representing the dependency graph.
 */
function renderDependencyGraph(modules) {
  if (!Array.isArray(modules) || modules.length === 0) {
    return "No modules to render.";
  }

  const graph = modules
    .map((mod, index) => {
      const deps = mod.dependencies ? mod.dependencies.map(dep => `  → ${dep}`).join('\n') : '  (no dependencies)';
      return `${index + 1}. ${mod.name}\n${deps}`;
    })
    .join('\n\n');

  return `Dependency Graph:\n${graph}`;
}

/**
 * Displays the module structure for debugging purposes.
 * @param {Object} module - The root module object to inspect.
 * @param {number} indent - Internal indentation level (do not set manually).
 * @returns {void}
 */
function displayModuleStructure(module, indent = 0) {
  const padding = '  '.repeat(indent);
  console.log(`${padding}Module: ${module.name}`);

  if (module.dependencies && module.dependencies.length > 0) {
    console.log(`${padding}Dependencies:`);
    module.dependencies.forEach(dep => displayModuleStructure(dep, indent + 1));
  }
}

// Preserve existing exports; add newly identified/updated functions
module.exports = {
  renderDependencyGraph,
  displayModuleStructure
};