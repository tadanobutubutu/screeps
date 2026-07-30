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

function logging(level, message) {  
  if (typeof console[level] === 'function') {  
    console[level](`[${level.toUpperCase()}] ${message}`);  
  } else {  
    console.log(`[${level.toUpperCase()}] ${message}`);  
  }  
}  

const addTask = addTaskExtended;  
const getTaskById = getTaskByIdExtended;  

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
  logging('info', 'Attempting to fix linting issues');  
  try {  
    await spawnSync('npm', ['run', 'lint:fix'], { stdio: 'inherit' });  
    logging('info', 'Linting fixes applied');  
    return { success: true };  
  } catch (error) {  
    logging('error', `Failed to fix linting issues: ${error.message}`);  
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

const getTaskByIdExtended = (id) => {  
  return tasks.find(task => task.id === id);  
};  

const updateNpmPackage = async (packageName, version) => {  
  try {  
    if (packageName === 'gitstream-github-action') {  
      await execSync(`npm install ${packageName}@${version}`);  
    } else {  
      await spawnSync('npm', ['install', packageName, `@${version}`], { stdio: 'inherit' });  
    }  
    logging('info', `Updated ${packageName} to ${version}`);  
  } catch (error) {  
    logging('error', `Failed to update ${packageName}: ${error.message}`);  
    throw error;  
  }  
};  

const updateLinearBotsGitstream = async () => {  
  try {  
    const taskId = await createAsyncUpdateTask('gitstream-github-action', 'v4');  
    const packageJsonPath = path.join(__dirname, '..', 'package.json');  
    const packageJsonData = fs.readFileSync(packageJsonPath, { encoding: 'utf8' });  
    const parsedPackageJson = JSON.parse(packageJsonData);  
    const isDependencyPresent = Object.keys(parsedPackageJson.dependencies || {}).includes('linear-bots/gitstream-github-action');  
    if (isDependencyPresent) {  
      const matchFound = parsedPackageJson.dependencies['linear-bots/gitstream-github-action'].match(/^(\d+\.\d+\.\d+)$/);  
      if (matchFound === undefined || matchFound === null) {  
        parsedPackageJson.dependencies['linear-bots/gitstream-github-action'] = 'v4';  
        const updated = true;  
        fs.writeFileSync(packageJsonPath, JSON.stringify(parsedPackageJson, null, 2), { encoding: 'utf8' });  
      } else {  
        parsedPackageJson.dependencies['linear-bots/gitstream-github-action'] = `${matchFound[1].split('.')[0]}.${matchFound[1].split('.')[1]}.${Number(matchFound[1].split('.')[2]) + 1}`;  
      }  
      await updateNpmPackage('github/gitstream-github-action', 'v4');  
      logging('info', `Successfully updated linear-bots/gitstream-github-action to v4`);  
      return taskId;  
    } else {  
      logging('warn', `Package "linear-bots/gitstream-github-action" not found as a dependency in the current project`);  
      throw new Error('Package "linear-bots/gitstream-github-action" not found as a dependency in the current project');  
    }  
  } catch (error) {  
    logging('warn', `Failed to update linear-bots/gitstream-github-action: ${error.message}`);  
  }  
};  

const updateDependencyVersions = async (dependencies, newVersion) => {  
  if (typeof dependencies === 'object' && !Array.isArray(dependencies)) {  
    for (const [name, version] of Object.entries(dependencies)) {  
      await updateDependencyVersions([name], version);  
    }  
    return;  
  }  
  if (dependencies === ['linear-bots/gitstream-github-action']) {  
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

updateLinearBotsGitstreamGithubAction = updateLinearBotsGitstream;  

async function awaitScheduledUpdates() {  
  const scheduledTasks = tasks.filter(task => task.tags?.includes('auto-schedule') && !task.completed);  
  for (const task of scheduledTasks) {  
    const prTask = createAllAwaitingSchedulePrs(task.title);  
    tasks.push(prTask);  
    logging('info', `Created PR creation task for ${task.title}`);  
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
  updateDependencyVersions,  
  logging,  
  handlePrTitle,  
  updateLinearBotsGitstream,  
  updateLinearBotsGitstreamGithubAction,  
  newFunction  
];  

module.exports.awaitScheduledUpdates = awaitScheduledUpdates;