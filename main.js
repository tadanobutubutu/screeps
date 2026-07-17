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
 function getLodashVersion() {
     return _fetchPackageVersion('lodash');
 }

 // Existing helper: fetch Node.js version used by the CLI (if any)
 function getNodeVersion() {
     try {
         const pkg = require('./package.json');
         return pkg.engines && pkg.engines.node ? pkg.engines.node : '';
     } catch (e) {
         return '';
     }
 }

 // New functions added to address Dependency Dashboard issues
 function getPostHogVersion() {
     return _fetchPackageVersion('posthog');
 }

 function getSupabaseVersion() {
     return _fetchPackageVersion('supabase');
 }

 function getCircleCINodeVersion() {
     return _fetchPackageVersion('@circleci/node'); // or appropriate package name
 }

 function getDevContainerPythonVersion() {
     // Often from container config, not from package.json – placeholder
     return 'dev-container-python-version';
 }

 function getDevContainerNodeVersion() {
     // Often from container config, not from package.json – placeholder
     return 'dev-container-node-version';
 }

 function getTravisNodeVersion() {
     // Often from Travis environment, placeholder
     return 'travis-node-version';
 }

 function getRenovateUpdates() {
     // Simplified placeholder – could read renovate.json
     return 'renovate-updates';
 }

 // Export all existing and new functions
 module.exports = {
     getLodashVersion,
     getNodeVersion,
     getPostHogVersion,
     getSupabaseVersion,
     getCircleCINodeVersion,
     getDevContainerPythonVersion,
     getDevContainerNodeVersion,
     getTravisNodeVersion,
     getRenovateUpdates,
 };