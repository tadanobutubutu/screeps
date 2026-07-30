'use strict';
const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { memoryVisualizer } = require('./memory.visualizer.js');

// User Safety: unsafe
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

function handleParsingError(code) {
  const regex = /:(.*):\d+:\d+: Unexpected token (.*)/;
  const match = code.match(regex);
  if (match) {
    const line = match[2];
    const token = match[3];
    logging.log('error', `Parsing error at line ${line}: Unexpected token ${token}`);
    return { success: false, error: `Parsing error at line ${line}: Unexpected token ${token}` };
  }
  return { success: true };
}

async function checkAndFixMemoryVisualizer() {
  const memoryVisualizerPath = path.join(__dirname, './memory.visualizer.js');
  const memoryVisualizerCode = fs.readFileSync(memoryVisualizerPath, { encoding: 'utf8' });
  const result = handleParsingError(memoryVisualizerCode);
  if (!result.success) {
    logging.log('error', `Error found in memory.visualizer.js: ${result.error}`);
    return { success: false, error: result.error };
  }
  const fixedCode = memoryVisualizerCode.replace(/\.visualizer/g, 'Visualizer');
  fs.writeFileSync(memoryVisualizerPath, fixedCode, { encoding: 'utf8' });
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
      const notFound = stdout.includes('Package "linear-bots/gitstream-github-action" not found as a dependency in the current project') ||
                       stderr.includes('Package "linear-bots/gitstream-github-action" not found as a dependency in the current project');
      if (notFound) {
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
    const { stdout, stderr } = spawnSync('npm', ['install', packageName, `@${version}`], { stdio: 'pipe' });
    const success = stdout.includes('Successfully installed');
    if (!success) {
      logging.error(`Failed to install ${packageName}@${version}: ${stderr || stdout}`);
      throw new Error(`npm install ${packageName}@${version} failed`);
    }
    logging.log('info', `Updated ${packageName} to ${version}`);
    return { success };
  } catch (error) {
    logging.error(`Error updating ${packageName}: ${error.message}`);
    throw error;
  }
};

async function updateLinearBotsGitstream() {
  try {
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJsonData = fs.readFileSync(packageJsonPath, { encoding: 'utf8' });
    const parsed = JSON.parse(packageJsonData);
    const depName = 'linear-bots/gitstream-github-action';
    let newVersion = parsed.dependencies[depName];
    let updated = false;
    if (newVersion) {
      const semverMatch = newVersion.match(/^(\d+)\.(\d+)\.(\d+)$/);
      if (semverMatch) {
        const [ , major, minor, patch ] = semverMatch;
        newVersion = `${major}.${minor}.${Number(patch) + 1}`;
        updated = true;
      } else {
        newVersion = 'v4';
        updated = true;
      }
    } else {
      newVersion = 'v4';
      updated = true;
    }
    if (updated) {
      parsed.dependencies[depName] = newVersion;
      fs.writeFileSync(packageJsonPath, JSON.stringify(parsed, null, 2), { encoding: 'utf8' });
    }
    await updateNpmPackage(depName, newVersion);
    logging.info(`Successfully updated ${depName} to ${newVersion}`);
    return true;
  } catch (error) {
    logging.warn(`Failed to update ${depName}: ${error.message}`);
    return false;
  }
}

async function createAsyncUpdateTask(title, version) {
  // Dummy implementation for task creation
  taskIdCounter++;
  return taskIdCounter;
}

const updateLinearBotsGitstreamGithubAction = async () => {
  try {
    const taskId = await createAsyncUpdateTask('gitstream-github-action', 'v4');
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJsonData = fs.readFileSync(packageJsonPath, { encoding: 'utf8' });
    const parsed = JSON.parse(packageJsonData);
    const depName = 'linear-bots/gitstream-github-action';
    const isDependencyPresent = Object.keys(parsed.dependencies || {}).includes(depName);
    if (!isDependencyPresent) {
      logging.log('warn', `Package "${depName}" not found as a dependency in the current project`);
      throw new Error(`Package "${depName}" not found as a dependency in the current project`);
    }

    let updated = false;
    const dependency = parsed.dependencies[depName];
    const matchFound = dependency.match(/^(\d+)\.(\d+)\.(\d+)$/);
    if (matchFound) {
      const [ , major, minor, patch ] = matchFound;
      parsed.dependencies[depName] = `${major}.${minor}.${Number(patch) + 1}`;
      updated = true;
    } else {
      parsed.dependencies[depName] = 'v4';
      updated = true;
    }

    if (updated) {
      fs.writeFileSync(packageJsonPath, JSON.stringify(parsed, null, 2), { encoding: 'utf8' });
    }

    await updateNpmPackage('github/gitstream-github-action', 'v4');
    logging.log('info', `Successfully updated ${depName} to v4`);
    return taskId;
  } catch (error) {
    logging.log('warn', `Failed to update ${depName}: ${error.message}`);
  }
};

const updateLinearBotsGitstream = updateLinearBotsGitstreamGithubAction;

const updateDependencyVersions = async (dependencies, newVersion) => {
  if (typeof dependencies === 'object' && !Array.isArray(dependencies)) {
    for (const [name, version] of Object.entries(dependencies)) {
      await updateNpmPackage(name, version);
    }
    return;
  }

  const defaultMap = {
    'posthog-js': '1.408.2',
    'actions/stale': '11',
    'typescript': '7',
    'linear-bots/gitstream-github-action': 'v4'
  };
  for (const dep of dependencies) {
    const version = defaultMap[dep];
    if (version) {
      await updateNpmPackage(dep, version);
    }
  }
};

const handlePrTitle = async (params) => {};

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
  newFunction,
  awaitScheduledUpdates
];

module.exports.awaitScheduledUpdates = awaitScheduledUpdates;