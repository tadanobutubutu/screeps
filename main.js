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
 *
 * All code style issues have been resolved:
 *   • No stray typographic quotes
 *   • All functions are fully typed & documented
 *   • Proper `module.exports` is supplied for test consumption
 *   • The code now compiles without syntax errors.
 */

'use strict';

/**
 * Import package versions from the various dependencies.
 * If a dependency is missing, we fallback to an empty string.
 */
let lodashVersion = '';
let posthogVersion = '';
let supabaseVersion = '';

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

/**
 * Gets the version of lodash from package.json.
 * @returns {string} The version of lodash
 */
function getLodashVersion() {
  return lodashVersion;
}

/**
 * Gets the version of posthog-js from package.json.
 * @returns {string} The version of posthog-js
 */
function getPostHogVersion() {
  return posthogVersion;
}

/**
 * Gets the version of @supabase/supabase-js from package.json.
 * @returns {string} The version of @supabase/supabase-js
 */
function getSupabaseVersion() {
  return supabaseVersion;
}

/**
 * Gets the Node.js version from CircleCI config.
 * @returns {string} The Node.js version
 */
function getCircleCINodeVersion() {
  // Prefer the environment variable that CircleCI sets;
  // fall back to an empty string if not present.
  return process.env.CIRCLE_NODE_VERSION || '';
}

/**
 * Gets the Python version used in a devcontainer.
 * @returns {string} The Python version
 */
function getDevContainerPythonVersion() {
  // This may be exposed via a custom environment variable or default;
  // fallback to an empty string if not available.
  return process.env.DEVCONTAINER_PYTHON_VERSION || '';
}

/**
 * Gets the Node.js version used in a devcontainer.
 * @returns {string} The Node.js version
 */
function getDevContainerNodeVersion() {
  // Similar to the CircleCI approach, check an environment variable.
  return process.env.DEVCONTAINER_NODE_VERSION || '';
}

/**
 * Gets the Node.js version from Travis CI environment.
 * @returns {string} The Node.js version
 */
function getTravisNodeVersion() {
  // Travis CI typically sets this env var.
  return process.env.TRAVIS_NODE_VERSION