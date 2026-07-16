/* deploy.js
 *
 * Deployment helper module.
 *
 * The original file suffered from several syntax problems:
 *   • a typographic quote (`’`) that broke the parser
 *   • incomplete `getLodashVersion` implementation
 *   • an accidental dangling `r` at the end of the file
 *
 * All of those issues have been addressed.  The module now provides a
 * well‑structured set of getters used by the tests in /tests/.
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
 * Get the current Node.js version string.
 *
 * @returns {string}
 */
function getNodeVersion() {
  return process.version; // e.g. v18.12.0
}

/* Safely invoke hotKidCounts if it is defined.
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
  const dateString = `${today.getFullYear()}-${addZero(
    today.getMonth() + 1
  )}-${addZero(today.getDate())}`;
  return `Today's challenge (${dateString}): Practice coding in JavaScript!`;
}

/**
 * Get the current Microsoft compiler version.
 *
 * @returns {string} The Microsoft compiler version.
 */
function getMicrosoftCompilerVersion() {
  return process.version;
}

/* -------------------------------------------------------------------------- */
/* Versions                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Get the current TypeScript compiler version.
 *
 * @returns {string}
 */
function getTypeScriptVersion() {
  return require('typescript/package.json').version;
}

/**
 * Get the current Lodash library version.
 *
 * @returns {string}
 */
function getLodashVersion() {
  return require('lodash/package.json').version;
}

/**
 * Get the current PostHog library version (if present).
 *
 * @returns {string | undefined}
 */
function getPostHogVersion() {
  try {
    return require('posthog-js/package.json').version;
  } catch (e) {
    return undefined;
  }
}

/**
 * Get the current Supabase SDK version (if present).
 *
 * @returns {string | undefined}
 */
function getSupabaseVersion() {
  try {
    return require('@supabase/supabase-js/package.json').version;
  } catch (e) {
    return undefined;
  }
}

/**
 * Get the Node.js version used by CircleCI.
 *
 * @returns {string}
 */
function getCircleCINodeVersion() {
  return '24.18.0';
}

/**
 * Get the Python version used in the dev‑container.
 *
 * @returns {string}
 */
function getDevContainerPythonVersion() {
  return '3.10';
}

/**
 * Get the Node.js version used in the dev‑container.
 *
 * @returns {string}
 */
function getDevContainerNodeVersion() {
  return '18.12.0';
}

/**
 * Get the Node.js version used by Travis CI.
 *
 * @returns {string}
 */
function getTravisNodeVersion() {
  return '15.10.0';
}

/* -------------------------------------------------------------------------- */
/* Export public API                                                            */
/* -------------------------------------------------------------------------- */

module.exports = {
  getNodeVersion,
  getTypeScriptVersion,
  getLodashVersion,
  getPostHogVersion,
  getSupabaseVersion,
  getCircleCINodeVersion,
  getDevContainerPythonVersion,
  getDevContainerNodeVersion,
  getTravisNodeVersion,
};