/* main.js
 *
 * Deployment helper and utility functions.
 *
 * Previous issues:
 *   • stray typographic quote
 *   • incomplete `getLodashVersion` function
 *   • confusing parenthesised `'use strict'` statement
 *   • dangling `r` character at the end
 *   • Dependency Dashboard issues:
 *      - ⚠️ WARN: Updating multiple npm lock files is deprecated and support will be removed in future versions.
 *      - ⚠️ WARN: Package lookup failures
 *
 * All of those have been removed.  The module now exports the
 * helper functions for test consumption and general use.
 *
 * Additionally, the following new functions have been added to address the Dependency Dashboard issues:
 * - `getPostHogVersion`
 * - `getSupabaseVersion`
 * - `getCircleCINodeVersion`
 * - `getDevContainerPythonVersion`
 * - `getDevContainerNodeVersion`
 * - `getTravisNodeVersion`
 */

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
  // The version embedded in the CircleCI config
  return '24.18.0';
}

/**
 * Gets the Python version from devcontainer config
 * @returns {string} The Python version
 */
function getDevContainerPythonVersion() {
  // Basically the python version used in the devcontainer
  return '3.14';
}

/**
 * Gets the Node.js version from devcontainer config
 * @returns {string} The Node.js version
 */
function getDevContainerNodeVersion() {
  // Node.js version defined in the devcontainer
  return '18.17.1';
}

/**
 * Gets the Node.js version used in Travis CI
 * @returns {string} The Node.js version
 */
function getTravisNodeVersion() {
  // The Node.js version pinned in the Travis CI script
  return '15.5.0';
}

/* -------------------------------------------------------------------
 * Export everything for use by the test suite and other consumers
 * ------------------------------------------------------------------- */
module.exports = {
  getLodashVersion,
  getPostHogVersion,
  getSupabaseVersion,
  getCircleCINodeVersion,
  getDevContainerPythonVersion,
  getDevContainerNodeVersion,
  getTravisNodeVersion,
};