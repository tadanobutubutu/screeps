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

async function updateLinearBotsGitstream() {
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

    const currentVersion = parsedPackageJson.dependencies['linear-bots/gitstream-github-action'];
    const matchFound = currentVersion.match(/^(\d+\.\d+\.\d+)$/);
    if (!matchFound) {
      parsedPackageJson.dependencies['linear-bots/gitstream-github-action'] = 'v4';
    } else {
      const [major, minor, patch] = currentVersion.split('.').map(Number);
      parsedPackageJson.dependencies['linear-bots/gitstream-github-action'] = `${major}.${minor}.${patch + 1}`;
    }

    // write updated JSON back to file
    fs.writeFileSync(packageJsonPath, JSON.stringify(parsedPackageJson, null, 2), { encoding: 'utf8' });

    // install the package
    await updateNpmPackage('github/gitstream-github-action', 'v4');

    logging.log('info', `Successfully updated linear-bots/gitstream-github-action to v4`);
    return taskId;
  } catch (error) {
    logging.log('warn', `Failed to update linear-bots/gitstream-github-action: ${error.message}`);
  }
}

// Alias
updateLinearBotsGitstreamGithubAction = updateLinearBotsGitstream;

// updateNpmPackage helper
async function updateNpmPackage(packageName, version) {
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
}

// updateDependencyVersions (simplified)
async function updateDependencyVersions(dependencies) {
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
}

// module exports
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
```

This resolved file keeps the changes from both branches that didn't conflict with each other. It integrates the changes related to npm package updates, function names, and some style changes while discarding the conflicting function definition for `updateLinearBotsGitstream` and the `getTaskById` and `getTaskByIdExtended` functions. The renamed function `updateLinearBotsGitstreamGithubAction` is preserved.