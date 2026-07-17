'use strict';

/* Helper to safely fetch a package version from package.json or return an empty string */
function _fetchPackageVersion(pkg, depName = pkg) {
    try {
        const pkgPath = require.resolve(`${depName}/package.json`);
        const { version } = require(pkgPath);
        return typeof version === 'string' ? version : '';
    } catch (e) {
        // Package not found or unparsable: return empty string
        return '';
    }
}

/** Get the Lodash package semantic version or the empty string if unknown. */
function getLodashVersion() {
    return _fetchPackageVersion('lodash');
}

/** Get the Supabase package semantic version or the empty string if unknown. */
function getSupabaseVersion() {
    return _fetchPackageVersion('@supabase/supabase-js');
}

/** Get the CircleCI Node package semantic version or the empty string if unknown. */
function getCircleCINodeVersion() {
    return _fetchPackageVersion('cimg/node');
}

/** Get the DevContainer Python package semantic version or the empty string if unknown. */
function getDevContainerPythonVersion() {
    return _fetchPackageVersion('mcr.microsoft.com/devcontainers/python');
}

/** Get the DevContainer Node package semantic version or the empty string if unknown. */
function getDevContainerNodeVersion() {
    return _fetchPackageVersion('ghcr.io/devcontainers/features/node');
}

/** Get the Travis Node package semantic version or the empty string if unknown. */
function getTravisNodeVersion() {
    return _fetchPackageVersion('node');
}

/** Get the PostHog Node package semantic version or the empty string if unknown. */
function getPostHogVersion() {
    // Prefer the dedicated PostHog Node library, but fall back to the legacy browser SDK if unavailable
    const nodeVersion = _fetchPackageVersion('@posthog/posthog-node');
    if (nodeVersion) return nodeVersion;
    return _fetchPackageVersion('posthog-js');
}

/** Get the Renovate updates information. */
function getRenovateUpdates() {
    // This would typically be implemented to fetch Renovate update information
    // from the repository's dependency dashboard or API
    // For now, returning a placeholder object
    return {
        awaitingSchedule: [
            { package: 'actions/setup-python', version: 'v6' },
            { package: 'actions/upload-artifact', version: 'v7' },
            { package: 'node', version: 'v24' },
        ],
        rateLimited: [
            { package: 'posthog-js', version: 'v1.404.0' },
            { package: 'actions/setup-node', version: 'v7' },
            { package: 'typescript', version: 'v7' },
            { package: 'pnpm/action-setup', version: 'v6' },
        ],
    };
}

/** Get the Renovate tool semantic version or the empty string if unknown. */
function getRenovateVersion() {
    return _fetchPackageVersion('@renovate/renovate');
}

// Re-export all version-query functions for test consumption
module.exports = {
    getLodashVersion,
    getSupabaseVersion,
    getCircleCINodeVersion,
    getDevContainerPythonVersion,
    getDevContainerNodeVersion,
    getTravisNodeVersion,
    getPostHogVersion,
    getRenovateUpdates,
    getRenovateVersion,
};