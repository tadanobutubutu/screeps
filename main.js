/**
 * Dependency Dashboard Module
 * Handles display and management of detected dependencies from various sources
 */

// Dependency status constants
const DEPENDENCY_STATUS = {
  AWAITING_SCHEDULE: 'awaiting_schedule',
  BLOCKED: 'blocked',
  UPDATED: 'updated',
  FAILED: 'failed'
};

// Package manager types
const PACKAGE_MANAGERS = {
  NPM: 'npm',
  CIRCLECI: 'circleci',
  GITLABCI: 'gitlabci',
  TRAVIS: 'travis'
};

/**
 * Parses dependency data from Renovate dashboard
 * @param {Object} rawData - Raw dependency data from the dashboard
 * @returns {Object} Processed dependency information
 */
function parseDependencyData(rawData) {
  if (!rawData || typeof rawData !== 'object') {
    return {
      dependencies: [],
      errors: [],
      warnings: []
    };
  }

  const dependencies = [];
  const errors = [];
  const warnings = [];

  if (rawData.dependencies) {
    rawData.dependencies.forEach(dep => {
      if (dep && typeof dep === 'object') {
        dependencies.push({
          name: dep.name || dep.packageName || 'unknown',
          currentVersion: dep.currentVersion || dep.version,
          targetVersion: dep.targetVersion || dep.newVersion,
          type: dep.type || PACKAGE_MANAGERS.NPM,
          status: dep.status || DEPENDENCY_STATUS.AWAITING_SCHEDULE,
          manager: dep.manager || inferManager(dep.type)
        });
      }
    });
  }

  if (rawData.errors) {
    errors.push(...rawData.errors);
  }

  if (rawData.warnings) {
    warnings.push(...rawData.warnings);
  }

  return { dependencies, errors, warnings };
}

/**
 * Infers package manager from dependency type
 * @param {string} type - Dependency type
 * @returns {string} Package manager name
 */
function inferManager(type) {
  if (!type) return PACKAGE_MANAGERS.NPM;
  
  const lowerType = type.toLowerCase();
  
  if (lowerType.includes('circleci')) return PACKAGE_MANAGERS.CIRCLECI;
  if (lowerType.includes('gitlab')) return PACKAGE_MANAGERS.GITLABCI;
  if (lowerType.includes('travis')) return PACKAGE_MANAGERS.TRAVIS;
  
  return PACKAGE_MANAGERS.NPM;
}

/**
 * Filters dependencies by package manager
 * @param {Array} dependencies - Array of dependency objects
 * @param {string} manager - Package manager to filter by
 * @returns {Array} Filtered dependencies
 */
function filterByManager(dependencies, manager) {
  if (!Array.isArray(dependencies)) return [];
  if (!manager) return dependencies;
  
  return dependencies.filter(dep => dep.manager === manager);
}

/**
 * Filters dependencies by status
 * @param {Array} dependencies - Array of dependency objects
 * @param {string} status - Status to filter by
 * @returns {Array} Filtered dependencies
 */
function filterByStatus(dependencies, status) {
  if (!Array.isArray(dependencies)) return [];
  if (!status) return dependencies;
  
  return dependencies.filter(dep => dep.status === status);
}

/**
 * Groups dependencies by package manager
 * @param {Array} dependencies - Array of dependency objects
 * @returns {Object} Dependencies grouped by manager
 */
function groupByManager(dependencies) {
  if (!Array.isArray(dependencies)) return {};
  
  return dependencies.reduce((groups, dep) => {
    const manager = dep.manager || PACKAGE_MANAGERS.NPM;
    if (!groups[manager]) {
      groups[manager] = [];
    }
    groups[manager].push(dep);
    return groups;
  }, {});
}

/**
 * Groups dependencies by status
 * @param {Array} dependencies - Array of dependency objects
 * @returns {Object} Dependencies grouped by status
 */
function groupByStatus(dependencies) {
  if (!Array.isArray(dependencies)) return {};
  
  return dependencies.reduce((groups, dep) => {
    const status = dep.status || DEPENDENCY_STATUS.AWAITING_SCHEDULE;
    if (!groups[status]) {
      groups[status] = [];
    }
    groups[status].push(dep);
    return groups;
  }, {});
}

/**
 * Gets dependencies awaiting schedule
 * @param {Array} dependencies - Array of dependency objects
 * @returns {Array} Dependencies awaiting schedule
 */
function getAwaitingSchedule(dependencies) {
  return filterByStatus(dependencies, DEPENDENCY_STATUS.AWAITING_SCHEDULE);
}

/**
 * Gets blocked dependencies
 * @param {Array} dependencies - Array of dependency objects
 * @returns {Array} Blocked dependencies
 */
function getBlocked(dependencies) {
  return filterByStatus(dependencies, DEPENDENCY_STATUS.BLOCKED);
}

/**
 * Formats dependency for display
 * @param {Object} dependency - Dependency object
 * @returns {string} Formatted dependency string
 */
function formatDependency(dependency) {
  if (!dependency || typeof dependency !== 'object') {
    return '';
  }
  
  const name = dependency.name || 'unknown';
  const current = dependency.currentVersion || 'N/A';
  const target = dependency.targetVersion || 'N/A';
  
  return `${name}: ${current} → ${target}`;
}

/**
 * Generates a summary report of dependencies
 * @param {Array} dependencies - Array of dependency objects
 * @returns {Object} Summary statistics
 */
function generateSummary(dependencies) {
  if (!Array.isArray(dependencies)) {
    return {
      total: 0,
      byManager: {},
      byStatus: {},
      updatesAvailable: 0
    };
  }
  
  const byManager = groupByManager(dependencies);
  const byStatus = groupByStatus(dependencies);
  
  const managerStats = {};
  Object.keys(byManager).forEach(manager => {
    managerStats[manager] = byManager[manager].length;
  });
  
  const statusStats = {};
  Object.keys(byStatus).forEach(status => {
    statusStats[status] = byStatus[status].length;
  });
  
  return {
    total: dependencies.length,
    byManager: managerStats,
    byStatus: statusStats,
    updatesAvailable: dependencies.filter(d => d.status === DEPENDENCY_STATUS.AWAITING_SCHEDULE).length
  };
}

/**
 * Validates dependency object structure
 * @param {Object} dependency - Dependency to validate
 * @returns {boolean} Whether the dependency is valid
 */
function isValidDependency(dependency) {
  if (!dependency || typeof dependency !== 'object') {
    return false;
  }
  
  return !!(dependency.name || dependency.packageName);
}

/**
 * Creates a dependency object from raw data
 * @param {Object} rawDep - Raw dependency data
 * @returns {Object} Normalized dependency object
 */
function createDependency(rawDep) {
  return {
    name: rawDep.name || rawDep.packageName || 'unknown',
    currentVersion: rawDep.currentVersion || rawDep.version || rawDep.from,
    targetVersion: rawDep.targetVersion || rawDep.newVersion || rawDep.to,
    type: rawDep.type || 'npm',
    status: rawDep.status || DEPENDENCY_STATUS.AWAITING_SCHEDULE,
    manager: rawDep.manager || inferManager(rawDep.type),
    isDev: rawDep.isDev || false,
    isPeer: rawDep.isPeer || false,
    homepage: rawDep.homepage || null
  };
}

/**
 * Processes npm dependencies specifically
 * @param {Array} dependencies - Array of dependency objects
 * @returns {Object} NPM-specific data
 */
function processNpmDependencies(dependencies) {
  const npmDeps = filterByManager(dependencies, PACKAGE_MANAGERS.NPM);
  
  return {
    dependencies: npmDeps.filter(d => !d.isDev && !d.isPeer),
    devDependencies: npmDeps.filter(d => d.isDev),
    peerDependencies: npmDeps.filter(d => d.isPeer),
    total: npmDeps.length
  };
}

/**
 * Sorts dependencies by name
 * @param {Array} dependencies - Array of dependency objects
 * @returns {Array} Sorted dependencies
 */
function sortByName(dependencies) {
  if (!Array.isArray(dependencies)) return [];
  
  return [...dependencies].sort((a, b) => {
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();
    return nameA.localeCompare(nameB);
  });
}

/**
 * Sorts dependencies by version
 * @param {Array} dependencies - Array of dependency objects
 * @returns {Array} Sorted dependencies
 */
function sortByVersion(dependencies) {
  if (!Array.isArray(dependencies)) return [];
  
  return [...dependencies].sort((a, b) => {
    const versionA = a.currentVersion || '';
    const versionB = b.currentVersion || '';
    return versionA.localeCompare(versionB);
  });
}

/**
 * Exports for testing and external use
 */
module.exports = {
  DEPENDENCY_STATUS,
  PACKAGE_MANAGERS,
  parseDependencyData,
  inferManager,
  filterByManager,
  filterByStatus,
  groupByManager,
  groupByStatus,
  getAwaitingSchedule,
  getBlocked,
  formatDependency,
  generateSummary,
  isValidDependency,
  createDependency,
  processNpmDependencies,
  sortByName,
  sortByVersion
};