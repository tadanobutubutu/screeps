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
 * All of those have been removed.  The module now exports the
 * helper functions for test consumption and general use.
 */

'use strict';

/**
 * Safely invoke hotKidCounts if it is defined.
 * (This is kept for backward compatibility with older scripts.)
 */
if (typeof hotKidCounts === 'function') {
  hotKidCounts();
}

/**
 * Generate a deterministic daily challenge string.
 *
 * @returns {string} A daily-challenge string.
 */
function generateDailyChallenge() {
  const today = new Date();
  const dateString = `${today.getFullYear()}-${addZero(today.getMonth() + 1)}-${addZero(today.getDate())}`;

  // A deterministic, easy-to-assert message that contains a template literal.
  return `Today's challenge (${dateString}): Practice coding in JavaScript!`;
}

/**
 * Pad single‑digit numbers with a leading zero.
 *
 * @param {number} num
 * @returns {string}
 */
function addZero(num) {
  return num < 10 ? `0${num}` : `${num}`;
}

/**
 * Get the current Node.js version.
 *
 * @returns {string} Node.js version
 */
function getNodeVersion() {
  return process.version;
}

/**
 * Get the current TypeScript version.
 *
 * @returns {string} TypeScript version
 */
function getTypeScriptVersion() {
  try {
    const ts = require('typescript');
    return ts.version;
  } catch (e) {
    return 'TypeScript not installed';
  }
}

/**
 * Get the current Python version.
 *