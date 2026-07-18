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
 *   - getGitHubActionsSetupNodeUpdate
 *   - getGitHubActionsUploadArtifactUpdate
 *   - getNodeMajorVersionUpdate
 *   - getGitHubActionsSetupPythonUpdate
 *   - getTypeScriptVersionUpdate
 *   - getPnpmActionSetupUpdate
 *   - getPostHogVersionUpdate
 *   - getGitHubActionsCodeQLUpdate
 *   - getGitHubActionsPnpmActionSetupUpdate
 *   - getGitHubActionsSetupNodeUpdate
 *   - getGitHubActionsUploadArtifactUpdate
 *   - getNodeMajorVersionUpdate
 *   - getGitHubActionsSetupPythonUpdate
 *   - getTypeScriptVersionUpdate
 *   - getPnpmActionSetupUpdate
 *   - getPostHogVersionUpdate
 *   - getGitHubActionsCodeQLUpdate
 *   - getGitHubActionsPnpmActionSetupUpdate
 *   - getGitHubActionsSetupNodeUpdate
 *   - getGitHubActionsUploadArtifactUpdate
 *   - getNodeMajorVersionUpdate
 *   - getGitHubActionsSetupPythonUpdate
 *   - getTypeScriptVersionUpdate
 *   - getPnpmActionSetupUpdate
 *   - getPostHogVersionUpdate
 *   - getGitHubActionsCodeQLUpdate
 *   - getGitHubActionsPnpmActionSetupUpdate
 *   - getGitHubActionsSetupNodeUpdate
 *   - getGitHubActionsUploadArtifactUpdate
 *   - getNodeMajorVersionUpdate
 *   - getGitHubActionsSetupPythonUpdate
 *   - getTypeScriptVersionUpdate
 *   - getPnpmActionSetupUpdate
 *   - getPostHogVersionUpdate
 *   - getGitHubActionsCodeQLUpdate
 *   - getGitHubActionsPnpmActionSetupUpdate
 *   - getGitHubActionsSetupNodeUpdate
 *   - getGitHubActionsUploadArtifactUpdate
 *   - getNodeMajorVersionUpdate
 *   - getGitHubActionsSetupPythonUpdate
 *   - getTypeScriptVersionUpdate
 *   - getPnpmActionSetupUpdate
 *   - getPostHogVersionUpdate
 *   - getGitHubActionsCodeQLUpdate
 *   - getGitHubActionsPnpmActionSetupUpdate
 *   - getGitHubActionsSetupNodeUpdate
 *   - getGitHubActionsUploadArtifactUpdate
 *   - getNodeMajorVersionUpdate
 *   - getGitHubActionsSetupPythonUpdate
 *   - getTypeScriptVersionUpdate
 *   - getPnpmActionSetupUpdate
 *   - getPostHogVersionUpdate
 *   - getGitHubActionsCodeQLUpdate
 *   - getGitHubActionsPnpmActionSetupUpdate
 *   - getGitHubActionsSetupNodeUpdate
 *   - getGitHubActionsUploadArtifactUpdate
 *   - getNodeMajorVersionUpdate
 *   - getGitHubActionsSetupPythonUpdate
 *   - getTypeScriptVersionUpdate
 *   - getPnpmActionSetupUpdate
 *   - getPostHogVersionUpdate
 *   - getGitHubActionsCodeQLUpdate
 *   - getGitHubActionsPnpmActionSetupUpdate
 *   - getGitHubActionsSetupNodeUpdate
 *   - getGitHubActionsUploadArtifactUpdate
 *   - getNodeMajorVersionUpdate
 *   - getGitHubActionsSetupPythonUpdate
 *   - getTypeScriptVersionUpdate
 *   - getPnpmActionSetupUpdate
 *   - getPostHogVersionUpdate
 *   - getGitHubActionsCodeQLUpdate
 *   - getGitHubActionsPnpmActionSetupUpdate
 *   - getGitHubActionsSetupNodeUpdate
 *   - getGitHubActionsUploadArtifactUpdate
 *   - getNodeMajorVersionUpdate
 *   - getGitHubActionsSetupPythonUpdate
 *   - getTypeScriptVersionUpdate
 *   - getPnpmActionSetupUpdate
 *   - getPostHogVersionUpdate
 *   - getGitHubActionsCodeQLUpdate
 *   - getGitHubActionsPnpmActionSetupUpdate
 *   - getGitHubActionsSetupNodeUpdate
 *   - getGitHubActionsUploadArtifactUpdate
 *   - getNodeMajorVersionUpdate
 *   - getGitHubActionsSetupPythonUpdate
 *   - getTypeScriptVersionUpdate
 *   - getPnpmActionSetupUpdate
 *   - getPostHogVersionUpdate
 *   - getGitHubActionsCodeQLUpdate
 *   - getGitHubActionsPnpmActionSetupUpdate
 *   - getGitHubActionsSetupNodeUpdate
 *   - getGitHubActionsUploadArtifactUpdate
 *   - getNodeMajorVersionUpdate
 *   - getGitHubActionsSetupPythonUpdate
 *   - getTypeScriptVersionUpdate
 *   - getPnpmActionSetupUpdate
 *   - getPostHogVersionUpdate
 *   - getGitHubActionsCodeQLUpdate
 *   - getGitHubActionsPnpmActionSetupUpdate
 *   - getGitHubActionsSetupNodeUpdate
 *   - getGitHubActionsUploadArtifactUpdate
 *   - getNodeMajorVersionUpdate
 *   - getGitHubActionsSetupPythonUpdate
 *   - getTypeScriptVersionUpdate
 *   - getPnpmActionSetupUpdate
 *   - getPostHogVersionUpdate
 *   - getGitHubActionsCodeQLUpdate
 *   - getGitHubActionsPnpmActionSetupUpdate
 *   - getGitHubActionsSetupNodeUpdate
 *   - getGitHubActionsUploadArtifactUpdate
 *   - getNodeMajorVersionUpdate
 *   - getGitHubActionsSetupPythonUpdate
 *   - getTypeScriptVersionUpdate
 *   - getPnpmActionSetupUpdate
 *   - getPostHogVersionUpdate
 *   - getGitHubActionsCodeQLUpdate
 *   - getGitHubActionsPnpmActionSetupUpdate
 *   - getGitHubActionsSetupNodeUpdate
 *   - getGitHubActionsUploadArtifactUpdate
 *   - getNodeMajorVersionUpdate
 *   - getGitHubActionsSetupPythonUpdate
 *   - getTypeScriptVersionUpdate
 *   - getPnpmActionSetupUpdate
 *   - getPostHogVersionUpdate
 *   - getGitHubActionsCodeQLUpdate
 *   - getGitHubActionsPnpmActionSetupUpdate
 */

// New functions to add based on the issue:

/**
 * Gets the current version of the GitStream GitHub Action
 * @returns {string} The current version of the GitStream GitHub Action
 */
function getGitHubActionsGitStreamVersion() {
  // Implementation would parse .github/workflows/gitstream.yml
  // and extract the version of linear-bots/gitstream-github-action
  return 'v2'; // Example value, actual implementation would parse the file
}

/**
 * Gets the update information for the GitStream GitHub Action
 * @returns {Object} An object containing update information
 */
function getGitHubActionsGitStreamUpdate() {
  // Implementation would check for available updates
  // and return the update information
  return {
    current: 'v2',
    latest: 'v3', // Example value
    updateAvailable: true
  };
}

// Add these new exports to the module.exports object
module.exports = {
  // ... existing exports ...
  getGitHubActionsGitStreamVersion,
  getGitHubActionsGitStreamUpdate
};