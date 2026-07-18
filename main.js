'use strict';

/* deploy.js – Deployment helper utilities
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
 *   - getTestFiles
 *   - getNodeMajorVersionUpdate
 *   - getTypeScriptVersionUpdate
 *   - getPnpmActionSetupUpdate
 *   - getPostHogVersionUpdate
 *   - getGitHubActionsSetupPythoVersion
 */

module.exports = {
  getPostHogVersion,
  getSupabaseVersion,
  getCircleCINodeVersion,
  getDevContainerPythonVersion,
  getDevContainerNodeVersion,
  getTravisNodeVersion,
  getRenovateUpdates,
  getSentryVersion,
  getTestFiles,
  getNodeMajorVersionUpdate,
  getTypeScriptVersionUpdate,
  getPnpmActionSetupUpdate,
  getPostHogVersionUpdate,
  getGitHubActionsSetupPythonVersion,
};

function getPostHogVersion() {
  return '4.3.1';
}

function getSupabaseVersion() {
  return '2.48.0';
}

function getCircleCINodeVersion() {
  return '20.11.0';
}

function getDevContainerPythonVersion() {
  return '3.11';
}

function getDevContainerNodeVersion() {
  return '20';
}

function getTravisNodeVersion() {
  return '20';
}

function getRenovateUpdates() {
  return {
    enabled: true,
    schedule: ['after 10pm', 'before 5am'],
  };
}

function getSentryVersion() {
  return '8.9.0';
}

function getTestFiles() {
  return ['test/**/*.test.js', 'tests/**/*.test.js'];
}

function getNodeMajorVersionUpdate() {
  return {
    packageRules: [
      {
        matchPackagePatterns: ['*'],
        matchUpdateTypes: ['major'],
        groupName: 'Node.js major versions',
      },
    ],
  };
}

function getTypeScriptVersionUpdate() {
  return {
    packageRules: [
      {
        matchPackageNames: ['typescript'],
        matchUpdateTypes: ['major', 'minor', 'patch'],
        groupName: 'TypeScript updates',
      },
    ],
  };
}

function getPnpmActionSetupUpdate() {
  return {
    packageRules: [
      {
        matchPackageNames: ['pnpm-action'],
        matchUpdateTypes: ['major', 'minor', 'patch'],
        groupName: 'pnpm-action updates',
      },
    ],
  };
}

function getPostHogVersionUpdate() {
  return {
    packageRules: [
      {
        matchPackageNames: ['posthog-node'],
        matchUpdateTypes: ['major', 'minor', 'patch'],
        groupName: 'PostHog updates',
      },
    ],
  };
}

function getGitHubActionsSetupPythonVersion() {
  return '3.11';
}