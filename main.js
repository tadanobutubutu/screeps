// main.js
import { dependencyGraphContent } from './dependencyGraph.js';
import { indexContent } from './index.js';

/**
 * Renders the dependency graph view by delegating content generation
 * to the dedicated dependencyGraph module.
 *
 * @param {Object} options - rendering options
 * @returns {string} rendered dependency graph content
 */
function renderDependencyGraph(options) {
  return dependencyGraphContent(options);
}

/**
 * Renders the index view by delegating content generation
 * to the dedicated index module.
 *
 * @param {Object} options - rendering options
 * @returns {string} rendered index content
 */
function renderIndexView(options) {
  return indexContent(options);
}

export { renderDependencyGraph, renderIndexView };