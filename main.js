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

/* ---------- Logging ---------- */
const logging = {
  log(level, message) {
    if (typeof console[level] === 'function') {
      console[level](`[${level.toUpperCase()}] ${message}`);
    } else {
      console.log(`[${level.toUpperCase()}] ${message}`);
    }
  }
};

/* ---------- Linting ---------- */
async function runLinting() {
  if (isLintingRunning) {
    logging.log('warn', 'Linting is already running');
    return { success: false, reason: 'already_running' };
  }
  isLintingRunning = true;
  logging.log('info', 'Starting linting process');
  try {
    const { stdio } = spawnSync('npm', ['run', 'lint'], { stdio: 'inherit' });
    logging.log('info', 'Linting completed successfully');
    isLintingRunning = false;
    if (stdio.toString().includes('Package "linear-bots/gitstream-github-action" not found as a dependency in the current project')) {
      throw new Error('Package "linear-bots/gitstream-github-action" not found as a dependency in the current project');
    }
    return { success: true };
  } catch (error) {
    logging.log('error', `Linting failed: ${error.message}`);
    isLintingRunning = false;
    return { success: false, error: error.message };
  }
}

async function fixLintingIssues() {
  logging.log('info', 'Attempting to fix linting issues');
  try {
    await spawnSync('npm', ['run', 'lint:fix'], { stdio: 'inherit' });
    logging.log('info', 'Linting fixes applied');
    return { success: true };
  } catch (error) {
    logging.log('error', `Failed to fix linting issues: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function updateLinearBotsGitstreamGithubAction() {
  try {
    const taskId = await createAsyncUpdateTask('gitstream-github-action', 'v4');
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJsonData = fs.readFileSync(packageJsonPath, { encoding: 'utf8' });
    const parsedPackageJson = JSON.parse(packageJsonData);
    const isDependencyPresent = Object.keys(parsedPackageJson.dependencies || {}).includes('linear-bots/gitstream-github-action');
    if (!isDependencyPresent) {
      logging.log('warn', `Package "linear-bots/gitstream-github-action" not found as a dependency in the current project`);
      throw new Error('Package "linear-bots/gitstream-github-action" not found as a dependency in the current project');
    }

    let updated = false;
    const matchFound = parsedPackageJson.dependencies['linear-bots/gitstream-github-action'].match(/^(\d+\.\d+\.\d+)$/);
    if (!matchFound) {
      parsedPackageJson.dependencies['linear-bots/gitstream-github-action'] = 'v4';
      updated = true;
    } else {
      parsedPackageJson.dependencies['linear-bots/gitstream-github-action'] = `${matchFound[1].split('.')[0]}.${matchFound[1].split('.')[1]}.${Number(matchFound[1].split('.')[2]) + 1}`;
      updated = true;
    }

    if (updated) {
      fs.writeFileSync(packageJsonPath, JSON.stringify(parsedPackageJson, null, 2), { encoding: 'utf8' });
    }

    await updateNpmPackage('github/gitstream-github-action', 'v4');
    logging.log('info', `Successfully updated linear-bots/gitstream-github-action to v4`);
    return taskId;
  } catch (error) {
    logging.log('warn', `Failed to update linear-bots/gitstream-github-action: ${error.message}`);
  }
}

const createAsyncUpdateTask = (packageName, version) => {
  return addTaskExtended(`Update ${packageName} to ${version}`, 'high', ['dependency-update']);
};
async function updateDependencyVersions(dependencies, newVersion) {
  if (typeof dependencies === 'object' && !Array.isArray(dependencies)) {
    for (const [name, version] of Object.entries(dependencies)) {
      await updateDependencyVersions([name], version);
    }
  }
}
const updateCodeqlAction = async () => {
  try {
    const taskId = await createAsyncUpdateTask('github/codeql-action', 'v4');
    await updateNpmPackage('github/codeql-action', 'v4');
    logging.log('info', `Successfully updated github/codeql-action to v4`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update github/codeql-action: ${error.message}`);
  }
};
const updatePosthogJs = async () => {
  await updateDependencyVersions({ 'posthog-js': 'v1.408.1' });
};
const updatePosthogJsToLatest = async () => {
  try {
    const taskId = await createAsyncUpdateTask('posthog-js', 'v1.408.1');
    await updateNpmPackage('posthog-js', 'v1.408.1');
    logging.log('info', `Successfully updated posthoh-js to v1.408.1`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update posthoh-js: ${error.message}`);
  }
};

const updateActionsStale = async () => {
  try {
    const taskId = await createAsyncUpdateTask('actions/stale', 'v11');
    await updateNpmPackage('actions/stale', 'v11');
    logging.log('info', `Successfully updated actions/stale to v11`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update actions/stale: ${error.message}`);
  }
};

const updateTypescript = async () => {
  try {
    const taskId = await createAsyncUpdateTask('typescript', 'v7');
    await updateNpmPackage('typescript', 'v7');
    logging.log('info', `Successfully updated typescript to v7`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update typescript: ${error.message}`);
  }
};
const handleLockFileWarning = async () => {
  const taskId = await createAsyncUpdateTask('Consolidate multiple npm lock files');
  logging.log('warn', 'Multiple lock files detected. Consider consolidating to a single lock file.');
  logging.log('info', 'Lock file consolidation task created');
  return taskId;
};
const isAwaitingSchedule = (taskId) => {
  const task = getTaskById(taskId);
  return task && task.tags && task.tags.includes('auto-schedule') && !task.completed;
};
const createAllAwaitingSchedulePrs = async () => {
  const awaitingTasks = Array.from(tasks.values()).filter(task => {
    return task.tags && task.tags.includes('auto-schedule') && !task.completed;
  });
  awaitingTasks.forEach(task => {
    addTaskExtended(`Create PR for ${task.title}`, 'medium', ['auto-schedule']);
    logging.log('info', `Scheduled PR creation task for ${task.title}`);
  });
  return { scheduledPrTasks: awaitingTasks.length };
};
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
const checkPavoukpr = (pr) => {
  if (!pr || typeof pr !== 'object') return false;
  const title = pr.data?.title ?? pr.title;
  if (typeof title !== 'string') return false;
  const hasPavouk = /Pavouk/i.test(title);
  if (hasPavouk) return true;
  const body = pr.data?.body ?? pr.body ?? '';
  const blockedComment = new RegExp("<!--\\s*recreate-branch=renovate", "i");
  if (blockedComment.test(body)) return true;
  const numberMatch = /\b(\d+)\b/.exec(title);
  const blockedPrNumber = numberMatch ? numberMatch[1] : null;
  const matchesPrNumber = blockedPrNumber && parseInt(blockedPrNumber, 10) === pr.number;
  return matchesPrNumber;
};
async function runPendingRenovateUpdatesFinal() {
  const pending = Array.from(tasks.values()).filter(t => t.tags && t.tags.includes('renovate') && !t.completed);
  for (const task of pending) {
    logging.log('info', `Pending Renovate update: ${task.title}`);
  }
  return { pendingTasks: pending.length };
}
const manualTrigger = () => {
  logging.log('info', 'Manual trigger requested for Renovate re-run.');
  return { manual: true };
};
module.exports = {
  addTask,
  getTaskById,
  addTaskExtended,
  getTaskByIdExtended,
  updateNpmPackage,
  createAsyncUpdateTask,
  isAwaitingSchedule,
  createAllAwaitingSchedulePrs,
  runLinting,
  fixLintingIssues,
  updateDependencyVersions,
  logging,
  handlePrTitle,
  updateLinearBotsGitstream,
  updateLinearBotsGitstreamGithubAction,
  updateCodeqlAction,
  updatePosthogJsToLatest,
  handleLockFileWarning,
  checkPavoukpr,
  runPendingRenovateUpdatesFinal,
  manualTrigger
};