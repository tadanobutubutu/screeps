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

// Helper to safely fetch a package version from package.json or empty string
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

/** Get the PostHog package semantic version or the empty string if unknown. */
function getPostHogVersion() {
    return _fetchPackageVersion(pkg, 'posthog');
}

/** Get the Supabase package semantic version or the empty string if unknown. */
function getSupabaseVersion() {
    return _fetchPackageVersion(pkg, '@supabase/supabase-js');
}

/** Get the CircleCI Node package semantic version or the empty string if unknown. */
function getCircleCINodeVersion() {
    return _fetchPackageVersion(pkg, '@circleci/node');
}

/** Get the Dev Container Python version or the empty string if unknown. */
function getDevContainerPythonVersion() {
    return _fetchPackageVersion(pkg, 'python');
}

/** Get the Dev Container Node version or the empty string if unknown. */
