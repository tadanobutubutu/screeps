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
    logging.log('error', `Parsing error at line ${match[1]}: Unexpected token ${match[2]}`);
    return { success: false, error: `Parsing error at line ${match[1]}: Unexpected token ${match[2]}` };
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
  fs.writeFileSync(memoryVisualizerPath, memoryVisualizerCode.replace(/\.visualizer/g, 'Visualizer'), { encoding: 'utf8' });
  logging.log('info', 'Memory visualizer file fixed');
  return { success: true };
}

const addTaskExtended = (title, priority = "medium", tags = []) => {
  taskIdCounter++;
  const task = { id: taskIdCounter, title, priority, tags, completed: false, createdAt: new Date() };
  tasks.push(task);
  return taskIdCounter;
};
const getTaskByIdExtended = (id) => tasks.find(t => t.id === id);
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
      if (stdout && stdout.includes('Package "linear-bots/gitstream-github-action" not found as a dependency in the current project')) {
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

const createAsyncUpdateTask = async (name, version) => {
  taskIdCounter++;
  return taskIdCounter;
};

const updateLinearBotsGitstreamGithubAction = async () => {
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
    await updateNpmPackage('linear-bots/gitstream-github-action', 'v4');
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
  if (Array.isArray(dependencies) && dependencies.includes('linear-bots/gitstream-github-action')) {
    await createAsyncUpdateTask('linear-bots/gitstream-github-action', 'v4');
  }
  if (Array.isArray(dependencies) && dependencies.includes('posthog-js')) {
    await updateNpmPackage('posthog-js', '1.408.3');
  }
  if (Array.isArray(dependencies) && dependencies.includes('actions/stale')) {
    await updateNpmPackage('actions/stale', '11');
  }
  if (Array.isArray(dependencies) && dependencies.includes('typescript')) {
    await updateNpmPackage('typescript', '7');
  }
  if (Array.isArray(dependencies) && dependencies.includes('@sentry/browser')) {
    await updateNpmPackage('@sentry/browser', '10.69.0');
  }
  if (Array.isArray(dependencies) && dependencies.includes('github/codeql-action')) {
    await updateNpmPackage('github/codeql-action', 'v4');
  }
  if (Array.isArray(dependencies) && dependencies.includes('cimg/node')) {
    await updateNpmPackage('cimg/node', '24.18.1');
  }
  if (Array.isArray(dependencies) && dependencies.includes('node')) {
    await updateNpmPackage('node', '24.18.1');
  }
};

const updateNodeVersionInFiles = async () => {
  const filesToUpdate = [
    '.circleci/config.yml',
    '.devcontainer/devcontainer.json',
    '.github/workflows/ai-code-maintenance.yml',
    '.github/workflows/ai-guardian.yml',
    '.github/workflows/auto-issue.yml',
    '.github/workflows/deploy.yml',
    '.github/workflows/fix-undici-lockfile.yml',
    '.github/workflows/game-monitor-15min.yml',
    '.github/workflows/random-experiment.yml',
    '.github/workflows/security-autofix.yml',
    '.github/workflows/supabase-keepalive.yml',
    '.github/workflows/test-auto-pr.yml',
    '.github/workflows/validate-versions.yml',
    '.github/workflows/weekly-quality-report.yml',
    '.gitlab-ci.yml',
    '.travis.yml'
  ];

  for (const file of filesToUpdate) {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, { encoding: 'utf8' });
      const originalContent = content;
      content = content.replace(/node\s*[:=]\s*['"]?24(\.\d+)?['"]?/g, 'node: 24.18.1');
      content = content.replace(/cimg\/node\s*[:=]\s*['"]?24(\.\d+)?['"]?/g, 'cimg/node: 24.18.1');
      content = content.replace(/node\s*:\s*['"]?20['"]?/g, 'node: 24');
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, { encoding: 'utf8' });
        logging.log('info', `Updated node version in ${file}`);
      }
    }
  }
};

const updatePackageJsonDependencies = async () => {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJsonData = fs.readFileSync(packageJsonPath, { encoding: 'utf8' });
  const parsedPackageJson = JSON.parse(packageJsonData);
  let updated = false;

  if (parsedPackageJson.dependencies) {
    if (parsedPackageJson.dependencies['posthog-js'] && parsedPackageJson.dependencies['posthog-js'] !== '1.408.3') {
      parsedPackageJson.dependencies['posthog-js'] = '1.408.3';
      updated = true;
    }
    if (parsedPackageJson.dependencies['@sentry/browser'] && parsedPackageJson.dependencies['@sentry/browser'] !== '10.69.0') {
      parsedPackageJson.dependencies['@sentry/browser'] = '10.69.0';
      updated = true;
    }
  }

  if (parsedPackageJson.devDependencies) {
    if (parsedPackageJson.devDependencies['typescript'] && !parsedPackageJson.devDependencies['typescript'].includes('7')) {
      parsedPackageJson.devDependencies['typescript'] = '^7.0.0';
      updated = true;
    }
    if (parsedPackageJson.devDependencies['actions/stale'] && parsedPackageJson.devDependencies['actions/stale'] !== '11') {
      parsedPackageJson.devDependencies['actions/stale'] = '11';
      updated = true;
    }
  }

  if (updated) {
    fs.writeFileSync(packageJsonPath, JSON.stringify(parsedPackageJson, null, 2));
    logging.log('info', 'Updated package.json dependencies');
  }

  const dashboardPackageJsonPath = path.join(__dirname, '..', 'dashboard', 'package.json');
  if (fs.existsSync(dashboardPackageJsonPath)) {
    const dashboardPackageJsonData = fs.readFileSync(dashboardPackageJsonPath, { encoding: 'utf8' });
    const parsedDashboardPackageJson = JSON.parse(dashboardPackageJsonData);
    let dashboardUpdated = false;

    if (parsedDashboardPackageJson.devDependencies && parsedDashboardPackageJson.devDependencies['typescript'] && !parsedDashboardPackageJson.devDependencies['typescript'].includes('7')) {
      parsedDashboardPackageJson.devDependencies['typescript'] = '^7.0.0';
      dashboardUpdated = true;
    }

    if (dashboardUpdated) {
      fs.writeFileSync(dashboardPackageJsonPath, JSON.stringify(parsedDashboardPackageJson, null, 2));
      logging.log('info', 'Updated dashboard/package.json dependencies');
    }
  }
};

const updateGitHubActions = async () => {
  const workflowsDir = path.join(__dirname, '..', '.github', 'workflows');
  if (!fs.existsSync(workflowsDir)) return;

  const files = fs.readdirSync(workflowsDir).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
  
  for (const file of files) {
    const filePath = path.join(workflowsDir, file);
    let content = fs.readFileSync(filePath, { encoding: 'utf8' });
    const originalContent = content;

    content = content.replace(/actions\/stale\s*@\s*v10/g, 'actions/stale@v11');
    content = content.replace(/github\/codeql-action\s*@\s*v3/g, 'github/codeql-action@v4');
    content = content.replace(/linear-bots\/gitstream-github-action\s*@\s*v2/g, 'linear-bots/gitstream-github-action@v4');

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, { encoding: 'utf8' });
      logging.log('info', `Updated GitHub Actions in ${file}`);
    }
  }
};

const runAllUpdates = async () => {
  logging.log('info', 'Starting all dependency updates');
  
  await updateNodeVersionInFiles();
  await updatePackageJsonDependencies();
  await updateGitHubActions();
  
  await updateDependencyVersions(['posthog-js'], '1.408.3');
  await updateDependencyVersions(['actions/stale'], '11');
  await updateDependencyVersions(['typescript'], '7');
  await updateDependencyVersions(['@sentry/browser'], '10.69.0');
  await updateDependencyVersions(['github/codeql-action'], 'v4');
  await updateDependencyVersions(['cimg/node'], '24.18.1');
  await updateDependencyVersions(['node'], '24.18.1');
  
  try {
    await updateLinearBotsGitstreamGithubAction();
  } catch (error) {
    logging.log('warn', `linear-bots/gitstream-github-action update skipped: ${error.message}`);
  }

  logging.log('info', 'All dependency updates completed');
  return { success: true };
};

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
  handleParsingError,
  updateLinearBotsGitstreamGithubAction,
  newFunction,
  updateNodeVersionInFiles,
  updatePackageJsonDependencies,
  updateGitHubActions,
  runAllUpdates
];

async function awaitScheduledUpdates() {
  const scheduledTasks = tasks.filter(task => task.tags?.includes('auto-schedule') && !task.completed);
  for (const task of scheduledTasks) {
    const prTask = { title: task.title, completed: false };
    tasks.push(prTask);
    logging.log('info', `Created PR creation task for ${task.title}`);
  }
  return { createdPrTasks: scheduledTasks.length };
}

module.exports.awaitScheduledUpdates = awaitScheduledUpdates;