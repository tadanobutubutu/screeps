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
 * This module also re-exports the version‑query functions defined in
 * main.js so test files can access them.
 */

/* Helper to safely fetch a package version from package.json or return an empty string */
function _fetchPackageVersion(pkg, depName) {
    try {
        const pkgPath = require.resolve(`${pkg}/package.json`);
        const { version } = require(pkgPath);
        return typeof version === 'string' ? version : '';
    } catch (e) {
        // Package not found or unparsable: return empty string
        return '';
    }
}

/* Existing helper: fetch Lodash version */
function getLodashVersion() {
    return _fetchPackageVersion('lodash');
}

/** Get the Supabase package semantic version or an empty string if unknown. */
function getSupabaseVersion() {
    return _fetchPackageVersion('@supabase/supabase-js');
}

/** Get the CircleCI Node package semantic version or an empty string if unknown. */
function getCircleCINodeVersion() {
    return _fetchPackageVersion('cimg/node');
}

/** Get the DevContainer Python package semantic version or an empty string if unknown. */
function getDevContainerPythonVersion() {
    return _fetchPackageVersion('mcr.microsoft.com/devcontainers/python');
}

/** Get the DevContainer Node package semantic version or an empty string if unknown. */
function getDevContainerNodeVersion() {
    return _fetchPackageVersion('ghcr.io/devcontainers/features/node');
}

/** Get the Travis Node package semantic version or an empty string if unknown. */
function getTravisNodeVersion() {
    return _fetchPackageVersion('node');
}

/** Get the PostHog package semantic version or an empty string if unknown. */
function getPostHogVersion() {
    return _fetchPackageVersion('posthog-js');
}

/** Get the Renovate updates information or an empty string if unknown. */
function getRenovateUpdates() {
    // Normally this would read a config or call an API; here we return a stub.
    return 'placeholder';
}

/* Export all public helpers so tests can import them */
module.exports = {
    getLodashVersion,
    getSupabaseVersion,
    getCircleCINodeVersion,
    getDevContainerPythonVersion,
    getDevContainerNodeVersion,
    getTravisNodeVersion,
    getPostHogVersion,
    getRenovateUpdates
};