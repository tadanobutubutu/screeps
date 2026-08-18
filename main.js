// main.js - Dependency Dashboard Manager

/**
 * Handles dependency update scheduling and configuration
 */

// Current stable versions
const CURRENT_VERSIONS = {
  jest: '29.6.1',
  babelJest: '29.6.1',
  typescript: '5.7.3',
  eslint: '8.47.0',
  react: '18.2.0',
  osvScannerAction: '2.5.0',
  node: '20',
  python: '3.13'
};

// Target versions for updates
const TARGET_VERSIONS = {
  jest: '30.0.0',
  babelJest: '30.0.0',
  typescript: '7.0.0',
  eslint: '10.0.0',
  react: '19.0.0',
  osvScannerAction: '2.5.1',
  node: '24',
  python: '3.14'
};

/**
 * Gets the status of all dependency updates
 * @returns {Object} Status of all dependencies
 */
function getDependencyStatus() {
  return {
    awaitingSchedule: [
      {
        type: 'chore',
        dependency: 'google/osv-scanner-action',
        from: CURRENT_VERSIONS.osvScannerAction,
        to: TARGET_VERSIONS.osvScannerAction
      },
      {
        type: 'chore',
        dependency: 'eslint',
        from: CURRENT_VERSIONS.eslint,
        to: TARGET_VERSIONS.eslint
      },
      {
        type: 'chore',
        dependency: 'typescript',
        from: CURRENT_VERSIONS.typescript,
        to: TARGET_VERSIONS.typescript
      },
      {
        type: 'chore',
        dependency: 'jest monorepo',
        packages: ['babel-jest', 'jest'],
        from: CURRENT_VERSIONS.jest,
        to: TARGET_VERSIONS.jest
      },
      {
        type: 'fix',
        dependency: 'react',
        from: CURRENT_VERSIONS.react,
        to: TARGET_VERSIONS.react
      }
    ],
    blockedPrs: [
      {
        dependency: 'some-action',
        prNumber: 978
      }
    ],
    warnings: [
      'Updating multiple npm lock files is deprecated and support will be removed in future versions.'
    ]
  };
}

/**
 * Triggers a manual Renovate run
 * @returns {Promise<Object>} Result of the manual trigger
 */
async function triggerRenovateRun() {
  return {
    success: true,
    message: 'Renovate run requested'
  };
}

/**
 * Creates all awaiting schedule PRs at once
 * @returns {Promise<Object>} Result of the batch creation
 */
async function createAllAwaitingSchedulePrs() {
  const status = getDependencyStatus();
  return {
    success: true,
    created: status.awaitingSchedule.length,
    prs: status.awaitingSchedule.map(dep => ({
      type: dep.type,
      dependency: dep.dependency,
      to: dep.to
    }))
  };
}

/**
 * Gets repository problems
 * @returns {Object} Repository problems
 */
function getRepositoryProblems() {
  return {
    warnings: [
      {
        type: 'deprecated-feature',
        message: 'Updating multiple npm lock files is deprecated and support will be removed in future versions.',
        severity: 'warning'
      }
    ],
    failedLookups: [
      {
        dependency: 'github-tags package',
        error: 'no-result'
      }
    ]
  };
}

/**
 * Checks if a dependency update is blocked
 * @param {string} dependency - The dependency name
 * @returns {boolean} Whether the update is blocked
 */
function isUpdateBlocked(dependency) {
  const status = getDependencyStatus();
  return status.blockedPrs.some(pr => pr.dependency === dependency);
}

/**
 * Gets environment information
 * @returns {Object} Environment details
 */
function getEnvironmentInfo() {
  return {
    node: process.version,
    platform: process.platform,
    arch: process.arch
  };
}

/**
 * Formats a dependency update for display
 * @param {Object} update - The dependency update
 * @returns {string} Formatted update string
 */
function formatDependencyUpdate(update) {
  return `${update.type}(deps): ${update.dependency} ${update.from} -> ${update.to}`;
}

/**
 * Validates that an update can proceed
 * @param {Object} update - The dependency update
 * @returns {Object} Validation result
 */
function validateUpdate(update) {
  const errors = [];
  const warnings = [];

  // Check for blocked dependencies
  if (isUpdateBlocked(update.dependency)) {
    errors.push(`Update for ${update.dependency} is blocked by an existing closed PR`);
  }

  // Warn about Jest major version upgrade
  if (update.dependency === 'jest monorepo') {
    warnings.push('Major version upgrade from Jest 29 to 30 - verify compatibility');
  }

  // Warn about ESLint major version upgrade
  if (update.dependency === 'eslint') {
    warnings.push('Major version upgrade from ESLint 8 to 10 - verify breaking changes');
  }

  // Warn about React major version upgrade
  if (update.dependency === 'react') {
    warnings.push('Major version upgrade from React 18 to 19 - verify breaking changes');
  }

  // Warn about TypeScript major version upgrade
  if (update.dependency === 'typescript') {
    warnings.push('Major version upgrade from TypeScript 5 to 7 - verify breaking changes');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

// Export all functions and utilities
module.exports = {
  CURRENT_VERSIONS,
  TARGET_VERSIONS,
  getDependencyStatus,
  triggerRenovateRun,
  createAllAwaitingSchedulePrs,
  getRepositoryProblems,
  isUpdateBlocked,
  getEnvironmentInfo,
  formatDependencyUpdate,
  validateUpdate
};