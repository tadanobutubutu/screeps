'use strict';

/* Deployment helpers
 *
 * Deployment helper and utility functions.
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
 * This module also re-exports the version-query functions defined in
 * main.js so test files can access them.
 */

/* Helper to safely fetch a package version from package.json or an empty string */
function _fetchPackageVersion(pkg, depName) {
    if (!pkg) return '';
    const deps = pkg.dependencies || {};
    const devDeps = pkg.devDependencies || {};
    if (deps[depName]) return deps[depName];
    if (devDeps[depName]) return devDeps[depName];
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
 * Get the lodash package semantic version or the empty string if unknown.
 */
function getLodashVersion() {
    return _fetchPackageVersion(pkg, 'lodash');
}

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
 * Get the DevContainer Python package semantic version or the empty string if unknown.
 */
function getDevContainerPythonVersion() {
    return _fetchPackageVersion(pkg, 'devcontainer-python');
}

/**
 * Get the DevContainer Node package semantic version or the empty string if unknown.
 */
function getDevContainerNodeVersion() {
    return _fetchPackageVersion(pkg, 'devcontainer-node');
}

/**
 * Get the Travis CI Node package semantic version or the empty string if unknown.
 */
function getTravisNodeVersion() {
    return _fetchPackageVersion(pkg, 'travis');
}

/**
 * Return a string representing the Renovate configuration status.
 * The logic here is intentionally minimal – it simply returns the value
 * of the "renovate" field in package.json if present, otherwise an empty
 * string. This keeps the function lightweight while still exposing useful
 * information for tests and debugging.
 */
function getRenovateUpdates() {
    if (!pkg) return '';
    return pkg.renovate || '';
}

// Export all functions for external consumption
module.exports = {
    getLodashVersion,
    getPostHogVersion,
    getSupabaseVersion,
    getCircleCINodeVersion,
    getDevContainerPythonVersion,
    getDevContainerNodeVersion,
    getTravisNodeVersion,
    getRenovateUpdates,
    // Re-exported for convenience in test environments
    _fetchPackageVersion,
    pkg
};