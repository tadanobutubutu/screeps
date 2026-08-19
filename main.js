/**
 * Dependency Dashboard Handler
 * Handles dependency updates from Renovate
 */

// Store for tracking dependency updates
const pendingUpdates = new Map();

/**
 * Adds an update to the pending queue
 * @param {string} type - Type of dependency (npm, action, etc.)
 * @param {string} name - Name of the dependency
 * @param {string} currentVersion - Current version
 * @param {string} newVersion - New version to update to
 * @param {Object} options - Additional options
 * @returns {Object} The created update object
 */
function addUpdate(type, name, currentVersion, newVersion, options = {}) {
    const update = {
        type,
        name,
        currentVersion,
        newVersion,
        status: options.status || 'awaiting-schedule',
        createdAt: new Date().toISOString(),
        changeType: options.changeType || 'chore',
        scheduled: options.scheduled || false
    };

    const key = `${type}:${name}`;
    pendingUpdates.set(key, update);

    return update;
}

/**
 * Removes an update from the pending queue
 * @param {string} type - Type of dependency
 * @param {string} name - Name of the dependency
 * @returns {boolean} Whether the update was removed
 */
function removeUpdate(type, name) {
    const key = `${type}:${name}`;
    return pendingUpdates.delete(key);
}

/**
 * Gets all pending updates
 * @param {string} type - Filter by type (optional)
 * @returns {Array} Array of pending updates
 */
function getPendingUpdates(type = null) {
    const updates = Array.from(pendingUpdates.values());
    if (type) {
        return updates.filter(u => u.type === type);
    }
    return updates;
}

/**
 * Gets updates awaiting schedule
 * @returns {Array} Array of updates awaiting schedule
 */
function getAwaitingScheduleUpdates() {
    return Array.from(pendingUpdates.values())
        .filter(u => u.status === 'awaiting-schedule');
}

/**
 * Gets updates that are blocked by closed PRs
 * @returns {Array} Array of blocked updates
 */
function getBlockedUpdates() {
    return Array.from(pendingUpdates.values())
        .filter(u => u.status === 'blocked');
}

/**
 * Triggers immediate update for an awaiting schedule update
 * @param {string} type - Type of dependency
 * @param {string} name - Name of the dependency
 * @returns {Object|null} The triggered update or null if not found
 */
function triggerUpdate(type, name) {
    const key = `${type}:${name}`;
    const update = pendingUpdates.get(key);

    if (update && update.status === 'awaiting-schedule') {
        update.status = 'pending';
        update.scheduled = false;
        return update;
    }

    return null;
}

/**
 * Creates all awaiting schedule PRs at once
 * @returns {Array} Array of created PRs
 */
function createAllAwaitingPRs() {
    const awaitingPRs = getAwaitingScheduleUpdates();
    const createdPRs = [];

    for (const update of awaitingPRs) {
        update.status = 'pending';
        update.scheduled = false;
        createdPRs.push({
            type: update.type,
            name: update.name,
            version: update.newVersion,
            changeType: update.changeType
        });
    }

    return createdPRs;
}

/**
 * Validates an action update
 * @param {string} actionName - Name of the action
 * @param {string} version - Version to validate
 * @returns {boolean} Whether the version is valid
 */
function validateActionVersion(actionName, version) {
    // Actions should follow semver-like versioning
    const versionPattern = /^\d+\.\d+(\.\d+)?$/;
    return versionPattern.test(version);
}

/**
 * Processes a batch of dependency updates
 * @param {Array} updates - Array of update objects
 * @returns {Object} Processing results
 */
function processUpdates(updates) {
    const results = {
        processed: 0,
        skipped: 0,
        errors: []
    };

    for (const update of updates) {
        try {
            if (!update.name || !update.newVersion) {
                results.errors.push({
                    update,
                    error: 'Missing required fields'
                });
                results.skipped++;
                continue;
            }

            addUpdate(update.type, update.name, update.currentVersion, update.newVersion, {
                status: update.status || 'awaiting-schedule',
                changeType: update.changeType || 'chore'
            });

            results.processed++;
        } catch (error) {
            results.errors.push({
                update,
                error: error.message
            });
            results.skipped++;
        }
    }

    return results;
}

/**
 * Generates a unique ID for accessibility purposes
 * @returns {string} A unique ID string
 */
function generateAccessibleId() {
    return `a11y-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validates if a table structure is accessible
 * @param {Object} tableData - Table data structure
 * @returns {boolean} Whether the table is accessible
 */
function validateTableStructure(tableData) {
    // Basic validation for table structure
    if (!tableData.headers || !tableData.rows) {
        return false;
    }

    // Check if all rows have the same number of cells as headers
    const headerCount = tableData.headers.length;
    return tableData.rows.every(row => row.cells.length === headerCount);
}

/**
 * Creates accessible landmark attributes
 * @param {string} role - ARIA role for the landmark
 * @param {string} label - Accessible label for the landmark
 * @returns {Object} Accessible landmark attributes
 */
function createLandmarkAttributes(role, label) {
    return {
        role: role,
        'aria-label': label,
        'aria-labelledby': generateAccessibleId()
    };
}

/**
 * Creates accessible SVG attributes
 * @param {string} title - Title for the SVG
 * @param {string} description - Description for the SVG
 * @returns {Object} Accessible SVG attributes
 */
function createSvgAccessibilityAttributes(title, description) {
    return {
        'aria-labelledby': generateAccessibleId(),
        'role': 'img',
        'title': title,
        'desc': description
    };
}

/**
 * Creates accessible link attributes
 * @param {string} href - Link destination
 * @param {string} text - Link text
 * @returns {Object} Accessible link attributes
 */
function createAccessibleLinkAttributes(href, text) {
    return {
        href: href,
        'aria-label': text,
        'role': 'link'
    };
}

// Initialize with updates from the issue
function initializeDashboard() {
    // Actions updates
    addUpdate('action', 'google/osv-scanner-action', 'v2.5.0', 'v2.5.1', {
        changeType: 'chore'
    });

    // NPM updates
    addUpdate('npm', 'typescript', '^5.7.3', '^7.0.0', {
        changeType: 'chore'
    });

    addUpdate('npm', 'react', '^18.2.0', '^19.0.0', {
        changeType: 'fix'
    });

    addUpdate('npm', 'jest', '^29.6.1', '^30.0.0', {
        changeType: 'chore'
    });

    addUpdate('npm', 'eslint', '^8.47.0', '^10.0.0', {
        changeType: 'chore'
    });

    addUpdate('npm', 'babel-jest', '^29.6.1', '^30.0.0', {
        changeType: 'chore'
    });
}

module.exports = {
    addUpdate,
    removeUpdate,
    getPendingUpdates,
    getAwaitingScheduleUpdates,
    getBlockedUpdates,
    triggerUpdate,
    createAllAwaitingPRs,
    validateActionVersion,
    processUpdates,
    initializeDashboard,
    pendingUpdates,
    generateAccessibleId,
    validateTableStructure,
    createLandmarkAttributes,
    createSvgAccessibilityAttributes,
    createAccessibleLinkAttributes
};

// Auto-initialize if running directly
if (require.main === module) {
    initializeDashboard();
    console.log('Dashboard initialized with', pendingUpdates.size, 'pending updates');
}