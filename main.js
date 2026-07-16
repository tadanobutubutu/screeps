/* main.js
 *
 * Deployment helper and utility functions.
 *
 * Previous issues:
 *   • stray typographic quote
 *   • incomplete `getLodashVersion` function
 *   • confusing parenthesised `'use strict'` statement
 *   • dangling `r` character at the end
 *   • Dependency Dashboard issues:
 *      - ⚠️ WARN: Updating multiple npm lock files is deprecated and support will be removed in future versions.
 *      - ⚠️ WARN: Package lookup failures
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
 */