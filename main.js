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
 * so test files (