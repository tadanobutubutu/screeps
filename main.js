// main.js
const fs = require('fs');
const path = require('path');

// ... existing code ...

// TODO: Identify and update specific functions that render dependency graphs or
// index views to import and use dependencyGraphContent/indexContent from
// their respective modules for better maintainability and content separation.

// Import the new content modules
const dependencyGraphContent = require('./dependencyGraphContent');
const indexContent = require('./indexContent');

function renderDependencyGraph(dependencies, options) {
  // Use the imported dependencyGraphContent module
  const content = dependencyGraphContent.getContent(dependencies, options);
  return content;
}

function renderIndexView(options) {
  // Use the imported indexContent module
  const content = indexContent.getContent(options);
  return content;
}

module.exports = {
  renderDependencyGraph,
  renderIndexView,
  // ... other existing exports
};