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
const yaml = require('js-yaml');

/**
 * Load a JSON file with safety.
 */
function loadJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

/**
 * Load a YAML file with safety.
 */
function loadYaml(filePath) {
  try {
    return yaml.load(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function getPostHogVersion() {
  const packageJson = require('../package.json');
  return packageJson.dependencies?.['posthog-js'] ?? null;
}

function getSupabaseVersion() {
  const packageJson = require('../package.json');
  return packageJson.dependencies?.['@supabase/supabase-js'] ?? null;
}

function getCircleCINodeVersion() {
  const configPath = path.join(__dirname, '..', '.circleci', 'config.yml');
  const config = loadYaml(configPath);
  if (!config) return null;
  const jobs = config.jobs || {};
  // assume "build" job contains docker image
  const job = jobs.build || {};
  const dockerImage = Array.isArray(job.docker) && job.docker[0]?.image;
  if (!dockerImage) return null;
  const match = dockerImage.match(/cimg\/node:(\d+\.\d+\.\d+)/);
  return match?.[1] ?? null;
}

function getDevContainerPythonVersion() {
  const configPath = path.join(__dirname, '..', '.devcontainer', 'devcontainer.json');
  const config = loadJson(configPath);
  return config?.features?.python?.version ?? null;
}

function getDevContainerNodeVersion() {
  const configPath = path.join(__dirname, '..', '.devcontainer', 'devcontainer.json');
  const config = loadJson(configPath);
  return config?.features?.node?.version ?? null;
}

function getTravisNodeVersion() {
  const configPath = path.join(__dirname, '..', '.travis.yml');
  const config = loadYaml(configPath);
  if (!config) return null;
  return config.language === 'node_js' ? config.node_js?.[0] ?? null : null;
}

function getRenovateUpdates() {
  // This is a placeholder; real implementation would parse renovate.json
  const configPath = path.join(__dirname, '..', 'renovate.json');
  const config = loadJson(configPath);
  return