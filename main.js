import { dependencyGraphContent } from './dependencyGraph/index.js';
import { indexContent } from './indexView/index.js';

// TODO: Identify and update specific functions that render dependency graphs or
// index views to import and use dependencyGraphContent/indexContent from the
// appropriate modules.

export function renderDependencyGraph() {
  return dependencyGraphContent();
}

export function renderIndexView() {
  return indexContent();
}

export const UserSafety = 'unsafe';
export const SafetyCategories = 'Unauthorized Advice';