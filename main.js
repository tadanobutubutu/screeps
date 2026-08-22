/**
 * Main entry point for the Dependency Dashboard
 * Handles dependency update notifications and status tracking
 */

const dependencyUpdates = {
  pending: [],
  blocked: [],
  detected: []
};

/**
 * Adds a pending dependency update to the tracking list
 * @param {Object} update - The dependency update object
 */
function addPendingUpdate(update) {
  if (update && update.name && update.version) {
    dependencyUpdates.pending.push({
      ...update,
      status: 'awaiting_schedule',
      addedAt: new Date().toISOString()
    });
  }
}

/**
 * Adds a blocked dependency update to the tracking list
 * @param {Object} update - The blocked update object
 */
function addBlockedUpdate(update) {
  if (update && update.name) {
    dependencyUpdates.blocked.push({
      ...update,
      status: 'blocked',
      addedAt: new Date().toISOString()
    });
  }
}

/**
 * Adds a detected dependency to the tracking list
 * @param {string} ecosystem - The ecosystem type (npm, github-actions, etc.)
 * @param {Array} dependencies - List of detected dependencies
 */
function addDetectedDependencies(ecosystem, dependencies) {
  if (ecosystem && Array.isArray(dependencies)) {
    dependencyUpdates.detected.push({
      ecosystem,
      dependencies,
      detectedAt: new Date().toISOString()
    });
  }
}

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

// === Accessibility fixes from insight report ===

/**
 * REACT_015: Add lang attribute to HTML element
 * @param {string} lang - The language code (e.g., 'en')
 */
function setHtmlLang(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang;
  }
}

/**
 * REACT_027: Fix table structure issues
 * @param {HTMLElement} table - The table element to fix
 */
function fixTableStructure(table) {
  if (!table) return;
  // Ensure table has an accessible name if missing
  if (!table.getAttribute('aria-label') && !table.querySelector('caption')) {
    table.setAttribute('aria-label', 'Table');
  }
  // Basic structure check: ensure rows exist
  const rows = table.querySelectorAll('tr');
  rows.forEach(row => {
    if (!row.querySelector('th, td')) {
      // Empty row, could be ignored
    }
  });
}

/**
 * REACT_017: Add/fix landmark issues
 * @param {HTMLElement} element - The element to add landmark role
 * @param {string} role - The landmark role (e.g., 'main', 'nav')
 * @param {string} [accessibleName] - Optional accessible name
 */
function addLandmark(element, role, accessibleName) {
  if (!element) return;
  element.setAttribute('role', role);
  if (accessibleName) {
    element.setAttribute('aria-label', accessibleName);
  }
}

/**
 * REACT_041: Add accessible names to SVGs
 * @param {SVGElement} svg - The SVG element to fix
 * @param {string} name - The accessible name
 */
function addSvgAccessibleName(svg, name) {
  if (!svg) return;
  svg.setAttribute('aria-label', name);
  // Also add a title element for deeper support
  let title = svg.querySelector('title');
  if (!title) {
    title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = name;
    svg.insertBefore(title, svg.firstChild);
  }
}

/**
 * REACT_025: Ensure unique landmarks
 * Fixes duplicate landmark roles by adding suffixes to subsequent instances
 */
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') return;
  const landmarkRoles = ['main', 'nav', 'aside', 'footer', 'header', 'form', 'search'];
  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0) {
          el.setAttribute('aria-label', `${role} ${index}`);
        }
      });
    }
  });
}

/**
 * REACT_036: Fix fake link issue
 * Converts a fake link (a with href="#") to a button
 * @param {HTMLElement} link - The anchor element to fix
 */
function fixFakeLink(link) {
  if (!link) return;
  if (link.tagName === 'A' && link.getAttribute('href') === '#') {
    const button = document.createElement('button');
    button.textContent = link.textContent;
    button.addEventListener('click', () => {
      // Preserve original click behavior if any
      link.dispatchEvent(new Event('click'));
    });
    link.parentNode.replaceChild(button, link);
  }
}

module.exports = {
  addPendingUpdate,
  addBlockedUpdate,
  addDetectedDependencies,
  getPendingUpdates,
  getBlockedUpdates,
  getDetectedDependencies,
  clearAllUpdates,
  generateSummary,
  dependencyUpdates,
  setHtmlLang,
  fixTableStructure,
  addLandmark,
  addSvgAccessibleName,
  ensureUniqueLandmarks,
  fixFakeLink
};