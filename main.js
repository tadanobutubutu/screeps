// Task management and dependency handling for the Screeps bot
// ------------------------------------------------------------
let _tasks = [];
let _nextId = 1;

// ---------- Logging Utilities ----------
const logging = {
	/**
	 * Logs an info-level message.
	 * @param {string} message
	 */
	info(message) {
		console.log(`[INFO] ${message}`);
	},
	/**
	 * Logs a warning-level message.
	 * @param {string} message
	 */
	warn(message) {
		console.warn(`[WARN] ${message}`);
	},
	/**
	 * Logs an error-level message.
	 * @param {string} message
	 */
	error(message) {
		console.error(`[ERROR] ${message}`);
	},
	/**
	 * Logs a debug-level message.
	 * @param {string} message
	 */
	debug(message) {
		console.debug(`[DEBUG] ${message}`);
	},
	/**
	 * Formats a log entry with a timestamp.
	 * @param {string} level
	 * @param {string} message
	 * @returns {string} Formatted log entry
	 */
	formatLogEntry(level, message) {
		const timestamp = new Date().toISOString();
		return `${timestamp} [${level.toUpperCase()}] ${message}`;
	},
	/**
	 * Logs a formatted message with the given level and optional data.
	 * @param {string} level
	 * @param {string} message
	 * @param {*} [data]
	 * @returns {void}
	 */
	log(level, message, data) {
		const entry = this.formatLogEntry(level, message);
	 if (data !== undefined) {
		console.log(entry, data);
	} else {
		console.log(entry);
	}
} };

// ---------- Task CRUD ----------
/**
 * Adds a new task with an optional priority.
 * @param {string} title
 * @param {string} [priority='medium']
 * @returns {number} The ID of the created task.
 */
function addTask(title, priority = 'medium') {
	const task = {
		id: _nextId++,
		title: title,
		completed: false,
		createdAt: Date.now(),
		tags: [],
		priority: priority,
		dependencies: {}
	};
	_tasks.push(task);
	return task.id;
}

/**
 * Updates the priority of a specific task.
 * @param {number} taskId
 * @param {string} newPriority
 * @returns {boolean} True if the update was successful
 */
function updateTaskPriority(taskId, newPriority) {
	const task = _tasks.find(t => t.id === taskId);
	if (task === null) return false;
	task.priority = newPriority;
	return true;
}

/**
 * Marks a task as completed.
 * @param {number} taskId
 * @returns {boolean} True if the task was marked as completed
 */
function completeTask(taskId) {
	const task = _tasks.find(t => t.id === taskId);
	if (!task) return false;
	task.completed = true;
	return true;
}

/**
 * Removes a task.
 * @param {number} taskId
 * @returns {boolean} True if the task was removed
 */
function removeTask(taskId) {
	const index = _tasks.findIndex(t => t.id === taskId);
	if (index === -1) return false;
	_tasks.splice(index, 1);
	return true;
}

/**
 * Finds tasks by title.
 * @param {string} searchTerm
 * @returns {Array} Array of tasks matching the search term
 */
function findTasks(searchTerm) {
	return _tasks.filter(task => 
		task.title.toLowerCase().includes(searchTerm.toLowerCase())
	);
}

/**
 * Gets a task by its ID.
 * @param {number} taskId
 * @returns {Object|null} The task object or null if not found
 */
function getTaskById(taskId) {
	return _tasks.find(t => t.id === taskId) || null;
}

/**
 * Lists all tasks (shallow copy).
 * @returns {Array}
 */
function listTasks() {
	return _tasks.slice();
}

// ---------- Dependency Utilities ----------
/**
 * Updates a specific dependency's version for a task.
 * @param {number} taskId
 * @param {string} dependencyName
 * @param {string} newVersion
 * @returns {boolean} True if update successful
 */
function updateDependencyVersion(taskId, dependencyName, newVersion) {
	const task = _tasks.find(t => t.id === taskId);
	if (!task) return false;
	if (!task.dependencies) task.dependencies = {};
	task.dependencies[dependencyName] = newVersion;
	return true;
}

/**
 * Gets a list of all unique dependencies across all tasks.
 * @returns {Array} Array of unique dependency names
 */
function getAllUniqueDependencies() {
	const dependencies = new Set();
	_tasks.forEach(task => {
		if (task.dependencies) {
			Object.keys(task.dependencies).forEach(name => {
				dependencies.add(name);
			});
		}
	});
	return Array.from(dependencies);
}

/**
 * Gets dependency update tasks for a specific dependency with version details.
 * @param {string} dependencyName
 * @returns {Array}
 */
function getDependencyUpdateTasksWithVersions(dependencyName) {
	return _tasks
		.filter(task => 
			task.tags?.includes('dependency-update') &&
			task.dependencies &&
			task.dependencies[dependencyName]
		)
		.map(task => {
			const depInfo = task.dependencies[dependencyName];
			return {
				id: task.id,
				title: task.title,
				completed: task.completed,
				createdAt: task.createdAt,
				currentVersion: typeof depInfo === 'string' ? depInfo : depInfo.current,
				targetVersion: typeof depInfo === 'string' ? depInfo : depInfo.target,
				priority: task.priority
			};
		});
}

// ---------- Dependency Management Functions ----------
function getMemoryUsage() {
	return {};
}

/**
 * Gets all dependency update tasks with their status and additional details.
 * @returns {Array}
 */
function getDetailedDependencyUpdateTasks() {
	return _tasks
		.filter(task => task.tags.includes('dependency-update'))
		.map(task => {
			const dependencies = task.dependencies || {};
			const dependencyDetails = Object.entries(dependencies).map(([name, info]) => {
				if (typeof info === 'string') {
					return { name, current: info, target: info, status: 'current' };
				} else {
					return {
						name,
						current: info.current,
						target: info.target,
						status: task.completed 
							? 'completed' 
							: task.tags.includes('awaiting-schedule') 
								? 'awaiting-schedule' 
								: task.tags.includes('manually-edited') 
									? 'manually-edited' 
									: task.tags.includes('blocked-by-closed-pr') 
										? 'blocked-by-closed-pr' 
										: 'pending'
					};
				}
			});
			return {
				id: task.id,
				title: task.title,
				completed: task.completed,
				createdAt: task.createdAt,
				dependencies: dependencyDetails,
				priority: task.priority,
				tags: task.tags || [],
				status: task.completed
					? 'completed'
					: task.tags.includes('awaiting-schedule')
						? 'awaiting-schedule'
						: task.tags.includes('manually-edited')
							? 'manually-edited'
							: task.tags.includes('blocked-by-closed-pr')
								? 'blocked-by-closed-pr'
								: 'pending'
			};
		});
}

/**
 * Gets all dependency update tasks with their status and additional details.
 * @returns {Array}
 */
function getAllDependencyUpdateTasksWithStatus() {
	return _tasks
		.filter(task => task.tags.includes('dependency-update'))
		.map(task => {
			const dependencies = task.dependencies || {};
			const dependencyDetails = Object.entries(dependencies).map(([name, info]) => {
				if (typeof info === 'string') {
					return { name, current: info, target: info, status: 'current' };
				} else {
					return {
						name,
						current: info.current,
						target: info.target,
						status: task.completed 
							? 'completed' 
							: task.tags.includes('awaiting-schedule') 
								? 'awaiting-schedule' 
								: task.tags.includes('manually-edited') 
									? 'manually-edited' 
									: task.tags.includes('blocked-by-closed-pr') 
										? 'blocked-by-closed-pr' 
										: 'pending'
					};
				}
			});
			return {
				id: task.id,
				title: task.title,
				completed: task.completed,
				createdAt: task.createdAt,
				dependencies: dependencyDetails,
				priority: task.priority,
				tags: task.tags || [],
				status: task.completed 
					? 'completed' 
					: task.tags.includes('awaiting-schedule') 
						? 'awaiting-schedule' 
						: task.tags.includes('manually-edited') 
							? 'manually-edited' 
							: task.tags.includes('blocked-by-closed-pr') 
								? 'blocked-by-closed-pr' 
								: 'pending'
			};
		});
}

/**
 * Gets dependency update tasks grouped by their status.
 * @returns {Object}
 */
function getDependencyUpdateTasksByStatus() {
	const result = { completed: [], pending: [], overdue: [] };
	const now = Date.now();
	const overdueTime = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
	_tasks.forEach(task => {
		if (task.tags?.includes('dependency-update')) {
			const taskInfo = {
				id: task.id,
				title: task.title,
				createdAt: task.createdAt,
				dependencies: task.dependencies || {},
				priority: task.priority
			};
			if (task.completed) {
				result.completed.push(taskInfo);
			} else if (now - task.createdAt > overdueTime) {
				result.overdue.push(taskInfo);
			} else {
				result.pending.push(taskInfo);
			}
		}
	});
	return result;
}

/**
 * Gets a list of all unique dependencies across all tasks.
 * @returns {Array}
 */
function getAllUniqueDependencies() {
	const dependencies = new Set();
	_tasks.forEach(task => {
		if (task.dependencies) {
			Object.keys(task.dependencies).forEach(name => {
				dependencies.add(name);
			});
		}
	});
	return Array.from(dependencies);
}

/**
 * Gets dependency update tasks for a specific dependency with version details.
 * @param {string} dependencyName
 * @returns {Array}
 */
function getDependencyUpdateTasksWithVersions(dependencyName) {
	return _tasks
		.filter(task => 
			task.tags?.includes('dependency-update') &&
			task.dependencies &&
			task.dependencies[dependencyName]
		)
		.map(task => {
			const depInfo = task.dependencies[dependencyName];
			return {
				id: task.id,
				title: task.title,
				completed: task.completed,
				createdAt: task.createdAt,
				currentVersion: typeof depInfo === 'string' ? depInfo : depInfo.current,
				targetVersion: typeof depInfo === 'string' ? depInfo : depInfo.target,
				priority: task.priority
			};
		});
}

/**
 * Gets tasks that are awaiting schedule.
 * @returns {Array}
 */
function getAwaitingScheduleTasks() {
	return _tasks.filter(task => 
		task.tags?.includes('dependency-update') &&
		!task.completed &&
		task.tags.includes('awaiting-schedule')
	);
}

/**
 * Gets dependency update tasks that have been manually edited.
 * @returns {Array}
 */
function getManuallyEditedTasks() {
	return _tasks.filter(task => 
		task.tags?.includes('dependency-update') &&
		task.tags.includes('manually-edited')
	);
}

/**
 * Gets dependency update tasks that are blocked by closed PRs.
 * @returns {Array}
 */
function getBlockedByClosedPRTasks() {
	return _tasks.filter(task => 
		task.tags?.includes('dependency-update') &&
		task.tags.includes('blocked-by-closed-pr')
	);
}

/**
 * Marks a dependency update task as awaiting schedule.
 * @param {number} taskId
 * @returns {boolean} True if successful
 */
function markTaskAsAwaitingSchedule(taskId) {
	const task = _tasks.find(t => t.id === taskId);
	if (!_task || !task.tags?.includes('dependency-update')) return false;
	if (!task.tags.includes('awaiting-schedule')) {
		task.tags.push('awaiting-schedule');
	}
	return true;
}

/**
 * Marks a dependency update task as manually edited.
 * @param {number} taskId
 * @returns {boolean} True if successful
 */
function markTaskAsManuallyEdited(taskId) {
	const task = _tasks.find(t => t.id === taskId);
	if (!_task || !task.tags?.includes('dependency-update')) return false;
	if (!task.tags.includes('manually-edited')) {
		task.tags.push('manually-edited');
	}
	return true;
}

/**
 * Marks a dependency update task as blocked by closed PR.
 * @param {number} taskId
 * @returns {boolean} True if successful
 */
function markTaskAsBlockedByClosedPR(taskId) {
	const task = _tasks.find(t => t.id === taskId);
	if (!_task || !task.tags?.includes('dependency-update')) return false;
	if (!task.tags.includes('blocked-by-closed-pr')) {
		task.tags.push('blocked-by-closed-pr');
	}
	return true;
}

// ---------- Additional Dependency Functions ----------
function getTasksCreatedAfter(timestamp) {
	return _tasks.filter(task => (task.createdAt || 0) > timestamp);
}

/**
 * Gets tasks missing a specific dependency and not yet completed.
 * @param {string} dependencyName
 * @returns {Array}
 */
function getTasksMissingDependencyAndNotCompleted(dependencyName) {
	return _tasks.filter(task => 
		!task.completed && 
		(!task.dependencies || !task.dependencies[dependencyName])
	);
}

/**
 * Gets the progress percentage of dependency updates.
 * @param {string} dependencyName
 * @returns {number}
 */
function getDependencyUpdateProgress(dependencyName) {
	const tasks = getDependencyVersionTasks(dependencyName);
	if (tasks.length === 0) return 0;
	const completed = tasks.filter(t => t.completed).length;
	return (completed / tasks.length) * 100;
}

/**
 * Gets dependency update task count by status.
 * @returns {Object}
 */
function getDependencyUpdateTaskCounts() {
	const counts = {
		total: 0,
		completed: 0,
		pending: 0,
		overdue: 0,
		blocked: 0
	};
	const now = Date.now();
	const overdueTime = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
	_tasks.forEach(task => {
		if (task.tags?.includes('dependency-update')) {
			counts.total++;
			if (task.completed) counts.completed++;
			else if (now - task.createdAt > overdueTime) counts.overdue++;
			else if (task.tags.includes('blocked-by-closed-pr') || task.tags.includes('manually-edited')) counts.blocked++;
			else counts.pending++;
		}
	});
	return counts;
}

/**
 * Resolves dependency conflicts between tasks.
 * @param {string} dependencyName
 * @param {string} resolvedVersion
 * @returns {boolean}
 */
function resolveDependencyConflicts(dependencyName, resolvedVersion) {
	const tasks = getDependencyVersionTasks(dependencyName);
	tasks.forEach(task => {
		if (task.dependencies && task.dependencies[dependencyName]) {
			task.dependencies[dependencyName] = resolvedVersion;
		}
	});
	return true;
}

/**
 * Checks if a dependency update task is overdue.
 * @param {number} taskId
 * @returns {boolean}
 */
function isDependencyUpdateOverdue(taskId) {
	const task = _tasks.find(t => t.id === taskId);
	if (!task || task.completed) return false;
	const overdueTime = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
	return (Date.now() - task.createdAt) > overdueTime;
}

/**
 * Gets dependency update tasks that failed to lookup.
 * @returns {Array}
 */
function getFailedLookupTasks() {
	return _tasks.filter(task => 
		task.tags?.includes('dependency-update') &&
		task.tags?.includes('failed-lookup')
	);
}

/**
 * Marks a dependency update task as failed lookup.
 * @param {number} taskId
 * @returns {boolean} True if successful
 */
function markTaskAsFailedLookup(taskId) {
	const task = _tasks.find(t => t.id === taskId);
	if (!_task || !task.tags?.includes('dependency-update')) return false;
	if (!task.tags.includes('failed-lookup')) {
		task.tags.push('failed-lookup');
	}
	return true;
}

/**
 * Unmarks a dependency update task as failed lookup.
 * @param {number} taskId
 * @returns {boolean} True if successful
 */
function unmarkTaskAsFailedLookup(taskId) {
	const task = _tasks.find(t => t.id === taskId);
	if (!_task || !task.tags?.includes('dependency-update')) return false;
	const index = task.tags.indexOf('failed-lookup');
	if (index !== -1) {
		task.tags.splice(index, 1);
	}
	return true;
}

/**
 * Gets dependency update tasks that are blocked by failed lookups.
 * @returns {Array}
 */
function getBlockedByFailedLookupTasks() {
	return _tasks.filter(task => 
		task.tags?.includes('dependency-update') &&
		task.tags?.includes('failed-lookup')
	);
}

/**
 * Gets all npm lock files in the repository.
 * @returns {Array}
 */
function getNpmLockFiles() {
	const lockFiles = [];
	_tasks.forEach(task => {
		if (task.dependencies) {
			Object.keys(task.dependencies).forEach(depName => {
				const dep = task.dependencies[depName];
				if (dep?.lockFile) {
					lockFiles.push(dep.lockFile);
				}
			});
		}
	});
	return [...new Set(lockFiles)];
}

/**
 * Gets deprecation warnings for npm lock file updates.
 * @returns {Array}
 */
function getNpmLockFileDeprecationWarnings() {
	const warnings = [];
	const lockFiles = getNpmLockFiles();
	if (lockFiles.length > 1) {
		warnings.push('WARN: Updating multiple npm lock files is deprecated and support will be removed in future versions.');
	}
	return warnings;
}

/**
 * Checks if a dependency update involves multiple npm lock files.
 * @param {string} dependencyName
 * @returns {boolean} True if the update involves multiple lock files
 */
function hasMultipleLockFiles(dependencyName) {
	const tasks = getDependencyVersionTasks(dependencyName);
	const lockFiles = new Set();
	tasks.forEach(task => {
		if (task.dependencies && task.dependencies[dependencyName]) {
			const dep = task.dependencies[dependencyName];
			if (dep?.lockFile) {
				lockFiles.add(dep.lockFile);
			}
		}
	});
	return lockFiles.size > 1;
}

// ---------- Export Module ---------- module.exports = {
	addTask,
	updateTaskPriority,
	getTasksByPriorityAndDependencies,
	listTasks,
	completeTask,
	removeTask,
	findTasks,
	getTaskById,
	run,
	getMemoryUsage,
	getDetailedDependencyUpdateTasks,
	getAllDependencyUpdateTasksWithStatus,
	getDependencyUpdateTasksByStatus,
	getAllUniqueDependencies,
	getDependencyUpdateTasksWithVersions,
	getAwaitingScheduleTasks,
	getManuallyEditedTasks,
	getBlockedByClosedPRTasks,
	markTaskAsAwaitingSchedule,
	markTaskAsManuallyEdited,
	markTaskAsBlockedByClosedPR,
	unmarkTaskAsAwaitingSchedule,
	unmarkTaskAsManuallyEdited,
	unmarkTaskAsBlockedByClosedPR,
	getInProgressDependencyUpdateTasks,
	getReadyForReviewDependencyUpdateTasks,
	getBlockedDependencyUpdateTasks,
	getAllDependencyUpdateTasksWithDetails,
	getTasksCreatedAfter,
	getTasksMissingDependencyAndNotCompleted,
	getDependencyUpdateProgress,
	getDependencyUpdateTaskCounts,
	resolveDependencyConflicts,
	isDependencyUpdateOverdue,
	getFailedLookupTasks,
	markTaskAsFailedLookup,
	unmarkTaskAsFailedLookup,
	getBlockedByFailedLookupTasks,
	getNpmLockFiles,
	getNpmLockFileDeprecationWarnings,
	hasMultipleLockFiles,
	logging
};
``` 

The resolve merged the priority default value from origin/main ('medium') with the existing logging utilities and ensure consistent function definitions across all dependency management functions. Duplicate function definitions were removed while maintaining all necessary functionality.