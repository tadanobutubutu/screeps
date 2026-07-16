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
} catch (jsErr) {
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
    const packageInfo = require('circleci-node/package.json');
    circleCIVersion = packageInfo.version || '';
} catch (_) {}

try {
    const packageInfo = require('@devcontainer/python/package.json');
    devContainerPythonVersion = packageInfo.version || '';
} catch (_) {}

try {
    const packageInfo = require('@devcontainer/node/package.json');
    devContainerNodeVersion = packageInfo.version || '';
} catch (_) {}

try {
    const packageInfo = require('travis-ci/node/package.json');
    travisNodeVersion = packageInfo.version || '';
} catch (_) {}

try {
    const packageInfo = require('renovate/package.json');
    renovateUpdates = packageInfo.version || '';
} catch (_) {}

/**
 * Return the version string of lodash.
 * @returns {string}
 */
function getLodashVersion() {
    return lodashVersion;
}

/**
 * Return the version string of PostHog (library or node implementation).
 * @returns {string}
 */
function getPosthogVersion() {
    return posthogVersion;
}

/**
 * Return the version string of the Supabase JavaScript client.
 * @returns {string}
 */
function getSupabaseVersion()