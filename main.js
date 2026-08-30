// main.js
// TODO: Identify and update specific functions that render dependency graphs or
// index views to import and use dependencyGraphContent/indexContent from the
// appropriate modules.
// Updated: imported and used dependencyGraphContent and indexContent in the
// relevant rendering functions.

import { dependencyGraphContent } from './dependencyGraph';
import { indexContent } from './index';

function renderDependencyGraph(container) {
  container.innerHTML = dependencyGraphContent;
}

function renderIndex(container) {
  container.innerHTML = indexContent;
}

// Export functions
export { renderDependencyGraph, renderIndex };