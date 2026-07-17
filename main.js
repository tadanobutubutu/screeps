'use strict';

/* Deployment helpers
 *
 * Deployment helper and utility functions.
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
 * so test files (
 */

/* Helper to safely fetch a package version from package.json or an empty string */
function _fetchPackageVersion(pkg) {
    try {
        // Resolve the package's package.json
        const pkgPath = require.resolve(`${pkg}/package.json`);
        const { version } = require(pkgPath);
        return typeof version === 'string' ? version : '';
    } catch (e) {
        // Package not found or unparsable: return empty string
        return '';
    }
}

/* Existing helper: fetch Lodash version */
function getLodashVersion() {
    return _fetchPackageVersion('lodash');
}

/* Existing exports and functions remain unchanged
 * The issue appears to be in daily-challenge.js, not main.js
 * No