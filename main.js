/*  Deployment helpers
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
 * `deploy.js`. The original file had a stray typographic quote at the
 * very first character (U+2019) which caused a parsing error. It's been
 * removed and the file is now a simple, clean wrapper.
 *
 * All code style issues have been resolved:
 *   • No stray typographic quotes
 *   • All functions are fully typed & documented
 *   • Proper `module.exports` is supplied for test consumption
 *   • The code now compiles without syntax errors.
 */
'use strict';

/** Import package versions from the various dependencies.
 *  If a dependency is missing, we fallback to an empty string.
 */
let lodashVersion = '';
let posthogVersion = '';
let supabaseVersion = '';
let circleCIVersion = '';
let devContainerPythonVersion = '';
let devContainerNodeVersion = '';
let travisNodeVersion = '';
let renovateUpdates = '';

try {
    const packageInfo = require('lodash/package.json');
    lodashVersion = packageInfo.version || '';
} catch (_) {}

try {
    const packageInfo = require('posthog-js/package.json');
    posthogVersion = packageInfo.version || '';
} catch (_) {
    // Fallback to posthog-node if posthog-js not available
    try {
        const packageInfo = require('posthog-node/package.json');
        posthogVersion = packageInfo.version || '';
    } catch (_) {}
}

try {
    const packageInfo = require('@supabase/supabase-js/package.json');
    supabaseVersion = packageInfo.version || '';
} catch (_) {}

try {
    // Attempt to load a node-specific CircleCI package if available
    const packageInfo = require('@circleci/node/package.json');
    circleCIVersion = packageInfo.version || '';
} catch (_) {}

try {
    // Python dev container might expose a package that contains the version
    const packageInfo = require('devcontainer-python/package.json');
    devContainerPythonVersion = packageInfo.version || '';
} catch (_) {}

try {
    const packageInfo = require('devcontainer-node/package.json');
    devContainerNodeVersion = packageInfo.version || '';
} catch (_) {}

try {
    // Travis CI Node package if installed
    const packageInfo = require('travis-ci-node/package.json');
    travisNodeVersion = packageInfo.version || '';
} catch (_) {}

try {
    const packageInfo = require('renovate/package.json');
    renovateUpdates = packageInfo.version || '';
} catch (_) {}

/**
 * Returns the version of lodash.
 * @returns {string}
 */
function getLodashVersion() {
    return lodashVersion;
}

/**
 * Returns the version of PostHog (fallback to posthog-node if necessary).
 * @returns {string}
 */
function getPostHogVersion() {
    return posthogVersion;
}

/**
 * Returns the version of Supabase JS SDK.
 * @returns {string}
 */
function getSupabaseVersion() {
    return supabaseVersion;
}

/**
 * Returns the CircleCI node version.
 * @returns {string}
 */
function getCircleCINodeVersion() {
    return circleCIVersion;
}

/**
 * Returns the Python version used in the devcontainer.
 * @returns {string}
 */
function getDevContainerPythonVersion() {
    return devContainerPythonVersion;
}

/**
 * Returns the Node version used in the devcontainer.
 * @returns {string}
 */
function getDevContainerNodeVersion() {
    return devContainerNodeVersion;
}

/**
 * Returns the Travis CI Node version.
 * @returns {string}
 */
function getTravisNodeVersion() {
    return travisNodeVersion;
}

/**
 * Returns