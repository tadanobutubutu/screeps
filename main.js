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
    const content = fs.readFileSync(configPath, 'utf8');
    // Look for the first occurrence of something like: image: cimg/node:XX.YZ
    const match = content.match(/image:\s*cimg\/node:([^\s]+)/i);
    return match ? match[1].trim() : '';
  } catch (error) {
    return '';
  }
}

/**
 * Returns the Python version specified in the devcontainer.json.
 * @returns {string} The Python version or an empty string if not found.
 */
function getDevContainerPythonVersion() {
  const devContainerPath = path.join(__dirname, '.devcontainer', 'devcontainer.json');
  try {
    const json = JSON.parse(fs