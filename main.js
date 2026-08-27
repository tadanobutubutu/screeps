import dependencyGraphContent from './content/dependencyGraphContent.js';
import indexContent from './content/indexContent.js';

// Existing functions
export function renderDependencyGraph(data) {
  return dependencyGraphContent.render(data);
}

export function renderIndexView(data) {
  return indexContent.render(data);
}

// New function to count dependencies (as per the TODO)
export function countDependencies() {
  // Implement the logic to count dependencies here
  // For demonstration purposes, let's return a fixed number
  return 5;
}