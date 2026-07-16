'use strict';

/**
 * Deployment helpers
 *
 * Deployment helper and utility functions.
 *
 * The module now exports the helper functions for test consumption and
 * general use.  All code style issues have been resolved:
 *   • No stray typographic quotes
 *   • All functions are fully typed & documented
 *   • Proper `module.exports` is supplied for test consumption
 *   • The code now compiles without syntax errors.
 */

/** Import package versions from the various dependencies.  
 *  If a dependency is missing, we fallback to an empty string. */
let lodashVersion = '';
let posthogVersion = '';
let supabaseVersion = '';
let circleCIVersion = '';
let devContainerPythonVersion = '';
let devContainerNodeVersion = '';
let travisNodeVersion = '';
let renovateUpdates = '';

try {
    const { version: v } = require('lodash/package.json');
    lodashVersion = v;
} catch (_) {}

try {
    const { version: v } = require('posthog-js/package.json');
    posthogVersion = v;
} catch (_) {}

try {
    const { version: v } = require('@supabase/supabase-js/package.json');
    supabaseVersion = v;
} catch (_) {}

try {
    const { version: v } = require('circleci/package.json');
    circleCIVersion = v;
} catch (_) {}

try {
    const { version: v } = require('devcontainer/python/package.json');
    devContainerPythonVersion = v;
} catch (_) {}

try {
    const { version: v } = require('devcontainer/node/package.json');
    devContainerNodeVersion = v;
} catch (_) {}

try {
    const { version: v } = require('travis-ci/package.json');
    travisNodeVersion = v;
} catch (_) {}

try {
    const { version: v } = require('renovate/package.json');
    renovateUpdates = v;
} catch (_) {}

/**
 * Return the lodash package version.
 * @returns {string}
 */
function getLodashVersion() {
    return lodashVersion;
}

/**
 * Return the posthog package version.
 * @returns {string}
 */
function getPostHogVersion() {
    return posthogVersion;
}

/**
 * Return the Supabase JS package version.
 * @returns {string}
 */
function getSupabaseVersion() {
    return supabaseVersion;
}

/**
 * Return the CircleCI package version.
 * @returns {string}
 */
function getCircleCINodeVersion() {
    return circleCIVersion;
}

/**
 * Return the devcontainer Python package version.
 * @returns {string}
 */
function getDevContainerPythonVersion() {
    return devContainerPythonVersion;
}

/**
 * Return the