// For docs/dependency-graph.html
const initializeDependencyGraphPage = require('./path/to/initialize-dependency-graph-page').default;

// Add the <main> tag and content here
module.exports = {
  // ... existing exports ...
  initializeDependencyGraphPage,
  // Replace the content with the <main> tag
  renderDependencyGraphPage: (content) => {
    return `<main>${content}</main>`;
  }
};

// For docs/index.html
const initializeIndexPage = require('./path/to/initialize-index-page').default;

// Add the <main> tag and content here
module.exports = {
  // ... existing exports ...
  initializeIndexPage,
  // Replace the content with the <main> tag
  renderIndexPage: (content) => {
    return `<main>${content}</main>`;
  }
};