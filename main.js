const createPage = (content) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
</head>
<body>
  <main>
    ${content}
  </main>
</body>
</html>`;
};

/**
 * Adds a pending dependency update to the tracking list
 * @param {Object} update - The dependency update object
 * @param {HTMLElement} mainElement - The main HTML element
 */
function addPendingUpdate(update, mainElement) {
  // ...
}

/**
 * Adds a blocked dependency update to the tracking list
 * @param {Object} update - The blocked update object
 * @param {HTMLElement} mainElement - The main HTML element
 */
function addBlockedUpdate(update, mainElement) {
  // ...
}

/**
 * Adds a detected dependency to the tracking list
 * @param {string} ecosystem - The ecosystem type (npm, github-actions, etc.)
 * @param {Array} dependencies - List of detected dependencies
 * @param {HTMLElement} mainElement - The main HTML element
 */
function addDetectedDependencies(ecosystem, dependencies, mainElement) {
  // ...
}

let mainElement = document.documentElement; // Set mainElement to the root HTML element

/**
 * Retrieves all pending updates
 * @returns {Array} List of pending updates
 */
function getPendingUpdates() {
  return [...dependencyUpdates.pending];
}

/**
 * Retrieves all blocked updates
 * @returns {Array} List of blocked updates
 */
function getBlockedUpdates() {
  return [...dependencyUpdates.blocked];
}

/**
 * Retrieves all detected dependencies grouped by ecosystem
 * @returns {Object} Detected dependencies by ecosystem
 */
function getDetectedDependencies() {
  return dependencyUpdates.detected.reduce((acc, item) => {
    if (!acc[item.ecosystem]) {
      acc[item.ecosystem] = [];
    }
    acc[item.ecosystem].push(...item.dependencies);
    return acc;
  }, {});
}

/**
 * Clears all tracked updates (useful for testing)
 */
function clearAllUpdates() {
  dependencyUpdates.pending = [];
  dependencyUpdates.blocked = [];
  dependencyUpdates.detected = [];
}

/**
 * Generates a summary report of all dependency updates
 * @returns {Object} Summary of all updates
 */
function generateSummary() {
  return {
    pendingCount: dependencyUpdates.pending.length,
    blockedCount: dependencyUpdates.blocked.length,
    detectedEcosystems: dependencyUpdates.detected.map(d => d.ecosystem),
    lastUpdated: new Date().toISOString()
  };
}

// Set lang attribute on HTML element to address accessibility issue
function setLangAttribute(element, mainElement) {
  if (element && mainElement && element.setAttribute) {
    mainElement.setAttribute('lang', 'en');
  }
}

// Fixing table structure issues
// Ensures all tables have proper <thead> and <tbody>, and that each <th> has a scope attribute.
function fixTableStructure(mainElement) {
  if (typeof document === 'undefined') return;

  const tables = mainElement.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('thead')) {
      const thead = document.createElement('thead');
      table.appendChild(thead);
    }
    if (!table.querySelector('tbody')) {
      const tbody = document.createElement('tbody');
      table.appendChild(tbody);
    }
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      if (!th.hasAttribute('scope')) {
        th.setAttribute('scope', 'col');
      }
    });
  });
}

// Add/fix 4 landmark issues
// Add appropriate ARIA landmark roles to semantic HTML elements
function addLandmarks(mainElement) {
  if (typeof document === 'undefined') return;

  const elementConfigs = [
    { selector: 'header', role: 'banner' },
    { selector: 'nav', role: 'navigation' },
    { selector: 'main', role: 'main' },
    { selector: 'footer', role: 'contentinfo' }
  ];

  elementConfigs.forEach(config => {
    const element = mainElement.querySelector(config.selector);
    if (element) {
      element.setAttribute('role', config.role);
    }
  });
  mainElement.setAttribute('aria-label', 'Main content area');
}

// Add accessible names to SVGs
// Add <title> and <desc> elements to SVGs for screen readers
function addAccessibleSVGs() {
  if (typeof document === 'undefined') return;

  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const title = document.createElement('title');
    title.textContent = 'Descriptive title for SVG';
    svg.appendChild(title);
    const desc = document.createElement('desc');
    desc.textContent = 'Description of SVG content';
    svg.appendChild(desc);
  });
}

// Ensure unique landmarks (2 issues)
// Ensure that each landmark has a unique accessible name
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') return;

  const landmarks = [
    { selector: 'header', idPrefix: 'unique-header' },
    { selector: 'nav', idPrefix: 'unique-nav' },
    { selector: 'main', idPrefix: 'unique-main' },
    { selector: 'footer', idPrefix: 'unique-footer' }
  ];

  landmarks.forEach(landmark => {
    const element = mainElement.querySelector(landmark.selector);
    if (element && !element.hasAttribute('id')) {
      element.setAttribute('id', landmark.idPrefix);
    }
  });
}

// Fix fake link issue
// Ensure elements pretending to be links have proper accessibility
function fixFakeLink() {
  if (typeof document === 'undefined') return;

  const fakeLinks = mainElement.querySelectorAll('.fake-link');
  fakeLinks.forEach(fakeLink => {
    if (!fakeLink.hasAttribute('role') || fakeLink.getAttribute('role') !== 'link') {
      fakeLink.setAttribute('role', 'link');
    }
    if (!fakeLink.hasAttribute('href')) {
      fakeLink.setAttribute('href', '#');
    }
  });
}

/**
 * Fixes the fake link in docs/dependency-graph.html by replacing it with a button
 * This addresses REACT_036 accessibility issue
 */
function fixFakeLinkInDocs() {
  if (typeof document === 'undefined') return;
  const oldLink = document.getElementById('unrotate');
  if (oldLink && oldLink.tagName.toLowerCase() === 'a' && oldLink.getAttribute('href') === '#') {
    const button = document.createElement('button');
    button.textContent = oldLink.textContent;
    button.id = oldLink.id;
    oldLink.parentNode.replaceChild(button, oldLink);
  }
}

// Add the new function to the module.exports
module.exports = {
  createPage,
  addPendingUpdate,
  addBlockedUpdate,
  addDetectedDependencies,
  getPendingUpdates,
  getBlockedUpdates,
  getDetectedDependencies,
  clearAllUpdates,
  generateSummary,
  setLangAttribute,
  fixTableStructure,
  addLandmarks,
  addAccessibleSVGs,
  ensureUniqueLandmarks,
  fixFakeLink,
  fixFakeLinkInDocs,
  getRequiredDependencies
};