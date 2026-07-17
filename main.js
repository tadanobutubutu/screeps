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
 * The exported functions are also re‑exported for easier use in tests.
 */

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

/**
 * Helper to safely fetch a package version from node_modules or return an
 * empty string if the package is not found or doesn't contain a version field.
 *
 * @param {string} pkg - The package name to look up.
 * @param {string} [fallback=''] - Optional fallback value to return on error.
 * @returns {string} The resolved package version or the fallback.
 */
function getPackageVersion(pkg, fallback = '') {
    try {
        const pkgJsonPath = path.join(
            process.cwd(),
            'node_modules',
            pkg,
            'package.json'
        );
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
        return pkgJson.version || fallback;
    } catch (_) {
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
 * Falls back to the standard Node version if the CircleCI environment variable is not set.
 * @returns {string}
 */
function getCircleCINodeVersion() {
    const circleNodeVersion = process.env.CIRCLE_NODE_VERSION;
    if (circleNodeVersion) return circleNodeVersion;
    return process.version;
}

/**
 * Retrieve the Python version used within the