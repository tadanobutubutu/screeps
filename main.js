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
    const { version: v } = require('posthog-node/package.json');
    posthogVersion = v;
} catch (_) {}

try {
    const packageInfo = require('@supabase/supabase-js/package.json');
    const { version: v } = packageInfo;
    supabaseVersion = v;
} catch (_) {}

try {
    const { version: v } = require('circleci/node/package.json');
    circleCIVersion = v;
} catch (_) {}

try {
    const { version: v } = require('@devcontainer/template/package.json');
    devContainerPythonVersion = v;
} catch (_) {}

try {
    const { version: v } = require('@devcontainer/template/package.json');
    devContainerNodeVersion = v;
} catch (_) {}

try {
    const { version: v } = require('travis-merge-deploy/package.json');
    travisNodeVersion = v;
} catch (_) {}

try {
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