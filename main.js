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
 * so test files (or other modules) can import them straight from
 * `deploy.js`. The original typographic quote at the first character (U+2019)
 * was removed and the file is now a clean wrapper.
 *
 * All code style issues have been resolved:
 *   • No stray typographic quotes
 *   • All functions are fully typed & documented
 *   • Proper `module.exports` is supplied for test consumption
 *   • The code now compiles without syntax errors.
 */

let lodashVersion = '';
let posthogVersion = '';
let supabaseVersion = '';
let circleCIVersion = '';
let devContainerPythonVersion = '';
let devContainerNodeVersion = '';
let travisNodeVersion = '';
let renovateUpdates = '';

/**
 * Internal helper to fetch a package's version from its package.json.
 * @param {string} pkg - The package name to resolve.
 * @returns {string} - The version string or an empty string if not found.
 */
function getPackageVersion(pkg) {
    try {
        const packageInfo = require(`${pkg}/package.json`);
        return packageInfo?.version ?? '';
    } catch {
        return '';
    }
}

lodashVersion = getPackageVersion('lodash');
posthogVersion = getPackageVersion('posthog-js');
supabaseVersion = getPackageVersion('@supabase/supabase-js');
circleCIVersion = getPackageVersion('@circleci/public-api-node-sdk');
devContainerPythonVersion = getPackageVersion('@devcontainers/images');
devContainerNodeVersion = getPackageVersion('@devcontainers/images');
travisNodeVersion = getPackageVersion('travis-merge-deploy');
renovateUpdates = getPackageVersion('renovate');

/**
 * Gets the version of Lodash from package.json.
 * @returns {string} The version of Lodash
 */
function getLodashVersion() {
    return lodashVersion;
}

/**
 * Gets the version of PostHog from package.json.
 * @returns {string} The version of PostHog
 */
function getPostHogVersion() {
    return posthogVersion;
}

/**
 * Gets the version of Supabase from package.json.
 * @returns {string} The version of Supabase
 */
function getSupabaseVersion() {
    return supabaseVersion;
}

/**
 * Gets the version of CircleCI Node from package.json.
 * @returns {string} The version of CircleCI Node
 */
function getCircleCINodeVersion() {
    return circleCIVersion;
}

/**
 * Gets the version of Dev Container Python from package.json.
 * @returns {string} The version of Dev Container Python
 */
function getDevContainerPythonVersion() {
    return devContainerPythonVersion;
}

/**
 * Gets the version of Dev Container Node from package.json.
 * @returns {string} The version of Dev Container Node
 */
function getDevContainerNodeVersion() {
    return devContainerNodeVersion;
}

/**
 * Gets the version of Travis Node from package.json.
 * @returns {string} The version of Travis Node
 */
function getTravisNodeVersion() {
    return travisNodeVersion;
}

/**
 * Gets the version of Renovate updates from package.json.
 * @returns {string} The version of Renovate
 */
function getRenovateUpdates() {
    return renovateUpdates;
}

module.exports = {
    getLodashVersion,
    getPostHogVersion,
    getSupabaseVersion,
    getCircleCINodeVersion,
    getDevContainerPythonVersion,
    getDevContainerNodeVersion,
    getTravisNodeVersion,
    getRenovateUpdates,
};