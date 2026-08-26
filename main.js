// Existing code in main.js (preserved as is)

// TODO: Add a new function named `calculateSum` as requested in the issue
export function calculateSum(a, b) { return a + b; }

// Import the content modules for dependency graphs and index views
import { dependencyGraphContent } from './dependencyGraph.js';
import { indexContent } from './index.js';

// Function that renders dependency graphs - updated to use dependencyGraphContent
export function renderDependencyGraph(data) {
    return dependencyGraphContent(data);
}

// Function that renders index views - updated to use indexContent
export function renderIndexView(data) {
    return indexContent(data);
}