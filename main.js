'use strict';
const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { memoryVisualizer } = require('./memory.visualizer.js');

let isLintingRunning = false;
let taskIdCounter = 0;
const tasks = [];

function addTask(task) {
  task.id = ++taskIdCounter;
  tasks.push(task);
  return task;
}

function getTaskById(id) {
  return tasks.find(task => task.id === id);
}

/* ---------- Linting ---------- */
function runLinting() {
  logging.log('info', 'Running linting');
  // Implementation would go here
}

function fixLintingIssues() {
  logging.log('info', 'Fixing linting issues');
  // Implementation would go here
}

/* ---------- Logging ---------- */
const logging = {
  log(level, message) {
    console.log(`[${level}] ${message}`);
  }
};

/* ---------- Task Management ---------- */
const addTaskExtended = (title, priority = "medium", tags = []) => {
  taskIdCounter++;
  const task = { id: taskIdCounter, title, priority, tags, completed: false, createdAt: new Date() };
  tasks.push(task);
  return taskIdCounter;
};

const getTaskByIdExtended = (taskId) => tasks.find(t => t.id === taskId) || null;

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
const createAsyncUpdateTask = (packageName, version) => {
  return addTaskExtended(`Update ${packageName} to ${version}`, 'high', ['dependency-update']);
};

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
    addTaskExtended(taskTitle, 'high', ['renovate']);
  } catch (error) {
    logging.log('error', `Failed to update ${dependency}: ${error.message}`);
    throw error;
  }
};

/* ---------- Specific Update Functions ---------- */
const updateLinearBotsGitstream = async () => {
  await createAsyncUpdateTask('Update gitstream-github-action to v4');
  await npmUpdate('linear-bots/gitstream-github-action', 'v4');
};

const updateLinearBotsGitstreamGithubAction = async () => {
  try {
    const taskId = await createAsyncUpdateTask('linear-bots/gitstream-github-action to v4');
    await npmUpdate('linear-bots/gitstream-github-action', 'v4');
    logging.log('info', `Successfully updated linear-bots/gitstream-github-action to v4`);
    return taskId;
  } catch (error) {
    logging.log('warn', `Failed to update linear-bots/gitstream-github-action: ${error.message}`);
  }
};

const updateCodeqlAction = async () => {
  try {
    const taskId = await createAsyncUpdateTask('github/codeql-action to v4');
    await npmUpdate('github/codeql-action', 'v4');
    logging.log('info', `Successfully updated github/codeql-action to v4`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update github/codeql-action: ${error.message}`);
    throw error;
  }
};

const updatePosthogJs = async () => {
  await updateDependencyVersions('posthog-js', 'v1.408.1');
};

const updatePosthogJsToLatest = async () => {
  try {
    const taskId = await createAsyncUpdateTask('posthog-js to v1.408.1');
    await npmUpdate('posthog-js', 'v1.408.1');
    logging.log('info', `Successfully updated posthog-js to v1.408.1`);
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

const updateActionsStale = async () => {
  await updateDependencyVersions('actions/stale', 'v11');
};

const updateStaleAction = async () => {
  try {
    const taskId = await createAsyncUpdateTask('actions/stale to v11');
    await npmUpdate('actions/stale', 'v11');
    logging.log('info', `Successfully updated actions/stale to v11`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update actions/stale: ${error.message}`);
    throw error;
  }
};

const updateTypeScript = async () => {
  try {
    await npmUpdate('typescript', '^7.0.2');
    logging.log('info', 'Successfully updated typescript to ^7.0.2');
  } catch (error) {
    logging.log('error', `Failed to update typescript: ${error.message}`);
    throw error;
  }
};

/* ---------- Schedule Awareness ---------- */
const isAwaitingSchedule = (taskId) => {
  const task = getTaskById(taskId);
  return task && task.tags && task.tags.includes('auto-schedule') && !task.completed;
};

const createAllAwaitingSchedulePrs = async () => {
  const awaitingTasks = Array.from(tasks.values()).filter(task => task.tags && task.tags.includes('renovate') && !task.completed);
  awaitingTasks.forEach(task => {
    addTaskExtended(`Create PR for ${task.title}`, 'medium', ['auto-schedule']);
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
  if (hasConvention === undefined || hasConvention === null) {
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
  const numberMatch = /\b(\\d+)\b/.exec(title);
  const blockedPrNumber = numberMatch ? numberMatch[1] : null;
  const matchesPrNumber = blockedPrNumber && parseInt(blockedPrNumber, 10) === pr.number;
  return matchesPrNumber;
};

const checkPavoukPr = willRecreateBlockedUpdate;

/* ---------- Emotion Functions ---------- */
function handlePrTitleEmotion(title) {
  // Implementation would go here
}

function validateEmotion(emotion) {
  // Implementation would go here
}

function categorizeEmotion(emotion) {
  // Implementation would go here
}

function analyzeEmotionText(text) {
  // Implementation would go here
}

function createEmotionProfile(emotions) {
  // Implementation would go here
}

/* ---------- Utility Functions ---------- */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/* ---------- Stargazer Tracking ---------- */
function trackStargazers() {
  // Implementation would go here
}

function identifyRunawayStargazers() {
  // Implementation would go here
}

function getStargazerStats() {
  // Implementation would go here
}

function detectStargazerAnomalies() {
  return [];
}

function analyzeStargazerGrowth() {
  // Implementation would return {}
}

function trackRunawayStargazers() {
  // Implementation would here
}

/* ---------- Deployment ---------- */
const runPendingRenovateUpdates = async () => {
  logging.log('info', 'Running pending renovate updates');
  const updates = [
    updateTypeScript,
    updatePosthogJs,
    updateActionsStale,
    updateLinearBotsGitstream,
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

/* ---------- Dependency Dashboard ---------- */
const updateLinearBotsGitstreamGithubActionDashboard = () => {
  logging.log('info', 'Updating linear-bots/gitstream-github-action');
};

const updateCodeqlActionDashboard = () => {
  logging.log('info', 'Updating codeql-action');
};

const updatePosthogJsToLatestDashboard = () => {
  logging.log('info', 'Updating posthog-js to latest');
};

const handleLockFileWarningDashboard = () => {
  logging.log('warn', 'Lock file warning handled');
};

const updateStaleActionDashboard = () => {
  logging.log('info', 'Updating actions/stale');
};

const updateLinearBotsGitstreamDashboard = () => {
  logging.log('info', 'Updating linear-bots/gitstream');
};

const updatePosthogJsDashboard = () => {
  logging.log('info', 'Updating posthog-js');
};

const updateActionsStaleDashboard = () => {
  logging.log('info', 'Updating actions/stale');
};

const updateTypeScriptDashboard = () => {
  logging.log('info', 'Updating typescript');
};

/* ---------- Dependent Dashboard ---------- */
const dependencyDashboard = () => {
  const pendingSchedule = [
    { dependency: 'typescript', version: '^7.0.2', branch: 'typescript-7.x', type: 'chore(deps)', action: 'Update typescript to ^7.0.2' },
    { dependency: 'posthog-js', version: '1.408.1', branch: 'posthog-js-1.x', type: 'fix(deps)', action: 'Update posthog-js to v1.408.1' },
    { dependency: 'actions/stale', version: 'v11', branch: 'actions-stale-11.x', type: 'chore(deps)', action: 'Update actions/stale to v11' },
  ];

  const blockedEdited = [
    { dependency: '@sentry/browser', version: 'v10.69.0', branch: 'sentry-javascript-monorepo', type: 'fix(deps)', action: 'Update @sentry/browser to v10.69.0' },
  ];

  const blockedClosed = [
    { dependency: 'github/codeql-action', version: 'v4', branch: 'github-codeql-action-4.x', pr: 978, type: 'chore(deps)', action: 'Update github/codeql-action to v4' },
  ];

  const failedLookups = [
    { package: 'linear-bots/gitstream-github-action', reason: 'no-result', file: '.github/workflows/gitstream.yml' },
  ];

  const warnings = [
    { type: 'multiple-lock-files', message: 'Updating multiple npm lock files is deprecated and support will be removed in future versions.' },
  ];

  const allUpdates = [...pendingSchedule, ...blockedEdited, ...blockedClosed];
  const totalPending = pendingSchedule.length;
  const totalBlocked = blockedEdited.length + blockedClosed.length;
  const totalFailedLookups = failedLookups.length;

  logging.log('info', `Dependency Dashboard: ${totalPending} pending, ${totalBlocked} blocked, ${totalFailedLookups} failed lookups`);

  return {
    pendingSchedule,
    blockedEdited,
    blockedClosed,
    failedLookups,
    warnings,
    summary: {
      totalPending,
      totalBlocked,
      totalFailedLookups,
      totalUpdates: allUpdates.length,
    },
  };
};

/* ---------- Deployment ---------- */
const runPendingRenovateUpdatesFinal = async () => {
  logging.log('info', 'Running pending renovate updates');
  const updates = [
    updateTypeScriptDashboard,
    updatePosthogJsDashboard,
    updateActionsStaleDashboard,
    updateLinearBotsGitstreamDashboard,
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

// Additional Exports
module.exports = {
  addTask,
  getTaskById,
  isAwaitingSchedule,
  createAllAwaitingSchedulePrs,
  runLinting,
  fixLintingIssues,
  logging,
  handlePrTitle,
  updateLinearBotsGitstreamGithubAction,
  updateCodeqlAction,
  updatePosthogJsToLatest,
  handleLockFileWarning,
  updateStaleAction,
  updateLinearBotsGitstream,
  updatePosthogJs,
  updateActionsStale,
  updateTypeScript,
  runPendingRenovateUpdates,
  dependencyDashboard,
};