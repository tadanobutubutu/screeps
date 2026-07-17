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