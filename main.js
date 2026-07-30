Here is the resolved file content:

```javascript
'use strict';
const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { memoryVisualizer } = require('./memory.visualizer.js');
let isLintingRunning = false;
let taskIdCounter = 0;
const tasks = [];

const logging = {
    log(level, message) {
        if (typeof console[level] === 'function') {
            console[level](`[${level.toUpperCase()}] ${message}`);
        } else {
            console.log(`[${level.toUpperCase()}] ${message}`);
        }
    }
};

function newFunction() {
    return { hello: 'world' };
}

function handleParsingError(code) {
    const regex = /:(.*):\d+:\d+: Unexpected token (.*)/;
    const match = code.match(regex);
    if (match) {
        logging.log('error', `Parsing error at line ${match[2]}: Unexpected token ${match[3]}`);
        return { error: `Parsing error at line ${match[2]}: Unexpected token ${match[3]}` };
    }
    return { error: 'Unknown parsing error' };
}

async function checkAndFixMemoryVisualizer() {
    const memoryVisualizerPath = path.join(__dirname, './memory.visualizer.js');
    const memoryVisualizerCode = fs.readFileSync(memoryVisualizerPath, { encoding: 'utf8' });
    const result = handleParsingError(memoryVisualizerCode);
    if (!result.success) {
        logging.log('error', `Error found in memory.visualizer.js: ${result.error}`);
        return { success: false, error: result.error };
    }
    fs.writeFileSync(memoryVisualizerPath, memoryVisualizerCode.replace(/\.visualizer/g, 'Visualizer'), { encoding: 'utf8' });
    logging.log('info', 'Memory visualizer file fixed');
    return { success: true };
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

const getTaskByIdExtended = (id) => {
  return tasks.find(task => task.id === id);
};

async function runLinting() {
    if (isLintingRunning) {
        logging('warn', 'Linting is already running');
        return { success: false, reason: 'already_running' };
    }
    isLintingRunning = true;
    logging('info', 'Starting linting process');
    try {
        const { stdout, stderr } = spawnSync('npm', ['run', 'lint'], { stdio: 'pipe' });
        logging('info', 'Linting completed successfully');
        if (process.env.CI) {
            if (stdout.includes('Package "linear-bots/gitstream-github-action" not found as a dependency in the current project')) {
                throw new Error('Package "linear-bots/gitstream-github-action" not found as a dependency in the current project');
            }
        }
        isLintingRunning = false;
        return { success: true };
    } catch (error) {
        logging('error', `Linting failed: ${error.message}`);
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

async function updateLinearBotsGitstream() {
    try {
        const taskId = await createAsyncUpdateTask('gitstream-github-action', 'v4');
        const packageJsonPath = path.join(__dirname, '..', 'package.json');
        const packageJsonData = fs.readFileSync(packageJsonPath, { encoding: 'utf8' });
        const parsedPackageJson = JSON.parse(packageJsonData);
        const isDependencyPresent = Object.keys(parsedPackageJson.dependencies || {}).includes('linear-bots/gitstream-github-action');
        if (!isDependencyPresent) {
            logging.log('warn', 'Package "linear-bots/gitstream-github-action" not found as a dependency in the current project');
            throw new Error('Package "linear-bots/gitstream-github-action" not found as a dependency in the current project');
        }
        let updated = false;
        const matchFound = parsedPackageJson.dependencies['linear-bots/gitstream-github-action'].match(/^(\d+\.\d+\.\d+)$/);
        if (!matchFound) {
            parsedPackageJson.dependencies['linear-bots/gitstream-github-action'] = 'v4';
            updated = true;
        } else {
            const [major, minor, patch] = matchFound[1].split('.').map(Number);
            parsedPackageJson.dependencies['linear-bots/gitstream-github-action'] = `${major}.${minor}.${patch + 1}`;
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

// ... remaining code (getTaskById, createAsyncUpdateTask, ... )
```

This resolved file integrates both changes by keeping the task management function refactor, the `runLinting`, `fixLintingIssues`, and `updateLinearBotsGitstream` functions, and the `updateDependencyVersions` function from one branch. It also includes the `checkAndFixMemoryVisualizer` function and the new `newFunction` from the other branch. The style and formatting are preserved as much as possible.