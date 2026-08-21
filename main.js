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

module.exports = {
  addPendingUpdate,
  addBlockedUpdate,
  addDetectedDependencies,
  getPendingUpdates,
  getBlockedUpdates,
  getDetectedDependencies,
  clearAllUpdates,
  generateSummary,
  dependencyUpdates
};