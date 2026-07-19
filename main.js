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
 *   - getGitStreamVersion
 *   - getGitStreamActionVersionUpdate
 *   - getGitStreamActionVersionUpdateAlt
 *   - getGitStreamVersionUpdate
 *   - getDailyChallengeVersionUpdate
 *   - getTestFiles
 *   - getPostHogVersionUpdate
 *   - getPnpmActionSetupUpdate
 *   - getPnpm
 *   - getNodeMajorVersionUpdate
 *   - getTypeScriptVersionUpdate
 */

/**
 * Gets the update information for GitHub Actions GitStream version.
 * @returns {Object} The update information for GitHub Actions GitStream version
 */
function getGitStreamVersion() {
  return {
    current: 'v2',
    update: 'v2' // No update available as per the issue
  };
}

/**
 * Alias for getGitStreamVersion to maintain backward compatibility.
 * @returns {Object}
 */
function getGitStreamActionVersionUpdate() {
  return getGitStreamVersion();
}

/**
 * Alternate GitStream action version function (legacy name).
 * @returns {Object}
 */
function getGitStreamActionVersionUpdateAlt() {
  return getGitStreamVersion();
}

/**
 * Gets the update information for GitHub Actions GitStream version.
 * @returns {Object} The update information for GitHub Actions GitStream version
 */
function getGitStreamVersionUpdate() {
  return {
    current: 'linear-bots/gitstream-github-action v2',
    update: 'linear-bots/gitstream-github-action v2' // No update available as per the issue
  };
}

/**
 * Gets the update information for daily challenge version
 * @returns {Object} The update information for daily challenge version
 */
function getDailyChallengeVersionUpdate() {
  return {
    current: 'v1',
    update: 'v