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
  // Dev Container node version can be defined directly or under a feature
  if (config.features.node) {
    return config.features.node.version;
  }
  // Fallback for older formats
  return config.features['node:14'] ? config.features['node:14'].version : null;
}

function getTravisNodeVersion() {
  const configPath = path.join(__dirname, '..', '.travis.yml');
  const config = fs.readFileSync(configPath, 'utf8');
  const match = config.match(/node_js:\s*["']?(\d+\.\d+)[\"']?/);
  return match ? match[1] : null;
}

function getRenovateUpdates() {
  const configPath = path.join(__dirname, '..', 'renovate.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  return config.updates;
}

function getSentryVersion() {
  const packageJson = require('../package.json');
  return packageJson.dependencies['@sentry/browser'];
}

function getGitHubActionsPythonVersion() {
  const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'node.yml');
  const workflow = fs.readFileSync(workflowPath, 'utf8');
  const match = workflow.match(/actions\/setup-python@(\d+\.\d+\.\d+)/);
  return match ? match[1] : null;
}

function getGitHubActionsNodeVersion() {
  const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'node.yml');
  const workflow = fs.readFileSync(workflowPath, 'utf8');
  const match = workflow.match(/actions\/setup-node@(\d+\.\d+\.\d+)/);
  return match ? match[1] : null;
}

function getGitHubActionsSetupNodeVersion() {
  const configPath = path.join(__dirname, '..', '.github', 'workflow-templates', 'setup-node.yml');
  const config = fs.readFileSync(configPath, 'utf8');
  const match = config.match(/actions\/setup-node@(\d+\.\d+\.\d+)/);
  return match ? match[1] : null;
}

function getGitHubActionsUploadArtifactVersion() {
  const configPath = path.join(__dirname, '..', '.github', 'workflow-templates', 'upload-artifact.yml');
  const config = fs.readFileSync(configPath, 'utf8');
  const match = config.match(/actions\/upload-artifact@(\d+\.\d+\.\d+)/);
  return match ? match[1] : null;
}

function getGitHubActionsSetupPythonVersion() {
  const configPath = path.join(__dirname, '..', '.github', 'workflow-templates', 'setup-python.yml');
  const config = fs