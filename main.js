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
 *   - getGitHubActionsSetupPythonUpdateV6
 *   - getNodeMajorVersionUpdateV24
 *   - getGitHubActionsUploadArtifactUpdateV7
 *   - getTypeScriptVersionUpdateV7
 *   - getPnpmActionSetupUpdateV6
 *   - getPostHogVersionUpdateV1_404_1
 *   - getGitHubActionsSetupNodeUpdateV7
 *   - getGitHubActionsCodeQLUpdateV4
 *
 */

// Existing functions remain unchanged...

/**
 * Gets the update for GitHub Actions setup-python to v6
 * @returns {string} The update version
 */
function getGitHubActionsSetupPythonUpdateV6() {
  return 'v6';
}

/**
 * Gets the update for Node major version to v24
 * @returns {string} The update version
 */
function getNodeMajorVersionUpdateV24() {
  return 'v24';
}

/**
 * Gets the update for GitHub Actions upload-artifact to v7
 * @returns {string} The update version
 */
function getGitHubActionsUploadArtifactUpdateV7() {
  return 'v7';
}

/**
 * Gets the update for TypeScript to v7
 * @returns {string} The update version
 */
function getTypeScriptVersionUpdateV7() {
  return 'v7';
}

/**
 * Gets the update for pnpm/action-setup to v6
 * @returns {string} The update version
 */
function getPnpmActionSetupUpdateV6() {
  return 'v6';
}

/**
 * Gets the update for posthog-js to v1.404.1
 * @returns {string} The update version
 */
function getPostHogVersionUpdateV1_404_1() {
  return 'v1.404.1';
}

/**
 * Gets the update for GitHub Actions setup-node to v7
 * @returns {string} The update version
 */
function getGitHubActionsSetupNodeUpdateV7() {
  return 'v7';
}

/**
 * Gets the update for GitHub Actions codeql-action to v4
 * @returns {string} The update version
 */
function getGitHubActionsCodeQLUpdateV4() {
  return 'v4';
}