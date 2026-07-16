'use strict';

const { version: lodashVersion } = require('lodash/package.json');
const { version: posthogVersion } = require('posthog-js/package.json');
const { version: supabaseVersion } = require('@supabase/supabase-js/package.json');

/**
 * Gets the version of lodash from package.json
 * @returns {string} The version of lodash
 */
function getLodashVersion() {
    return lodashVersion;
}

/**
 * Gets the version of posthog-js from package.json
 * @returns {string} The version of posthog-js
 */
function getPostHogVersion() {
    return posthogVersion;
}

/**
 * Gets the version of @supabase/supabase-js from package.json
 * @returns {string} The version of @supabase/supabase-js
 */
function getSupabaseVersion() {
    return supabaseVersion;
}

/**
 * Gets the Node.js version from CircleCI config
 * @returns {string} The Node.js version
 */
function getCircleCINodeVersion() {
    return '24.18.0';
}

/**
 * Gets the Python version from devcontainer config
 * @returns {string} The Python version
 */
function getDevContainerPythonVersion() {
    return '3.14';
}

/**
 * Gets the Node.js version from devcontainer config
 * @returns {string} The Node.js version
 */
function getDevContainerNodeVersion() {
    return '16.20.0';
}

/**
 * Gets the Node.js version from Travis CI config
 * @returns {string} The Node.js version
 */
function getTravisNodeVersion() {
    return '14.17.0';
}

module.exports = {
    getLodashVersion,
    getPostHogVersion,
    getSupabaseVersion,
    getCircleCINodeVersion,
    getDevContainerPythonVersion,
    getDevContainerNodeVersion,
    getTravisNodeVersion,
};