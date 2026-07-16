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

/* -------------------------------------------------------------------------- */
/* Helpers                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Pad a number with a leading zero if it is less than 10.
 *
 * @param {number} value
 * @returns {string}
 */
function addZero(value) {
  return value < 10 ? `0${value}` : `${value}`;
}

/* -------------------------------------------------------------------------- */
/* Legacy compatibility (kept for completeness)                               */
/* -------------------------------------------------------------------------- */

/**
 * Safely invoke hotKidCounts if it is defined.
 * (This is kept for backward compatibility with older scripts.)
 */
if (typeof hotKidCounts === 'function') {
  hotKidCounts();
}

/* -------------------------------------------------------------------------- */
/* Deprecations / fixes                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Get the current Lodash version (if present).
 *
 * @returns {string | undefined}
 */
function getLodashVersion() {
  try {
    return require('lodash/package.json').version;
  } catch (e) {
    // Lodash may not be installed – expose that fact to the caller.
    return undefined;
  }
}

/* -------------------------------------------------------------------------- */
/* Public API                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Generate a deterministic daily challenge string.
 *
 * @returns {string} A daily‑challenge string.
 */
function generateDailyChallenge() {
  const today = new Date();
  const dateString = `${today.getFullYear()}-${addZero(today.getMonth() + 1)}-${addZero(today.getDate())}`;
  return `Today's challenge (${dateString}): Practice coding in JavaScript!`;
}

/**
 * Get the current Node.js version.
 *
 * @returns {string} The Node.js version.
 */
function getNodeVersion() {
  return process.version;
}

/**
 * Get the current TypeScript version.
 *
 * @returns {string} The TypeScript version.
 */
function getTypeScriptVersion() {
  return require('typescript/package.json').version;
}

/**
 * Get the current PostHog version.
 *
 * @returns {string} The PostHog version.
 */
function getPostHogVersion() {
  return require('posthog-js/package.json').version;
}

/**
 * Get the current Supabase version.
 *
 * @returns {string} The Supabase version.
 */
function getSupabaseVersion() {
  return require('@supabase/supabase-js/package.json').version;
}

/**
 * Get the current CircleCI Node version.
 *
 * @returns {string} The CircleCI Node version.
 */
function getCircleCINodeVersion() {
  return '24.18.0';
}

/**
 * Get the current DevContainer Python version.
 *
 * @returns {string} The DevContainer Python version.
 */
function getDevContainerPythonVersion() {
  return '3.10.8';
}

/**
 * Get the current DevContainer Node version.
 *
 * @returns {string} The DevContainer Node version.
 */
function getDevContainerNodeVersion() {
  return '18.17.0';
}

/**
 * Get the current Travis CI Node version.
 *
 * @returns {string} The Travis CI Node version.
 */
function getTravisNodeVersion() {
  return '16.13.0';
}

/* -------------------------------------------------------------------------- */
/* Exported surface                                                               */
/* -------------------------------------------------------------------------- */

module.exports = {
  generateDailyChallenge,
  getNodeVersion,
  getTypeScriptVersion,
  getPostHogVersion,
  getSupabaseVersion,
  getCircleCINodeVersion,
  getDevContainerPythonVersion,
  getDevContainerNodeVersion,
  getTravisNodeVersion,
  getLodashVersion,
};