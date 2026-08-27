// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// Restore previously removed exports and address accessibility issues from insight report

const dependencyGraph = document.querySelector('#dependencyGraph .dependencyGraph');

if (dependencyGraph) {
  dependencyGraph.setAttribute('role', 'tree');
  dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
}

// Render dependency graph content
function renderDependencyGraphContent(data) {
  const container = document.getElementById('dependencyGraph');
  if (container) {
    container.innerHTML = data;
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

// Implement the new function as per the issue requirements
// REACT_025: Ensure unique <main> landmarks in the DOM.
// If multiple <main> elements are present (e.g., from conditionally rendered
// Dashboard states), convert the additional ones to <section> elements so that
// only a single <main> landmark remains. This preserves semantic content
// while satisfying the unique-landmark accessibility rule.
function ensureUniqueMainLandmark() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length <= 1) {
    return;
  }

  // Keep the first <main> as the unique landmark; convert the rest to <section>.
  for (let i = 1; i < mainElements.length; i++) {
    const extraMain = mainElements[i];
    const section = document.createElement('section');

    // Copy attributes (id, class, aria-*, data-*) over to the new <section>.
    for (const attr of Array.from(extraMain.attributes)) {
      section.setAttribute(attr.name, attr.value);
    }

    // Move all child nodes into the new <section>.
    while (extraMain.firstChild) {
      section.appendChild(extraMain.firstChild);
    }

    // Replace the duplicate <main> with the <section>.
    extraMain.parentNode.replaceChild(section, extraMain);
  }
}

// Add the new function within the module.exports for calling from another file
module.exports = {
  renderDependencyGraphContent,
  ensureUniqueLandmarks,
  fixFakeLinks,
  implementNewFunction,
  ensureUniqueMainLandmark,
  renderGraphContent // original export preserves for calling from another file
};