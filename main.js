'use strict';

/**
 * Lightweight deployment helper utilities.
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
 *   - ...
 *   - ...
 *   - ...
 *   - ...
 *   - ...
 *   - ...
 *   - ...
 *   - ...
 *   - getTestFiles
 *   - getPostHogVersionUpdate
 *   - ...
 *   - ...
 *   - getNodeMajorVersionUpdate
 *   - ...
 *   - getTypeScriptVersionUpdate
 *   - getPnpmActionSetupUpdate
 *   - ...
 *   - ...
 *   - ...
 */

/**
 * Gets the update information for GitHub Actions GitStream version
 * @returns {Object} The update information for GitHub Actions GitStream version
 */
function getGitStreamVersionUpdate() {
  return {
    current: 'v2',
    update: 'v2' // No update available as per the issue
  };
}