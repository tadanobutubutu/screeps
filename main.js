// TODO: Address accessibility issues from insight report
// TODO-hash: 4960bda783623b568ecb422d6e6eb9ceac6573ea
const dependencyGraphModule = require('./dependency-graph');
const indexModule = require('./indexModule');

// ... existing code, imports, and functions

// Accessibility: Updated dependencyGraphFunction to use dependencyGraphContent directly
// with proper accessibility attributes and semantic HTML
function dependencyGraphFunction() {
  const { dependencyGraphContent } = dependencyGraphModule;
  
  // Ensure the returned content has proper accessibility attributes
  if (dependencyGraphContent && dependencyGraphContent.element) {
    // Add role and aria-label if not present for screen reader support
    if (!dependencyGraphContent.element.getAttribute('role')) {
      dependencyGraphContent.element.setAttribute('role', 'img');
    }
    if (!dependencyGraphContent.element.getAttribute('aria-label')) {
      dependencyGraphContent.element.setAttribute('aria-label', 'Dependency graph visualization');
    }
    if (!dependencyGraphContent.element.getAttribute('aria-hidden')) {
      dependencyGraphContent.element.setAttribute('aria-hidden', '0');
    }
  }
  
  return dependencyGraphContent;
}

// Accessibility: Updated indexFunction to use indexContent directly
// with proper accessibility attributes and semantic HTML
function indexFunction() {
  const { indexContent } = indexModule;
  
  // Ensure the returned content has proper accessibility attributes
  if (indexContent && indexContent.element) {
    // Add semantic structure for screen reader support
    if (!indexContent.element.getAttribute('role')) {
      indexContent.element.setAttribute('role', 'region');
    }
    if (!indexContent.element.getAttribute('aria-label')) {
      indexContent.element.setAttribute('aria-label', 'Index view');
    }
    if (!indexContent.element.getAttribute('tabindex')) {
      indexContent.element.setAttribute('tabindex', '-1');
    }
  }
  
  return indexContent;
}

module.exports = {
  dependencyGraphFunction,
  indexFunction,
};