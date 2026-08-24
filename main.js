import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

// Updated functions that render dependency graphs or index views
export function renderDependencyGraph() {
  return dependencyGraphContent();
}

export function renderIndex() {
  return indexContent();
}