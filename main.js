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

/* Use strict mode to catch silent errors. */
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
 * @returns {string} A daily‑challenge string.
 */
function generateDailyChallenge() {
  const today = new Date();
  const dateString = `${today.getFullYear()}-${addZero(today.getMonth() + 1)}-${addZero(
    today.getDate()
  )}`;
  return `Today's challenge (${dateString}): Practice coding in JavaScript!`;
}

/*********************************************************************
 * Utility helpers
 *********************************************************************/

/**
 * Pad a number with a leading zero if it's less than 10.
 *
 * @param {number} num - A number.
 * @returns {string} The number padded with a leading zero, or as‑is.
 */
function addZero(num) {
  return num < 10 ? `0${num}` : `${num}`;
}

/**
 * Get the current Node.js version
 * @returns {string} Node.js version
 */
function getNodeVersion() {
  try {
    return process.version;
  } catch (e) {
    return 'Node.js version unavailable';
  }
}

/**
 * Get the current pnpm version
 * @returns {string} pnpm version
 */
function getPnpmVersion() {
  try {
    const { execSync } = require('child_process');
    return execSync('pnpm --version').toString().trim();
  } catch (e) {
    return 'pnpm not installed';
  }
}

/**
 * Get the current PostHog version
 * @returns {string} PostHog version
 */
function getPostHogVersion() {
  try {
    const posthog = require('posthog-js');
    return posthog.version;
  } catch (e) {
    return 'PostHog not installed';
  }
}

/** Ge