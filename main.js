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
    return _fetchPackageVersion('travis-ci');
}

/** Get the PostHog Node package semantic version or the empty string if unknown. */
function getPostHogVersion() {
    return _fetchPackageVersion('@posthog/posthog-node');
}

/** Get the Renovate updates information or the empty string if unknown. */
function getRenovateUpdates() {
    // This would typically be fetched from a configuration file or API
    // For now, we'll return a placeholder string
    return 'Renovate updates information would be returned here';
}

/** Get the Sentry package semantic version or the empty string if unknown. */
function getSentryVersion() {
    return _fetchPackageVersion('@sentry/browser');
}

/* Export all helper functions */
module.exports = {
    getLodashVersion,
    getSupabaseVersion,
    getCircleCINodeVersion,
    getDevContainerPython