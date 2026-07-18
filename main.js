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
 *
 * The exported functions are also
 */

const fs = require('fs');
const path = require('path');

function getPostHogVersion() {
  const packageJson = require('../package.json');
  return packageJson.dependencies['posthog-js'];
}

function getSupabaseVersion() {
  const packageJson = require('../package.json');
  return packageJson.dependencies['@supabase/supabase-js'];
}

function getCircleCINodeVersion() {
  const configPath = path.join(__dirname, '..', '.circleci', 'config.yml');
  const config = fs.readFileSync(configPath, 'utf8');
  const match = config.match(/cimg\/node (\d+\.\d+\.\d+)/);
  return match ? match[1] : null;
}

function getDevContainerPythonVersion() {
  const configPath = path.join(__dirname, '..', '.devcontainer', 'devcontainer.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  return config.features.python.version;
}

function getDevContainerNodeVersion() {
  const configPath = path.join(__dirname, '..', '.devcontainer', 'devcontainer.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  return config.features.node.version;
}

function getTravisNodeVersion() {
  const configPath = path.join(__dirname, '..', '.travis.yml');
  const config = fs.readFileSync(configPath, 'utf8');
  const match = config.match(/node (\d+)/);
  return match ? match[1] : null;
}

function getRenovateUpdates() {
  const renovateConfigPath = path.join(__dirname, '..', 'renovate.json');
  if (fs.existsSync(renovateConfigPath)) {
    return JSON.parse(fs.readFileSync(renovateConfigPath, 'utf8'));
  }
  return null;
}

function getSentryVersion() {
  const packageJson = require('../package.json');
  return packageJson.dependencies['@sentry/browser'];
}

function getGitHubActionsPythonVersion() {
  const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'ai-autocoder.yml');
  const workflow = fs.readFileSync(workflowPath, 'utf8');
  const match = workflow.match(/python (\d+\.\d+)/);
  return match ? match[1] : null;
}

function getGitHubActionsNodeVersion() {
  const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'ai-code-maintenance.yml');
  const workflow = fs.readFileSync(workflowPath, 'utf8');
  const match = workflow.match(/node (\d+)/);
  return match ? match[1] : null;
}

function getGitHubActionsSetupNodeVersion() {
  const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'ai-code-maintenance.yml');
  const workflow = fs.readFileSync(workflowPath, 'utf8');
  const match = workflow.match(/actions\/setup-node v(\d+)/);
  return match ? match[1] : null;
}

function getGitHubActionsUploadArtifactVersion() {
  const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'auto-issue.yml');
  const workflow = fs.readFileSync(workflowPath, 'utf8');
  const match = workflow.match(/actions\/upload-artifact v(\d+)/);
  return match ? match[1] : null;
}

function getGitHubActionsSetupPythonVersion() {
  const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'ai-autocoder.yml');
  const workflow = fs.readFileSync(workflowPath, 'utf8');
  const match = workflow.match(/actions\/setup-python v(\d+)/);
  return match ? match[1] : null;
}

function getGitHubActionsCodeQLVersion() {
  const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'ai-guardian.yml');
  const workflow = fs.readFileSync(workflowPath, 'utf8');
  const match = workflow.match(/github\/codeql-action v(\d+)/);
  return match ? match[1] : null;
}

function getGitHubActionsPnpmVersion() {
  const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'ai-guardian.yml');
  const workflow = fs.readFileSync(workflowPath, 'utf8');
  const match = workflow.match(/pnpm (\d+)/);
  return match ? match[1] : null;
}

function getGitHubActionsGitStreamVersion() {
  const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'gitstream.yml');
  const workflow = fs.readFileSync(workflowPath, 'utf8');
  const match = workflow.match(/linear-bots\/gitstream-github-action v(\d+)/);
  return match ? match[1] : null;
}

/**
 * Gets a list of test files in the project
 * @returns {string[]} Array of test file paths
 */
function getTestFiles() {
  const testDir = path.join(__dirname, '..', 'tests');
  if (!fs.existsSync(testDir)) {
    return [];
  }

  const files = fs.readdirSync(testDir);
  return files.filter(file =>
    file.endsWith('.test.js') || file.endsWith('.spec.js')
  ).map(file => path.join(testDir, file));
}

/**
 * Gets the update version for GitHub Actions setup-node
 * @returns {string|null} The update version or null if not found
 */
function getGitHubActionsSetupNodeUpdate() {
  const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'ai-code-maintenance.yml');
  const workflow = fs.readFileSync(workflowPath, 'utf8');
  const match = workflow.match(/actions\/setup-node v(\d+) → \[Updates: `v(\d+)`\]/);
  return match ? match[2] : null;
}

/**
 * Gets the update version for GitHub Actions upload-artifact
 * @returns {string|null} The update version or null if not found
 */
function getGitHubActionsUploadArtifactUpdate() {
  const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'auto-issue.yml');
  const workflow = fs.readFileSync(workflowPath, 'utf8');
  const match = workflow.match(/actions\/upload-artifact v(\d+) → \[Updates: `v(\d+)`\]/);
  return match ? match[2] : null;
}

/**
 * Gets the update version for Node.js major version
 * @returns {string|null} The update version or null if not found
 */
function getNodeMajorVersionUpdate() {
  const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'ai-code-maintenance.yml');
  const workflow = fs.readFileSync(workflowPath, 'utf8');
  const match = workflow.match(/node (\d+) → \[Updates: `(\d+)`\]/);
  return match ? match[2] : null;
}

/**
 * Gets the update version for GitHub Actions setup-python
 * @returns {string|null} The update version or null if not found
 */
function getGitHubActionsSetupPythonUpdate() {
  const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'auto-merge-pr.yml');
  const workflow = fs.readFileSync(workflowPath, 'utf8');
  const match = workflow.match(/actions\/setup-python v(\d+) → \[Updates: `v(\d+)`\]/);
  return match ? match[2] : null;
}

/**
 * Gets the update version for TypeScript
 * @returns {string|null} The update version or null if not found
 */
function getTypeScriptVersionUpdate() {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const match = packageJson.dependencies.typescript.match(/typescript (\^?\d+\.\d+\.\d+) → \[Updates: `(\^?\d+\.\d+\.\d+)`\]/);
  return match ? match[2] : null;
}

/**
 * Gets the update version for pnpm/action-setup
 * @returns {string|null} The update version or null if not found
 */
function getPnpmActionSetupUpdate() {
  const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'ai-guardian.yml');
  const workflow = fs.readFileSync(workflowPath, 'utf8');
  const match = workflow.match(/pnpm\/action-setup v(\d+) → \[Updates: `v(\d+)`\]/);
  return match ? match[2] : null;
}

/**
 * Gets the update version for posthog-js
 * @returns {string|null} The update version or null if not found
 */
function getPostHogVersionUpdate() {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const match = packageJson.dependencies['posthog-js'].match(/posthog-js (\d+\.\d+\.\d+) → \[Updates: `(\d+\.\d+\.\d+)`\]/);
  return match ? match[2] : null;
}

module.exports = {
  getPostHogVersion,
  getSupabaseVersion,
  getCircleCINodeVersion,
  getDevContainerPythonVersion,
  getDevContainerNodeVersion,
  getTravisNodeVersion,
  getRenovateUpdates,
  getSentryVersion,
  getGitHubActionsPythonVersion,
  getGitHubActionsNodeVersion,
  getGitHubActionsSetupNodeVersion,
  getGitHubActionsUploadArtifactVersion,
  getGitHubActionsSetupPythonVersion,
  getGitHubActionsCodeQLVersion,
  getGitHubActionsPnpmVersion,
  getGitHubActionsGitStreamVersion,
  getTestFiles,
  getGitHubActionsSetupNodeUpdate,
  getGitHubActionsUploadArtifactUpdate,
  getNodeMajorVersionUpdate,
  getGitHubActionsSetupPythonUpdate,
  getTypeScriptVersionUpdate,
  getPnpmActionSetupUpdate,
  getPostHogVersionUpdate
};