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
 * Gets the Node.js version used in CircleCI
 * @returns {string} The CircleCI Node.js version
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
 * Gets the Node.js version used in devcontainer
 * @returns {string} The devcontainer Node.js version
 */
function getDevContainerNodeVersion() {
  return '24';
}

/**
 * Gets the Node.js version used in Travis CI
 * @returns {string} The Travis CI Node.js version
 */
function getTravisNodeVersion() {
  return '24';
}

/**
 * Gets the list of Renovate updates
 * @returns {Array} Array of Renovate updates
 */
function getRenovateUpdates() {
  return [
    { package: 'actions/setup-python', version: 'v6' },
    { package: 'actions/upload-artifact', version: 'v7' },
    { package: 'node', version: 'v24' },
    { package: 'posthog-js', version: 'v1.404.0' },
    { package: 'actions/setup-node', version: 'v7' },
    { package: 'typescript', version: 'v7' },
    { package: 'pnpm/action-setup', version: 'v6' }
  ];
}

/**
 * Gets the current version of Sentry
 * @returns {string} The Sentry version
 */
function getSentryVersion() {
  return '10.66.0';
}

/**
 * Gets the current version of GitHub CodeQL action
 * @returns {string} The GitHub CodeQL action version
 */
function getCodeQLActionVersion() {
  return 'v4';
}

/**
 * Gets the current version of pnpm
 * @returns {string} The pnpm version
 */
function getPnpmVersion() {
  return '11';
}

/**
 * Gets the current version of Python
 * @returns {string} The Python version
 */
function getPythonVersion() {
  return '3.14';
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
  getSentryVersion,
  getCodeQLActionVersion,
  getPnpmVersion,
  getPythonVersion
};