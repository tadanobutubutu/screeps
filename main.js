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
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    // Wrap the a tag with a button to give it keyboard focusability and screen reader support
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.innerHTML = link.innerHTML;
    link.parentNode.replaceChild(button, link);
    // Set appropriate ARIA attributes for the new button
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    if (!button.getAttribute('aria-label')) {
      button.setAttribute('aria-label', 'Button');
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