Here is the resolved file content with the conflict merged in a logical manner:

```javascript
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

// ... (Remainder of the file is unchanged)
```