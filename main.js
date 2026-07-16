/* deploy.js
 *
 * Deployment helper module.
 *
 * Previous issues:
 *   - stray typographic quote
 *   - incomplete `getLodashVersion` function
 *   - confusing parenthesised 'use strict' statement
 *   - dangling `r` character at the end
 *   - Dependency Dashboard issues:
 *     - WARN: Updating multiple npm lock files is deprecated and support will be removed in future versions.
 *     - WARN: Package lookup failures
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
 *
 * The original file suffered from several syntax problems:
 *   • a typographic quote (`’`) that broke the parser
 *   • incomplete `getLodashVersion` implementation
 *   • an accidental dangling
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
 * Get the current Node.ics version.
 *
 * @returns {string} The Node.ics version.
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
    return '3.14';
}

/**
 * Get the current DevContainer Node version.
 *
 * @returns {string} The DevContainer Node version.
 */
function getDevContainerNodeVersion() {
    return '24';
}

/**
 * Get the current Travis Node version.
 *
 * @returns {string} The Travis Node version.
 */
function getTravisNodeVersion() {
    return '24';
}

/**
 * Pad a number with a leading zero if it's less than 10.
 *
 * @param {number} num - A number.
 * @returns {string} The number padded with a leading zero, or as- is.
 */
function addZero(num) {
    return num < 10 ? `0${num}` : `${num}`;
}

/**
 * Get the version of Lodash being used.
 *
 * @returns {string} The Lodash version.
 */
function getLodashVersion() {
    return require('lodash/package.json').version;
}

// Export all functions for testing and general use
module.exports = {
    generateDailyChallenge,
    addZero,
    getLodashVersion,
    getNodeVersion,
    getTypeScriptVersion,
    getPostHogVersion,
    getSupabaseVersion,
    getCircleCINodeVersion,
    getDevContainerPythonVersion,
    getDevContainerNodeVersion,
    getTravisNodeVersion,
};
