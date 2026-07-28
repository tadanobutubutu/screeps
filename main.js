"use strict";
/* User Safety: unsafe
Safety Categories: Unauthorized Advice */

const { spawnSync } = require('child_process');

const willRecreateBlockedUpdate = (pr) => {
  if (!pr || typeof pr !== 'object') {
    return false;
  }
  const title = pr.data?.title ?? pr.title;
  if (typeof title !== 'string') {
    return false;
  }
  const hasPavouk = /Pavouk/i.test(title);
  const match = /\b(\d+)\b/.exec(title);
  const blockedPrNumber = match ? match[1] : null;
  const matchesPrNumber = blockedPrNumber && parseInt(blockedPrNumber) === pr.number;
  return hasPavouk || matchesPrNumber;
};

const logging = {
  log: (level, message) => {
    console[level](`${level}: ${message}`);
  },
};

let taskIdCounter = 0;
const tasks = [];

const addTask = (title, priority = 'medium', tags = []) => {
  taskIdCounter++;
  tasks.push({ id: taskIdCounter, title, priority, tags, completed: false });
  return taskIdCounter;
};

const getTaskById = (taskId) => {
  return tasks.find(task => task.id === taskId) || null;
};

const npmUpdate = async (_dependency, _newVersion) => {
  return Promise.resolve();
};

const updateDependencyVersions = async (dependency, newVersion) => {
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

const createAsyncUpdateTask = async (title, tags = []) => {
  try {
    const taskId = addTask(title, 'medium', tags);
    logging.log('info', `Created task: ${title}`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to create task: ${error.message}`);
    throw error;
  }
};

const isAwaitingSchedule = (dependency) => {
  const task = tasks.find(task => task.title.startsWith("update ") && task.title.includes(dependency));
  return task && !task.completed;
};

const updateNpmPackage = async ({ name, version }) => {
  try {
    const taskId = await createAsyncUpdateTask(`update ${name} to ${version}`);
    await updateDependencyVersions(name, version);
    logging.log('info', `Successfully updated ${name} to ${version}`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update ${name}: ${error.message}`);
    throw error;
  }
};

const updateGitstreamGithubAction = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update gitstream-github-action to v4');
    await updateNpmPackage({ name: 'gitstream-github-action', version: 'v4' });
    logging.log('info', `Successfully updated gitstream-github-action to v4`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update gitstream-github-action: ${error.message}`);
    throw error;
  }
};

const updateActionsLabeler = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update actions/labeler action to v7');
    await updateNpmPackage({ name: 'actions/labeler', version: 'v7' });
    logging.log('info', `Successfully updated actions/labeler to v7`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update actions/labeler: ${error.message}`);
    throw error;
  }
};

const updateLinearBotsGitstream = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update linear-bots/gitstream to latest');
    await updateNpmPackage({ name: 'linear-bots/gitstream', version: 'latest' });
    logging.log('info', `Successfully updated linear-bots/gitstream to latest`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update linear-bots/gitstream: ${error.message}`);
    throw error;
  }
};

const updateLinearBotsGitstreamGithubAction = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update linear-bots/gitstream-github-action to latest');
    await updateNpmPackage({ name: 'linear-bots/gitstream-github-action', version: 'latest' });
    logging.log('info', `Successfully updated linear-bots/gitstream-github-action to latest`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update linear-bots/gitstream-github-action: ${error.message}`);
    throw error;
  }
};

const updateCodeqlAction = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update codeql action to v4');
    await updateNpmPackage({ name: 'codeql-action', version: 'v4' });
    logging.log('info', `Successfully updated codeql action to v4`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update codeql action: ${error.message}`);
    throw error;
  }
};

const updatePosthogJsToLatest = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update posthog-js to v1.407.3');
    await updateNpmPackage({ name: 'posthog-js', version: 'v1.407.3' });
    logging.log('info', `Successfully updated posthog-js to v1.407.3`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update posthog-js: ${error.message}`);
    throw error;
  }
};

const handleLockFileWarning = async () => {
  try {
    const taskId = await createAsyncUpdateTask('Consolidate multiple npm lock files');
    logging.log('warn', 'Multiple npm lock files detected. Consider consolidating to a single lock file.');
    logging.log('info', 'Lock file consolidation task created');
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to handle lock file warning: ${error.message}`);
    throw error;
  }
};

const updateStaleAction = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update actions/stale to v10');
    await updateNpmPackage({ name: 'actions/stale', version: 'v10' });
    logging.log('info', `Successfully updated actions/stale to v10`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update actions/stale: ${error.message}`);
    throw error;
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

module.exports = {
  logging,
  addTask,
  getTaskById,
  npmUpdate,
  updateDependencyVersions,
  updateNpmPackage,
  createAsyncUpdateTask,
  updateGitstreamGithubAction,
  updateActionsLabeler,
  updateLinearBotsGitstream,
  updateLinearBotsGitstreamGithubAction,
  updateCodeqlAction,
  updatePosthogJsToLatest,
  handleLockFileWarning,
  updateStaleAction,
  isAwaitingSchedule,
  willRecreateBlockedUpdate,
  fixLintingIssues,
};