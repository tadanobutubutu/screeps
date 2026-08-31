let idCounter = 0;

function getUniqueId() {
  idCounter++;
  return `landmark-${idCounter}`;
}

function ensureLandmarkId(element) {
  const role = element.getAttribute('role');
  const landmarkRoles = ['banner', 'navigation', 'main', 'article', 'section', 'aside', 'footer', 'complementary'];
  
  if (landmarkRoles.includes(role) || element.tagName === 'MAIN' || element.tagName === 'NAV' || 
      element.tagName === 'ARTICLE' || element.tagName === 'SECTION' || element.tagName === 'ASIDE' || 
      element.tagName === 'FOOTER') {
    if (!element.hasAttribute('id')) {
      element.id = getUniqueId();
    }
  }
}

function ensureDependencyGraphAria(container) {
  if (container) {
    container.setAttribute('role', 'region');
    if (!container.hasAttribute('aria-label') && !container.hasAttribute('aria-labelledby')) {
      container.setAttribute('aria-label', 'Dependency Graph');
    }
    ensureLandmarkId(container);
  }
}

// TODO: Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// Ensure all landmark elements have unique ids. If a landmark doesn't have an id, generates one.
// (Preserve existing function for control)