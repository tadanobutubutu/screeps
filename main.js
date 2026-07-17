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
 * so test files ...
 */

/**
 * Helper: read the project's package.json
 * @returns {{[key:string]:any}}
 */
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

let _cachedPkg = null;
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
const getDependencyVersion = (name) => {
  const pkg = getPackageJson();
  const version =
    (pkg.dependencies && pkg.dependencies[name]) ||
    (pkg.devDependencies && pkg.devDependencies[name]) ||
    null;
  return typeof version === 'string' ? version.replace(/^[^0-9]*/, '') : null;
};

/**
 * Get the current Lodash version.
 * @returns {string|null}
 */
const getLodashVersion = () => getDependencyVersion('lodash');

/**
 * Get the PostHog JS client version.
 * @returns {string|null}
 */
const getPostHogVersion = () => getDependencyVersion('posthog-js');

/**
 * Get the Supabase JS client version.
 * @returns {string|null}
 */
const getSupabaseVersion = () => getDependencyVersion('@supabase/supabase-js');

/**
 * Get the CircleCI Node.js version specified by the dep config.
 * @returns {string|null}
 */
const getCircleCINodeVersion = () => getDependencyVersion('@circleci/nodejs');

/**
 * Get the DevContainer Python version spec used in the container.
 * @returns {string|null}
 */
const getDevContainerPythonVersion = () => getDependencyVersion('devcontainer-python');

/**
 * Get the DevContainer Node.js version spec used in the container.
 * @returns {string|null}
 */
const getDevContainerNodeVersion = () => getDependencyVersion('devcontainer-nodejs');

/**
 * Get the Travis CI Node.js version used in the build config.
 * @returns {string|null}
 */
const getTravisNodeVersion = () => getDependencyVersion('travis-ci-nodejs');

/**
 * Get the Renovate updates JSON string if present.
 * @returns {string|null}
 */
const getRenovateUpdates = () => {
  const pkg = getPackageJson();
  return pkg?.renovate ? JSON.stringify(pkg.renovate, null, 2) : null;
};

module.exports = {
  getLodashVersion,
  getPostHogVersion,
  getSupabaseVersion,
  getCircleCINodeVersion,
  getDevContainerPythonVersion,
  getDevContainerNodeVersion,
  getTravisNodeVersion,
  getRenovateUpdates,
};