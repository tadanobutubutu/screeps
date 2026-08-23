const dependencyGraphModule = require('./dependencyGraph');
const indexModule = require('./index');

// Accessibility: Updated dependencyGraphFunction to use dependencyGraphContent directly
// with proper accessibility attributes and semantic HTML
function dependencyGraphFunction() {
  const { dependencyGraphContent } = dependencyGraphModule;
  
  // Ensure the returned content has proper accessibility attributes
  if (dependencyGraphContent && dependencyGraphContent.element) {
    // Add role and aria-label if not present for screen reader support
    if (!dependencyGraphContent.element.hasAttribute('role')) {
      dependencyGraphContent.element.setAttribute('role', 'img');
    }
    if (!dependencyGraphContent.element.hasAttribute('aria-label')) {
      dependencyGraphContent.element.setAttribute('aria-label', 'Dependency graph visualization');
    }
    if (!dependencyGraphContent.element.hasAttribute('aria-hidden')) {
      dependencyGraphContent.element.setAttribute('aria-hidden', '0');
    }
  }
  
  // ... existing code for rendering the dependency graph
  return dependencyGraphContent;
}

// Accessibility: Updated indexFunction to use indexContent directly
// with proper accessibility attributes and semantic HTML
function indexFunction() {
  const { indexContent } = indexModule;
  
  // Ensure the returned content has proper accessibility attributes
  if (indexContent && indexContent.element) {
    // Add semantic structure for screen reader support
    if (!indexContent.element.hasAttribute('role')) {
      indexContent.element.setAttribute('role', 'region');
    }
    if (!indexContent.element.hasAttribute('aria-label')) {
      indexContent.element.setAttribute('aria-label', 'Index view');
    }
    if (!indexContent.element.hasAttribute('tabindex')) {
      indexContent.element.setAttribute('tabindex', '-1');
    }
  }
  
  // ... existing code for rendering the index view
  return indexContent;
}

// ... other functions and exports

// Added the required exports
module.exports = {
  dependencyGraphFunction,
  indexFunction,
};