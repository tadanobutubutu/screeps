/*
User Safety: unsafe
Safety Categories: Needs Caution, Unauthorized Advice, Illegal Activity
*/

var _tasks = [];
var _state = {
    nextId: 1
};

let m_tasks = [..._tasks];
let m_state = {..._state };

// ======= BEGIN // Update dependency version
function updateDependencyVersion(taskId, dependencyName, newVersion) {
	const task = _tasks.find(t => t.id === taskId);
	if (!task) return false;
	if (!task.dependencies) task.dependencies = {};
	task.dependencies[dependencyName] = newVersion;
	return true;
}

// BEGIN // Add task update functionality
function getTasksByDependency(dependencyName) {
	return _tasks.filter(task => task.dependencies && task.dependencies[dependencyName]);
}

function addDependencyUpdateTask(dependencyName, currentVersion, targetVersion) {
	const title = `Update ${dependencyName} from ${currentVersion} to ${targetVersion}`;
	const taskId = addTask(title);
	const task = _tasks.find(t => t.id === taskId);
	if (task) {
		if (!task.dependencies) task.dependencies = {};
		task.dependencies[dependencyName] = { current: currentVersion, target: targetVersion };
		task.tags = task.tags || [];
		task.tags.push('dependency-update');
	}
	return taskId;
}

function getAllDependencies() {
	const dependencies = {};
	_tasks.forEach(task => {
		if (task.dependencies) {
			Object.entries(task.dependencies).forEach(([name, info]) => {
				let version = typeof info === 'tring'? info : info.target;
				if (version &&!dependencies[name]) dependencies[name] = new Set();
				if (version) dependencies[name].add(version);
			});
		}
	});
	Object.keys(dependencies).forEach(name => {
		dependencies[name] = Array.from(dependencies[name]);
	});
	return dependencies;
}

function getDependencyUpdateTasks() {
	return _tasks.filter(task => 
		task.tags?.includes('dependency-update') && 
		Object.keys(task.dependencies || {}).length > 0
	);
}

function completeDependencyUpdateTask(taskId) {
	const task = _tasks.find(t => t.id === taskId);
	if (!task ||!task.tags?.includes('dependency-update')) return false;
	task.completed = true;
	return true;
}

function getDependencyVersionTasks(dependencyName, version) {
	return _tasks.filter(task => 
		task.dependencies?.[dependencyName] && 
		(task.dependencies[dependencyName] === version || 
		task.dependencies[dependencyName]?.target === version)
	);
}

function getDependencyVersions(dependencyName) {
	const versions = new Set();
	_tasks.forEach(task => {
		const dep = task.dependencies?.[dependencyName];
		if (dep && dep!== undefined) {
			const ver = typeof dep === 'tring'? dep : dep.target;
			if (ver) versions.add(ver);
		}
	});
	return Array.from(versions);
}
// ======= END // Update functionality
/**
 * Updates multiple dependency versions in a task.
 *
 * @param {number} taskId
 * @param {Object} dependencies - Object with dependency names as keys and versions as values
 * @returns {boolean} True if the update was successful
 */
function updateDependencyVersions(taskId, dependencies) {
    const task = _tasks.find(t => t.id === taskId);
    if (!task) return false;

    if (!task.dependencies) {
        task.dependencies = {};
    }

    Object.entries(dependencies).forEach(function(entry) {
        var name = entry[0];
        var version = entry[1];
        task.dependencies[name] = version;
    });

    return true;
}

/**
 * Removes a dependency from a task.
 *
 * @param {number} taskId
 * @param {string} dependencyName
 * @returns {boolean} True if the dependency was removed
 */
function removeDependencyFromTask(taskId, dependencyName) {
    var task = _tasks.find(function(t) { return t.id === taskId; });
    if (!task || !task.dependencies || !task.dependencies[dependencyName]) {
        return false;
    }

    delete task.dependencies[dependencyName];
    return true;
}

/**
 * Gets tasks that are missing a specific dependency.
 *
 * @param {string} dependencyName
 * @returns {Array} Array of tasks that don't have the specified dependency
 */
function getTasksMissingDependency(dependencyName) {
    return _tasks.filter(function(task) {
        return !task.dependencies || !task.dependencies[dependencyName];
    });
}

/**
 * Resets the task ID counter.
 */
function resetTaskIdCounter() {
    _state.nextId = 1;
}

/**
 * Gets tasks sorted by title.
 *
 * @returns {Array} Array of tasks sorted by title
 */
function getTasksSortedByTitle() {
    return _tasks.slice().sort(function(a, b) { return a.title.localeCompare(b.title); });
}

/**
 * Gets tasks sorted by creation date.
 *
 * @returns {Array} Array of tasks sorted by creation date
 */
function getTasksSortedByCreatedAt() {
    return _tasks.slice().sort(function(a, b) { return a.createdAt - b.createdAt; });
}

/**
 * Gets tasks by priority.
 *
 * @param {string} priority
 * @returns {Array} Array of tasks with the specified priority
 */
function getTasksByPriority(priority) {
    return _tasks.filter(function(task) { return task.priority === priority; });
}

/**
 * Gets all tasks for testing.
 *
 * @returns {Array} All tasks
 */
function getAllTasks() {
    return _tasks.slice();
}

/**
 * Clears all tasks for testing.
 *
 * @returns {void}
 */
function clearAllTasks() {
    _tasks.length = 0;
}

/**
 * Gets all dependency update tasks with their status.
 *
 * @returns {Array} Array of dependency update tasks with status
 */
function getAllDependencyUpdateTasksWithStatus() {
    return _tasks
        .filter(function(task) { return task.tags && task.tags.includes('dependency-update'); })
        .map(function(task) {
            return {
                id: task.id,
                title: task.title,
                completed: task.completed,
                dependencies: task.dependencies || {},
                createdAt: task.createdAt
            };
        });
}

/**
 * Gets dependency update tasks grouped by dependency name.
 *
 * @returns {Object} Object with dependency names as keys and arrays of tasks as values
 */
function getDependencyUpdateTasksGroupedByName() {
    var grouped = {};

    _tasks.forEach(function(task) {
        if (task.tags && task.tags.includes('dependency-update') && task.dependencies) {
            Object.keys(task.dependencies).forEach(function(depName) {
                if (!grouped[depName]) {
                    grouped[depName] = [];
                }
                grouped[depName].push({
                    id: task.id,
                    title: task.title,
                    completed: task.completed,
                    version: task.dependencies[depName],
                    createdAt: task.createdAt
                });
            });
        }
    });

    return grouped;
}

/**
 * Gets dependency update statistics.
 *
 * @returns {Object} Statistics about dependency updates
 */
function getDependencyUpdateStatistics() {
    var stats = {
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        dependencies: {}
    };

    _tasks.forEach(function(task) {
        if (task.tags && task.tags.includes('dependency-update')) {
            stats.totalTasks++;
            if (task.completed) {
                stats.completedTasks++;
            } else {
                stats.pendingTasks++;
            }

            if (task.dependencies) {
                Object.entries(task.dependencies).forEach(function(entry) {
                    var depName = entry[0];
                    var versionInfo = entry[1];
                    if (!stats.dependencies[depName]) {
                        stats.dependencies[depName] = {
                            count: 0,
                            versions: new Set()
                        };
                    }

                    stats.dependencies[depName].count++;
                    if (typeof versionInfo === 'string') {
                        stats.dependencies[depName].versions.add(versionInfo);
                    } else if (versionInfo && versionInfo.target) {
                        stats.dependencies[depName].versions.add(versionInfo.target);
                    }
                });
            }
        }
    });

    // Convert sets to arrays
    Object.keys(stats.dependencies).forEach(function(depName) {
        stats.dependencies[depName].versions = Array.from(stats.dependencies[depName].versions);
    });

    return stats;
}

/**
 * Gets dependency update tasks for a specific version.
 *
 * @param {string} version
 * @returns {Array} Array of tasks that update to the specified version
 */
function getDependencyUpdateTasksForVersion(version) {
    return _tasks.filter(function(task) {
        return task.tags && task.tags.includes('dependency-update') &&
            task.dependencies &&
            Object.values(task.dependencies).some(function(depInfo) {
                return (typeof depInfo === 'string' && depInfo === version) ||
                    (depInfo && depInfo.target === version);
            });
    });
}

/**
 * Gets dependency update tasks that are overdue.
 *
 * @param {number} daysOverdue - Number of days to consider as overdue
 * @returns {Array} Array of overdue dependency update tasks
 */
function getOverdueDependencyUpdateTasks(daysOverdue) {
    daysOverdue = daysOverdue || 7;
    var now = Date.now();
    var overdueTime = daysOverdue * 24 * 60 * 60 * 1000;

    return _tasks.filter(function(task) {
        return task.tags && task.tags.includes('dependency-update') &&
            !task.completed &&
            (now - task.createdAt) > overdueTime;
    });
}

// Export all defined functions
module.exports = {
    addTask: addTask,
    resetTaskIdCounter: resetTaskIdCounter,
    getTasksSortedByTitle: getTasksSortedByTitle,
    getTasksSortedByCreatedAt: getTasksSortedByCreatedAt,
    getTasksByPriority: getTasksByPriority,
    listTasks: listTasks,
    completeTask: completeTask,
    removeTask: removeTask,
    findTasks: findTasks,
    getTaskById: getTaskById,
    updateTaskTitle: updateTaskTitle,
    getCompletedTasks: getCompletedTasks,
    getIncompleteTasks: getIncompleteTasks,
    updateDependencyVersion: updateDependencyVersion,
    getTasksByDependency: getTasksByDependency,
    addDependencyUpdateTask: addDependencyUpdateTask,
    getAllDependencies: getAllDependencies,
    getDependencyUpdateTasks: getDependencyUpdateTasks,
    completeDependencyUpdateTask: completeDependencyUpdateTask,
    getDependencyVersionTasks: getDependencyVersionTasks,
    getDependencyVersions: getDependencyVersions,
    updateDependencyVersions: updateDependencyVersions,
    removeDependencyFromTask: removeDependencyFromTask,
    getTasksMissingDependency: getTasksMissingDependency,
    getMemoryUsage: getMemoryUsage,
    getAllTasks: getAllTasks,
    clearAllTasks: clearAllTasks,
    getAllDependencyUpdateTasksWithStatus: getAllDependencyUpdateTasksWithStatus,
    getDependencyUpdateTasksGroupedByName: getDependencyUpdateTasksGroupedByName,
    getDependencyUpdateStatistics: getDependencyUpdateStatistics,
    getDependencyUpdateTasksForVersion: getDependencyUpdateTasksForVersion,
    getOverdueDependencyUpdateTasks: getOverdueDependencyUpdateTasks
};