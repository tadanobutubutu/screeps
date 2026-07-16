'use strict';

/* Deployment helpers
 *
 * Deployment helper and utility functions.
 *
 * The module now exports the helper functions for test consumption and
 * general use. Previous issues such as stray typographic quotes, missing
 * functions, and dangling characters have been resolved.
 *
 * The following functions are available:
 * - `getLodashVersion`
 * - `getPostHogVersion`
 * - `getSupabaseVersion`
 * - `getCircleCINodeVersion`
 * - `getDevContainerPythonVersion`
 * - `getDevContainerNodeVersion`
 * - `getTravisNodeVersion`
 * - `getRenovateUpdates`
 */

const fs = require('fs');
const path = require('path');

/**
 * Generic helper to retrieve a package's version from its package.json.
 * @param {string} packageName Fully qualified npm package name.
 * @returns {string} The version string, or an empty string if unavailable.
 */
function _getPackageVersion(packageName) {
    try {
        const pkg = require(`${packageName}/package.json`);
        return pkg.version || '';
    } catch {
        return '';
    }
}

/** Cache for resolved package versions */
const versionCache = {};

/**
 * Read a package's version, using a cache to minimize disk I/O.
 * @param {string} pkgName The package name to resolve.
 * @returns {string} The resolved version or an empty string if not found.
 */
function readPackageVersion(pkgName) {
    if (pkgName in versionCache) {
        return versionCache[pkgName];
    }
    const version = _getPackageVersion(pkgName);
    versionCache[pkgName] = version;
    return version;
}

/** -------------------------------------------------------------------------- */
/** Public functions exported
 * These wrappers provide a very small API for getting specific versions.
 * -------------------------------------------------------------------------- */

function getLodashVersion() {
    return readPackageVersion('lodash');
}

function getPostHogVersion() {
    return readPackageVersion('@posthog/plugin-scoped');
}

function getSupabaseVersion() {
    return readPackageVersion('@supabase/supabase-js');
}

function getCircleCINodeVersion() {
    return readPackageVersion('@circleci/node');
}

function getDevContainerPythonVersion() {
    return readPackageVersion('python');
}

function getDevContainerNodeVersion() {
    return readPackageVersion('devcontainer');
}

function getTravisNodeVersion() {
    return readPackageVersion('travis');
}

function getRenovateUpdates() {
    return readPackageVersion('renovate');
}

/** -------------------------------------------------------------------------- */
/** Exported objects
 * Export the functions so other modules can import them directly.
 * -------------------------------------------------------------------------- */

module.exports = {
    getLodashVersion,
    getPostHogVersion,
    getSupabaseVersion,
    getCircleCINodeVersion,
    getDevContainerPythonVersion,
    getDevContainerNodeVersion,
    getTravisNodeVersion,
    getRenovateUpdates
};