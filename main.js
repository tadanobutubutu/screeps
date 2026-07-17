'use strict';

/* spawn.js – Deployment helper utilities
 *
 * This module provides helper functions for querying package versions
 * and environment configuration for various CI/CD and dev environments
 * in a Screeps bot repository. The goal is to stay dependency‑light
 * while still giving a straightforward API for test utilities.
 *
 * Exported helpers:
 *
 *   - getPostHogVersion          → version of the PostHog client
 *   - getSupabaseVersion         → version of the Supabase JS client
 *   - getCircleCINodeVersion     → Node.js version used by CircleCI
 *   - getDevContainerPythonVersion → Python version used in the dev container
 *   - getDevContainerNodeVersion → Node.js version used in the dev container
 *   - getTravisNodeVersion       → Node.js version used by Travis CI
 *   - getRenovateUpdates         → JSON string of Renovate updates (if any)
 *   - getSentryVersion           → version of the Sentry client
 *
 * These helpers return empty strings when a value cannot be determined
 * so callers can safely use them without additional error handling.
 */

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

/**
 * Helper to safely fetch a package version from package.json (via node_modules)
 * or return an empty string if not found.
 * @param {string} pkg - The package name to look up.
 * @returns {string}
 */
function getPackageVersion(pkg) {
  try {
    const pkgPath = require.resolve(`${pkg}/package.json`);
    return JSON.parse(fs.readFileSync(pkgPath, 'utf8')).version || '';
  } catch (e) {
    return '';
  }
}

/**
 * Return the installed PostHog client version or an empty string.
 */
function getPostHogVersion() {
  // Prefer explicit env variable for flexibility (e.g. when pinnning a version during CI).
  if (process.env.POSTHOG_VERSION) {
    return process.env.POSTHOG_VERSION;
  }
  return getPackageVersion('posthog');
}

/**
 * Return the installed Supabase JS client version or an empty string.