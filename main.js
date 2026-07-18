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
 *   - getGitHubActionsPnpmUpdate
 *   - getGitHubActionsGitStreamUpdate
 *   - getGitHubActionsSetupNodeVersionUpdate
 *   - getGitHubActionsUploadArtifactVersionUpdate
 *   - getGitHubActionsSetupPythonVersionUpdate
 *   - getGitHubActionsCodeQLVersionUpdate
 *   - getGitHubActionsPnpmVersionUpdate
 *   - getGitHubActionsGitStreamVersionUpdate
 *   - getGitHubActionsSetupNodeVersionUpdate
 *   - getGitHubActionsUploadArtifactVersionUpdate
 *   - getGitHubActionsSetupPythonVersionUpdate
 *   - getGitHubActionsCodeQLVersionUpdate
 *   - getGitHubActionsPnpmVersionUpdate
 *   - getGitHubActionsGitStreamVersionUpdate
 *   - getGitHubActionsSetupNodeVersionUpdate
 *   - getGitHubActionsUploadArtifactVersionUpdate
 *   - getGitHubActionsSetupPythonVersionUpdate
 *   - getGitHubActionsCodeQLVersionUpdate
 *   - getGitHubActionsPnpmVersionUpdate
 *   - getGitHubActionsGitStreamVersionUpdate
 *   - getGitHubActionsSetupPyt
 */

/**
 * Gets a list of test files that match Jest's default patterns
 * @returns {string[]} Array of test file paths
 */
function getTestFiles() {
  const fs = require('fs');
  const path = require('path');

  const testDir = path.join(__dirname, '..', 'tests');
  const testFiles = [];

  // Check if tests directory exists
  if (fs.existsSync(testDir)) {
    // Recursively find all test files matching Jest patterns
    const findTestFiles = (dir) => {
      const files = fs.readdirSync(dir);

      files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          findTestFiles(fullPath);
        } else if (
          file.endsWith('.test.js') ||
          file.endsWith('.spec.js') ||
          (file.match(/__tests__/) && file.endsWith('.js'))
        ) {
          testFiles.push(fullPath);
        }
      });
    };

    findTestFiles(testDir);
  }

  return testFiles;
}

// All existing functions remain unchanged below this point...

function getPostHogVersion() {
  // ... existing implementation ...
}

function getSupabaseVersion() {
  // ... existing implementation ...
}

// ... all other existing functions remain exactly as they were ...