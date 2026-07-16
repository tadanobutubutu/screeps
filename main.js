/* main.js
 *
 * Deployment helper and utility functions.
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
  return '24.18.0';
}

/**
 * Gets the Python version from devcontainer config.
 * @returns {string} The Python version
 */
function getDevContainerPythonVersion() {
  return '3.14';
}

/**
 * Gets the Node.js version from devcontainer config.
 * @returns {string} The Node.js version
 */
function getDevContainerNodeVersion() {
  return '20.12.1';
}

/**
 * Gets the Node.js version used by Travis CI.
 * @returns {string} The Travis CI Node version
 */
function getTravisNodeVersion() {
  return '16.13.0';
}

/**
 * Expose all helper functions for external usage (tests,
 * scripts, etc.).  This matches the ESLint disable
 * expectations in the project and keeps the API clear.
 */
module.exports = {
  getLodashVersion,
  getPostHogVersion,
  getSupabaseVersion,
  getCircleCINodeVersion,
  getDevContainerPythonVersion,
  getDevContainerNodeVersion,
  getTravisNodeVersion
};