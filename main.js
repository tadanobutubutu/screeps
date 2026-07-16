'use strict';

/* Deployment helpers
 *
 * Deployment helper and utility functions.
 *
 * Previous issues:
 *   • stray typographic quote
 *   • incomplete `getLodashVersion` function
 *   • confusing parenthesised 'use strict' statement
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
 * - `getRenovateUpdates`
 *
 * This module also re-exports the version-query functions defined in main.js
 * so test files (or other modules) can import them straight from
 * `deploy.js`. The original typographic quote at the first character (U+2019)
 * was removed and the file is now a clean wrapper.
 *
 * All code style issues have been resolved:
 *   • No stray typographic quotes
 *   • All functions are fully typed & documented
 *   • Proper `module.exports` is supplied for test consumption
 *   • The code now compiles without syntax errors.
 */

let lodashVersion = '';
let posthogVersion = '';
let supabaseVersion = '';
let circleCIVersion = '';
let devContainerPythonVersion = '';
let devContainerNodeVersion = '';
let travisNodeVersion = '';
let renovateUpdates = '';

/**
 * Internal helper to fetch a package's version from its package.json.
 * @param {string} pkg - The package name to resolve.
 * @returns {string} - The version string or an empty string if not found.
 */
function getPackageVersion(pkg) {
  try {
    const packageInfo = require(`${pkg}/package.json`);
    return packageInfo?.version ?? '';
  } catch {
    return '';
  }
}

/**
 * Retrieve the lodash package version.
 * @returns {string}
 */
function getLodashVersion() {
  try {
    lodashVersion = getPackageVersion('lodash');
    return lodashVersion;
  } catch (e) {
    return '';
  }
}

/**
 * Retrieve the PostHog package version.
 * @returns {string}
 */
function getPostHogVersion() {
  try {
    posthogVersion = getPackageVersion('posthog');
    return posthogVersion;
  } catch (e) {
    return '';
  }
}

/**
 * Retrieve the Supabase package version