'use strict';
const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { memoryVisualizer } = require('./memory.visualizer.js');
let isLintingRunning = false;
let taskIdCounter = 0;
const tasks = [];

function newFunction() {
  return { hello: 'world' };
}

const addTask = addTaskExtended;
const getTaskById = getTaskByIdExtended;

const logging = {
  log(level, message) {
    if (typeof console[level] === 'function') {
      console[level](`[${level.toUpperCase()}] ${message}`);
    } else {
      console.log(`[${level.toUpperCase()}] ${message}`);
    }
  }
};

async function runLinting() {
  if (isLintingRunning) {
    logging.log('warn', 'Linting is already running');
    return { success: false, reason: 'already_running' };
  }
  isLintingRunning = true;
  logging.log('info', 'Starting linting process');
  try {
    await spawnSync('npm', ['run', 'lint'], { stdio: 'inherit' });
    logging.log('info', 'Linting completed successfully');
    isLintingRunning = false;
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

const updateNpmPackage = updateNpmPackage;

const createAsyncUpdateTask = createAsyncUpdateTask;

const updateDependencyVersions = updateDependencyVersions;

const updateLinearBotsGitstream = updateLinearBotsGitstream;
const updateLinearBotsGitstreamGithubAction = updateLinearBotsGitstreamGithubAction;
const updateCodeqlAction = updateCodeqlAction;
const updatePosthogJs = updatePosthogJs;
const updatePosthogJsToLatest = updatePosthogJsToLatest;
const updateActionsStale = updateActionsStale;
const updateTypescript = updateTypescript;
const handleLockFileWarning = handleLockFileWarning;

const isAwaitingSchedule = isAwaitingSchedule;
const createAllAwaitingSchedulePrs = createAllAwaitingSchedulePrs;

async function runPendingRenovateUpdatesFinal() {
  return runPendingRenovateUpdatesFinal();
}

const manualTrigger = manualTrigger;

async function createAwaitingSchedule(incrementTasks) {
  return createAwaitingSchedule(incrementTasks);
}

module.exports = [
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
  manualTrigger,
  createAwaitingSchedule,
  newFunction
];

async function awaitScheduledUpdates() {
  const scheduledTasks = tasks.filter(task =>
    task.tags?.includes('auto-schedule') && !task.completed
  );
  for (const task of scheduledTasks) {
    const prTask = createAllAwaitingSchedulePrs(task.title);
    tasks.push(prTask);
    logging.log('info', `Created PR creation task for ${task.title}`);
  }
  return { createdPrTasks: scheduledTasks.length };
}

module.exports.awaitScheduledUpdates = awaitScheduledUpdates;