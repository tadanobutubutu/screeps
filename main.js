// User Safety: unsafe
// Safety Categories: Unauthorized Advice
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
      console.error(`[${level.toUpperCase()}] ${message}`);
    }
  }
};

function handleParsingError(code) {
  const regex = /:(.*):\d+:\d+: Unexpected token (.*)/;
  const match = code.match(regex);
  if (match) {
    logging.log('error', `Parsing error at line ${match[2]}: Unexpected token ${match[3]}`);
    return { error: `Parsing error at line ${match[2]}: Unexpected token ${match[3]}` };
  }
  return null;
}

async function checkAndFixMemoryVisualizer() {
  const memoryVisualizerPath = path.join(__dirname, './memory.visualizer.js');
  const memoryVisualizerCode = fs.readFileSync(memoryVisualizerPath, { encoding: 'utf8' });
  const result = handleParsingError(memoryVisualizerCode);
  if (result) {
    logging.log('error', `Error found in memory.visualizer.js: ${result.error}`);
    return { success: false, error: result.error };
  }
  fs.writeFileSync(memoryVisualizerPath, memoryVisualizerCode.replace(/\.visualizer/g, 'Visualizer'), { encoding: 'utf8' });
  logging.log('info', 'Memory visualizer file fixed');
  return { success: true };
}

const addTaskExtended = (title, priority = 'medium', tags = []) => {
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

const addTask = addTaskExtended;
const getTaskById = getTaskByIdExtended;

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
    const dependency = parsedPackageJson.dependencies['linear-bots/gitstream-github-action'];
    const matchFound = dependency.match(/^(\d+\.\d+\.\d+)$/);
    if (matchFound) {
      parsedPackageJson.dependencies['linear-bots/gitstream-github-action'] = `${matchFound[1].split('.')[0]}.${matchFound[1].split('.')[1]}.${Number(matchFound[1].split('.')[2]) + 1}`;
      updated = true;
    } else {
      parsedPackageJson.dependencies['linear-bots/gitstream-github-action'] = 'v4';
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

const updateLinearBotsGitstream = updateLinearBotsGitstreamGithubAction;

const updateDependencyVersions = async (dependencies, newVersion) => {
  if (typeof dependencies === 'object' && !Array.isArray(dependencies)) {
    for (const [name, version] of Object.entries(dependencies)) {
      await updateDependencyVersions([name], version);
    }
    return;
  }

  if (dependencies.includes('linear-bots/gitstream-github-action')) {
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

const handlePrTitle = async (params) => {};

module.exports = [
  addTask,
  getTaskById,
  addTaskExtended,
  getTaskByIdExtended,
  updateNpmPackage,
  createAsyncUpdateTask,
  runLinting,
  fixLintingIssues,
  checkAndFixMemoryVisualizer,
  logging,
  handleParsingError,
  updateDependencyVersions,
  updateLinearBotsGitstream,
  updateLinearBotsGitstreamGithubAction,
  handlePrTitle,
  newFunction
];

module.exports.awaitScheduledUpdates = awaitScheduledUpdates;

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

isLintingRunning = false;