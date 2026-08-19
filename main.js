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

/**
 * Creates an accessible table structure
 * @param {Array} headers - Array of header strings
 * @param {Array} rows - Array of row data arrays
 * @returns {Object} Table structure with accessibility attributes
 */
function createAccessibleTable(headers, rows) {
    return {
        role: 'table',
        'aria-label': 'Dependency updates table',
        headers: headers.map((header, index) => ({
            role: 'columnheader',
            id: `header-${index}`,
            children: header
        })),
        rows: rows.map((row, rowIndex) => ({
            role: 'row',
            cells: row.map((cell, cellIndex) => ({
                role: 'cell',
                'aria-describedby': `header-${cellIndex}`,
                children: cell
            }))
        }))
    };
}

/**
 * Creates an accessible SVG element
 * @param {string} title - Accessible title for the SVG
 * @param {string} description - Accessible description
 * @param {Object} svgProps - SVG properties
 * @returns {Object} Accessible SVG structure
 */
function createAccessibleSVG(title, description, svgProps) {
    return {
        svg: {
            ...svgProps,
            role: 'img',
            'aria-label': `${title}. ${description}`
        },
        title: {
            role: 'title',
            children: title
        },
        description: {
            role: 'description',
            children: description
        }
    };
}

/**
 * Creates an accessible link
 * @param {string} text - Link text
 * @param {string} href - Link URL
 * @param {Object} props - Additional link properties
 * @returns {Object} Accessible link structure
 */
function createAccessibleLink(text, href, props = {}) {
    return {
        role: 'link',
        href,
        'aria-label': text,
        ...props,
        children: text
    };
}

/**
 * Adds ARIA landmarks to the dashboard structure
 * @param {Object} dashboard - Dashboard structure
 * @returns {Object} Dashboard with ARIA landmarks
 */
function addLandmarks(dashboard) {
    return {
        ...dashboard,
        header: {
            role: 'banner',
            ...dashboard.header
        },
        main: {
            role: 'main',
            ...dashboard.main
        },
        footer: {
            role: 'contentinfo',
            ...dashboard.footer
        }
    };
}

/**
 * Sets the language attribute for the dashboard
 * @param {Object} dashboard - Dashboard structure
 * @param {string} lang - Language code
 * @returns {Object} Dashboard with language attribute
 */
function setLanguage(dashboard, lang = 'en') {
    return {
        ...dashboard,
        lang
    };
}

/**
 * Wraps content in a main landmark element
 * @param {React.ReactNode} children - Content to wrap
 * @returns {React.ReactElement} Main landmark element
 */
function createMainLandmark(children) {
    return React.createElement('main', {
        role: 'main',
        'aria-label': 'Main content'
    }, children);
}

/**
 * Wraps content in a navigation landmark element
 * @param {React.ReactNode} children - Content to wrap
 * @returns {React.ReactElement} Navigation landmark element
 */
function createNavigationLandmark(children) {
    return React.createElement('nav', {
        role: 'navigation',
        'aria-label': 'Main navigation'
    }, children);
}

/**
 * Wraps content in a complementary landmark element
 * @param {React.ReactNode} children - Content to wrap
 * @returns {React.ReactElement} Complementary landmark element
 */
function createComplementaryLandmark(children) {
    return React.createElement('aside', {
        role: 'complementary',
        'aria-label': 'Additional information'
    }, children);
}

/**
 * Wraps content in a search landmark element
 * @param {React.ReactNode} children - Content to wrap
 * @returns {React.ReactElement} Search landmark element
 */
function createSearchLandmark(children) {
    return React.createElement('section', {
        role: 'search',
        'aria-label': 'Search'
    }, children);
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
    createAccessibleTable,
    createAccessibleSVG,
    createAccessibleLink,
    addLandmarks,
    setLanguage,
    createMainLandmark,
    createNavigationLandmark,
    createComplementaryLandmark,
    createSearchLandmark
};

// Auto-initialize if running directly
if (require.main === module) {
    initializeDashboard();
    console.log('Dashboard initialized with', pendingUpdates.size, 'pending updates');
}