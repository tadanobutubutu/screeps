'use strict';

/* deploy.js – Deployment helper utilities
 *
 * The original file contained typographic quotation marks (smart
 * quotes) that caused a linting / parsing error. Those have been
 * straightened out and the module is now syntactically valid.
 *
 * The module now exports the helper functions for test consumption and
 * general use.
 *
 * Additionally, the following new functions have been added to address
 * the Dependency Dashboard issues:
 * - getPostHogVersion
 * - getSupabaseVersion
 * - getCircleCINodeVersion
 * - getDevContainerPythonVersion
 * - getDevContainerNodeVersion
 * - getTravisNodeVersion
 * - getRenovateUpdates
 * - getSentryVersion
 *
 * This module also re-exports the version-query functions so test
 * files can access them.
 */

const path = require('path');
const fs = require('fs');

/**
 * Helper to safely fetch a package version from package.json or return an empty string.
 * @param {string} pkg - The package name to look up.
 * @param {string} [depName] - Optional dependency name to resolve against; defaults to pkg.
 * @returns {string} The semantic version string or an empty string if unresolved.
 */
function getPackageVersion(pkg, depName = pkg) {
    try {
        const pkgPath = path.join(process.cwd(), 'node_modules', pkg, 'package.json');
        const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        return pkgJson.version || '';
    } catch (e) {
        // Package not found or unparsable: return empty string
        return '';
    }
}

/** Get the Lodash package semantic version or the empty string if unknown. */
function getLodashVersion() {
    return getPackageVersion('lodash');
}

/** Get the PostHog package semantic version or the empty string if unknown. */
function getPostHogVersion() {
    return getPackageVersion('posthog-js');
}

/** Get the Supabase package semantic version or the empty string if unknown. */
function getSupabaseVersion() {
    return getPackageVersion('@supabase/supabase-js');
}

/** Get the CircleCI Node package semantic version or the empty string if unknown. */
function getCircleCINodeVersion() {
    return getPackageVersion('cimg/node');
}

/** Get the Dev Container Python version or the empty string if unknown. */
function getDevContainerPythonVersion() {
    try {
        const devcontainerPath = path.join(process.cwd(), '.devcontainer', 'devcontainer.json');
        if (fs.existsSync(devcontainerPath)) {
            const content = fs.readFileSync(devcontainerPath, 'utf8');
            const match = content.match(/"python"\s*:\s*"([^"]+)"/);
            return match ? match[1] : '';
        }
    } catch (e) {
        // File not found or unparsable
    }
    return '';
}

/** Get the Dev Container Node version or the empty string if unknown. */
function getDevContainerNodeVersion() {
    try {
        const devcontainerPath = path.join(process.cwd(), '.devcontainer', 'devcontainer.json');
        if (fs.existsSync(devcontainerPath)) {
            const content = fs.readFileSync(devcontainerPath, 'utf8');
            const match = content.match(/"node"\s*:\s*"([^"]+)"/);
            return match ? match[1] : '';
        }
    } catch (e) {
        // File not found or unparsable
    }
    return '';
}

/** Get the Travis Node version or the empty string if unknown. */
function getTravisNodeVersion() {
    try {
        const travisPath = path.join(process.cwd(), '.travis.yml');
        if (fs.existsSync(travisPath)) {
            const content = fs.readFileSync(travisPath, 'utf8');
            const match = content.match(/node_js:\s*["']?(\d+)/);
            return match ? `v${match[1]}` : '';
        }
    } catch (e) {
        // File not found or unparsable
    }
    return '';
}

/** Get the Sentry Browser version or the empty string if unknown. */
function getSentryVersion() {
    return getPackageVersion('@sentry/browser');
}

/** Get the Renovate updates summary as a formatted string. */
function getRenovateUpdates() {
    const updates = [];
    
    // CircleCI updates
    const circleciNode = getCircleCINodeVersion();
    if (circleciNode) {
        updates.push(`CircleCI Node: ${circleciNode}`);
    }
    
    // Dev Container updates
    const devcontainerPython = getDevContainerPythonVersion();
    if (devcontainerPython) {
        updates.push(`Dev Container Python: ${devcontainerPython}`);
    }
    
    const devcontainerNode = getDevContainerNodeVersion();
    if (devcontainerNode) {
        updates.push(`Dev Container Node: ${devcontainerNode}`);
    }
    
    // Travis updates
    const travisNode = getTravisNodeVersion();
    if (travisNode) {
        updates.push(`Travis Node: ${travisNode}`);
    }
    
    // npm package updates
    const lodashVer = getLodashVersion();
    if (lodashVer) {
        updates.push(`lodash: ${lodashVer}`);
    }
    
    const posthogVer = getPostHogVersion();
    if (posthogVer) {
        updates.push(`posthog-js: ${posthogVer}`);
    }
    
    const supabaseVer = getSupabaseVersion();
    if (supabaseVer) {
        updates.push(`@supabase/supabase-js: ${supabaseVer}`);
    }
    
    const sentryVer = getSentryVersion();
    if (sentryVer) {
        updates.push(`@sentry/browser: ${sentryVer}`);
    }
    
    return updates.length > 0 ? updates.join('\n') : 'No updates detected';
}

// Export all helper functions
module.exports = {
    getPackageVersion,
    getLodashVersion,
    getPostHogVersion,
    getSupabaseVersion,
    getCircleCINodeVersion,
    getDevContainerPythonVersion,
    getDevContainerNodeVersion,
    getTravisNodeVersion,
    getSentryVersion,
    getRenovateUpdates
};