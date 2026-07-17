'use strict';

/* spawn. js – Deployment helper utilities
 *
 * This module provides helper functions for querying package versions
 * and environment configuration. It is intentionally minimal to avoid
 * extra dependencies, while still offering useful functionality for
 * the Screeps bot repository.
 *
 * The module functions are:
 *
 *   - getPostHogVersion
 *   - getSupabaseVersion
 *   - getCircleCINodeVersion
 *   - getDevContainerPythonVersion
 *   - getDevContainerNodeVersion
 *   - getTravisNodeVersion
 *   - getRenovateUpdates
 *   - getSentryVersion
 *
 * The exported functions are also re‑exported for easier use in tests.
 */

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

/**
 * Helper to safely fetch a package version from node_modules or return an
 * empty string if the package cannot be resolved.
 *
 * @param {string} pkg   - The package name to look up.
 * @param {string} [depName= pkg] - Optional dependency name to resolve against.
 * @returns {string} The resolved version or an empty string if not found.
 */
function getPackageVersion(pkg, depName = pkg) {
  try {
    const packageJsonPath = path.join(
      __dirname,
      'node_modules',
      depName,
      'package.json'
    );
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return packageJson.version || '';
  } catch (error) {
    return '';
  }
}

/**
 * Returns the version of the PostHog package.
 * @returns {string} The PostHog version or an empty string if not found.
 */
function getPostHogVersion() {
  return getPackageVersion('posthog-js');
}

/**
 * Returns the version of the Supabase package.
 * @returns {string} The Supabase version or an empty string if not found.
 */
function getSupabaseVersion() {
  return getPackageVersion('@supabase/supabase-js');
}

/**
 * Returns the version of the CircleCI Node.js image used in the .circleci/config. yml.
 * @returns {string} The CircleCI Node.js image version or an empty string if not found.
 */
function getCircleCINodeVersion() {
  const configPath = path.join(__dirname, '.circleci/config. yml');
  const config = fs.readFileSync(configPath, 'utf8');
  const match = config.match(/cimg\/node (\d+\.\d+\.\d+)/);
  return match ? match[1] : '';
}

/**
 * Returns the version of the Python image used in the .devcontainer/devcontainer. json.
 * @returns {string} The Python image version or an empty string if not found.
 */
function getDevContainerPythonVersion() {
  const configPath = path.join(__dirname, '.devcontainer/devcontainer. json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const image = config.image || '';
  const match = image.match(/python (\d+\.\d+\.\d+)/);
  return match ? match[1] : '';
}

/**
 * Returns the version of the Node.js image used in the .devcontainer/devcontainer. json.
 * @returns {string} The Node.js image version or an empty string if not found.
 */
function getDevContainerNodeVersion() {
  const configPath = path.join(__dirname, '.devcontainer/devcontainer. json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const image = config.image || '';
  const match = image.match(/node (\d+)/);
  return match ? match[1] : '';
}

/**
 * Returns the version of the Node.js used in the .travis. yml.
 * @returns {string} The Node.js version or an empty string if not found.
 */
function getTravisNodeVersion() {
  const configPath = path.join(__dirname, '.travis. yml');
  const config = fs.readFileSync(configPath, 'utf8');
  const match = config.match(/node (\d+)/);
  return match ? match[1] : '';
}

/**
 * Returns the list of Renovate updates awaiting their schedule.
 * @returns {string} The Renovate updates or an empty string if not found.
 */
function getRenovateUpdates() {
  // This is a placeholder function as Renovate updates are not directly accessible via a simple file.
  // The actual implementation would require interaction with the Renovate API or dashboard.
  return 'awaiting updates...';
}

/**
 * Returns the version of the Sentry package.
 * @returns {string} The Sentry version or an empty string if not found.
 */
function getSentryVersion() {
  return getPackageVersion('@sentry/browser');
}

// Re-exporting functions for easier use in tests
module.exports = {
  getPostHogVersion,
  getSupabaseVersion,
  getCircleCINodeVersion,
  getDevContainerPythonVersion,
  getDevContainerNodeVersion,
  getTravisNodeVersion,
  getRenovateUpdates,
  getSentryVersion
};