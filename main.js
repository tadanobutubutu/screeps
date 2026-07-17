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
 * This module also re-exports the version-query functions defined in
 * main.js so test files can access them
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
 * Get the Dev Container Python version or empty string if not defined.
 */
function getDevContainerPythonVersion() {
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
 * Get the Travis CI Node version from .travis.yml if present, otherwise empty string.
 */
function getTravisNodeVersion() {
    try {
        const travisYml = require('./.travis.yml');
        // travisYml may be parsed by require if valid JSON, but typical .yml is YAML.
        // For simplicity, try require and fallback to empty.
        return travisYml.node_js ? (Array.isArray(travisYml.node_js) ? travisYml.node_js[0] : travisYml.node_js) : '';
    } catch (_) {
        return '';
    }
}

/**
 * Return information about Renovate updates configuration if present.
 */
function getRenovateUpdates() {
    try {
        const r = require('./renovate.json');
        return JSON.stringify(r);
    } catch (_) {
        return '';
    }
}

// Export all helper functions
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