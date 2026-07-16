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

/**
 * Get the current Node.js version string.
 *
 * @returns {string}
 */
function getNodeVersion() {
    return process.version; // e.g. v18.12.0
}

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
 * Get the current PostHog JS library version.
 *
 * @returns {string}
 */
function getPostHogVersion() {
    return require('posthog-js/package.json').version;
}

/**
 * Get the current Supabase JS library version.
 *
 * @returns {string}
 */
function getSupabaseVersion() {
    return require('@supabase/supabase-js/package.json').version;
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
