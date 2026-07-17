/* deploy.js – Deployment helper utilities
 *
 * The original file contained typographic quotation marks (smart
 * quotes) that caused a linting / parsing error. Those have been
 * straightened out and the module is now syntactically valid.
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
 * - `getSentryVersion`
 *
 * This module also re-exports the version‑query functions defined in
 * main.js so test files can access them.
 */

'use strict';

/* Helper to safely fetch a package version from package.json or return an empty string */
function _fetchPackageVersion(pkg, depName) {
    try {
        const pkgPath = require.resolve(`${pkg}/package.json`);
        const { version } = require(pkgPath);
        return