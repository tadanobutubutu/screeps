/*
 * Deployment helpers
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
 * Holds the resolved version strings. They are initialized as undefined
 * and only set if the corresponding package can be found. This mirrors the
 * behavior of the original utility functions.
 */
let lodashVersion;
let posthogVersion;
let supabaseVersion;
let circleCINodeVersion;
let devContainerPythonVersion;
let devContainerNodeVersion;
let travisNodeVersion;

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
  const { version: v } = require('@circleci/node/package.json');
  circleCINodeVersion = v;
} catch (_) {}

try {
  const { version: v } = require('@devcontainers/python/package.json');
  devContainerPythonVersion = v;
} catch (_) {}

try {
  const { version: v } = require('@devcontainers/node/package.json');
  devContainerNodeVersion = v;
} catch (_) {}

try {
  const { version: v } = require('@travis/node/package.json');
  travisNodeVersion = v;
} catch (_) {}

/**
 * Gets the version of lodash from package.json.
 * @returns {string|undefined} The version of lodash or undefined if lodash is not available
 */
function getLodashVersion() {
  return lodashVersion;
}

/**
 * Gets the version of posthog-js from package.json.
 * @returns {string|undefined} The version of posthog-js or undefined if posthog-js is not available
 */
function getPostHogVersion() {
  return posthogVersion;
}

/**
 * Gets the version of supabase-js from package.json.
 * @returns {string|undefined} The version of supabase-js or undefined if supabase-js is not available
 */
function getSupabaseVersion() {
  return supabaseVersion;
}

/**
 * Gets the version of @circleci/node from package.json.
 * @returns {string|undefined} The version of @circleci/node or undefined if @circleci/node is not available
 */
function getCircleCINodeVersion() {
  return circleCINodeVersion;
}

/**
 * Gets the version of @devcontainers/python from package.json.
 * @returns {string|undefined} The version of @devcontainers/python or undefined if @devcontainers/python is not available
 */
function getDevContainerPythonVersion() {
  return devContainerPythonVersion;
}

/**
 * Gets the version of @devcontainers/node from package.json.
 * @returns {string|undefined} The version of @devcontainers/node or undefined if @devcontainers/node is not available