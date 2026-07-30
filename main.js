`use strict`;
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

const addTaskExtended = (title, priority = "medium", tags = []) => {
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
};

const getTaskByIdExtended = (taskId) => tasks.find(t => t.id === taskId) || null;

const updateNpmPackage = async (packageName, version) => {
  try {
    if (packageName === 'github/gitstream-github-action') {
      await spawnSync('npm', ['install', packageName, `@${version}`], { stdio: 'inherit' });
    } else if (packageName === 'gitstream-github-action') {
      await updateDependencyVersions({ gitstreamGithubAction: version });
    } else {
      await spawnSync('npm', ['install', packageName, `@${version}`], { stdio: 'inherit' });
    }
    logging.log('info', `Updated ${packageName} to ${version}`);
  } catch (error) {
    logging.log('error', `Failed to update ${packageName}: ${error.message}`);
    throw error;
  }
};

const createAsyncUpdateTask = (packageName, version) => {
  return addTaskExtended(`Update ${packageName} to ${version}`, 'high', ['dependency-update']);
};

const updateDependencyVersions = async (dependencies) => {
  if (typeof dependencies === 'object' && !Array.isArray(dependencies)) {
    for (const [name, version] of Object.entries(dependencies)) {
      await updateDependencyVersions(name, version);
    }
    return;
  }
  const taskTitle = `Update dependency${dependencies.length > 1 ? 's' : ''} to ${dependencies.gitstreamGithubAction || dependencies.version}`;
  try {
    if (dependencies.gitstreamGithubAction) {
      await updateNpmPackage(dependencies.gitstreamGithubAction, dependencies.version);
    } else {
      for (const dependency of dependencies) {
        await updateNpmPackage(dependency.name, dependency.version);
      }
    }
    logging.log('info', `Successfully updated dependencies${dependencies.length > 1 ? 's' : ''} to ${dependencies.gitstreamGithubAction || dependencies.version}`);
    Array.from(tasks.values()).filter(task => task.title.includes(taskTitle)).forEach(task => {
      task.completed = true;
    });
  } catch (error) {
    logging.log('error', `Failed to update dependencies: ${error.message}`);
    throw error;
  }
};

// ... Rest of the code
module.exports = {
  // ... Exported functions
};