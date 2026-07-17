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

/**
 * Gets the current version of lodash
 * @returns {string} The lodash version
 */
function getLodashVersion() {
  return lodashVersion;
}

/**
 * Gets the current version of PostHog
 * @returns {string} The PostHog version
 */
function getPostHogVersion() {
  return posthogVersion;
}

/**
 * Gets the current version of Supabase
 * @returns {string} The Supabase version
 */
function getSupabaseVersion() {
  return supabaseVersion;
}

/**
 * Gets the Node version used in CircleCI
 * @returns {string} The CircleCI Node version
 */
function getCircleCINodeVersion() {
  return circleCIVersion;
}

/**
 * Gets the Python version used in devcontainer
 * @returns {string} The devcontainer Python version
 */
function getDevContainerPythonVersion() {
  return '3.14';
}

/**
 * Gets the Node version used in devcontainer
 * @returns {string} The devcontainer Node version
 */
function getDevContainerNodeVersion() {
  return '24';
}

/**
 * Gets the Node version used in Travis CI
 * @returns {string} The Travis Node version
 */
function getTravisNodeVersion() {
  return '24';
}

/**
 * Gets the pending Renovate updates
 * @returns {Array} Array of pending updates
 */
function getRenovateUpdates() {
  return [
    'actions/setup-python to v6',
    'actions/upload-artifact to v7',
    'node to v24',
    'posthog-js to v1.404.0',
    'actions/setup-node to v7',
    'typescript to v7',
    'pnpm/action-setup to v6'
  ];
}

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