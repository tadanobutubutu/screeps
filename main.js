// TODO: Identify and update specific functions that render dependency graphs or
// in main.js - ACTION: Added renderDependencyGraph function below
import { dependencyGraphContent, indexContent } from './content';

/**
 * Renders the dependency graph visualization
 * @returns {string} The rendered dependency graph content
 */
export function renderDependencyGraph() {
  return dependencyGraphContent;
}

/**
 * Gets the index content
 * @returns {string} The index page content
 */
export function getIndexContent() {
  return indexContent;
}

// Main entry point
export default function main() {
  return {
    dependencyGraph: renderDependencyGraph(),
    index: getIndexContent()
  };
}