'use strict';

/* main.js – Deployment helper utilities
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
  getGitHubActionsGitStreamVersion
};