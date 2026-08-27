// main.js

import { renderDependencyGraph } from './dependencyGraphContent.js';
import { renderIndexView } from './indexContent.js';

// ... existing code preserved above ...

// Existing functions/code should remain here unchanged
// Only the new functions addressing the TODO are added below

// TODO: Identify and update specific functions that render dependency graphs or
// index views to import and use dependencyGraphContent/indexContent from
// their respective modules for better maintainability and content separation.

function renderDependencyGraphView(data) {
  return renderDependencyGraph(data);
}

function renderIndexViewPage(data) {
  return renderIndexView(data);
}