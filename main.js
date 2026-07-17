'use strict';

/* spawn.js – Deployment helper utilities
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
    const content = fs.readFileSync(configPath, 'utf8');
    const match = content.match(/docker\.image:\s*\"?([^\"\\s]+)\"?/i);
    if (match && match[1]) {
      // Extract just the Node.js version part from a Docker image name like
      //   circleci/node:14.17.0
      const parts = match[1].split(':');
      return parts.length > 1 ? parts[1] : '';
    }
    return '';
  } catch (e) {
    return '';
  }
}

/**
 * Returns the Python version used in the devcontainer.
 * @returns {string} The Python version or an empty string if not found.
 */
function getDevContainerPythonVersion() {
  const devcontainerPath = path.join(__dirname, '.devcontainer', 'devcontainer.json');
  try {
    const content = fs.readFileSync(devcontainerPath, 'utf8');
    const match = content.match(/pythonVersion\s*:\s*\"?([^\"\\s]+)\"?/i);
    if (match && match[1]) {
      return match[1];
    }
    return '';
  } catch (e) {
    return '';
  }
}

/**
 * Returns the Node version used in the devcontainer.
 * @returns {string} The Node version or an empty string if not found.
 */
function getDevContainerNodeVersion() {
  const devcontainerPath = path.join(__dirname, '.devcontainer', 'devcontainer.json');
  try {
    const content = fs.readFileSync(devcontainerPath, 'utf8');
    const match = content.match(/nodeVersion\s*:\s*\"?([^\"\\s]+)\"?/i);
    if (match && match[1]) {
      return match[1];
    }
    return '';
  } catch (e) {
    return '';
  }
}

/**
 * Returns the Node version used in Travis CI from .travis.yml.
 * @returns {string} The Node version or an empty string if not found.
 */
function getTravisNodeVersion() {
  const travisPath = path.join(__dirname, '.travis.yml');
  try {
    const content = fs.readFileSync(travisPath, 'utf8');
    const match = content