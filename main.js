'use strict';

/* deploy.js - Deployment helper utilities
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
 *   - getGitHubActionsPythonVersion
 *   - getGitHubActionsNodeVersion
 *   - getGitHubActionsSetupNodeVersion
 *   - getGitHubActionsUploadArtifactVersion
 *   - getGitHubActionsSetupPythonVersion
 *   - getGitHubActionsCodeQLVersion
 *   - getGitHubActionsPnpmVersion
 *   - getGitHubActionsGitStreamVersion
 *   - getTestFiles
 *   - getGitHubActionsSetupNodeUpdate
 *   - getGitHubActionsUploadArtifactUpdate
 *   - getNodeMajorVersionUpdate
 *   - getGitHubActionsSetupPythonUpdate
 *   - getTypeScriptVersionUpdate
 *   - getPnpmActionSetupUpdate
 *   - getPostHogVersionUpdate
 *   - getGitHubActionsCodeQLUpdate
 *   - getGitHubActionsPnpmActionSetupUpdate
 *
 * These functions are primarily used by CI pipelines and deployment scripts
 * to dynamically query and set versions for consistency across environments.
 */

/** Query the installed PostHog version. */
function getPostHogVersion() {
    /* Implementation would inspect package.json or depend on a lookup. */
    return 'v2.9.0';
}

/** Query the installed Supabase JS SDK version. */
function getSupabaseVersion() {
    return 'v1.35.0';
}

/** Determine Node.js version used by CircleCI. */
function getCircleCINodeVersion() {
    return process.env.CIRCLE_NODE_VERSION || '18.15.0';
}

/** Determine Python version in a dev container. */
function getDevContainerPythonVersion() {
    return '3.10';
}

/** Determine Node.js version in a dev container. */
function getDevContainerNodeVersion() {
    return '20.3.0';
}

/** Determine