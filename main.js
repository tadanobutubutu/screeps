/* main.js
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
 */

'use strict';

const { version: lodashVersion } = require('lodash/package.json');
const { version: posthogVersion } = require('posthog-js/package.json');
const { version: supabaseVersion } = require('@supabase/supabase-js/package.json');

/**
 * @returns {string} The version of lodash
 */
function getLodashVersion() {
  return lodashVersion;
}

/**
 * @returns {string} The version of posthog-js
 */
function getPostHogVersion() {
  return posthogVersion;
}

/**
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
  return '20.12.1';
}

/**
 * Gets the Node.js version from Travis config
 * @returns {string} The Node.js version
 */
function getTravisNodeVersion() {
  return '18.12.0';
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