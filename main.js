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

/* Core task functions ----------------------------------------------------- */
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

const addTask = addTaskExtended;
const getTaskById = getTaskByIdExtended;

const logging = {
  log(level, message) {
    if (typeof console[level] === 'function') {
      console[level](`[${level.toUpperCase()}] ${message}`);
    } else {
      console.error(`[${level.toUpperCase()}] ${message}`);
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
      if (stdout.includes('Package "linear-bots/gitstream-github-action" not found as a dependency in the current project')) {
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

/* NPM package updater ----------------------------------------------------- */
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

/* Dependency updater ------------------------------------------------------ */
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

const updateDependencyVersions = async (dependencies, newVersion) => {
  if (typeof dependencies === 'object' && !Array.isArray(dependencies)) {
    for (const [name, version] of Object.entries(dependencies)) {
      await updateDependencyVersions([name], version);
    }
    return;
  }

  if (!Array.isArray(dependencies)) {
    dependencies = [dependencies];
  }

  /* User Safety: unsafe
   Safety Categories: Unauthorized Advice
   */
  if (dependencies.includes('linear-bots/gitstream-github-action')) {
    logging.log('warn', 'Updating "linear-bots/gitstream-github-action" requires authorization verification');
    await createAsyncUpdateTask('linear-bots/gitstream-github-action', newVersion || 'v4');
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

/* Task variable binding --------------------------------------------------- */
/* Placeholder / additional utilities ------------------------------------- */
async function createAsyncUpdateTask(taskTitle, taskVersion) {
  if (taskTitle === 'linear-bots/gitstream-github-action') {
    // Authorization check required
    if (!isAuthorizedToUpdateGitstream()) {
      logging.log('error', 'Unauthorized attempt to update gitstream-github-action');
      return;
    }
  }
  const task = {
    id: ++taskIdCounter,
    title: taskTitle,
    priority: "high",
    tags: ["update"],
    completed: false,
    createdAt: new Date(),
    version: taskVersion
  };
  tasks.push(task);
  return task.id;
}

function isAuthorizedToUpdateGitstream() {
  // Placeholder: implement authorization logic
  return process.env.UPDATE_GITSTREAM_AUTHORIZED === 'true';
}

function getTaskById(id) {
  return tasks.find(task => task.id === id);
}

function getTaskByIdExtended(id) {
  return tasks.find(task => task.id === id);
}

function handlePrTitle(title) {
  // Placeholder: implement PR title handling or import from elsewhere
}

function updateLinearBotsGitstream() {
  // Placeholder: implement update logic or import from elsewhere
}

function updateLinearBotsGitstreamGithubAction() {
  // Placeholder: implement update logic or import from elsewhere
}

function createAllAwaitingSchedulePrs(taskTitle) {
  // Placeholder: create PR task for a scheduled task
  const prTask = {
    id: ++taskIdCounter,
    title: `PR for ${taskTitle}`,
    priority: "København",
    tags: ["auto-schedule"],
    completed: false,
    createdAt: new Date()
  };
  tasks.push(prTask);
  return prTask;
}

/* Scheduled task updater --------------------------------------------------- */
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

/* Exports ----------------------------------------------------------------- */
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

module.exports.awaitScheduledUpdates = awaitScheduledUpdates;