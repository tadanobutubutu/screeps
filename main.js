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
 *   - getTestFiles
 *   - getPostHogVersionUpdate
 *   - getGitHubActionsSetupPythonVersion
 *   - getGitHub realidade GitHubActionsCodeQLUpdate
 *   - getGitHubActionsPnpmUpdate
 *   - getGitHubActionsGitStreamUpdate
 *   - getGitHubActionsSetupNodeUpdate
 *   - getGitHubActionsUploadArtifactUpdate
 *   - getNodeMajorVersionUpdate
 *   - getTypeScriptVersionUpdate
 *   - getPnpmActionSetupUpdate
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
  getPostHogVersionUpdate,
  getGitHubActionsSetupPythonVersion,
  getGitHubActionsCodeQLUpdate,
  getGitHubActionsPnpmUpdate,
  getGitHubActionsGitStreamUpdate,
  getGitHubActionsSetupNodeUpdate,
  getGitHubActionsUploadArtifactUpdate,
  getNodeMajorVersionUpdate,
  getTypeScriptVersionUpdate,
  getPnpmActionSetupUpdate,
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

function getGitHubActionsCodeQLUpdate() {
  return {
    packageRules: [
      {
        matchPackageNames: ['github/codeql-action'],
        matchUpdateTypes: ['major', 'minor', 'patch'],
        groupName: 'CodeQL Action updates',
      },
    ],
  };
}

function getGitHubActionsPnpmUpdate() {
  return {
    packageRules: [
      {
        matchPackageNames: ['pnpm-action'],
        matchUpdateTypes: ['major', 'minor', 'patch'],
        groupName: 'Pnpm Action updates',
      },
    ],
  };
}

function getGitHubActionsGitStreamUpdate() {
  return {
    packageRules: [
      {
        matchPackageNames: ['actions/checkout'],
        matchUpdateTypes: ['major', 'minor', 'patch'],
        groupName: 'Git Stream updates',
      },
    ],
  };
}

function getGitHubActionsSetupNodeUpdate() {
  return {
    packageRules: [
      {
        matchPackageNames: ['actions/setup-node'],
        matchUpdateTypes: ['major', 'minor', 'patch'],
        groupName: 'Setup Node Action updates',
      },
    ],
  };
}

function getGitHubActionsUploadArtifactUpdate() {
  return {
    packageRules: [
      {
        matchPackageNames: ['actions/upload-artifact'],
        matchUpdateTypes: ['major', 'minor', 'patch'],
        groupName: 'Upload Artifact Action updates',
      },
    ],
  };
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

λήςψειfunction getTypeScriptVersionUpdate() {
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