'use strict';

/* main.js – Deployment helper utilities
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
 * The exported functions are also re-exported for easier use in tests.
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
 * Returns the version of the CircleCI Node.js image used in the .circleci/config.yml.
 * @returns {string} The CircleCI Node.js image version or an empty string if not found.
 */
function getCircleCINodeVersion() {
  const configPath = path.join(__dirname, '.circleci', 'config.yml');
  try {
    const configContent = fs.readFileSync(configPath, 'utf8');
    const matches = configContent.match(/image:\s*circleci\/node:(\d+\.\d+)/);
    return matches ? matches[1] : '';
  } catch (error) {
    return '';
  }
}

/**
 * Returns the Python version used inside the development container.
 * @returns {string} The Python version or an empty string if not found.
 */
function getDevContainerPythonVersion() {
  const devContainerPath = path.join(__dirname, '.devcontainer', 'devcontainer.json');
  try {
    const devContainerContent = fs.readFileSync(devContainerPath, 'utf8');
    const matches = devContainerContent.match(/"pythonVersion"\s*:\s*"([^"]+)"/);
    return matches ? matches[1] : '';
  } catch (error) {
    return '';
  }
}

/**
 * Returns the Node.js version used inside the development container.
 * @returns {string} The Node.js version or an empty string if not found.
 */
function getDevContainerNodeVersion() {
  const devContainerPath = path.join(__dirname, '.devcontainer', 'devcontainer.json');
  try {
    const devContainerContent = fs.readFileSync(devContainerPath, 'utf8');
    const matches = devContainerContent.match(/"nodeVersion"\s*:\s*"([^"]+)"/);
    return matches ? matches[1] : '';
  } catch (error) {
    return '';
  }
}

/**
 * Returns the Node.js version used in Travis CI.
 * @returns {string} The Node.js version or an empty string if not found.
 */
function getTravisNodeVersion() {
  const travisPath = path.join(__dirname, '.travis.yml');
  try {
    const travisContent = fs.readFileSync(travisPath, 'utf8');
    const matches = travisContent.match(/node_js:\s*["']?(\d+\.\d+)["']?/);
    return matches ? matches[1] : '';
  } catch (error) {
    return '';
  }
}

/**
 * Returns information about Renovate updates from package-lock.json.
 * @returns {object} A summary of dependencies that have updates.
 */
function getRenovateUpdates() {
  const lockPath = path.join(__dirname, 'package-lock.json');
  try {
    const lockContent = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
    const updates = [];
    if (lockContent && lockContent.packages) {
      Object.keys(lockContent.packages).forEach((pkgPath) => {
        const dep = lockContent.packages[pkgPath];
        if (dep && dep.latest && dep.version !== dep.latest) {
          updates.push({
            name: pkgPath,
            current: dep.version,
            latest: dep.latest,
          });
        }
      });
    }
    return updates;
  } catch (error) {
    return [];
  }
}

/**
 * Returns the Sentry package version.
 * @returns {string} The Sentry version or an empty string if not found.
 */
function getSentryVersion() {
  return getPackageVersion('@sentry/node');
}

module.exports = {
  getPostHogVersion,
  getSupabaseVersion