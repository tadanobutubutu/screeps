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
 * This module also re-exports the version‑query functions so test
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

/** Get the Dev Container Python package semantic version or the empty string if unknown. */
function getDevContainerPythonVersion() {
    return getPackageVersion('devcontainers/python');
}

/** Get the Dev Container Node package semantic version or the empty string if unknown. */
function getDevContainerNodeVersion() {
    return getPackageVersion('devcontainers/node');
}

/** Get the Travis CI Node package semantic version or the empty string if unknown. */
function getTravisNodeVersion() {
    return getPackageVersion('travis-ci/node');
}

/** Get the Renovate updates package version or the empty string if unknown. */
function getRenovateUpdates() {
    return getPackageVersion('renovate');
}

/** Get the Sentry SDK package semantic version or the empty string if unknown. */
function getSentryVersion() {
    return getPackageVersion('sentry-sdk');
}

module.exports = {
    getPackageVersion,
    getLodashVersion,
    getPostHogVersion,
    getSupabaseVersion,
    getCircleCINodeVersion,
    getDevContainerPythonVersion,
    getDevContainerNodeVersion,
    getTravisNodeVersion,
    getRenovateUpdates,
    getSentryVersion
};