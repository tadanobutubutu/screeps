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
/* Helpers                                                                   */
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
/* Legacy compatibility (kept for completeness)                              */
/* -------------------------------------------------------------------------- */

/**
 * Safely invoke hotKidCounts if it is defined.
 * (This is kept for backward compatibility with older scripts.)
 */
if (typeof hotKidCounts === 'function') {
  hotKidCounts();
}

/* -------------------------------------------------------------------------- */
/* Deprecations / fixes                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Generate a deterministic daily challenge string.
 *
 * @returns {string} A daily-challenge string.
 */
function generateDailyChallenge() {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${addZero(today.getMonth() + 1)}-${addZero(today.getDate())}`;
  return `daily-challenge-${dateStr}`;
}

/**
 * Return the installed lodash version.
 *
 * @returns {string} The lodash version or 'unknown'.
 */
function getLodashVersion() {
  try {
    const pkg = require('