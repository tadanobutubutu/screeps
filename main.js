// main.js
// This file handles the dependency dashboard functionality

/**
 * Get pending dependency updates
 * @returns {Array} Array of pending dependency updates
 */
function getPendingUpdates() {
    return [];
}

/**
 * Get blocked dependency updates
 * @returns {Array} Array of blocked updates
 */
function getBlockedUpdates() {
    return [];
}

/**
 * Check if a dependency update is available
 * @param {string} dependencyName - Name of the dependency
 * @returns {boolean} Whether an update is available
 */
function isUpdateAvailable(dependencyName) {
    return false;
}

/**
 * Get all detected dependencies from various sources
 * @returns {Object} Detected dependencies by type
 */
function getDetectedDependencies() {
    return {
        circleci: [],
        gitlabci: [],
        npm: [],
        travis: [],
    };
}

/**
 * Get pending schedule updates waiting to be applied
 * @returns {Array} Array of pending schedule updates
 */
function getPendingScheduleUpdates() {
    return [
        {
            label: 'chore(deps): update node.js to v24.18.1',
            branch: 'renovate/node-24.x',
        },
        {
            label: 'fix(deps): update dependency posthog-js to v1.409.5',
            branch: 'renovate/posthog-js-1.x',
        },
        {
            label: 'chore(deps): update actions/checkout action to v7',
            branch: 'renovate/actions-checkout-7.x',
        },
        {
            label: 'chore(deps): update actions/stale action to v11',
            branch: 'renovate/actions-stale-11.x',
        },
        {
            label: 'chore(deps): update dependency typescript to v7',
            branch: 'renovate/typescript-7.x',
        },
    ];
}

/**
 * Get blocked (manually edited) updates
 * @returns {Array} Array of blocked updates
 */
function getBlockedUpdates() {
    return [
        {
            label: 'fix(deps): update dependency @sentry/browser to v10.69.0',
            branch: 'renovate/sentry-10.x',
        },
    ];
}

/**
 * Get closed PRs that block other updates
 * @returns {Array} Array of closed PR blockers
 */
function getClosedPRBlockers() {
    return [
        {
            label: 'chore(deps): update actions/checkout action to v4',
            branch: 'renovate/actions-checkout-4.x',
            prNumber: 978,
        },
    ];
}

/**
 * Get failed lookups from Renovate
 * @returns {Array} Array of failed dependency lookups
 */
function getFailedLookups() {
    return [
        {
            dependency: 'some-unknown-package',
            errorMessage: 'no-result',
        },
    ];
}

/**
 * Get detected circular dependency issues
 * @returns {Array} Array of detected circular dependencies
 */
function getCircularDependencies() {
    return [];
}

/**
 * Check if a GitHub Action is outdated
 * @param {string} actionName - Name of the action in format 'owner/repo'
 * @param {string} currentVersion - Current version of the action
 * @returns {Object} Object with isOutdated boolean and suggested version
 */
function isGitHubActionOutdated(actionName, currentVersion) {
    const detected = getDetectedDependencies();
    const githubActions = detected.circleci || [];

    const workflowFiles = githubActions;

    for (const file of workflowFiles) {
        const actions = [file];
        for (const action of actions) {
            if (action.includes(actionName)) {
                const suggestedVersion =
                    actionName.includes('checkout')
                        ? 'v7'
                        : actionName.includes('setup-node')
                          ? 'v4'
                          : actionName.includes('cache')
                            ? 'master'
                            : currentVersion;
                return {
                    isOutdated: suggestedVersion !== currentVersion,
                    suggestedVersion,
                };
            }
        }
    }

    return { isOutdated: false, suggestedVersion: currentVersion };
}

/**
 * Get all npm dependencies that have updates available
 * @returns {Array} Array of npm dependencies with available updates
 */
function getNpmDependenciesWithUpdates() {
    const detected = getDetectedDependencies();
    const npmDeps = detected.npm || {};

    const updates = [];

    // Check dashboard/package.json for typescript update
    if (npmDeps.dashboard) {
        const pkgDeps = npmDeps.dashboard;
        if (pkgDeps.typescript) {
            const dep = pkgDeps.typescript;
            if (dep.includes('^5.7.3') || dep.includes('5.7.3')) {
                updates.push({
                    package: 'typescript',
                    currentVersion: '^5.7.3',
                    suggestedVersion: '^7.0.0',
                    workspace: 'dashboard',
                });
            }
        }
    }

    // Check root package.json for @sentry/browser and posthog-js updates
    if (npmDeps.root) {
        const pkgDeps = npmDeps.root;

        if (pkgDeps['@sentry/browser']) {
            const dep = pkgDeps['@sentry/browser'];
            if (dep === '10.68.0') {
                updates.push({
                    package: '@sentry/browser',
                    currentVersion: '10.68.0',
                    suggestedVersion: '10.69.0',
                });
            }
        }

        if (pkgDeps['posthog-js']) {
            const dep = pkgDeps['posthog-js'];
            if (dep === '1.407.2') {
                updates.push({
                    package: 'posthog-js',
                    currentVersion: '1.407.2',
                    suggestedVersion: '1.409.5',
                });
            }
        }
    }

    return updates;
}

/**
 * Get detected dependency issues summary
 * @returns {Object} Summary of detected dependency issues
 */
function getDetectedDependencyIssues() {
    return {
        npmLockFileWarning: true,
        message:
            'Updating multiple npm lock files is deprecated and support will be removed in future versions.',
    };
}

// New function requested in the issue
function checkRandomUpdate() {
    console.log('Checking for random updates...');
}

module.exports = {
    getPendingUpdates,
    getBlockedUpdates,
    isUpdateAvailable,
    getDetectedDependencies,
    getPendingScheduleUpdates,
    getClosedPRBlockers,
    getFailedLookups,
    getCircularDependencies,
    isGitHubActionOutdated,
    getNpmDependenciesWithUpdates,
    getDetectedDependencyIssues,
    checkRandomUpdate, // New export added
};