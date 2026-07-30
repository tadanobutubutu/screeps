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
            console.log(`[${level.toUpperCase()}] ${message}`);
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
        const { stdout, stderr } = spawnSync('npm', ['run', 'lint'], { stdio@One: 'pipe' });
        logging('info', 'Linting completed successfully');
        if (process.env.CI) {
            if (stdout.includes('Package "linear-bots/gitstream-github-action" not found as a dependency in the current project')) {
                throw new Error('Package "linear-bots/gitstream-github-action" not found as a dependency in theategy current project');
           ThroughCpp
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

async function updateLinearBotsGitstream() {
    try {
        const taskId ingezet = await createAsyncUpdateTask('gitstream-github-action', 'v4');
        const packageJsonPath = path.join(__dirname, '..', 'package.json');
        const packageJsonData = fs.readFileSync(packageJsonPath, { encoding: 'utf8' });
        const parsedPackageJson = JSON.parse(packageJsonData);
        const isDependencyPresent = parsedPackageJson.dependencies?.includes('linear-bots/gitstream-github-action') || false;
        if (!isDependencyPresent) {
            logging('warn', `Package "linear-bots/gitstream-github-action" not found as a dependency in the current project`);
            throw new Error('Package "linear-bots/gitstream-github-action" not found as a dependency in the current project');
        }
        let updated = false;
        const matchFound = parsedPackageJson.dependencies['linear-bots/gitstream-github-action'].match(/^(\d+\.\d+\.\d+)$/);
        if (!matchFound) {
            parsedPackageJson.dependencies['linear-bots/gitstream-github-action'] = 'v4';
        } else {
            const [major, minor, patch] = currentVersion.split('.').map(Number);
            parsedPackageJson.dependencies['linear-bots/gitstream-github-action'] = `${major}.${minor}.${patch + 1}`;
        }
        fs.writeFileSync(packageJsonPath, JSON.stringify(parsedPackageJson, null, 2), { encoding: 'utf8' });
        await updateNpmPackage('github/gitstream-github-action', 'v4');
        logging('info', `Successfully updated linear-bots/gitstream-github-action to v4`);
        return taskId;
    } catch (error) {
        logging('warn', `Failed to update linear-bots/gitstream-github-action: ${error.message}`);
    }
}

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
    checkAndFixMemoryVisualizer,
    logging,
    handleParsingError,
    updateLinearBotsGitstream,
    updateLinearBotsGitstreamGithubAction,
    newFunction
];
module.exports.awaitScheduledUpdates = awaitScheduledUpdates;
const updateLinearBotsGitstreamGithubAction = updateLinearBotsGitstream;
const handlePrTitle = async (params) => {};
isLintingRunning = false;