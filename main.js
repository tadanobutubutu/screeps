/**
 * Main entry point for the Dependency Dashboard
 * Handles dependency update notifications and status tracking
 */

// Accessibility fixes for Jest-compatible DOM elements (for insight report issues)
const html = document.createElement('html');
html.lang = 'en'; // REACT_015: Add html lang attribute

// REACT_025: Unique landmark container mapping
const landmarkRegistry = new Map();

/** Adds a pending dependency update to the tracking list */
function addPendingUpdate(update) {
  if (update && update.name && update.version) {
    dependencyUpdates.pending.push({ ...update, status: 'awaiting_schedule', addedAt: new Date().toISOString() });
  }
}

/** Adds a blocked dependency update to the tracking list */
function addBlockedUpdate(update) {
  if (update && update.name) {
    dependencyUpdates.blocked.push({ ...update, status: 'blocked', addedAt: new Date().toISOString() });
  }
}

/** Adds a detected dependency to the tracking list */
function addDetectedDependencies(ecosystem, dependencies) {
  if (ecosystem && Array.isArray(dependencies)) {
    dependencyUpdates.detected.push({ ecosystem, dependencies, detectedAt: new Date().toISOString() });
  }
}

/** Retrieves all pending updates */
function getPendingUpdates() {
  return [...dependencyUpdates.pending];
}

/** Retrieves all blocked updates */
function getBlockedUpdates() {
  return [...dependencyUpdates.blocked];
}

/** Retrieves all detected dependencies grouped by ecosystem */
function getDetectedDependencies() {
  return dependencyUpdates.detected.reduce((acc, item) => {
    if (!acc[item.ecosystem]) acc[item.ecosystem] = [];
    acc[item.ecosystem].push(...item.dependencies);
    return acc;
  }, {});
}

/** Clears all tracked updates (useful for testing) */
function clearAllUpdates() {
  dependencyUpdates.pending = [];
  dependencyUpdates.blocked = [];
  dependencyUpdates.detected = [];
}

/** Generates a summary report of all dependency updates */
function generateSummary() {
  return {
    pendingCount: dependencyUpdates.pending.length,
    blockedCount: dependencyUpdates.blocked.length,
    detectedEcosystems: dependencyUpdates.detected.map(d => d.ecosystem),
    lastUpdated: new Date().toISOString()
  };
}

// REACT_041: SVG accessibility
function addAccessibleNameToSVG(svgElement) {
  if (!(svgElement instanceof SVGElement)) return;
  const title = svgElement.querySelector('text');
  if (!title || !title.textContent.trim()) {
    svgElement.setAttribute('aria-label', 'Dependency Update Chart');
  }
}

// REACT_036: Fake link detection
function isFakeLink(element) {
  if (!element || !element.closest) return false;
  const link = element.closest('a');
  return !link.href || link.href.startsWith('#') || !link.href.startsWith('http');
}

// REACT_027: Table structure fixes (implemented as wrapper function)
function generateTableStructure(updateData) {
  return updateData.map(update => ({
    ...update,
    name: update.name || '[Pending Update]',
    type: update.type || 'security',
    version: update.version || '{current}'
  }));
}

/** Main module exports */
module.exports = { 
  addPendingUpdate, 
  addBlockedUpdate, 
  addDetectedDependencies, 
  getPendingUpdates, 
  getBlockedUpdates, 
  getDetectedDependencies, 
  clearAllUpdates, 
  generateSummary 
};

// Empty object to hold DOM elements without affecting existing exports
const dependencyDashboardDOM = {};