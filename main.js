'use strict';

/* Deployment helpers
 *
 * Deployment helper and utility functions.
 *
 * Previous issues:
 *   • stray typographic quote
 *   • incomplete `getLodashVersion` function
 *   • confusing parenthesised 'use strict' statement
 *   • dangling `r` character at the end
 *
 * The module now exports the helper functions for test consumption and
 * general use.
 *
 * Additionally, the following new functions have been added to address
 * the Dependency Dashboard issues:
 * - `getPostHogVersion`
 * - `getSupabaseVersion`
 * - `getCircleCINodeVersion`
 * - `getDevContainerPythonVersion`
 * - `getDevContainerNodeVersion`
 * - `getTravisNodeVersion`
 * - `getRenovateUpdates`
 *
 * This module also re-exports the version-query functions defined in main.js
 * so test files can access them
 */

// ... (Existing code from main.js) ...

// Helper to safely fetch a package version from package.json or empty string
function _fetchPackageVersion(pkg, depName) {
    if (!pkg) return '';
    const deps = pkg.dependencies || {};
    const devDe = pkg.devDependencies || {};
    if (deps[depName]) return deps[depName];
    if (devDe[depName]) return devDe[depName];
    return '';
}

const pkg = (() => {
    try {
        return require('./package.json');
    } catch (_) {
        return null;
    }
})();

/**
 * Get the PostHog package semantic version or the empty string if unknown.
 */
function getPostHogVersion() {
    return _fetchPackageVersion(pkg, 'posthog');
}

/**
 * Get the Supabase package semantic version or the empty string if unknown.
 */
function getSupabaseVersion() {
    return _fetchPackageVersion(pkg, '@supabase/supabase-js');
}

/**
 * Get the CircleCI Node library semantic version or the empty string if unknown.
 */
function getCircleCINodeVersion() {
    return _fetchPackageVersion(pkg, '@circleci/node');
}

/**
 * Get the Dev Container Python version or empty string if not defined.
 */
function getDevContainerPythonVersion() {
    // Might be stored in devcontainer.json or similar; fallback to empty
    try {
        const dc = require('./.devcontainer/devcontainer.json');
        return dc.python?.version || '';
    } catch (_) {
        return '';
    }
}

/**
 * Get the Dev Container Node version or empty string if not defined.
 */
function getDevContainerNodeVersion() {
    try {
        const dc = require('./.devcontainer/devcontainer.json');
        return dc.node?.version || '';
    } catch (_) {
        return '';
    }
}

/**
 * Get the Travis Node version or empty string if not defined.
 */
function getTravisNodeVersion() {
    try {
        const travis = require('./.travis.yml');
        return travis.language === 'node_js' ? travis.node_js : '';
    } catch (_) {
        return '';
    }
}

/**
 * Get the Renovate updates version or empty string if not defined.
 */
function getRenovateUpdates() {
    try {
        const renovate = require('./renovate.json');
        return renovate.branch || '';
    } catch (_) {
        return '';
    }
}

/**
 * Gets the current version of S