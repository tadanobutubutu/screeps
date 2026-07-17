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
 * This module also re-exports the version‑query functions defined in main.js
 * so test files and other modules can import them directly.
 */

const _ = require('lodash');
const fs = require('fs');
const path = require('path');

let _cachedPkg = null;

/** @returns {{[key:string]:any}} */
const getPackageJson = () => {
  if (!_cachedPkg) {
    const pkgPath = path.resolve(__dirname, 'package.json');
    if (!fs.existsSync(pkgPath)) {
      throw new Error(`package.json not found at ${pkgPath}`);
    }
    _cachedPkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  }
  return _cachedPkg;
};

/**
 * Internal helper to fetch a dependency's version.
 * @param {string} name
 * @returns {string|null}
 */
const getDependencyVersion