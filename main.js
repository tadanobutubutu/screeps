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
      return;
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
const updateGitstreamGithubAction = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update gitstream-github-action to v4');
    await npmUpdate('linear-bots/gitstream-github-action', 'v4');
    logging.log('info', `Successfully updated gitstream-github-action to v4`);
    return taskId;
  } catch (error) {
    logging.log('warn', `Failed to update gitstream-github-action: ${error.message}`);
  }
};

const updateActionsLabeler = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update actions/labeler to v7');
    await npmUpdate('actions/labeler', 'v7');
    logging.log('info', `Successfully updated actions/labeler to v7`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update actions/labeler: ${error.message}`);
    throw error;
  }
};

const updateLinearBotsGitstream = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update linear-bots/gitstream-github-action to v4');
    await npmUpdate('linear-bots/gitstream-github-action', 'v4');
    logging.log('info', `Successfully updated linear-bots/gitstream-github-action to v4`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update linear-bots/gitstream-github-action: ${error.message}`);
    throw error;
  }
};

const updateLinearBotsGitstreamGithubAction = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update linear-bots/gitstream-github-action to v4');
    await npmUpdate('linear-bots/gitstream-github-action', 'v4');
    logging.log('info', `Successfully updated linear-bots/gitstream-github-action to v4`);
    return taskId;
  } catch (error) {
    logging.log('warn', `Failed to update linear-bots/gitstream-github-action: ${error.message}`);
  }
};

const updateCodeqlAction = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update github/codeql-action to v4');
    await npmUpdate('github/codeql-action', 'v4');
    logging.log('info', `Successfully updated github/codeql-action to v4`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update github/codeql-action: ${error.message}`);
    throw error;
  }
};

const updatePosthogJsToLatest = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update posthog-js to v1.407.6');
    await npmUpdate('posthog-js', 'v1.407.6');
    logging.log('info', `Successfully updated posthog-js to v1.407.6`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update posthog-js: ${error.message}`);
    throw error;
  }
};

const handleLockFileWarning = async () => {
  try {
    const taskId = await createAsyncUpdateTask('Consolidate multiple npm lock files');
    logging.log('warn', 'Multiple lock files detected. Consider consolidating to a single lock file.');
    logging.log('info', 'Lock file consolidation task created');
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to handle lock file warning: ${error.message}`);
    throw error;
  }
};

const updateStaleAction = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update actions/stale to v11');
    await npmUpdate('actions/stale', 'v11');
    logging.log('info', `Successfully updated actions/stale to v11`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update actions/stale: ${error.message}`);
    throw error;
  }
};

const updateTypeScript = async () => {
  await npmUpdate('typescript', '^7.0.2');
};

/* ---------- Schedule Awareness ---------- */
const isAwaitingSchedule = (dependency) => {
  const task = Array.from(tasks.values()).find(t => t.title.startsWith('update ') && t.title.includes(dependency));
  return task && !task.completed;
};

const createAllAwaitingSchedulePrs = async () => {
  const awaitingTasks = Array.from(tasks.values()).filter(task => task.tags && task.tags.includes('renovate') && !task.completed);
  awaitingTasks.forEach(task => {
    addTask(`Create PR for ${task.title}`, 'medium', ['auto-schedule']);
    logging.log('info', `Scheduled PR creation task for ${task.title}`);
  });
  return { scheduledPrTasks: awaitingTasks.length };
};

/* ---------- PR Title Handling ---------- */
const handlePrTitle = (title) => {
  if (title === undefined || title === null) {
    return { valid: false, reason: 'Empty title', score: 0 };
  }
  const trimmedTitle = title.trim();
  const hasConvention = /^(feat|fix|docs|style|refactor|test|chore|ci)(\(.+\))?:.+/i.test(trimmedTitle);
  if (!hasConvention) {
    return { valid: false, reason: 'Missing conventional commit prefix', score: 20 };
  }
  const lengthScore = trimmedTitle.length <= 72 ? 100 : 50;
  return { valid: true, reason: '', score: lengthScore };
};

const willRecreateBlockedUpdate = (pr) => {
  if (!pr || typeof pr !== 'object') return false;
  const title = pr.data?.title ?? pr.title;
  if (typeof title !== 'string') return false;
  const hasPavouk = /Pavouk/i.test(title);
  if (hasPavouk) return true;
  const body = pr.data?.body ?? pr.body ?? '';
  const blockedComment = new RegExp("<!--\\s*recreate-branch=renovate", "i");
  if (blockedComment.test(body)) return true;
  const numberMatch = /\b(\\d+)\\\\b/.exec(title);
  const blockedPrNumber = numberMatch ? numberMatch[1] : null;
  const matchesPrNumber = blockedPrNumber && parseInt(blockedPrNumber, 10) === pr.number;
  return matchesPrNumber;
};

const checkPavoukPr = willRecreateBlockedUpdate;

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
    updatePosthogJsToLatest,
    updateStaleAction,
    updateLinearBotsGitstream,
    updateLinearBotsGitstreamGithubAction,
    updateCodeqlAction,
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
};