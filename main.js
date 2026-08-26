import dependencyGraphContent from './content/dependencyGraphContent.js';
import indexContent from './content/indexContent.js';

// TODO: Identify and update specific functions that render dependency graphs or
// index views to import and use dependencyGraphContent/indexContent from the
// appropriate modules.

// Sample structure - replace with actual existing code
export function renderDependencyGraph(data) {
  return dependencyGraphContent.render(data);
}

export function renderIndexView(data) {
  return indexContent.render(data);
}

// Placeholder: Below is a sample structure. Replace with actual existing code + added exports.
// For example, if the issue requires adding back an export like `calculateSum`, you would add:
// export function calculateSum(a, b) { return a + b; }