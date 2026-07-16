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
        // Resolve to the package.json of the dependency
        const pkgJson = require(`${pkg}/package.json`);
        return pkgJson && pkgJson.version ? pkgJson.version : '';
    } catch (_) {
        // If the package cannot be resolved, return empty string
        return '';
    }
}

/**
 * Gets the version of Lodash from package.json.
 * @returns {string} The version of Lodash
 */
function getLodashVersion() {
    if (!lodashVersion) {
        lodashVersion = getPackageVersion('lodash');
    }
    return lodashVersion;
}

/**
 * Gets the version of PostHog from package.json.
 * @returns {string} The version of PostHog
 */
function getPostHogVersion() {
    if (!posthogVersion) {
        posthogVersion = getPackageVersion('posthog-js');
    }
    return posthogVersion;
}

/**
 * Gets the version of Supabase from package.json.
 * @returns {string} The version of Supabase
 */
function getSupabaseVersion() {
    if (!supabaseVersion) {
        supabaseVersion = getPackageVersion('@supabase/supabase-js');
    }
    return supabaseVersion;
}

/**
 * Gets the version of CircleCI Node from package.json.
 * @returns {string} The version of CircleCI Node
 */
function getCircleCINodeVersion() {
    if (!circleCIVersion) {
        circleCIVersion = getPackageVersion('circleci-node');
    }
    return circleCIVersion;
}

/**
 * Gets the version of the Dev Container Python from its Dockerfile or package.json.
 * @returns {string} The Python version used in the dev container
 */
function getDevContainerPythonVersion() {
    if (!devContainerPythonVersion) {
        // Attempt to read from .devcontainer Dockerfile if exists
        try {
            const dockerfile = require('fs').readFileSync('.devcontainer/Dockerfile', 'utf8');
            const match = dockerfile.match(/FROM.+python:(\d+\.\d+\.\d+)/i);
            devContainerPythonVersion = match ? match[1] : '';
        } catch (_) {
            devContainerPythonVersion = '';
        }
    }
    return devContainerPythonVersion;
}

/**
 * Gets the version of the Dev Container Node from .devcontainer devcontainer.json.
 * @returns {string} The Node version used in the dev container
 */
function getDevContainerNodeVersion() {
    if (!devContainerNodeVersion) {
        try {
            const devconf = require('./.devcontainer/devcontainer.json');
            devContainerNodeVersion = devconf.extensions && devconf.extensions['ms-vscode.node-debug2'];
            if (!devContainerNodeVersion && devconf.devContainer && devconf.devContainer.contentsOnUpdate) {
                // Fallback to looking into the Dockerfile if no explicit node version is found
                const dockerfile = require('fs').readFileSync('.devcontainer/Dockerfile', 'utf8');
                const match = dockerfile.match(/FROM.+node:(\d+\.\d+\.\d+)/i);
                devContainerNode