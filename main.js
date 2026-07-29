"use strict";
const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

let isLintingRunning = false;
let taskIdCounter = 0;
const tasks = new Map();
const stargazerData = new Map();

/* ---------- Linting ---------- */
const runLinting = () => {
	if (isLintingRunning) return;
	isLintingRunning = true;
	try {
		execSync('npx eslint --fix', { stdio: 'inherit' });
	} catch (error) {
		console.error('Linting failed:', error.message);
	} finally {
		isLintingRunning = false;
	}
};

const fixLintingIssues = () => {
	try {
		const result = spawnSync('npx', ['eslint', '--fix', './tests/**/*.js', './src/managers/roomManager.js', './main.js'], { stdio: 'inherit' });
		if (result.status === 0) {
			logging.log('info', 'ESLint fix completed successfully.');
		} else {
			logging.log('error', 'ESLint fix failed.');
		}
	} catch (error) {
		logging.log('error', `Failed to run ESLint fix: ${error.message}`);
	}
};

/* ---------- Logging ---------- */
const logging = {
	log: (level, message) => {
		if (level === 'FAILSAFE') {
			// no-op
		} else {
			const method = level.toUpperCase();
			const prefix = `[${method}]`;
			const consoleMethod = method in console ? console[method] : console.log;
			consoleMethod(`${prefix} ${message}`);
		}
	}
};

/* ---------- Git Updates ---------- */
const updateTypeScript = async () => { await npmUpdate('typescript', '^7.0.2'); };
const handleLockFileWarning = async () => {
	try {
		const taskId = await createAsyncUpdateTask('Consolidate multiple npm lock files');
		logging.log('warn', 'Multiple lock files detected. Consider consolidating to a single lock file.');
		logging.log('info', 'Lock file consolidation task created');
		return taskId;
	} catch (error) {
		logging.log('error', `Failed to handle lock file warning: ${error.message}`);
		throw error;
	}
};
const updateStaleAction = async () => {
	try {
		const taskId = await createAsyncUpdateTask('update actions/stale to v11');
		await npmUpdate('actions/stale', 'v11');
		logging.log('info', `Successfully updated actions/stale to v11`);
		return taskId;
	} catch (error) {
		logging.log('error', `Failed to update actions/stale: ${error.message}`);
		throw error;
	}
};
const runPendingRenovateUpdates = async () => {
	try {
		await execSync('renovate run --signoff');
	} catch (error) {
		logging.log('error', `Failed to run renovate updates: ${error.message}`);
	}
};
const updateLinearBotsGitstream = async () => {
	await updateLinearBotsGitstreamGithubAction();
};
const updateLinearBotsGitstreamGithubAction = async () => {
	try {
		const taskId = await createAsyncUpdateTask('update gitstream-github-action to v4');
		await npmUpdate('linear-bots/gitstream-github-action', 'v4');
		logging.log('info', `Successfully updated linear-bots/gitstream-github-action to v4`);
		return taskId;
	} catch (error) {
		logging.log('warn', `Failed to update linear-bots/gitstream-github-action: ${error.message}`);
	}
};
const updateCodeqlAction = async () => {
	try {
		const taskId = await createAsyncUpdateTask('update github/codeql-action to v4');
		await npmUpdate('github/codeql-action', 'v4');
		logging.log('info', `Successfully updated github/codeql-action to v4`);
		return taskId;
	} catch (error) {
		logging.log('error', `Failed to update github/codeql-action: ${error.message}`);
		throw error;
	}
};
const updatePosthogJsToLatest = async () => {
	try {
		const taskId = await createAsyncUpdateTask('update posthog-js to v1.407.6');
		await npmUpdate('posthog-js', 'v1.407.6');
		logging.log('info', `Successfully updated posthog-js to v1.407.6`);
		return taskId;
	} catch (error) {
		logging.log('error', `Failed to update posthog-js: ${error.message}`);
		throw error;
	}
};

// ... (Remainder of the file is unchanged)