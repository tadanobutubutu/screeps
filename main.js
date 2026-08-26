import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

export function renderDependencyGraph(data) {
  // Use dependencyGraphContent to render the dependency graph
  return dependencyGraphContent(data);
}

export function renderIndex(data) {
  // Use indexContent to render the index view
  return indexContent(data);
}

export function initializeApp() {
  console.log('App initialized');
}

export function handleUserInput(input) {
  // Process user input
  return { status: 'processed', input };
}

// ... rest of the existing code