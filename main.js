// Address accessibility issues from insight report
// Ensure the dependencyGraph container has a proper ARIA role
const { renderGraphContent } = require('./dependency-graph');

const container = document.getElementById('dependencyGraph');
if (container) {
  const graphEl = container.querySelector('.dependencyGraph') || container;
  graphEl.setAttribute('role', 'tree');
  graphEl.setAttribute('aria-label', 'Dependency Graph');
}

// Render dependency graph content
function renderDependencyGraphContent(data) {
  const container = document.getElementById('dependencyGraph');
  if (container) {
    const graphContainer = container.querySelector('.dependencyGraph') || container;
    graphContainer.innerHTML = data;
  }
}

// Ensure unique landmarks
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]');
  const seen = new Set();
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (seen.has(role)) {
      landmark.removeAttribute('role');
    } else {
      seen.add(role);
    }
  });
}

// Fix fake link issue
function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('span[role="link"], div[role="link"]');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
    if (!link.getAttribute('aria-label')) {
      link.setAttribute('aria-label', 'Button');
    }
  });
}

// New function to implement accessibility fixes
function implementNewFunction() {
  fixFakeLinks();
  ensureUniqueLandmarks();
}

// Export the module functions
module.exports = {
  renderDependencyGraphContent,
  ensureUniqueLandmarks,
  fixFakeLinks,
  implementNewFunction,
  renderGraphContent
};