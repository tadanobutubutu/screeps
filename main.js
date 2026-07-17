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
 * @param {string} [fallback=''] - Optional fallback value to return on error.
 * @returns {string} The resolved version or an empty string if not found.
 */
function getPackageVersion(pkg, fallback = '') {
  try {
    const packageJsonPath = path.join(process.cwd(), 'node_modules', pkg, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return packageJson.version || fallback;
  } catch (error) {
    return fallback;
  }
}

/**
 * Retrieve the installed PostHog SDK version.
 * @returns {string}
 */
function getPostHogVersion() {
  return getPackageVersion('posthog-js');
}

/**
 * Retrieve the installed Supabase client version.
 * @returns {string}
 */
function getSupabaseVersion() {
  return getPackageVersion('@supabase/supabase-js');
}

/**
 * Retrieve the Node.js version used by CircleCI.
 * Falls back to the environment variable, then configuration files,
 * and finally the current process version.
 * @returns {string}
 */
function getCircleCINodeVersion() {
  const circleNodeVersion = process.env.CIRCLE_NODE_VERSION;
  if (circleNodeVersion) return circleNodeVersion;

  const configPath = path.join(__dirname, '.circleci', 'config.yml');
  try {
    const configContent = fs.readFileSync(configPath, 'utf8');
    const match = configContent.match(/image:\s*node:(\d+\.\d+\.\d+)/);
    if (match) return match[1];
  } catch (e) {
    /* ignore */
  }

  const dockerfile = path.join(__dirname, 'Dockerfile');
  try {
    const dockerContent = fs.readFileSync(dockerfile, 'utf8');
    const dockerMatch = dockerContent.match(/FROM node:(\d+\.\d+\.\d+)/);
    if (dockerMatch) return dockerMatch[1];
  } catch (e) {
    /* ignore */
  }

  return process.version;
}

/**
 * Returns the Python version in the devcontainer setup.
 * @returns {string}
 */
function getDevContainerPythonVersion() {
  const dockerComposePath = path.join(__dirname, 'devcontainer', 'docker-compose.yml');
  try {
    const content = fs.readFileSync(dockerComposePath, 'utf8');
    const match = content.match(/Python-(\d+\.\d+)(?:\.\d+)?/);
    return match ? match[1] : '';
  } catch (err) {
    return '';
  }
}

/**
 * Returns the Node.js version in the devcontainer setup.
 * @returns {string}
 */
function getDevContainerNodeVersion() {
  const devContainerPath = path.join(__dirname, 'devcontainer', 'devcontainer.json');
  try {
    const json = JSON.parse(fs.readFileSync(devContainerPath, 'utf8'));
    const baseImage = json.runArgs?.find(arg => arg.includes('node:')).split(':')[1];
    const [major, minor] = baseImage.split('.').map(Number);
    return `${major}.${minor}.0`;
  } catch (err) {
    return '';
  }
}

/**
 * Returns the Travis CI Node.js version used in .travis.yml.
 * @returns {string}
 */
function getTravisNodeVersion() {
  const travisPath = path.join(__dirname, '.travis.yml');
  try {
    const content = fs.readFileSync(travisPath, 'utf8');
    const match = content.match(/node_js:\s*["']?(\d+\.\d+)(?:\.\d+)?["']?/);
    return match ? match[1] : '';
  } catch (error) {
    return '';
  }
}

/**
 * Returns the Renovate configuration updates for package updates.
 * @returns {string}
 */
function getRenovateUpdates() {
  const renovatePath = path.join(__dirname, 'renovate.json');
  try {
    const json = JSON.parse(fs.readFileSync(renovatePath, 'utf8'));
    if (Array.isArray(json.packageRules) && json.packageRules.length > 0) {
      return JSON.stringify(json.packageRules);
    }
    return '';
  } catch (error) {
    return '';
  }
}

/**
 * Returns the Sentry SDK version.
 * @returns {string}
 */
function getSentryVersion() {
  return getPackageVersion('@sentry/node');
}

module.exports = {
  getPostHogVersion