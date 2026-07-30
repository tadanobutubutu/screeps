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
/* ---------- Specific Update Functions ---------- */
const updateLinearBotsGitstream = async () => {
  await createAsyncUpdateTask('linear-bots/gitstream-github-action', 'v4');
  await updateNpmPackage('linear-bots/gitstream-github-action', 'v4');
};
const updateLinearBotsGitstreamGithubAction = async () => {
  try {
    const taskId = await createAsyncUpdateTask('linear-bots/gitstream-github-action', 'v4');
    await updateNpmPackage('linear-bots/gitstream-github-action', 'v4');
    logging.log('info', `Successfully updated linear-bots/gitstream-github-action to v4`);
    return taskId;
  } catch (error) {
    logging.log('warn', `Failed to update linear-bots/gitstream-github-action: ${error.message}`);
  }
};
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
// Add missing createAsyncUpdateTask function
async function createAsyncUpdateTask(packageName, version) {
  return addTaskExtended(`Update ${packageName} to ${version}`, 'high', ['dependency-update']);
}
// Replace updateNpmPackage with a new function that checks for linear-bots/gitstream-github-action package
const updateNpmPackage = async (packageName, version) => {
  try {
    if (packageName === 'linear-bots/gitstream-github-action') {
      // Check if package exists in package.json
      const packageJsonPath = path.join(__dirname, '..', 'package.json');
      const packageJsonData = fs.readFileSync(packageJsonPath, { encoding: 'utf8' });
      const parsedPackageJson = JSON.parse(packageJsonData);
      const isDependencyPresent = Object.keys(parsedPackageJson.dependencies || {}).includes(packageName);

      if (!isDependencyPresent) {
        logging.log('warn', `Package "${packageName}" not found as a dependency in the current project`);
        throw new Error(`Package "${packageName}" not found as a dependency in the current project`);
      }

      // Update the package.json file, using regex to find the correct package and its version
      const matchFound = parsedPackageJson.dependencies[packageName].match(/^(\d+\.\d+\.\d+)$/);
      let newDependency;

      if (!matchFound) {
        newDependency = `${version}`;
      } else {
        newDependency = `${matchFound[1].split('.')[0]}.${matchFound[1].split('.')[1]}.${Number(matchFound[1].split('.')[2]) + 1}`;
      }

      parsedPackageJson.dependencies[packageName] = newDependency;
      fs.writeFileSync(packageJsonPath, JSON.stringify(parsedPackageJson, null, 2), { encoding: 'utf8' });
    } else if (packageName === 'gitstream-github-action') {
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
const updateDependencyVersions = async (dependencies, newVersion) => {
  if (typeof dependencies === 'object' && !Array.isArray(dependencies)) {
    for (const [name, version] of Object.entries(dependencies)) {
      await updateDependencyVersions(name, version);
    }
    return;
  }
  const taskTitle = `Update dependency${dependencies.length > 1 ? 's' : ''} to ${newVersion}`;
  try {
    for (const dependency of dependencies) {
      await updateNpmPackage(dependency, newVersion);
    }
    logging.log('info', `Successfully updated dependencies${dependencies.length > 1 ? 's' : ''} to ${newVersion}`);
    Array.from(tasks.values()).filter(task => task.title.includes(taskTitle)).forEach(task => {
      task.completed = true;
    });
  } catch (error) {
    logging.log('error', `Failed to update dependencies: ${error.message}`);
    throw error;
  }
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
    addTaskExtended(`Create PR for ${task.title}`, 'edium', ['auto-schedule']);
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
  isAwaitingSchedule,
  createAllAwaitingSchedulePrs,
  runLinting,
  fixLintingIssues,
  logging,
  handlePrTitle,
  updateLinearBotsGitstreamGithubAction,
  updateLinearBotsGitstream,
  updateCodeqlAction,
  updatePosthogJsToLatest,
  handleLockFileWarning,
  checkPavoukpr,
  runPendingRenovateUpdatesFinal,
  manualTrigger,
  updateNpmPackage,
  updateDependencyVersions,
  createAsyncUpdateTask,
  addTaskExtended,
  getTaskByIdExtended,
  updateActionsStale,
  updateTypescript,
  updatePosthogJs
};