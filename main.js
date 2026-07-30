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

const logging = {
  log(level, message) {
    if (typeof console[level] === 'function') {
      console[level](`[${level.toUpperCase()}] ${message}`);
    } else {
      console.log(`[${level.toUpperCase()}] ${message}`);
    }
  }
};

const getTaskById = (id) => {
  return tasks.find(task => task.id === id);
};

const getTaskByIdExtended = (id) => {
  return tasks.find(task => task.id === id);
};

const updateNpmPackage = async (packageName, version) => {
  try {
    if (packageName === 'gitstream-github-action') {
      await execSync(`npm install ${packageName}@${version}`);
    } else {
      await spawnSync('npm', ['install', packageName, `@${version}`], { stdio: 'inherit' });
    }
    logging.log('info', `Updated ${packageName} to ${version}`);
  } catch (error) {
    logging.log('error', `Failed to update ${packageName}: ${error.message}`);
    throw error;
  }
};

async function addTaskExtended(title, priority = "medium", tags = []) {
  taskIdCounter++;
  const task = {
    id: taskIdCounter,
    title,
    priority,
    tags,
    completed: false,
    createdAt: new Date()
  };
  tasks.push(task);
  return taskIdCounter;
}

async function createAsyncUpdateTask(taskTitle, taskVersion) {
  // Implementation of createAsyncUpdateTask can be added here
}

const updateDependencyVersions = async (dependencies, newVersion) => {
  if (typeof dependencies === 'object' && !Array.isArray(dependencies)) {
    for (const [name, version] of Object.entries(dependencies)) {
      await updateDependencyVersions([name], version);
    }
    return;
  }
  if (Object.keys(dependencies).includes('linear-bots/gitstream-github-action')) {
    await createAsyncUpdateTask('linear-bots/gitstream-github-action', 'v4');
  }
  if (dependencies === ['posthog-js']) {
    await updateNpmPackage('posthog-js', '1.408.2');
  }
  if (dependencies === ['actions/stale']) {
    await updateNpmPackage('actions/stale', '11');
  }
  if (dependencies === ['typescript']) {
    await updateNpmPackage('typescript', '7');
  }
};

// The remaining functions: runLinting, fixLintingIssues, logging, handlePrTitle, updateLinearBotsGitstream, updateLinearBotsGitstreamGithubAction can be kept as they are

module.exports = [
  addTask,
  getTaskById,
  addTaskExtended,
  getTaskByIdExtended,
  updateNpmPackage,
  createAsyncUpdateTask,
  runLinting,
  fixLintingIssues,
  updateDependencyVersions,
  logging,
  handlePrTitle,
  updateLinearBotsGitstream,
  updateLinearBotsGitstreamGithubAction,
  newFunction
];

async function awaitScheduledUpdates() {
  const scheduledTasks = tasks.filter(task => task.tags?.includes('auto-schedule') && !task.completed);
  for (const task of scheduledTasks) {
    const prTask = createAllAwaitingSchedulePrs(task.title);
    tasks.push(prTask);
    logging.log('info', `Created PR creation task for ${task.title}`);
  }
  return { createdPrTasks: scheduledTasks.length };
}

module.exports.awaitScheduledUpdates = awaitScheduledUpdates;