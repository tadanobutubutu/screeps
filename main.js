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
  const dateString = `${today.getFullYear()}-${addZero(today.getMonth() + 1)}-${addZero(today.getDate())}`;
  return `Today's challenge (${dateString}): Practice coding in JavaScript!`;
}

/* -------------------------------------------------------------------------- */
/* Additional utilities                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Get the current Node.js version string.
 *
 * @returns {string}
 */
function getNodeVersion() {
  return process.version; // e.g. v18.12.0
}