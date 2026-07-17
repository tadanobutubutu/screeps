'use strict';

/* deploy.js – Deployment helper utilities
 *
 * The original file contained typographic quotation marks (smart
 * quotes) that caused a linting / parsing error. Those have been
 * straightened out and the module is now syntactically valid.
 *
 * The module now exports the helper functions for test consumption and
 * general use.
 *
 * Additionally, the following new functions have been added to address
 * the Dependency Dashboard issues:
 * - getPostHogVersion
 * - getSupabaseVersion
 * - getCircleCINodeVersion
 * - getDevContainerPythonVersion
 * - getDevContainerNodeVersion
 * - getTravisNodeVersion
 * - getRenovateUpdates
 * - getSentryVersion
 *
 * This module also re-exports the version‑query functions so test
 * files can access them.
 */

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

/**
 * Helper to safely fetch a package version from package.json (via node_modules) or return an empty string.
 * @param {string} pkg - The package name to look up.
 * @param {string} [depName=pkg] - Optional dependency name to resolve against.
 * @returns {string} The semantic version string or an empty string if unresolved.
 */
function getPackageVersion(pkg, depName = pkg) {
    try {
        const pkgPath = path.join(process.cwd(), 'node_modules', pkg, 'package.json');
        const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        return pkgJson.version || '';
    } catch (e) {
        return '';
    }
}

/**
 * Fetch the PostHog package version.
 */
function getPostHogVersion() {
    return getPackageVersion('posthog');
}

/**
 * Fetch the Supabase package version.
 */
function getSupabaseVersion() {
    return getPackageVersion('@supabase/supabase-js');
}

/**
 * Fetch the CircleCI Node.js version from the .circleci/config.yml if it exists.
 * The file may specify the image with a node tag or a node-version key.
 */
function getCircleCINodeVersion() {
    try {
        const configPath = path.join(process.cwd(), '.circleci', 'config.yml');
        if (!fs.existsSync(configPath)) return '';
        const content = fs.readFileSync(configPath, 'utf8');

        // Look for 'node:' or 'image:' followed by a node version
        const imageMatch = content.match(/image:\s*cimg\/node:([^\s]+)[\s\n]/);
        if (imageMatch) return imageMatch[1];

        const nodeMatch = content.match(/node:\s*([^\s]+)[\s\n]/);
        if (nodeMatch) return nodeMatch[1];

        // Fallback: look for 'node_version:' (older syntax)
        const versionMatch = content.match(/node_version:\s*([^\s]+)[\s\n]/);
        if (versionMatch) return versionMatch[1];

        return