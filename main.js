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
 * Get the current Python version
 * @returns {string} Python version
 */
function getPythonVersion() {
  try {
    const { execSync } = require('child_process');
    return execSync('python --version').toString().trim();
  } catch (e) {
    return 'Python not installed';
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

/**
 * Get the current Lodash version
 * @returns {string} Lodash version
 */
function getLodashVersion() {
  try {
    const _ = require('lodash');
    return _.VERSION;
  } catch (e) {
    return 'Lodash not installed';
  }
}

/**
 * Get the current GitHub Actions version
 * @returns {string} GitHub Actions version
 */
function getGitHubActionsVersion() {
  try {
    const { execSync } = require('child_process');
    return execSync('gh --version').toString().trim();
  } catch (e) {
    return 'GitHub CLI not installed';
  }
}

/**
 * Get the current CircleCI version
 * @returns {string} CircleCI version
 */
function getCircleCIVersion() {
  try {
    const { execSync } = require('child_process');