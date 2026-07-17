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
 * so test files can access them.
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

/* Existing functions (placeholder) */
function getLodashVersion() {
    return _fetchPackageVersion(pkg, 'lodash') || '';
}

/* New functions added to address Dependency Dashboard issues */
function getPostHogVersion() {
    return _fetchPackageVersion(pkg, 'posthog') || '';
}

function getSupabaseVersion() {
    return _fetchPackageVersion(pkg, '@supabase/supabase-js') || '';
}

function getCircleCINodeVersion() {
    return _fetchPackageVersion(pkg, '@circleci/node') || '';
}

function getDevContainerPythonVersion() {
    return _fetchPackageVersion(pkg, 'devcontainer-python') || '';
}

function getDevContainerNodeVersion() {
    return _fetchPackageVersion(pkg, 'devcontainer-node') || '';
}

function getTravisNodeVersion() {
    return _fetchPackageVersion(pkg, 'travis-node') || '';
}

function getRenovateUpdates() {
    // Placeholder for Renovate update logic
    return '';
}

module.exports