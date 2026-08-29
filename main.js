import { dependencyGraphContent, indexContent } from './content';

/**
 * Renders a visual representation of the dependency graph
 * @param {Object} dependencies - The dependencies object to visualize
 */
function renderDependencyGraph(dependencies) {
  console.log('=== Dependency Graph ===');
  for (const [module, deps] of Object.entries(dependencies)) {
    console.log(`${module} -> ${deps.join(', ') || '(no dependencies)'}`);
  }
}

/**
 * Displays module structure for debugging purposes
 * @param {Array} modules - Array of module objects to inspect
 */
function displayModuleStructure(modules) {
  console.log('=== Module Structure ===');
  modules.forEach((mod, index) => {
    console.log(`Module ${index + 1}:`, mod);
  });
}

/**
 * Debug function to print dependency information
 * @param {Object} config - Configuration object
 */
function debugDependencies(config) {
  if (process.env.DEBUG) {
    console.log('Debug: Dependency Configuration', config);
    renderDependencyGraph(config.dependencies || {});
  }
}

export { renderDependencyGraph, displayModuleStructure, debugDependencies };