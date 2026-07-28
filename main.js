"use strict";
import { execSync, spawnSync } from 'child_process';
import fs from 'fs';

let isLintingRunning = false;

const runLinting = () => {
  if (isLintingRunning) return;
  isLintingRunning = true;
  try {
    execSync('npx eslint --fix .', { stdio: 'inherit' });
  } catch (error) {
    console.error('Linting failed:', error.message);
  } finally {
    isLintingRunning = false;
  }
};

const willRecreateBlockedUpdate = (pr) => {
  if (!pr || typeof pr !== 'object') return false;
  const title = pr.data?.title ?? pr.title;
  if (typeof title !== 'string') return false;

  // Check for Pavouk PR (existing)
  const hasPavouk = /Pavouk/i.test(title);
  if (hasPavouk) return true;

  // Check PR body for Renovate comment indicating a blocked PR
  const body = pr.data?.body ?? pr.body ?? '';
  const blockedComment = /<!--\s*recreate-branch=renovate/i;
  if (blockedComment.test(body)) return true;

  // Existing number match logic
  const numberMatch = /\b(\d+)\b/.exec(title);
  const blockedPrNumber = numberMatch ? numberMatch[1] : null;
  const matchesPrNumber = blockedPrNumber && parseInt(blockedPrNumber, 10) === pr.number;
  return matchesPrNumber;
};

const checkPavoukPr = willRecreateBlockedUpdate;

const logging = {
  log: (level, message) => {
    if (level === 'FAILSAFE') {
      console[level](`FailSafe: ${message}`);
    } else {
      console[level](`${level}: ${message}`);
    }
  },
};

let taskIdCounter = 1;
const tasks = new Map();

const addTask = (description, priority = 'medium', tags = []) => {
  const id = taskIdCounter++;
  const task = { id, description, priority, tags, completed: false, createdAt: new Date() };
  tasks.set(id, task);
  return id;
};

const getTaskById = (id) => tasks.get(id);

const npmUpdate = async (packageName, version = 'latest') => {
  try {
    execSync(`npm install ${packageName}@${version}`, { stdio: 'inherit' });
    logging.log('info', `Updated ${packageName} to ${version}`);
  } catch (error) {
    logging.log('error', `Failed to update ${packageName}: ${error.message}`);
    throw error;
  }
};

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

// Additional functions from conflicted branches
// ... (you can fill in these functions if necessary)

module.exports = {
  logging,
  addTask,
  getTaskById,
  npmUpdate,
  updateDependencyVersions,
  createAsyncUpdateTask,
};

module.exports.real = {
  ...module.exports,
};