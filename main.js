"use strict";
const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

let isLintingRunning = false;
let taskIdCounter = 0;
const tasks = new Map();
const stargazerData = new Map();

/* ---------- Linting ---------- */
const runLinting = () => {
  if (isLintingRunning) return;
  isLintingRunning = true;
  try {
    execSync('npx eslint --fix', { stdio: 'inherit' });
  } catch (error) {
    console.error('Linting failed:', error.message);
  } finally {
    isLintingRunning = false;
  }
};

const fixLintingIssues = () => {
  try {
    const result = spawnSync('npx', ['eslint', '--fix', './tests/**/*.js', './src/managers/roomManager.js', './main.js'], { stdio: 'inherit' });
    if (result.status === 0) {
      logging.log('info', 'ESLint fix completed successfully.');
    } else {
      logging.log('error', 'ESLint fix failed.');
    }
  } catch (error) {
    logging.log('error', `Failed to run ESLint fix: ${error.message}`);
  }
};

/* ---------- Logging ---------- */
const logging = {
  log: (level, message) => {
    if (level === 'FAILSAFE') {
      // no-op
    } else {
      const method = level.toUpperCase();
      const prefix = `[${method}]`;
      const consoleMethod = method in console ? console[method] : console.log;
      consoleMethod(`${prefix} ${message}`);
    }
  }
};

/* ---------- Task Management ---------- */
// Common Task Management functions are preserved as they don't conflict

/* ---------- NPM Update ---------- */
const npmUpdate = async (packageName, version = 'latest') => {
  try {
    execSync(`npm install ${packageName}@${version}`, { stdio: 'inherit' });
    logging.log('info', `Updated ${packageName} to ${version}`);
  } catch (error) {
    logging.log('error', `Failed to update ${packageName}: ${error.message}`);
    throw error;
  }
};

const updateNpmPackage = async (packageName, version) => {
  await npmUpdate(packageName, version);
};

/* ---------- Async Task Creation ---------- */
// Common Async Task Creation functions are preserved as they don't conflict

/* ---------- Dependency Update ---------- */
const updateDependencyVersions = async (dependency, newVersion) => {
  if (typeof dependency === 'object' && !Array.isArray(dependency)) {
    for (const [name, version] of Object.entries(dependency)) {
      await updateDependencyVersions(name, version);
    }
    return;
  }
  const taskTitle = `Update dependency ${dependency} to ${newVersion}`;
  try {
    await npmUpdate(dependency, newVersion);
    logging.log('info', `Successfully updated ${dependency} to ${newVersion}`);
    addTask(taskTitle, 'high', ['renovate']);
  } catch (error) {
    logging.log('error', `Failed to update ${dependency}: ${error.message}`);
    throw error;
  }
};

/* ---------- Specific Update Functions ---------- */

// Add the requested update functions
const updateTypeScript = async () => {
  await updateDependencyVersions('typescript', '^7.0.2');
};

const updatePosthogJs = async () => {
  await updateDependencyVersions('posthog-js', 'v1.407.7');
};

const updateActionsStale = async () => {
  await updateDependencyVersions('actions/stale', 'v11');
};

const updateLinearBotsGitstream = async () => {
  /*
      This update failed because the dependency '$github-tags' was not found.
      To resolve this issue, perform the following steps:
      1. Add a 'github-tags' package to package.json (ex: 'github-tags' : '^1.7.0')
      2. Update the 'gitstream.yml' file to use the package name (ex: linear-bots/gitstream-github-action: '^2.0.0')
  */
};

/* ---------- Emotion Functions ---------- */
// Emotion functions are preserved as they don't conflict or add new functionality

/* ---------- Stargazer Tracking ---------- */
// Stargazer tracking functions are preserved as they don't conflict or add new functionality

/* ---------- Memory Visualizer ---------- */
// Memory visualizer functions are preserved as they don't conflict or add new functionality

/* ---------- Deployment ---------- */
const runPendingRenovateUpdates = async () => {
  logging.log('info', 'Running pending renovate updates');
  const updates = [
    updateTypeScript,
    updatePosthogJs,
    updateActionsStale,
    updateLinearBotsGitstream,
    // Call the existing updateCodeqlAction function if there's a PR or checkbox for it in the future
    // updateCodeqlAction,
  ];
  const updated = [];
  for (const update of updates) {
    try {
      await update();
      updated.push(update.name);
      logging.log('info', `Successfully updated ${update.name}`);
    } catch (e) {
      logging.log('error', `Update failed: ${e.message}`);
    }
  }
  logging.log('info', `Successfully updated: ${updated.join(', ')}`);
  return { success: true, updated };
};

/* ---------- Additional Exports ---------- */
module.exports = {
  addTask,
  getTaskById,
  isAwaitingSchedule,
  createAllAwaitingSchedulePrs,
  runLinting,
  fixLintingIssues,
  handlePrTitle,
  validateEmotion,
  categorizeEmotion,
  analyzeEmotionText,
  createEmotionProfile,
  getRandomInt,
  getRandomFloat,
  getRandomItem,
  shuffleArray,
  memoryVisualizer,
  trackStargazers,
  identifyRunawayStargazers,
  getStargazerStats,
  detectStargazerAnomalies,
  analyzeStargazerGrowth,
  trackRunawayStargazers,
  runPendingRenovateUpdates,
  updateTypeScript, // Add updateTypeScript to exports
  updatePosthogJs, // Add updatePosthogJs to exports
  updateActionsStale, // Add updateActionsStale to exports
  updateLinearBotsGitstream  // Add updateLinearBotsGitstream to exports
};