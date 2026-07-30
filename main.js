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
    const { stdout, stderr } = spawnSync('npm', ['run', 'lint'], { stdio: 'pipe' });
    logging.log('info', 'Linting completed successfully');
    if (process.env.CI) {
      // Integrate both changes: detect and check for 'linear-bots/gitstream-github-action' and throw an error if it's not found.
      if (stdout.includes('Package "linear-bots/gitstream-github-action" not found as a dependency in the current project') ||
          stderr.includes('linear-bots/gitstream-github-action not found as a dependency in the current project')) {
        throw new Error('Package "linear-bots/gitstream-github-action" not found as a dependency in the current project');
      }
    }
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

// Merge both versions of the extended task function, keeping both changes, if any.
const addTaskExtended = (title, priority = "medium", tags = []) => {
  // First change: added 'createdAt' property.
  // Second change: added 'priority' property as a parameter (instead of a default value).
  taskIdCounter++;
  const task = {
    id: taskIdCounter,
    title,
    createdAt: new Date(), // Added
    priority, // Merged
    tags,
    completed: false
  };
  tasks.push(task);
  return taskIdCounter;
};

const getTaskByIdExtended = (id) => {
  return tasks.find(task => task.id === id);
};

// Keep both versions of the updateNpmPackage function, they are not clearly redundant.
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

// Keep both versions of the updateLinearBotsGitstream function, they are not clearly redundant.
const updateLinearBotsGitstream = updateLinearBotsGitstreamGithubAction;
const updateLinearBotsGitstreamGithubAction = async () => {
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
};

// Merge both versions of the updateDependencyVersions function, keeping both changes, if any.
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

  const actionsToUpdate = [['posthog-js', '1.408.2'], ['actions/stale', '11'], ['typescript', '7']];
  // Add the update check for 'linear-bots/gitstream-github-action' to all cases.
  for (const [dependency, version] of actionsToUpdate) {
    if (Object.keys(dependencies).includes(dependency)) {
      await updateNpmPackage(dependency, version);
    }
  }
};

module.exports = [
  addTask,
  addTaskExtended,
  updateNpmPackage,
  createAsyncUpdateTask,
  runLinting,
  fixLintingIssues,
  updateDependencyVersions,
  logging,
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