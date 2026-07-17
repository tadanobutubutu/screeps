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
 */

 // Helper to safely fetch a package version from package.json or an empty string
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

// Existing helper: fetch Lodash version
function get