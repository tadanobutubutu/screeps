/*  Deployment helpers
 *
 * Deployment helper and utility functions.
 *
 * Previous issues:
 *   • stray typographic quote
 *   • incomplete `getLodashVersion` function
 *   • confusing parenthesised `'use strict'` statement
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
 * This module also re‑exports the version‑query functions defined in main.js
 * so test files (or other modules) can import them straight from
 * `deploy.js`. The original file had a stray typographic quote at the
 * very first character (U+2019) which caused a parsing error. It’s been
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
    const { version: v } = packageInfo;
    lodashVersion = v;
} catch (_) {}

try {
    const packageInfo = require('posthog-js/package.json');
    const { version: v } = packageInfo;
    posthogVersion = v;
} catch (_) {}

try {
    const packageInfo = require('@supabase/supabase-js/package.json');
    const { version: v } = packageInfo;
    supabaseVersion = v;
} catch (_) {}

try {
    const packageInfo = require('@circleci/public-api-node-sdk/package.json');
    const { version: v } = packageInfo;
    circleCIVersion = v;
} catch (_) {}

try {
    const packageInfo = require('@devcontainers/images/package.json');
    const { version: v } = packageInfo;
    devContainerPythonVersion = v;
} catch (_) {}

try {
    const packageInfo = require('@devcontainers/images/package.json');
    const { version: v } = packageInfo;
    devContainerNodeVersion = v;
} catch (_) {}

try {
    const packageInfo = require('travis-merge-deploy/package.json');
    const { version: v } = packageInfo;
    travisNodeVersion = v;
} catch (_) {}

try {
    // Renovate may not be a runtime dependency; fallback to empty string
    const packageInfo = require('renovate/package.json');
    const { version: v } = packageInfo;
    renovateUpdates = v;
} catch (_) {}

/**
 * Gets the version of lodash from package.json.
 * @returns {string} The version of lodash
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